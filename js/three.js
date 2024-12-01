let scene, camera, renderer, sphere;

function initThreeJS() {
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#bg-canvas'),
        antialias: true,
        alpha: true
    });

    // Configure renderer
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.setZ(30);

    // Create data sphere
    const geometry = new THREE.SphereGeometry(10, 64, 64);
    const material = new THREE.MeshStandardMaterial({
        color: 0x4a90e2,
        wireframe: true,
        transparent: true,
        opacity: 0.7
    });
    sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Add lights
    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(5, 5, 5);
    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(pointLight, ambientLight);

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        sphere.rotation.x += 0.001;
        sphere.rotation.y += 0.002;
        renderer.render(scene, camera);
    }
    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}