import CanvasWindow from "./canvasWindow";

class Application {

    public static launch(): HTMLCanvasElement  {
        const canvasWindow = new CanvasWindow('mainCanvas', 350, 150);
        return canvasWindow.drawCanvas();
    }

}

/**
 * ----------------------
 * Launch the application
 * ----------------------
 */
document.body.appendChild(Application.launch());