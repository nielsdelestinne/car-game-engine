import Drawable from "../drawable";
import DrawingEngine from "../../drawingEngine";

export default class Soldier implements Drawable {

    public static readonly WIDTH = 10;
    public static readonly HEIGHT = 10;

    private _positionX: number;
    private _positionY: number;
    private velocityX: number;
    private velocityY: number;
    private teamColor: string;

    constructor(positionX: number, positionY: number, teamColor: string, velocityX: number = 0, velocityY: number = 0) {
        this._positionX = positionX;
        this._positionY = positionY;
        this.teamColor = teamColor;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
    }

    draw(drawingEngine: DrawingEngine): void {
        this.calculateNewPositionX();
        this.calculateNewPositionY();
        drawingEngine.context.fillStyle = this.teamColor;
        drawingEngine.context.fillRect(this._positionX, this._positionY, Soldier.WIDTH, Soldier.HEIGHT);
    }

    inverseVelocityX() {
        this.velocityX *= -1;
    }

    inverseVelocityY() {
        this.velocityY *= -1;
    }

    get positionX(): number {
        return this._positionX;
    }

    get positionY(): number {
        return this._positionY;
    }

    private calculateNewPositionX(): void {
        this._positionX += this.velocityX;
    }

    private calculateNewPositionY(): void {
        this._positionY += this.velocityY;
    }

}