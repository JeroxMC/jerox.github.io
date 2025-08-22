// Elementos
const skinUpload = document.getElementById('skinUpload');
const downloadBtn = document.getElementById('downloadBtn');
const viewer = document.getElementById('viewer');

let skinImage = null;
let renderer, scene, camera, controls, playerMesh;

// Inicializar Three.js
function initViewer(skinTexture) {
    if (renderer) {
        renderer.dispose();
        viewer.innerHTML = '';
    }
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(35, 1, 0.1, 1000);
    camera.position.set(0, 12, 32);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(400, 400);
    viewer.appendChild(renderer.domElement);

    // Luz
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(10, 20, 10);
    scene.add(directionalLight);

    // Crear el jugador tipo Minecraft
    playerMesh = createPlayerMesh(skinTexture);
    scene.add(playerMesh);

    animate();
}

// Crear el modelo tipo Minecraft Steve
function createPlayerMesh(texture) {
    const group = new THREE.Group();

    // Medidas (en pixeles Minecraft)
    const head = new THREE.BoxGeometry(8, 8, 8);
    const body = new THREE.BoxGeometry(8, 12, 4);
    const arm = new THREE.BoxGeometry(4, 12, 4);
    const leg = new THREE.BoxGeometry(4, 12, 4);

    // Material con skin
    const material = new THREE.MeshBasicMaterial({ map: texture });

    // Cabeza
    const headMesh = new THREE.Mesh(head, material);
    headMesh.position.set(0, 20, 0);
    group.add(headMesh);

    // Cuerpo
    const bodyMesh = new THREE.Mesh(body, material);
    bodyMesh.position.set(0, 12, 0);
    group.add(bodyMesh);

    // Brazos
    const armRight = new THREE.Mesh(arm, material);
    armRight.position.set(-6, 12, 0);
    group.add(armRight);

    const armLeft = new THREE.Mesh(arm, material);
    armLeft.position.set(6, 12, 0);
    group.add(armLeft);

    // Piernas
    const legRight = new THREE.Mesh(leg, material);
    legRight.position.set(-2, 0, 0);
    group.add(legRight);

    const legLeft = new THREE.Mesh(leg, material);
    legLeft.position.set(2, 0, 0);
    group.add(legLeft);

    return group;
}

// Animar y renderizar
function animate() {
    requestAnimationFrame(animate);
    playerMesh.rotation.y += 0.01; // Girar el modelo
    renderer.render(scene, camera);
}

// Subida de imagen
skinUpload.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (ev) {
        const img = new Image();
        img.onload = function () {
            skinImage = ev.target.result;
            const texture = new THREE.Texture(img);
            texture.needsUpdate = true;
            initViewer(texture);
            downloadBtn.disabled = false;
        };
        img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
});

// Descargar skin
downloadBtn.addEventListener('click', function () {
    if (!skinImage) return;
    const a = document.createElement('a');
    a.href = skinImage;
    a.download = 'skin.png';
    a.click();
});