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
        this.currentFocusY = "50%";
        this.shiftScale = 3.5;
        this.isContextLost = false;
    }

    async init() {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(33, window.innerWidth / window.innerHeight, 0.01, 1000);
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
        
        const canvas = renderer.domElement;
        canvas.addEventListener('webglcontextlost', (e) => {
            console.warn('WebGL context lost in SplatViewer');
            e.preventDefault();
            this.isContextLost = true;
            this.isDisposed = true;
        }, false);
        
        canvas.addEventListener('webglcontextrestored', () => {
            console.log('WebGL context restored in SplatViewer');
            this.isContextLost = false;
            this.isDisposed = false;
        }, false);
        
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
            this.camera.clearViewOffset();
            this.applyViewOffset(this.currentFocusY);
            
            const pr = Math.min(window.devicePixelRatio, 2);
            this.renderer.setPixelRatio(pr);
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('mousemove', this.boundMouseMove);
        window.addEventListener('resize', this.boundResize);

        this.renderer.setAnimationLoop(this.animate.bind(this));
    }

    applyViewOffset(focusYString) {
        if (!this.camera) return;
        
        const percent = parseFloat(focusYString) || 50;

        const offsetY = (percent - 50) * this.shiftScale;
        
        this.camera.setViewOffset(
            window.innerWidth,
            window.innerHeight,
            0,
            offsetY,
            window.innerWidth,
            window.innerHeight
        );
    }

    loadSplat(id, focusY = "50%", onLoadCallback = null, onErrorCallback = null) {
        if (!this.scene || this.isDisposed || this.isContextLost) {
            if (onErrorCallback) onErrorCallback(new Error('Viewer not ready or context lost'));
            return;
        }
        
        this.currentFocusY = focusY;
        this.applyViewOffset(focusY);
        
        if (this.loadTimeout) clearTimeout(this.loadTimeout);
        
        if (this.currentSplatMesh) { 
            this.scene.remove(this.currentSplatMesh); 
            if (this.currentSplatMesh.dispose) this.currentSplatMesh.dispose(); 
        }
        
        const url = `./splats/${id}.ply`;
        let hasLoaded = false;
        let hasError = false;

        const splatMesh = new SplatMesh({ 
            url: url,
            maxStdDev: Math.sqrt(5),
            integerBasedSort: true,
            minAlpha: 0.1,
            maxPixelRadius: 32,
            stochastic: true,
            onLoad: () => { 
                if (hasLoaded || hasError) return;
                hasLoaded = true;
                
                splatMesh.rotation.y = Math.PI;
                if (this.loadTimeout) clearTimeout(this.loadTimeout);
                
                if (onLoadCallback) onLoadCallback();
            },
            onError: (error) => {
                if (hasLoaded || hasError) return;
                hasError = true;
                console.error('SplatMesh load error:', error);
                if (this.loadTimeout) clearTimeout(this.loadTimeout);
                if (onErrorCallback) onErrorCallback(error);
            }
        });
        
        splatMesh.quaternion.set(1, 0, 0, 0);
        splatMesh.position.set(0, 0, 0);
        
        this.scene.add(splatMesh); 
        this.currentSplatMesh = splatMesh;

        this.loadTimeout = setTimeout(() => {
            if (!hasLoaded && !hasError) {
                hasError = true;
                console.warn('Splat load timeout');
                if (onErrorCallback) onErrorCallback(new Error('Load timeout'));
            }
        }, 10000);
    }

    animate() {
        if (!this.camera || this.isDisposed || this.isContextLost) return;
        
        const baseZ = this.camera.position.z;
        
        this.camera.position.x += (this.mouseX * 0.5 - this.camera.position.x) * 0.05;
        this.camera.position.y += (-this.mouseY * 0.5 - this.camera.position.y) * 0.05;
        this.camera.position.z = baseZ;
        
        try {
            this.renderer.render(this.scene, this.camera);
        } catch (error) {
            console.error('Render error:', error);
            this.isDisposed = true;
        }
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