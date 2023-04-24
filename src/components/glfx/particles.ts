import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import particlesShader from 'src/components/glfx/particlesShader';
import horizontalBlurShader from 'src/components/glfx/horizontalBlurShader';
import verticalBlurShader from 'src/components/glfx/verticalBlurShader';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { BufferAttribute } from 'three';
import { vertexShader2 } from 'src/components/glfx/vertex';

const mapRange = (value: number, inputMin: number, inputMax: number, outputMin: number, outputMax: number): number =>
    outputMin + ((value - inputMin) / (inputMax - inputMin)) * (outputMax - outputMin);

const downSampled = (poly: number = 512) => {
    const amount = poly; // 100000;

    const positions = new Float32Array(amount * amount * 3);
    const texels = new Float32Array(amount * amount * 2);
    const sizes = new Float32Array(amount * amount);

    const vertex = new THREE.Vector3();
    const texel = new THREE.Vector2();

    const stepW = (1 / amount) * window.innerWidth;
    const stepH = (1 / amount) * window.innerHeight;

    for (let i = 0; i < amount; i++)
        for (let j = 0; j < amount; j++) {
            vertex.x = j * stepW - window.innerWidth / 2;
            vertex.y = i * stepH - window.innerHeight / 2;
            vertex.z = 0;
            const ind = i * amount + j;
            vertex.toArray(positions, ind * 3);
            texel.x = j / amount;
            texel.y = i / amount;
            texel.toArray(texels, ind * 2);
            sizes[ind] = 1;
        }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('texel', new THREE.BufferAttribute(texels, 2));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return geometry;
};

class ParticleSystem {
    private readonly renderer: THREE.WebGLRenderer;
    private readonly scene: THREE.Scene;
    private readonly camera: THREE.OrthographicCamera;
    private readonly sphere: THREE.Points;
    private readonly sphere2: THREE.Points;
    private readonly material: THREE.ShaderMaterial;
    private readonly material2: THREE.ShaderMaterial;
    private composer: EffectComposer;
    private readonly startTime: number;
    private readonly imageDataUrl: string;
    private container: HTMLElement;
    private limit: number;
    private readonly zoomDivider: number;
    private mouseDown: boolean;
    private mousePos: THREE.Vector2;
    private analyser: AnalyserNode;
    private readonly resizeCbWrapper: () => void;
    private geometry: THREE.BufferGeometry | undefined;
    private geometry2: THREE.BufferGeometry | undefined;
    private readonly defaultMousePos = new THREE.Vector2(0, 0);

