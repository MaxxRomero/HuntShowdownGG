import * as THREE from "three";

//En un futuro no utilizar paths relativos
import Stats from "./node_modules/three/examples/jsm/libs/stats.module.mjs";
import { GLTFLoader } from "./node_modules/three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "./node_modules/three/examples/jsm/controls/OrbitControls.js";

let container, controls;
let camera, scene, renderer;
const stats = new Stats();

init();
animate();

function init() {
    container = document.createElement("div");
    container.appendChild(stats.dom);
    document.body.appendChild(container);

    //Camera config
    camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.5,
        150
    );
    camera.position.z = 2;

    scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight());

    //Luz direccional
    const directionalLight = new THREE.DirectionalLight(0xffeedd);
    directionalLight.position.set(0, 0.5, 0);
    scene.add(directionalLight);

    //Cargamos el modelo del arma
    const loader = new GLTFLoader();

    loader.load("models/HuntUppercut/scene.gltf", function (gltf) {
        const model = gltf.scene;

        //Ajustar la escala del objeto respecto a la escena
        model.scale.multiplyScalar(1 / 2);
        model.rotation.set(0, 1.6, 0);

        scene.add(model);
    });

    //Opciones de renderer
    renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true nos permite manejar el color del bg desde css.
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    //Controles de la camara
    controls = new OrbitControls(camera, renderer.domElement);
    controls.mouseButtons = {
        LEFT: THREE.MOUSE.LEFT,
        MIDDLE: THREE.MOUSE.MIDDLE,
        RIGHT: THREE.MOUSE.LEFT,
    };

    //Limitando el zoom que podemos hacerle al arma
    controls.minDistance = 2;
    // controls.maxDistance = 10; Hay que ponerle 1000mts. como limite

    window.addEventListener("resize", resize);
}

//Resize del objeto en la pantalla (no funciona muy bien en responsive)
function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    controls.update();
    stats.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
