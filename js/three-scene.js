/**
 * HYPER-NETWORK AI NEURON CORE - FINAL V3
 * - Fixed Dimensional Mouse Tracking
 * - Real-time Synaptic Connections
 * - Recursive Neural Depth
 */

class CinematicNetwork {
    constructor(canvas) {
        if (!canvas || !window.THREE) return;
        this.canvas = canvas;
        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock();
        this.mouse3D = new THREE.Vector3(0, 0, 0);
        this.mouse2D = new THREE.Vector2(0, 0);
        this.raycaster = new THREE.Raycaster();
        
        this.scrollProgress = 0; 
        this.targetScroll = 0;

        this.CONFIG = {
            PARTICLE_COUNT: 160,
            MAX_CONNECTIONS: 3,
            CONNECT_DIST: 22,
            RADIUS_GLOBE: 35,
            COLORS: {
                DOTS: "#00f2ff",
                LINES: "#0d9488",
                FOG: 0x010409 
            }
        };

        this.init();
    }

    init() {
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.z = 70; 

        this.scene.fog = new THREE.FogExp2(this.CONFIG.COLORS.FOG, 0.008);

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        this.createNeuralEntities();
        this.createLines();
        this.addEvents();
        this.animate();
    }

    createNeuralEntities() {
        const vertexShader = `
            varying float vAlpha;
            attribute vec3 aTargetSphere;
            attribute float aSize;
            uniform float uProgress;
            uniform float uTime;

            void main() {
                vec3 morphed = mix(position, aTargetSphere, uProgress);
                float noise = sin(uTime + position.x * 0.2) * 0.4;
                morphed += noise * (1.0 - uProgress);

                vec4 mvPosition = modelViewMatrix * vec4(morphed, 1.0);
                gl_PointSize = aSize * (500.0 / -mvPosition.z); 
                vAlpha = smoothstep(-200.0, -5.0, mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `;

        const fragmentShader = `
            varying float vAlpha;
            void main() {
                float d = distance(gl_PointCoord, vec2(0.5));
                if (d > 0.5) discard;
                float glow = pow(1.0 - d * 2.0, 3.0);
                gl_FragColor = vec4(0.0, 0.95, 1.0, glow * vAlpha);
            }
        `;

        const geo = new THREE.BufferGeometry();
        const startPos = new Float32Array(this.CONFIG.PARTICLE_COUNT * 3);
        const targetSphere = new Float32Array(this.CONFIG.PARTICLE_COUNT * 3);
        const sizes = new Float32Array(this.CONFIG.PARTICLE_COUNT);

        for (let i = 0; i < this.CONFIG.PARTICLE_COUNT; i++) {
            const i3 = i * 3;
            startPos[i3] = (Math.random() - 0.5) * 160;
            startPos[i3+1] = (Math.random() - 0.5) * 140;
            startPos[i3+2] = (Math.random() - 0.5) * 100;

            const phi = Math.acos(-1 + (2 * i) / this.CONFIG.PARTICLE_COUNT);
            const theta = Math.sqrt(this.CONFIG.PARTICLE_COUNT * Math.PI) * phi;
            targetSphere[i3] = this.CONFIG.RADIUS_GLOBE * Math.cos(theta) * Math.sin(phi);
            targetSphere[i3+1] = this.CONFIG.RADIUS_GLOBE * Math.sin(theta) * Math.sin(phi);
            targetSphere[i3+2] = this.CONFIG.RADIUS_GLOBE * Math.cos(phi);

            sizes[i] = Math.random() * 2.2 + 0.8;
        }

        geo.setAttribute('position', new THREE.BufferAttribute(startPos, 3));
        geo.setAttribute('aTargetSphere', new THREE.BufferAttribute(targetSphere, 3));
        geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

        this.particleMaterial = new THREE.ShaderMaterial({
            uniforms: { uTime: { value: 0 }, uProgress: { value: 0 } },
            vertexShader,
            fragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.points = new THREE.Points(geo, this.particleMaterial);
        this.scene.add(this.points);
    }

    createLines() {
        this.lineGeo = new THREE.BufferGeometry();
        this.lineMat = new THREE.LineBasicMaterial({
            color: this.CONFIG.COLORS.LINES,
            transparent: true,
            opacity: 0.15,
            blending: THREE.AdditiveBlending
        });
        this.lineMesh = new THREE.LineSegments(this.lineGeo, this.lineMat);
        this.scene.add(this.lineMesh);
    }

    addEvents() {
        window.addEventListener('wheel', (e) => {
            this.targetScroll += e.deltaY * 0.0008;
            this.targetScroll = Math.max(0, Math.min(1.2, this.targetScroll));
        }, { passive: true });

        window.addEventListener('mousemove', (e) => {
            this.mouse2D.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse2D.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    update() {
        const time = this.clock.getElapsedTime();
        this.scrollProgress += (this.targetScroll - this.scrollProgress) * 0.05;
        
        this.particleMaterial.uniforms.uTime.value = time;
        this.particleMaterial.uniforms.uProgress.value = Math.min(1.0, this.scrollProgress);

        // --- CÁLCULO DE MOUSE DIMENSIONAL ---
        this.raycaster.setFromCamera(this.mouse2D, this.camera);
        // Interceptamos o mouse em um plano que acompanha a profundidade do globo
        const zTarget = (1.0 - this.scrollProgress) * 0; 
        const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), -zTarget);
        const intersectPoint = new THREE.Vector3();
        this.raycaster.ray.intersectPlane(planeZ, intersectPoint);

        // IMPORTANTE: Transformar a posição do mouse para o espaço local da cena rotacionada
        this.mouse3D.copy(intersectPoint).applyMatrix4(this.scene.matrixWorld.clone().invert());

        const posAttr = this.points.geometry.attributes.position.array;
        const sphereAttr = this.points.geometry.attributes.aTargetSphere.array;
        const lineCoords = [];
        const currentPositions = [];

        // 1. Calcular posições atuais interpoladas
        for (let i = 0; i < this.CONFIG.PARTICLE_COUNT; i++) {
            const i3 = i * 3;
            const px = THREE.MathUtils.lerp(posAttr[i3], sphereAttr[i3], Math.min(1.0, this.scrollProgress));
            const py = THREE.MathUtils.lerp(posAttr[i3+1], sphereAttr[i3+1], Math.min(1.0, this.scrollProgress));
            const pz = THREE.MathUtils.lerp(posAttr[i3+2], sphereAttr[i3+2], Math.min(1.0, this.scrollProgress));
            currentPositions.push(new THREE.Vector3(px, py, pz));
        }

        // 2. Gerar conexões neurais e magnéticas
        for (let i = 0; i < this.CONFIG.PARTICLE_COUNT; i++) {
            const p1 = currentPositions[i];
            let connections = 0;

            // Conexão entre partículas
            for (let j = i + 1; j < this.CONFIG.PARTICLE_COUNT; j++) {
                if (connections >= this.CONFIG.MAX_CONNECTIONS) break;
                const p2 = currentPositions[j];
                const dist = p1.distanceTo(p2);
                if (dist < this.CONFIG.CONNECT_DIST) {
                    lineCoords.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
                    connections++;
                }
            }

            // Conexão Magnética (Mouse) - Agora funciona no Globo!
            const distToMouse = p1.distanceTo(this.mouse3D);
            if (distToMouse < 28) {
                lineCoords.push(p1.x, p1.y, p1.z, this.mouse3D.x, this.mouse3D.y, this.mouse3D.z);
            }
        }

        this.lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(lineCoords, 3));
        this.lineGeo.attributes.position.needsUpdate = true;
        this.lineMat.opacity = 0.15 + Math.sin(time * 3) * 0.08;
    }

    animate() {
        this.update();
        const time = this.clock.getElapsedTime();

        // Rotação da Cena
        this.scene.rotation.y = time * 0.08 + (this.scrollProgress * 2.5);
        this.scene.updateMatrixWorld(); // Força atualização para o cálculo do mouse3D

        // Efeito de Câmera (Dolly Zoom)
        this.camera.position.z = 70 - (this.scrollProgress * 100);
        this.camera.fov = 60 + (this.scrollProgress * 40);
        this.camera.updateProjectionMatrix();

        // Parallax suave
        this.camera.position.x += (this.mouse2D.x * 12 - this.camera.position.x) * 0.05;
        this.camera.position.y += (this.mouse2D.y * 10 - this.camera.position.y) * 0.05;
        this.camera.lookAt(0, 0, 0);

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("bg-canvas");
    if (canvas) new CinematicNetwork(canvas);
});