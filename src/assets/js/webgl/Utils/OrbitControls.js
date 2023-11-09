import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { gl } from "../Components/canvasBase";

class Controls {
  constructor() {
    this.orbitControls = new OrbitControls(gl.camera, gl.renderer.domElement);
    this.orbitControls.enableDamping = true;
    this.orbitControls.dampingFactor = 0.1;
  }

  disableDamping() {
    this.orbitControls.enableDamping = false;
  }

  update() {
    this.orbitControls.update();
  }
}

export const controls = new Controls();