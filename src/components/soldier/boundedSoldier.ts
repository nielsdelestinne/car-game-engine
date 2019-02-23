import Drawable from "../drawable";
import Soldier from "./soldier";
import DrawingEngine from "../../drawingEngine";

/**
 * A BoundedSoldier checks for the outside boundaries of the canvas.
 * If the Soldier is attempting to move outside of the canvas, the BoundedSoldier will invert the speed, thus keeping
 * the Soldier within the canvas.
 */
export default class BoundedSoldier implements Drawable {

    constructor(private soldier: Soldier) {
    }

    draw(drawingEngine: DrawingEngine): void {
        this.soldier.draw(drawingEngine);
        if (this.isMovingOutsideOfCanvasHorizontally(drawingEngine)) {
            this.soldier.inverseVelocityX();
        }
        if (this.isMovingOutsideOfCanvasVertically(drawingEngine)) {
            this.soldier.inverseVelocityY();
        }
    }

    get positionX(): number {
        return this.soldier.positionX;
    }

    get positionY(): number {
        return this.soldier.positionY;
    }

    inverseVelocityX() {
        this.soldier.inverseVelocityX();
    }

    inverseVelocityY() {
        this.soldier.inverseVelocityY();
    }

    private isMovingOutsideOfCanvasVertically(drawingEngine: DrawingEngine) {
        return this.soldier.positionY + Soldier.HEIGHT >= drawingEngine.height || this.soldier.positionY <= 0;
    }

    private isMovingOutsideOfCanvasHorizontally(drawingEngine: DrawingEngine) {
        return this.soldier.positionX + Soldier.WIDTH >= drawingEngine.width || this.soldier.positionX <= 0;
    }
}