import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
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

    class ColorGUIHelper {
        constructor(object, prop) {
            this.object = object;
            this.prop = prop;
        }
        get value() {
            return `#${this.object[this.prop].getHexString()}`;
        }
        set value(hexString) {
            this.object[this.prop].set(hexString);
        }
    }
    class DegRadHelper {
        constructor(obj, prop) {
            this.obj = obj;
            this.prop = prop;
        }
        get value() {
            return THREE.MathUtils.radToDeg(this.obj[this.prop]);
        }
        set value(v) {
            this.obj[this.prop] = THREE.MathUtils.degToRad(v);
        }
    }

    function updateCamera() {
        camera.updateProjectionMatrix();
    }

    function updateSpotLight() {
    spot_light.target.updateMatrixWorld();
    spot_helper.update();
}
 
    const gui = new GUI();
    const cameraFolder = gui.addFolder('Camera');
    cameraFolder.add(camera, 'fov', 1, 180).onChange(updateCamera);
    const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
    cameraFolder.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera);
    cameraFolder.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far').onChange(updateCamera);


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

        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.AmbientLight(color, intensity);
        scene.add(light);
    

        const amibentFolder = gui.addFolder('Ambient Light');
        amibentFolder.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
        amibentFolder.add(light, 'intensity', 0, 5, 0.01);

        const skyColor = 0xB1E1FF;
        const groundColor = 0xB97A20; 
        const hemi_intensity = 1;
        const hemi_light = new THREE.HemisphereLight(skyColor, groundColor, hemi_intensity);
        scene.add(hemi_light);

        const hemisphereFolder = gui.addFolder('Hemisphere Light');
        hemisphereFolder.addColor(new ColorGUIHelper(hemi_light, 'color'), 'value').name('skyColor');
        hemisphereFolder.addColor(new ColorGUIHelper(hemi_light, 'groundColor'), 'value').name('groundColor');
        hemisphereFolder.add(hemi_light, 'intensity', 0, 5, 0.01);

        const spot_color = 0xFFFFFF;
        const spot_intensity = 150;
        const spot_light = new THREE.SpotLight(spot_color, spot_intensity);
        scene.add(spot_light);
        scene.add(spot_light.target);

        const spot_helper = new THREE.SpotLightHelper(spot_light);
        scene.add(spot_helper);

        const spotFolder = gui.addFolder('SpotLight');
        spotFolder.add(new DegRadHelper(spot_light, 'angle'), 'value', 0, 90).name('angle').onChange(updateSpotLight);
        spotFolder.add(spot_light, 'penumbra', 0, 1, 0.01);
        spotFolder.add(spot_light.position, 'x', -50, 50).name('pos x').onChange(updateSpotLight);
        spotFolder.add(spot_light.position, 'z', -50, 50).name('pos z').onChange(updateSpotLight);
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

    const diamondGeometry = new THREE.OctahedronGeometry(0.8); // size 0.8, adjust as needed
    const diamondMaterial = new THREE.MeshPhongMaterial({
        color: 0xB9F2FF, 
        shininess: 100,
        transparent: true,
        opacity: 0.8,
        specular: 0xffffff
    });
    const diamond = new THREE.Mesh(diamondGeometry, diamondMaterial);
    diamond.position.set(0, 12, 4);
    scene.add(diamond);

    function makediamond(d20geometry, color, x, y, z) {
        const material = new THREE.MeshPhongMaterial({
            color: color,
            shininess: 100,
            transparent: true,
            opacity: 0.8,
            specular: 0xffffff
        });

        const diamond = new THREE.Mesh(d20geometry, material);
        scene.add(diamond);
        
        diamond.position.x = x;
        diamond.position.y = y;
        diamond.position.z = z;
        
        return diamond;
    }

    const shines = [
        makediamond(diamondGeometry, 0xC0FA9A, -5, 3, 8),
        makediamond(diamondGeometry, 0xaa8844,  3, 3, -4),
        makediamond(diamondGeometry, 0xB9F2FF,4, 3, 8),
        makediamond(diamondGeometry, 0xAFB7C9,8, 4, 10),
        makediamond(diamondGeometry, 0x1C6104,-5, 10, 2),
        makediamond(diamondGeometry, 0xF85C47,-3, 8, -2),
    ];

    const radiusTop = 1;  
    const radiusBottom = 1;  
    const height = 4;  
    const radialSegments = 12;  

    const cyngeometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
    const cynMaterial = new THREE.MeshPhongMaterial({color: 0xB9F2FF});
    
    const cynlinder = new THREE.Mesh(cyngeometry, cynMaterial);
    cynlinder.position.set(4, 0, 8);
    scene.add(cynlinder);

    function makecyns(cyngeometry, color, x, y, z) {
        const material = new THREE.MeshPhongMaterial({color});

        const cynli = new THREE.Mesh(cyngeometry, material);
        scene.add(cynli);
        
        cynli.position.x = x;
        cynli.position.y = y;
        cynli.position.z = z;
        
        return cynli;
    }

    const cynslinders = [
        makecyns(cyngeometry, 0x8844aa, -5, 0, 8),
        makecyns(cyngeometry, 0xaa8844,  3, 0, -4),
    ];
    const radius = 1;
    const d20geometry = new THREE.IcosahedronGeometry( radius );
    const d20Material = new THREE.MeshPhongMaterial({color: 0xB9F2FF});
    const die = new THREE.Mesh(d20geometry, d20Material);
    die.position.set(-2, 1, 10);
    scene.add(die);

    function makedie(d20geometry, color, x, y, z) {
        const material = new THREE.MeshPhongMaterial({color});

        const die = new THREE.Mesh(d20geometry, material);
        scene.add(die);
        
        die.position.x = x;
        die.position.y = 1;
        die.position.z = z;
        
        return die;
    }

    const dieset = [
        makedie(d20geometry, 0x8844aa, -8, 1, 8),
        makedie(d20geometry, 0xaa8844,  -3, 0, -4),
        makedie(d20geometry,0x1D678E,  -5, 1, -1),
        makedie(d20geometry, 0xFF46A2,  2, 0, 6),
        makedie(d20geometry, 0xD08E19,  -6, 10, 10),
    ];

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