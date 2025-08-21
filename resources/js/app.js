import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import '../css/app.css';

// --- From AGENTS.md ---

function setupLighting(scene) {
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x8B4513, 0.4);
    hemisphereLight.position.set(0, 100, 0);
    scene.add(hemisphereLight);

    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
    directionalLight.position.set(100, 200, 50);
    directionalLight.target.position.set(0, 0, 0);
    directionalLight.castShadow = true;

    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 1000;
    directionalLight.shadow.camera.left = -500;
    directionalLight.shadow.camera.right = 500;
    directionalLight.shadow.camera.top = 500;
    directionalLight.shadow.camera.bottom = -500;
    directionalLight.shadow.bias = -0.0001;

    scene.add(directionalLight);
    scene.add(directionalLight.target);

    const pointLight = new THREE.PointLight(0xFFFFAA, 0.5, 100);
    pointLight.position.set(50, 30, 50);
    pointLight.castShadow = true;
    scene.add(pointLight);

    return {
        ambientLight,
        hemisphereLight,
        directionalLight,
        pointLight
    };
}

function processBuildingData(buildingData) {
    const buildings = [];

    buildingData.forEach(building => {
        const footprint = building.footprint.coordinates[0];

        const shape = new THREE.Shape();
        footprint.forEach((coord, index) => {
            // Using placeholder conversion
            const [x, z] = [coord[0] * 10, coord[1] * 10];
            if (index === 0) {
                shape.moveTo(x, z);
            } else {
                shape.lineTo(x, z);
            }
        });

        const height = building.height || (Math.random() * 40 + 10);
        const extrudeSettings = {
            depth: height,
            bevelEnabled: false
        };

        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geometry.rotateX(-Math.PI / 2);

        const material = new THREE.MeshStandardMaterial({
            color: building.color || 0x888888,
            roughness: 0.7,
            metalness: 0.1
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = 0;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        buildings.push(mesh);
    });

    return buildings;
}


class LaravelIntegration {
    constructor(baseUrl = '/api') {
        this.baseUrl = baseUrl;
        this.csrfToken = this.getCSRFToken();
    }

    getCSRFToken() {
        const token = document.querySelector('meta[name="csrf-token"]');
        return token ? token.getAttribute('content') : null;
    }

    async processAddress(address) {
        const response = await fetch(`${this.baseUrl}/process-address`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': this.csrfToken,
                'Accept': 'application/json'
            },
            body: JSON.stringify({ address: address })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Address processing failed: ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        return data;
    }

    async getVisualizationData(coordinates, radius = 500) {
        const params = new URLSearchParams({
            lat: coordinates.latitude,
            lng: coordinates.longitude,
            radius: radius
        });

        const response = await fetch(`${this.baseUrl}/data?${params}`, {
            headers: {
                'Accept': 'application/json',
                'X-CSRF-TOKEN': this.csrfToken
            }
        });

        if (!response.ok) {
            throw new Error(`Data fetch failed: ${response.statusText}`);
        }

        return await response.json();
    }

    async downloadModel(type, format = 'stl') {
        const response = await fetch(`${this.baseUrl}/download/${type}/${format}`, {
            headers: {
                'X-CSRF-TOKEN': this.csrfToken
            }
        });

        if (!response.ok) {
            throw new Error(`Model download failed: ${response.statusText}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}_model.${format}`;
        a.click();
        window.URL.revokeObjectURL(url);
    }
}


class SanDiegoVisualizer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;

        this.laravelIntegration = new LaravelIntegration();

        this.currentData = null;
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;

        console.log('Initializing San Diego 3D Geospatial Visualizer...');

        try {
            this.initializeThreeJS();
            this.setupLighting();
            this.setupEventListeners();
            this.startAnimationLoop();

            this.initialized = true;
            console.log('Visualizer initialized successfully');

            // Load initial dummy data
            await this.handleAddressSubmit(null, "San Diego");


        } catch (error) {
            console.error('Initialization failed:', error);
            throw error;
        }
    }

    initializeThreeJS() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB);

        this.camera = new THREE.PerspectiveCamera(
            75,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            10000
        );
        this.camera.position.set(20, 15, 20);

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.container.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.1;
        this.controls.minDistance = 10;
        this.controls.maxDistance = 2000;
        this.controls.maxPolarAngle = Math.PI / 2;
    }

    setupLighting() {
        this.lights = setupLighting(this.scene);
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());

        const addressForm = document.getElementById('address-form');
        if (addressForm) {
            addressForm.addEventListener('submit', (e) => this.handleAddressSubmit(e));
        }

        document.querySelectorAll('[data-download]').forEach(button => {
            button.addEventListener('click', (e) => this.handleDownload(e));
        });
    }

    onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    async handleAddressSubmit(event, defaultAddress = null) {
        if(event) event.preventDefault();

        const address = defaultAddress || new FormData(event.target).get('address');

        if (!address) {
            this.showError('Please enter an address');
            return;
        }

        try {
            this.showLoading(true);

            const addressData = await this.laravelIntegration.processAddress(address);

            const visualizationData = await this.laravelIntegration.getVisualizationData(
                addressData.coordinates
            );

            this.clearScene();

            await this.renderVisualizationData(visualizationData);

            this.currentData = visualizationData;
            this.showLoading(false);

        } catch (error) {
            console.error('Address processing failed:', error);
            this.showError('Failed to process address. Please try again.');
            this.showLoading(false);
        }
    }

    async renderVisualizationData(data) {
        console.log('Rendering visualization data...');

        if (data.buildings) {
            await this.renderBuildings(data.buildings);
        }

        this.positionCameraForData(data);
    }

    async renderBuildings(buildingsData) {
        const buildings = processBuildingData(buildingsData);
        buildings.forEach(building => this.scene.add(building));
    }


    positionCameraForData(data) {
        if (data.bounds) {
            const center = {
                x: (data.bounds.minX + data.bounds.maxX) / 2,
                z: (data.bounds.minZ + data.bounds.maxZ) / 2
            };

            const size = Math.max(
                data.bounds.maxX - data.bounds.minX,
                data.bounds.maxZ - data.bounds.minZ
            );

            const distance = size * 1.5;
            this.camera.position.set(center.x + distance, distance, center.z + distance);
            this.controls.target.set(center.x, 0, center.z);
            this.controls.update();
        }
    }

    clearScene() {
        const objectsToRemove = [];
        this.scene.traverse(child => {
            if (child.isMesh || child.isLight) {
                 if(!(child instanceof THREE.AmbientLight || child instanceof THREE.HemisphereLight || child instanceof THREE.DirectionalLight))
                    objectsToRemove.push(child);
            }
        });

        objectsToRemove.forEach(obj => {
            this.scene.remove(obj);
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                if (Array.isArray(obj.material)) {
                    obj.material.forEach(mat => mat.dispose());
                } else {
                    obj.material.dispose();
                }
            }
        });

        // Re-add lights
        this.setupLighting();
    }

    handleDownload(event) {
        const type = event.target.getAttribute('data-download');
        const format = event.target.getAttribute('data-format') || 'stl';

        if (!this.currentData) {
            this.showError('No data available for download');
            return;
        }

        this.laravelIntegration.downloadModel(type, format)
            .catch(error => {
                console.error('Download failed:', error);
                this.showError('Download failed. Please try again.');
            });
    }

    startAnimationLoop() {
        const animate = () => {
            requestAnimationFrame(animate);
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        };

        animate();
    }

    showLoading(show) {
        const loader = document.getElementById('loading-indicator');
        if (loader) {
            loader.style.display = show ? 'block' : 'none';
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('error-message');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        } else {
            alert(message);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const visualizer = new SanDiegoVisualizer('visualization-container');
    visualizer.initialize().catch(error => {
        console.error('Failed to initialize visualizer:', error);
    });
});
