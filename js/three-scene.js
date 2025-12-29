/**
 * HYPER-NETWORK AI PULSE
 * - Minimalist Neural Connections
 * - Data Transfer Pulse Effect
 * - Advanced 3D Depth
 */

class CinematicNetwork {
    constructor(canvas) {
        if (!canvas || !window.THREE) return;
        this.canvas = canvas;
        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock();
        this.mouse3D = new THREE.Vector3(0, 0, 0);
        this.mouse2D = new THREE.Vector2(-1, -1);
        this.raycaster = new THREE.Raycaster();

        this.CONFIG = {
            PARTICLE_COUNT: 100,    // Reduzido para ser minimalista
            CONNECT_DIST: 18,       // Distância menor = menos linhas, mais luxo
            LINE_OPACITY: 0.15,
            COLORS: {
                DOTS: new THREE.Color("#00f2ff"),
                LINES: new THREE.Color("#0d9488"),
                PULSE: new THREE.Color("#ffffff"), // Cor do pulso de dados
                FOG: 0x010409 
            }
        };

        this.init();
    }

    init() {
        // Câmera mais próxima (z: 55) para trazer o efeito para frente
        this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.z = 55; 

        this.scene.fog = new THREE.FogExp2(this.CONFIG.COLORS.FOG, 0.01);

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        this.createParticles();
        this.createLines();
        this.addEvents();
        this.animate();
    }

    createParticles() {
        const vertexShader = `
            varying float vAlpha;
            attribute float aSize;
            void main() {
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = aSize * (350.0 / -mvPosition.z); 
                vAlpha = smoothstep(-100.0, -10.0, mvPosition.z); 
                gl_Position = projectionMatrix * mvPosition;
            }
        `;

        const fragmentShader = `
            varying float vAlpha;
            void main() {
                float d = distance(gl_PointCoord, vec2(0.5));
                float strength = smoothstep(0.5, 0.2, d); 
                if (strength <= 0.0) discard;
                gl_FragColor = vec4(0.0, 0.95, 1.0, strength * vAlpha * 0.9);
            }
        `;

        const geo = new THREE.BufferGeometry();
        const pos = [];
        const sizes = [];
        this.velocities = [];

        for (let i = 0; i < this.CONFIG.PARTICLE_COUNT; i++) {
            pos.push(
                (Math.random() - 0.5) * 140, 
                (Math.random() - 0.5) * 120, 
                (Math.random() - 0.5) * 80
            );
            this.velocities.push(
                (Math.random() - 0.5) * 0.02, 
                (Math.random() - 0.5) * 0.02, 
                (Math.random() - 0.5) * 0.02
            );
            sizes.push(Math.random() * 1.0 + 0.3); 
        }

        geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        geo.setAttribute('aSize', new THREE.Float32BufferAttribute(sizes, 1));

        this.particleMaterial = new THREE.ShaderMaterial({
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
        // Usamos ShaderMaterial nas linhas para o efeito de pulso
        this.lineMat = new THREE.LineBasicMaterial({
            color: this.CONFIG.COLORS.LINES,
            transparent: true,
            opacity: this.CONFIG.LINE_OPACITY,
            blending: THREE.AdditiveBlending
        });

        this.lineMesh = new THREE.LineSegments(this.lineGeo, this.lineMat);
        this.scene.add(this.lineMesh);
    }

    addEvents() {
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
        const pos = this.points.geometry.attributes.position.array;
        const lineCoords = [];
        const time = this.clock.getElapsedTime();

        this.raycaster.setFromCamera(this.mouse2D, this.camera);
        const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        this.raycaster.ray.intersectPlane(planeZ, this.mouse3D);

        for (let i = 0; i < this.CONFIG.PARTICLE_COUNT; i++) {
            const i3 = i * 3;

            pos[i3] += this.velocities[i3] + Math.sin(time * 0.1 + i) * 0.005;
            pos[i3+1] += this.velocities[i3+1] + Math.cos(time * 0.1 + i) * 0.005;

            for (let j = i + 1; j < this.CONFIG.PARTICLE_COUNT; j++) {
                const j3 = j * 3;
                const dx = pos[i3] - pos[j3];
                const dy = pos[i3+1] - pos[j3+1];
                const dz = pos[i3+2] - pos[j3+2];
                const distSq = dx*dx + dy*dy + dz*dz;

                if (distSq < this.CONFIG.CONNECT_DIST * this.CONFIG.CONNECT_DIST) {
                    lineCoords.push(pos[i3], pos[i3+1], pos[i3+2], pos[j3], pos[j3+1], pos[j3+2]);
                }
            }

            // Conexão nítida com o ponteiro
            const mDist = this.mouse3D.distanceTo(new THREE.Vector3(pos[i3], pos[i3+1], pos[i3+2]));
            if (mDist < 25) {
                lineCoords.push(pos[i3], pos[i3+1], pos[i3+2], this.mouse3D.x, this.mouse3D.y, this.mouse3D.z);
            }
        }

        this.points.geometry.attributes.position.needsUpdate = true;
        this.lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(lineCoords, 3));
        
        // Efeito de transferência de dados (Brilho randômico)
        this.lineMat.opacity = this.CONFIG.LINE_OPACITY + Math.sin(time * 4) * 0.05;
    }

    animate() {
        this.update();

        // Parallax suave
        this.camera.position.x += (this.mouse2D.x * 10 - this.camera.position.x) * 0.03;
        this.camera.position.y += (this.mouse2D.y * 8 - this.camera.position.y) * 0.03;
        this.camera.lookAt(0, 0, 0);

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.animate());
    }
}

// Start
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("bg-canvas");
    if (canvas) {
        const run = () => {
            if (window.THREE) new CinematicNetwork(canvas);
            else setTimeout(run, 100);
        };
        run();
    }
});