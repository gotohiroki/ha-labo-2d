import "../scss/app.scss";
import { WebGL } from "./webgl/";

class App {
    constructor() {
        this.canvas = new WebGL(document.body);
    }
    dispose() {
        this.canvas.dispose();
    }
}
const app = new App();
window.addEventListener('beforeunload', () => {
    app.dispose();
});
