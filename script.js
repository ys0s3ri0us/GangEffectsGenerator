let scene, camera, renderer, plane, textureLoader;
let capturer;

// Initialize Three.js scene
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / 500, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth * 0.9, 500);
    document.getElementById('canvasContainer').appendChild(renderer.domElement);

    textureLoader = new THREE.TextureLoader();
    loadDefaultImage();

    camera.position.z = 5;

    capturer = new CCapture({ format: 'gif', workersPath: './' });
}

// Load Default Image
function loadDefaultImage() {
    textureLoader.load('assets/ape.png', (texture) => {
        if (plane) scene.remove(plane);
        const geometry = new THREE.PlaneGeometry(5, 5);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        plane = new THREE.Mesh(geometry, material);
        scene.add(plane);
    });
}

// Upload Image
document.getElementById('imageUpload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        textureLoader.load(url, (texture) => {
            if (plane) scene.remove(plane);
            const geometry = new THREE.PlaneGeometry(5, 5);
            const material = new THREE.MeshBasicMaterial({ map: texture });
            plane = new THREE.Mesh(geometry, material);
            scene.add(plane);
        });
    }
});

// Add Fire Effect
document.getElementById('fireEffect').addEventListener('click', () => {
    plane.material = new THREE.MeshBasicMaterial({ color: 0xff4500, wireframe: true });
});

// Add Glow Effect
document.getElementById('glowEffect').addEventListener('click', () => {
    plane.material = new THREE.MeshLambertMaterial({ emissive: 0xffd700 });
    const light = new THREE.PointLight(0xffd700, 1, 100);
    light.position.set(0, 0, 5);
    scene.add(light);
});

// Add Glitch Effect
document.getElementById('glitchEffect').addEventListener('click', () => {
    plane.material = new THREE.MeshNormalMaterial();
});

// Export as GIF
document.getElementById('exportGif').addEventListener('click', () => {
    capturer.start();
    animate(true);
});

// Animate Scene
function animate(capture = false) {
    requestAnimationFrame(() => animate(capture));
    plane.rotation.z += 0.01;
    renderer.render(scene, camera);
    if (capture) capturer.capture(renderer.domElement);
}

// Initialize the App
init();
animate();
