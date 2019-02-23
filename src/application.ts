import DrawingEngine from "./drawingEngine";

class Application {

    private static readonly INTERVAL_IN_MSEC = 10   ;
    private drawingEngine: DrawingEngine;

    constructor() {
        this.drawingEngine = new DrawingEngine('mainCanvas', 800, 800);
    }

    get canvasElement(): HTMLCanvasElement {
        return this.drawingEngine.draw();
    }

    public redraw() {
        setInterval(() => this.drawingEngine.draw(), Application.INTERVAL_IN_MSEC);
    }
}

/**
 * ----------------------
 * Launch the application
 * ----------------------
 */
const application = new Application();
document.body.appendChild(application.canvasElement);
application.redraw();