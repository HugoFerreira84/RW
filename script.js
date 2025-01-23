// Main Initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeMenuToggle();
    animateSections();
    handleFormSubmission();
    createStageElements();
    initStageVisualizer();
});

// Menu Toggle
const initializeMenuToggle = () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
};

// Animações GSAP para as seções
const animateSections = () => {
    const projectCards = document.querySelectorAll('.project-card');
    if (projectCards.length === 0) {
        console.warn('Nenhum elemento .project-card encontrado.');
        return;
    }

    gsap.from('.project-card', {
        scrollTrigger: {
            trigger: '.projects',
            start: 'top center',
            toggleActions: 'play none none reverse',
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.2,
    });

    const serviceItems = document.querySelectorAll('.service-item');
    if (serviceItems.length === 0) {
        console.warn('Nenhum elemento .service-item encontrado.');
        return;
    }

    gsap.from('.service-item', {
        scrollTrigger: {
            trigger: '.services',
            start: 'top center',
            toggleActions: 'play none none reverse',
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.2,
    });
};

// Form Validation
const handleFormSubmission = () => {
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let isValid = true;
        form.querySelectorAll('input, textarea').forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = 'red';
            } else {
                input.style.borderColor = '';
            }
        });

        if (isValid) {
            alert('Mensagem enviada com sucesso!');
            form.reset();
        }
    });
};

// Criação de elementos animados
const createStageElements = () => {
    const stageElements = document.querySelector('.stage-elements');
    if (!stageElements) {
        console.error('Elemento .stage-elements não encontrado no DOM.');
        return;
    }

    // Limpar conteúdo anterior
    stageElements.innerHTML = '';

    // Configurações gerais
    const stageWidth = 800;
    const stageHeight = 400;

    // Criar o palco principal (base)
    const stageBase = document.createElement('div');
    stageBase.style.cssText = `
      position: absolute;
      width: ${stageWidth}px;
      height: ${stageHeight}px;
      background-color: #2a2a2a;
      border-radius: 10px;
      bottom: 50px;
      left: 50%;
      transform: translateX(-50%);
      box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.5);
    `;
    stageElements.appendChild(stageBase);

    // Adicionar cortinas
    const createCurtain = (side) => {
        const curtain = document.createElement('div');
        curtain.style.cssText = `
        position: absolute;
        width: ${stageWidth / 4}px;
        height: ${stageHeight}px;
        background: linear-gradient(135deg, #ff3366, #cc0033);
        ${side}: 0;
        top: 0;
        border-radius: 10px 0 0 10px;
      `;
        return curtain;
    };
    stageBase.appendChild(createCurtain('left'));
    stageBase.appendChild(createCurtain('right'));

    // Adicionar luzes
    for (let i = 0; i < 3; i++) {
        const light = document.createElement('div');
        light.style.cssText = `
        position: absolute;
        width: 80px;
        height: 80px;
        background: radial-gradient(circle, rgba(255, 255, 0, 0.8), transparent);
        border-radius: 50%;
        top: -40px;
        left: ${i * (stageWidth / 4) + stageWidth / 8 - 40}px;
        animation: flicker 1s infinite alternate ease-in-out;
      `;
        stageBase.appendChild(light);
    }

    // Adicionar adereços
    const props = ['#00ffcc', '#ffcc00', '#3366ff'];
    for (let i = 0; i < 5; i++) {
        const prop = document.createElement('div');
        const size = Math.random() * 50 + 30;
        prop.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background-color: ${props[Math.floor(Math.random() * props.length)]};
        border-radius: 50%;
        bottom: 20px;
        left: ${Math.random() * (stageWidth - size)}px;
      `;
        stageBase.appendChild(prop);

        // Animação de leve movimentação
        gsap.to(prop, {
            y: Math.random() * 20 - 10,
            repeat: -1,
            yoyo: true,
            duration: Math.random() * 2 + 1,
            ease: 'sine.inOut',
        });
    }
};



// Initialize 3D Stage Visualizer
const initStageVisualizer = () => {
    if (!THREE) {
        console.error('Three.js não carregado!');
        return;
    }

    const visualizer = new StageVisualizer();
};

class StageVisualizer {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('stage3D'), antialias: true });
        this.init();
    }

    init() {
        this.setupScene();
        this.addLights();
        this.createStage();
        this.animate();
        this.setupControls();
    }

    setupScene() {
        this.renderer.setSize(this.renderer.domElement.clientWidth, this.renderer.domElement.clientHeight);
        this.renderer.setClearColor(0x1a1a1a);
        this.camera.position.z = 5;
    }

    addLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const spotLight = new THREE.SpotLight(0xff3366, 1);
        spotLight.position.set(0, 5, 5);
        this.scene.add(spotLight);
    }

    createStage() {
        const geometry = new THREE.BoxGeometry(4, 0.2, 3);
        const material = new THREE.MeshPhongMaterial({ color: 0x2a2a2a });
        this.stage = new THREE.Mesh(geometry, material);
        this.scene.add(this.stage);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }

    setupControls() {
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                if (this[action]) {
                    this[action]();
                } else {
                    console.error(`Ação ${action} não implementada.`);
                }
            });
        });
    }

    rotate() {
        gsap.to(this.stage.rotation, {
            y: this.stage.rotation.y + Math.PI * 2,
            duration: 2,
            ease: 'power2.inOut'
        });
    }

    lights() {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        this.scene.traverse((object) => {
            if (object.isLight) {
                object.color.set(`#${randomColor}`);
            }
        });
        console.log(`Cor da luz alterada para: #${randomColor}`);
    }

    props() {
        const geometry = new THREE.SphereGeometry(0.2, 32, 32);
        const material = new THREE.MeshPhongMaterial({ color: 0xff3366 });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(Math.random() * 4 - 2, 0.5, Math.random() * 4 - 2);
        this.scene.add(sphere);
        console.log('Novo prop adicionado à cena.');
    }
}
