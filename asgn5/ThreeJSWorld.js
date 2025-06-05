import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

    const fov = 95;
    const aspect = 3;
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, 30);

    class MinMaxGUIHelper {
        constructor(obj, minProp, maxProp, minDif) {
            this.obj = obj;
            this.minProp = minProp;
            this.maxProp = maxProp;
            this.minDif = minDif;
        }
        get min() {
            return this.obj[this.minProp];
        }
        set min(v) {
            this.obj[this.minProp] = v;
            this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
        }
        get max() {
            return this.obj[this.maxProp];
        }
        set max(v) {
            this.obj[this.maxProp] = v;
            this.min = this.min;  // this will call the min setter
        }
    }

    function updateCamera() {
        camera.updateProjectionMatrix();
    }
 
    const gui = new GUI();
    gui.add(camera, 'fov', 1, 180).onChange(updateCamera);
    const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
    gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera);
    gui.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far').onChange(updateCamera);

    

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 5, 0);
    controls.update();
    
    const scene = new THREE.Scene();
    const sce_loader = new THREE.CubeTextureLoader();
    const sce_texture = sce_loader.load([
            'textures/skybox/px.png',
            'textures/skybox/nx.png',
            'textures/skybox/py.png',
            'textures/skybox/ny.png',
            'textures/skybox/pz.png',
            'textures/skybox/nz.png',
        ]);
        scene.background = sce_texture;


    {
        const planeSize = 60;
        const loader = new THREE.TextureLoader();
        const texture = loader.load('textures/grassycarpet.jpg');

        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.NearestFilter;
        texture.repeat.set(planeSize / 2, planeSize / 2);

        const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
        const planeMat = new THREE.MeshPhongMaterial({
            map: texture,
            side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(planeGeo, planeMat);
        mesh.rotation.x = Math.PI * -0.5;
        scene.add(mesh);
    }
    {
        
        const color = 0xFFFFFF;
        const intensity = 3;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
    }

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const box_geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    const spheregeometry = new THREE.SphereGeometry(0.80, 32, 16 ); 

    const sphereloader = new THREE.TextureLoader();
    const texture = sphereloader.load( 'textures/fire.jpg' );
    texture.colorSpace = THREE.SRGBColorSpace;


    const material = new THREE.MeshBasicMaterial({
        map: texture
    });

    function makeInstance(box_geometry, color, x, y, z) {
        const material = new THREE.MeshPhongMaterial({color});

        const cube = new THREE.Mesh(box_geometry, material);
        scene.add(cube);
        
        cube.position.x = x;
        cube.position.y = y;
        cube.position.z = z;
        
        return cube;
    }


    const dragon_powers = [
        makeInstance(box_geometry, 0x8844aa, -2, 8.25, 4),
        makeInstance(box_geometry, 0xaa8844,  2, 8.25, 4),
    ];

    const textured_orb = new THREE.Mesh(spheregeometry, material);
    textured_orb.position.y = 10;
    textured_orb.position.z = 4;
    scene.add(textured_orb);
    dragon_powers.push(textured_orb);

    {
        {
            const objLoader = new OBJLoader();
            const textureLoader = new THREE.TextureLoader();
            const dragonTexture = textureLoader.load('textures/Dragon_ground_color.jpg');
            dragonTexture.colorSpace = THREE.SRGBColorSpace;

            objLoader.load('models/dragon.obj', (root) => {
                root.traverse((child) => {
                    if (child.isMesh) {
                        child.material = new THREE.MeshPhongMaterial({
                            map: dragonTexture
                        });
                    }
                });
                scene.add(root);
            });
        }
    }

    {
        const mtlLoader = new MTLLoader();
        mtlLoader.load('models/indoorplant_03.mtl', (materials) => {
        materials.preload();

        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load('models/indoorplant_03.obj', (object) => {
            object.position.x = 8;
            object.position.z = 10;
            scene.add(object);
        });
    });
}
    
    function resizeRendererToDisplay(renderer){
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        const resizer = canvas.width !== width || canvas.height !== height;

        if (resizer) {
            renderer.setSize(width, height, false);
        }

        return resizer;
    }


    function render(time) {
        time *= 0.001;  // convert time to seconds

        dragon_powers.forEach((cube, ndx) => {
            const speed = 1 + ndx * .1;
            const rot = time * speed;
            cube.rotation.x = rot;
            cube.rotation.y = rot;
        });

        if (resizeRendererToDisplay(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        
        renderer.render(scene, camera);
        
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

main();