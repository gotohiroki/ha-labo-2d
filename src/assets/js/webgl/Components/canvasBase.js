import { Camera, Clock, Scene, WebGLRenderer } from 'three';
import Stats from "three/examples/jsm/libs/stats.module";

class CanvasBase {
  constructor() {
    this.camera = new Camera();
    this.time = new Clock();

    // ウィンドウのリサイズ時に、設定されたコールバック関数（resizeCallback）を実行し、描画領域のサイズを最新のウィンドウサイズに合わせて調整するためのものです。
    this.handleResize = () => {
      this.resizeCallback && this.resizeCallback();
      const { width, height } = this.size;
      this.renderer.setSize(width, height);
    };

    const { width, height } = this.size;

    this.renderer = new WebGLRenderer({
      antialias: true,
      alpha: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.renderer.shadowMap.enabled = true;
    this.scene = new Scene;
    window.addEventListener('reisize', this.handleResize);
  }

  // ウィンドウのサイズを取得し、オブジェクト { width, height, aspect } として返すゲッターです。
  // width はウィンドウの幅、 height は高さ、 aspect はアスペクト比を表します。
  get size() {
    const { innerWidth: width, innerHeight: height } = window;
    return { width, height, aspect: width / height };
  }

  setup(container) {
    container.appendChild(this.renderer.domElement);
  }

  // リサイズ時に呼び出すコールバック関数を設定します。
  // ウィンドウのサイズが変更されると、このコールバックが実行されます。
  setResizeCallback(callback) {
    this.resizeCallback = callback;
  }

  // 指定された名前の3Dオブジェクトをシーン内から取得します。
  getMesh(name) {
    return this.scene.getObjectByName(name);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
  
  // アニメーションループを開始し、指定されたコールバック関数を呼び出します。
  requestAnimationFrame(callback) {
    gl.renderer.setAnimationLoop(callback);
  }

  // アニメーションループを停止します。
  cancelAnimationFrame() {
    gl.renderer.setAnimationLoop(null);
  }

  // シーン内の子要素（Scene タイプでないもの）を削除し、アニメーションループを停止します。
  // これはリソースの解放やクリーンアップに使用できます。
  dispose() {
    this.cancelAnimationFrame();
    gl.scene?.traverse(child => child.type !== 'Scene' && gl.scene.remove(child));
  }
}

export const gl = new CanvasBase();