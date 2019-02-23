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
                filter((e: KeyboardEvent) => e.code === 'ArrowUp'
                    || e.code === 'ArrowRight'
                    || e.code === 'ArrowDown'
                    || e.code === 'ArrowLeft'
                    || e.code === 'Space')
            );

        keyPresses.subscribe((event: KeyboardEvent) => {
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

        if (this.isKeyUpPressed) {
            this.velocityX -= Math.sin(this.angle) * this.power;
            this.velocityY -= Math.cos(this.angle) * this.power;
        }

        if (this.isKeyDownPressed) {
            this.velocityX += Math.sin(this.angle) * this.power;
            this.velocityY += Math.cos(this.angle) * this.power;
        }

        if (this.isKeyLeftPressed) {
            this.angularVelocity += this.turnSpeed;
        }

        if (this.isKeyRightPressed) {
            this.angularVelocity -= this.turnSpeed;
        }

        this._positionX += this.velocityX;
        this._positionY += this.velocityY;

        this.velocityX *= this.drag;
        this.velocityY *= this.drag;

        this.angle += this.angularVelocity;
        this.angularVelocity *= this.angularDrag;

        this.collisionDetectionStuff(drawingEngine);

        // this._positionX =  this.power === 0 ? this._positionX : this._positionX + this.power;
        // this._positionY = this.power === 0 ? this._positionY : this._positionY + this.rotate;
        drawingEngine.context.save();
        drawingEngine.context.translate(this._positionX + (this.width / 2), this._positionY + (this.height / 2)); //translate to center of shape
        drawingEngine.context.rotate(-this.angle);
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

        drawingEngine.context.save();
        drawingEngine.context.beginPath();
        drawingEngine.context.translate(this._positionX + (this.width / 2), this._positionY + (this.height / 2));
        drawingEngine.context.rotate(-this.angle);
        drawingEngine.context.translate(-(this._positionX + (this.width / 2)), -(this._positionY + (this.height / 2)));
        drawingEngine.context.moveTo(this._positionX, this._positionY);
        drawingEngine.context.lineTo(this._positionX + this.width, this._positionY);
        drawingEngine.context.strokeStyle = 'yellow';
        drawingEngine.context.stroke();
        drawingEngine.context.restore();


    }

    collisionDetectionStuff(drawingEngine: DrawingEngine):void {
        const line = {from: {x: 200, y: 250}, to: {x: 450, y: 260}};
        this.drawDummyLine(drawingEngine, line);
        // const newPosition = this.lineToAngle(drawingEngine, this._positionX, this._positionY, this.width, -this.angle);


        // https://www.mathsisfun.com/sine-cosine-tangent.html
        // Forget about this... https://stackoverflow.com/questions/20916953/get-distance-between-two-points-in-canvas
        // https://math.stackexchange.com/questions/143932/calculate-point-given-x-y-angle-and-distance
        const x2 = (this._positionX + (this.width / 2));
        const y2 = (this._positionY + (this.height / 2));
        const distance = Math.sqrt( Math.pow(x2 - this._positionX, 2) + Math.pow(y2 - this._positionY, 2) );

        const borderX_TL = x2 + distance * Math.cos((-110 * Math.PI / 180) - this.angle);
        const borderY_TL = y2 + distance * Math.sin((-110 * Math.PI / 180) - this.angle);
        const borderX_TR = x2 + distance * Math.cos((-70 * Math.PI / 180) - this.angle);
        const borderY_TR = y2 + distance * Math.sin((-70 * Math.PI / 180) - this.angle);

        const isCollided = this.collisionDetection(drawingEngine, borderX_TR, borderY_TR, borderX_TL, borderY_TL, line.from.x, line.from.y, line.to.x, line.to.y);

        if(isCollided) {
            this.velocityX = this.velocityX * -2;
            this.velocityY = this.velocityY * -2;
        }

        drawingEngine.context.save();
        drawingEngine.context.beginPath();
        drawingEngine.context.arc(borderX_TL, borderY_TL, 2, 0, 2 * Math.PI);
        drawingEngine.context.arc(borderX_TR, borderY_TR, 2, 0, 2 * Math.PI);
        drawingEngine.context.fillStyle = "red";
        drawingEngine.context.fill();

        drawingEngine.context.moveTo(borderX_TL, borderY_TL);
        drawingEngine.context.lineTo(borderX_TR, borderY_TR);
        drawingEngine.context.strokeStyle = "red";
        drawingEngine.context.stroke();

        drawingEngine.context.restore();
    }

    drawDummyLine(drawingEngine: DrawingEngine, line: any): void {
        drawingEngine.context.save();
        drawingEngine.context.beginPath();
        drawingEngine.context.moveTo(line.from.x, line.from.y);
        drawingEngine.context.lineTo(line.to.x, line.to.y);
        drawingEngine.context.strokeStyle = 'purple';
        drawingEngine.context.lineWidth = 5;
        drawingEngine.context.stroke();
        drawingEngine.context.restore();
    }

    // http://www.jeffreythompson.org/collision-detection/line-line.php
    collisionDetection(drawEngine: DrawingEngine, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number) {

        // calculate the distance to intersection point
        const uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
        const uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

        drawEngine.context.fillText(`uA: ${uA}`, 10, 97);
        drawEngine.context.fillText(`uB: ${uB}`, 10, 109);

        // if uA and uB are between 0-1, lines are colliding
        if (uA >= -0.25 && uA <= 1.25 && uB >= 0 && uB <= 1) {

            // optionally, draw a circle where the lines meet
            const intersectionX = x1 + (uA * (x2 - x1));
            const intersectionY = y1 + (uA * (y2 - y1));

            drawEngine.context.beginPath();
            drawEngine.context.arc(intersectionX, intersectionY, 20, 0, 2 * Math.PI);
            drawEngine.context.fillStyle = "red";
            drawEngine.context.fill();
            console.log("hit");
            return true;
        }
        return false;
    }

    lineToAngle(drawingEngine: DrawingEngine, x1: number, y1: number, width: number, angle:number) {

        var x2 = x1 + width * Math.cos(angle),
            y2 = y1 + width * Math.sin(angle);

        drawingEngine.context.moveTo(x1, y1);
        drawingEngine.context.lineTo(x2, y2);
        drawingEngine.context.strokeStyle = "purple";
        drawingEngine.context.lineWidth = 5;
        drawingEngine.context.stroke();

        return {x: x2, y: y2};
    }

}