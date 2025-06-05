import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

    const fov = 75;
    const aspect = 2;
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, 30);

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 5, 0);
    controls.update();
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('lavenderblush');

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
        const objLoader = new OBJLoader();
        objLoader.load('models/dragon.obj', (root) => {
            scene.add(root);
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