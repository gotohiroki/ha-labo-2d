import { Mesh, PlaneGeometry, ShaderMaterial, Vector2 } from 'three';
import GUI from 'lil-gui';

import { gl } from './Components/canvasBase';
import { loadAssets } from './Utils/assetLoader';
import { resolvePath } from './Utils/path';
import { calcCoveredTextureScale } from './Utils/coveredTexture';
import { mouse2d } from './Utils/Mouse2d';

import vertexShader from './Shader/vertex.glsl';
import fragmentShader from './Shader/fragment.glsl';

export class WebGL {
  constructor(parentNode) {
    this.parentNode = parentNode;
    this.assets = {
      image: { path: resolvePath('assets/img/image.jpg') }
    }
    this.resizeCallback = () => {
      const uniforms = this.getUniforms();
      calcCoveredTextureScale(uniforms.u_image.value.texture, gl.size.aspect, uniforms.u_image.value.coveredScale);
      uniforms.uResolution.value.set(gl.size.width, gl.size.height);
    }

    // Animation
    this.anim = () => {
      const dt = gl.time.getDelta();
      const uniforms = this.getUniforms();
      uniforms.u_mouse.value.set(mouse2d.position[0], mouse2d.position[1]);
      uniforms.u_time.value += dt;
      gl.render();
    };

    loadAssets(this.assets).then(() => {
      this.init();
      this.createObjects();
      gl.requestAnimationFrame(this.anim);
    });

  }

  init() {
    gl.setup(this.parentNode.querySelector('#webgl'));
    gl.setResizeCallback(this.resizeCallback);
  }

  createObjects() {
    const texture = this.assets.image.data;
    const coveredScale = calcCoveredTextureScale(texture, gl.size.aspect);
    const geometry = new PlaneGeometry(2, 2);
    const material = new ShaderMaterial({
      uniforms: {
        u_image: { value: { texture, coveredScale: new Vector2(coveredScale[0], coveredScale[1]) } },
        u_resolution: { value: new Vector2(gl.size.width, gl.size.height) },
        u_mouse: { value: new Vector2() },
        u_time: { value: 0 },
        u_refractPower: { value: 0.8 },
        u_unrefractRange: { value: 0.1 }
      },
      vertexShader,
      fragmentShader,
    });

    const mesh = new Mesh( geometry, material );
    mesh.name = 'screen';
    gl.scene.add(mesh);

    // gui
    const gui = new GUI();
    gui.add(material.uniforms.u_refractPower, 'value', 0, 1, 0.01).name('refract power');
    gui.add(material.uniforms.u_unrefractRange, 'value', 0, 0.2, 0.01).name('unrefract range');
  }

  getUniforms() {
    return gl.getMesh('screen').material.uniforms;
  }

  // dispose
  dispose() {
    gl.dispose();
  }
}
