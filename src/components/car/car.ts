import Drawable from "../drawable";
import {fromEvent, merge} from "rxjs";
import {filter, tap} from "rxjs/operators";
import DrawingEngine from "../../drawingEngine";

export default class Car implements Drawable {

    private _positionX: number; // position of car on x axis
    private _positionY: number; // position of car on y axis

    private velocityX: number = 0; // speed of car on x axis
    private velocityY: number = 0; // speed of car on y axis

    private power: number = 0.085; // how fast car can accelerate

    private drag: number = 0.97; // how fast the car slows down (the higher the value, the less drag)

    private angle: number = 0; // the rotation of the car, in radians
    private angularVelocity: number = 0; // speed the car is spinning, in radians
    private angularDrag: number = 0.95; // how fast the car stops spinning

    private turnSpeed: number = 0.0025; // how fast to turn (the lower the value the lower the turn speed)

    private readonly width: number = 10;
    private readonly height: number = 25;

    private isKeyUpPressed = false;
    private isKeyDownPressed = false;
    private isKeyLeftPressed = false;
    private isKeyRightPressed = false;

    get positionX(): number {
        return this._positionX;
    }

    get positionY(): number {
        return this._positionY;
    }

    constructor(positionX: number = 20, positionY: number = 650) {

        this._positionX = positionX;
        this._positionY = positionY;


        const keyDowns = fromEvent(document, 'keydown');
            // .pipe(distinctUntilChanged((e1: KeyboardEvent, e2: KeyboardEvent) => e1.code === e2.code));
        const keyUps = fromEvent(document, 'keyup');
            // .pipe(distinctUntilChanged((e1: KeyboardEvent, e2: KeyboardEvent) => e1.code === e2.code));

        const keyPresses = merge(keyDowns, keyUps)
            .pipe(
                tap((e: KeyboardEvent) => console.log(e.code)),
                filter((e: KeyboardEvent) => e.code === 'ArrowUp'
                    || e.code === 'ArrowRight'
                    || e.code === 'ArrowDown'
                    || e.code === 'ArrowLeft'
                    || e.code === 'Space'));

        keyPresses.subscribe((event: KeyboardEvent) => {
            console.log(event);
            switch (event.code) {
                case 'ArrowUp':
                    this.isKeyUpPressed = event.type === 'keydown';
                    break;
                case 'ArrowRight':
                    this.isKeyRightPressed = event.type === 'keydown';
                    break;
                case 'ArrowDown':
                    this.isKeyDownPressed = event.type === 'keydown';
                    break;
                case 'ArrowLeft':
                    this.isKeyLeftPressed = event.type === 'keydown';
                    break;
            }
        })
    }

    draw(drawingEngine: DrawingEngine): void {

        if(this.isKeyUpPressed) {
            this.velocityX -= Math.sin(this.angle) * this.power;
            this.velocityY -= Math.cos(this.angle) * this.power;
        }

        if(this.isKeyDownPressed) {
            this.velocityX += Math.sin(this.angle) * this.power;
            this.velocityY += Math.cos(this.angle) * this.power;
        }

        if(this.isKeyLeftPressed) {
            this.angularVelocity += this.turnSpeed;
        }

        if(this.isKeyRightPressed) {
            this.angularVelocity -= this.turnSpeed;
        }

        this._positionX += this.velocityX;
        this._positionY += this.velocityY;

        this.velocityX *= this.drag;
        this.velocityY *= this.drag;

        this.angle += this.angularVelocity;
        this.angularVelocity *= this.angularDrag;

        // this._positionX =  this.power === 0 ? this._positionX : this._positionX + this.power;
        // this._positionY = this.power === 0 ? this._positionY : this._positionY + this.rotate;
        drawingEngine.context.save();
        drawingEngine.context.translate(this._positionX + (this.width / 2), this._positionY + (this.height / 2)); //translate to center of shape
        drawingEngine.context.rotate(-this.angle);  //rotate 25 degrees.
        drawingEngine.context.translate(-(this._positionX + (this.width / 2)), -(this._positionY + (this.height / 2))); //translate center back to 0,0
        drawingEngine.context.fillStyle = 'black';
        drawingEngine.context.fillRect(this._positionX, this._positionY, this.width, this.height);
        drawingEngine.context.restore();

        drawingEngine.context.fillStyle = 'black';
        drawingEngine.context.font = "12px Consolas";
        drawingEngine.context.fillText(`position X: ${this._positionX}`, 10, 25);
        drawingEngine.context.fillText(`position Y: ${this._positionY}`, 10, 37);
        drawingEngine.context.fillText(`velocity X: ${this.velocityX}`, 10, 49);
        drawingEngine.context.fillText(`velocity Y: ${this.velocityY}`, 10, 61);
        drawingEngine.context.fillText(`Angle: ${this.angle}`, 10, 73);
        drawingEngine.context.fillText(`Angular velocity: ${this.angularVelocity}`, 10, 85);
    }

}