// 2Dマウス座標を管理する Mouse2D クラスを定義しています。

export class Mouse2D {

  // Mouse2D クラスのインスタンスを取得するための静的メソッドです。
  // このメソッドは、Mouse2D クラスの単一インスタンスを確保し、既に存在する場合はそれを返します。これにより、シングルトンデザインパターンが実装されています。
  static get instance() {
    if (!this.mouse2d) {
      this.mouse2d = new Mouse2D();
    }
    return this.mouse2d;
  }

  // コンストラクタ内では、初期のマウス座標を [0, 0] と設定します。
  // さらに、マウス座標を更新するためのイベントリスナー handleMouseMove と handleTouchMove が設定されています。handleMouseMove はマウスの移動に反応し、handleTouchMove はタッチイベントに反応します。
  // これらのイベントリスナーがマウス座標を更新し、クラスの position プロパティに格納します。
  constructor() {
    this.position = [0, 0];

    this.handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -1 * ((e.clientY / window.innerHeight) * 2 - 1);
      this.position = [x, y];
    };

    this.handleTouchMove = (e) => {
      const { pageX, pageY } = e.touches[0];
      const x = (pageX / window.innerWidth) * 2 - 1;
      const y = -1 * ((pageY / window.innerHeight) * 2 - 1);
      this.position = [x, y];
    };

    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('touchmove', this.handleTouchMove);
  }

  // マウス座標を更新するイベントリスナーの削除と、Mouse2D クラスのインスタンスの破棄が行われます。これにより、リソースのクリーンアップが実現されます。
  // ウィンドウ上でのマウス移動とタッチイベントのリスニングが行われています。これらのリスナーは、マウス座標を更新し、position プロパティに新しい座標を設定します。
  dispose() {
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('touchmove', this.handleTouchMove);
    Mouse2D.mouse2d = undefined;
  }
  
}
export const mouse2d = Mouse2D.instance;