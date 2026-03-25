import * as THREE from 'three';
import { SplatMesh } from '@sparkjsdev/spark';

export class SplatViewer {
    constructor(container) {
        this.container = container;
        this.currentSplatMesh = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
    }

    async init() {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(34, window.innerWidth / window.innerHeight, 0.01, 1000);
        camera.position.set(0, 0, 0);
        camera.lookAt(0, 0, 1);

        const renderer = new THREE.WebGLRenderer({ powerPreference: 'high-performance', antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        
        // Clear container just in case
        this.container.innerHTML = '';
        this.container.appendChild(renderer.domElement);

        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;

        // Mouse Listeners
        window.addEventListener('mousemove', (e) => {
            const hw = window.innerWidth / 2;
            const hh = window.innerHeight / 2;
            this.mouseX = (e.clientX - hw) / hw;
            this.mouseY = (e.clientY - hh) / hh;
        });

        // Resize Listener
        window.addEventListener('resize', () => {
            if (window.innerWidth < 768) {
                // If resized to mobile, cleanup is handled by main script logic ideally,
                // but we stop the loop here to save resources.
                if(this.renderer) this.renderer.setAnimationLoop(null); 
                return;
            }
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Start Loop
        this.renderer.setAnimationLoop(this.animate.bind(this));
    }

    loadSplat(id) {
        if (!this.scene) return;

        if (this.currentSplatMesh) { 
            this.scene.remove(this.currentSplatMesh); 
            if (this.currentSplatMesh.dispose) this.currentSplatMesh.dispose(); 
        }
        
        // Construct path based on ID
        const url = `./splats/${id}.ply`;

        const splatMesh = new SplatMesh({ 
            url: url, 
            onLoad: () => { 
                splatMesh.rotation.y = Math.PI;
            }
        });
        
        splatMesh.quaternion.set(1, 0, 0, 0);
        splatMesh.position.set(0, 0, 0);
        
        this.scene.add(splatMesh); 
        this.currentSplatMesh = splatMesh;
    }

    animate() {
        if (!this.camera) return;
        
        const baseZ = this.camera.position.z;
        this.camera.position.x += (this.mouseX * 0.5 - this.camera.position.x) * 0.05;
        this.camera.position.y += (-this.mouseY * 0.5 - this.camera.position.y) * 0.05;
        this.camera.position.z = baseZ;
        
        this.renderer.render(this.scene, this.camera);
    }
}