    constructor(imageDataUrl: string, container: HTMLElement, analyser: AnalyserNode) {
        // if (!Detector.webgl) Detector.addGetWebGLMessage();
        this.imageDataUrl = imageDataUrl;
        this.container = container;
        this.zoomDivider = 1;
        this.mousePos = new THREE.Vector2(0, 0);
        this.mouseDown = false;
        this.analyser = analyser;
        this.startTime = 0;
        this.limit = 500;

        this.camera = new THREE.OrthographicCamera(
            window.innerWidth / -2,
            window.innerWidth / 2,
            window.innerHeight / 2,
            window.innerHeight / -2,
            -1,
            2
        );
        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = 1;
        this.camera.updateProjectionMatrix();

        this.scene = new THREE.Scene();

        this.geometry = downSampled(512);
        this.geometry2 = downSampled(512);
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0.0 },
                limit: { value: 0.0 },
                uZoomMultiplier: { value: this.zoomDivider / new THREE.Vector3().distanceTo(this.camera.position) },
                screenCapture: { value: new THREE.TextureLoader().load(this.imageDataUrl) },
                mouse: { value: new THREE.Vector2(0, 0) },
            },
            vertexShader: particlesShader.vertexShader,
            fragmentShader: particlesShader.fragmentShader,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true,
        });

        this.material2 = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0.0 },
                limit: { value: 0.0 },
                uZoomMultiplier: { value: this.zoomDivider / new THREE.Vector3().distanceTo(this.camera.position) },
                screenCapture: { value: new THREE.TextureLoader().load(this.imageDataUrl) },
                mouse: { value: new THREE.Vector2(0, 0) },
            },
            vertexShader: vertexShader2,
            fragmentShader: particlesShader.fragmentShader,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true,
        });

        this.sphere = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.sphere);

        this.sphere2 = new THREE.Points(this.geometry, this.material2);
        this.scene.add(this.sphere2);

        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);

        this.composer = new EffectComposer(this.renderer);
        const mainPass = new RenderPass(this.scene, this.camera);
        // mainPass.renderToScreen = true;
        this.composer.addPass(mainPass);

        const hblur = new ShaderPass(horizontalBlurShader);
        this.composer.addPass(hblur);

        const vblur = new ShaderPass(verticalBlurShader);
        vblur.renderToScreen = true;
        this.composer.addPass(vblur);

        // const renderPixelatedPass = new RenderPixelatedPass( 6, this.scene, this.camera );
        // this.composer.addPass(renderPixelatedPass);

        this.resizeCbWrapper = this.onWindowResize.bind(this);
        window.addEventListener('resize', this.resizeCbWrapper, false);
        this.addMouseHandler();

        this.startTime = new Date().getTime();

        this.container.style.display = 'block';
        this.animate();
    }

    addMouseHandler() {
        document.addEventListener(
            'mousemove',
            e => {
                this.onMouseMove(e);
            },
            false
        );

        document.addEventListener(
            'mousedown',
            e => {
                this.onMouseDown(e);
            },
            false
        );

        document.addEventListener(
            'mouseup',
            () => {
                this.onMouseUp();
            },
            false
        );
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.render();
    }

    render() {
        const time = new Date().getTime() - this.startTime;
        this.material.uniforms.uTime.value = time * 0.000001;
        this.material2.uniforms.uTime.value = time * 0.000001;

        const data = new Uint8Array(this.analyser.fftSize);
        this.analyser.getByteFrequencyData(data);

        // if (!this.mouseDown) {
        //     this.material.uniforms.mouse.value = this.mousePos;
        //     if (this.limit > 2)
        //         this.limit -= 100;
        //     if (this.limit < 2) this.limit = 2;
        // } else {
        //     this.material.uniforms.mouse.value = this.defaultMousePos;
        //     if (this.limit < 500)
        //         this.limit += 100;
        //     if (this.limit >= 500) this.limit = 500;
        // }
        this.material.uniforms.mouse.value = this.mousePos;
        this.material.uniforms.limit.value = 2;
        this.material2.uniforms.limit.value = 500;

        const {
            geometry: { attributes },
        } = this.sphere2;
        const size = attributes.size as BufferAttribute;
        for (let i = 0; i < data.length; i++) {
            const v = data[i] / 300.0;
            for (let j = 0; j < data.length; j++)
                size.setX(i * data.length + j, v);

        }
        attributes.size.needsUpdate = true;

        // const {
        //     geometry: { attributes: attributes2 },
        // } = this.sphere2;
        // const size2 = attributes2.size as BufferAttribute;
        // for (let i = 0; i < data.length; i++) {
        //     const v = data[i] / 255.0;
        //     for (let j = 0; j < data.length; j++)
        //         size2.setX(i * data.length + j, v);
        //
        // }
        // attributes2.size.needsUpdate = true;

        this.composer.render();
        this.renderer.render(this.scene, this.camera);
    }

    onMouseMove(evt:MouseEvent) {
        // const deltaX = evt.clientX - this.mouseX;
        // const deltaY = evt.clientY - this.mouseY;
        this.mousePos.x = mapRange(evt.clientX, 0, window.innerWidth, -2, 2);
        this.mousePos.y = mapRange(evt.clientY, 0, window.innerHeight, 2, -2);
    }

    onMouseDown(evt:MouseEvent) {
        evt.preventDefault();
        this.mouseDown = true;
        // this.mouseX = evt.clientX;
        // this.mouseY = evt.clientY;
    }

    onMouseUp() {
        this.mouseDown = false;
    }

    onWindowResize() {
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

export default ParticleSystem;
