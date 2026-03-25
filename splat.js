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
        this.boundMouseMove = null;
        this.boundResize = null;
        this.isDisposed = false;
        this.loadTimeout = null;
    }

    async init() {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(34, window.innerWidth / window.innerHeight, 0.01, 1000);
        camera.position.set(0, 0, 0);
        camera.lookAt(0, 0, 1);

        const renderer = new THREE.WebGLRenderer({ 
            powerPreference: 'high-performance', 
            antialias: false,
            alpha: false,
            depth: false,
            stencil: false
        });
        
        const pixelRatio = Math.min(window.devicePixelRatio, 2);
        renderer.setPixelRatio(pixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        this.container.innerHTML = '';
        this.container.appendChild(renderer.domElement);

        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;

        this.boundMouseMove = (e) => {
            const hw = window.innerWidth / 2;
            const hh = window.innerHeight / 2;
            this.mouseX = (e.clientX - hw) / hw;
            this.mouseY = (e.clientY - hh) / hh;
        };

        this.boundResize = () => {
            if (window.innerWidth < 768) return;
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            const pr = Math.min(window.devicePixelRatio, 2);
            this.renderer.setPixelRatio(pr);
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('mousemove', this.boundMouseMove);
        window.addEventListener('resize', this.boundResize);

        this.renderer.setAnimationLoop(this.animate.bind(this));
    }

    loadSplat(id, onLoadCallback = null) {
        if (!this.scene || this.isDisposed) return;
        
        if (this.loadTimeout) clearTimeout(this.loadTimeout);
        
        if (this.currentSplatMesh) { 
            this.scene.remove(this.currentSplatMesh); 
            if (this.currentSplatMesh.dispose) this.currentSplatMesh.dispose(); 
        }
        
        const url = `./splats/${id}.ply`;
        let hasLoaded = false;

        const splatMesh = new SplatMesh({ 
            url: url,
            maxStdDev: Math.sqrt(5),
            integerBasedSort: true,
            minAlpha: 0.1,
            maxPixelRadius: 32,
            stochastic: true,
            onLoad: () => { 
                if (hasLoaded) return;
                hasLoaded = true;
                
                splatMesh.rotation.y = Math.PI;
                if (this.loadTimeout) clearTimeout(this.loadTimeout);
                
                if (onLoadCallback) onLoadCallback();
            }
        });
        
        splatMesh.quaternion.set(1, 0, 0, 0);
        splatMesh.position.set(0, 0, 0);
        
        this.scene.add(splatMesh); 
        this.currentSplatMesh = splatMesh;

        // Safety timeout: trigger callback after 3 seconds if onLoad didn't fire
        this.loadTimeout = setTimeout(() => {
            if (!hasLoaded && onLoadCallback) {
                hasLoaded = true;
                onLoadCallback();
            }
        }, 3000);
    }

    animate() {
        if (!this.camera || this.isDisposed) return;
        
        // Original smooth parallax (reverted)
        const baseZ = this.camera.position.z;
        this.camera.position.x += (this.mouseX * 0.5 - this.camera.position.x) * 0.05;
        this.camera.position.y += (-this.mouseY * 0.5 - this.camera.position.y) * 0.05;
        this.camera.position.z = baseZ;
        
        this.renderer.render(this.scene, this.camera);
    }

    dispose() {
        this.isDisposed = true;
        if (this.loadTimeout) clearTimeout(this.loadTimeout);
        
        if (this.renderer) {
            this.renderer.setAnimationLoop(null);
        }

        if (this.boundMouseMove) {
            window.removeEventListener('mousemove', this.boundMouseMove);
        }
        if (this.boundResize) {
            window.removeEventListener('resize', this.boundResize);
        }

        if (this.currentSplatMesh) {
            if (this.currentSplatMesh.dispose) {
                this.currentSplatMesh.dispose();
            }
            if (this.scene) {
                this.scene.remove(this.currentSplatMesh);
            }
            this.currentSplatMesh = null;
        }

        if (this.renderer) {
            this.renderer.dispose();
            if (this.renderer.domElement && this.renderer.domElement.parentNode) {
                this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
            }
            this.renderer = null;
        }

        this.scene = null;
        this.camera = null;
        this.container.innerHTML = '';
    }
}