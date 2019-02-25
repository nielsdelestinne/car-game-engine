import Drawable from "../drawable";
import {ArrowKeys} from "../controls/arrowkeys";

export default class Car implements Drawable {

    private readonly width: number = 10;
    private readonly height: number = 25;

    private arrowKeys: ArrowKeys;
    private context: CanvasRenderingContext2D;

    private _positionX: number; // position of car on x axis
    private _positionY: number; // position of car on y axis

    private velocityX: number = 0; // speed of car on x axis
    private velocityY: number = 0; // speed of car on y axis

    private power: number = 0.085; // how fast car can accelerate

    private drag: number = 0.97; // how fast the car slows down (the higher the value, the less drag)

    private angle: number = 0; // the rotation of the car, in radians
    private angularVelocity: number = 0; // speed the car is spinning, in radians
    private angularDrag: number = 0.95; // how fast the car stops spinning

    private turnSpeed: number = 0.0025;

    // how fast to turn (the lower the value the lower the turn speed)

    get positionX(): number {
        return this._positionX;
    }

    get positionY(): number {
        return this._positionY;
    }


    constructor(positionX: number = 20, positionY: number = 650) {
        this._positionX = positionX;
        this._positionY = positionY;
        this.arrowKeys = new ArrowKeys();
    }

    draw(context: CanvasRenderingContext2D): void {

        this.context = context;

        this.adjustVelocityBasedOnMovement();
        this.calculateVelocity();
        this.calculatePosition();
        this.adjustAngles();
        this.performCollisionDetection();

        this.drawDummyLine();

        this.context.save();
        this.context.translate(this._positionX + (this.width / 2), this._positionY + (this.height / 2)); //translate to center of shape
        this.context.rotate(-this.angle);
        this.context.translate(-(this._positionX + (this.width / 2)), -(this._positionY + (this.height / 2))); //translate center back to 0,0
        this.context.fillStyle = 'black';
        this.context.fillRect(this._positionX, this._positionY, this.width, this.height);
        this.context.restore();

        this.context.save();
        this.context.beginPath();
        this.context.fillStyle = 'black';
        this.context.font = "12px Consolas";
        this.context.fillText(`position X: ${this._positionX}`, 10, 25);
        this.context.fillText(`position Y: ${this._positionY}`, 10, 37);
        this.context.fillText(`velocity X: ${this.velocityX}`, 10, 49);
        this.context.fillText(`velocity Y: ${this.velocityY}`, 10, 61);
        this.context.fillText(`Angle: ${this.angle}`, 10, 73);
        this.context.fillText(`Angular velocity: ${this.angularVelocity}`, 10, 85);
        this.context.restore();

        this.context.save();
        this.context.beginPath();
        this.context.translate(this._positionX + (this.width / 2), this._positionY + (this.height / 2));
        this.context.rotate(-this.angle);
        this.context.translate(-(this._positionX + (this.width / 2)), -(this._positionY + (this.height / 2)));
        this.context.moveTo(this._positionX, this._positionY);
        this.context.lineTo(this._positionX + this.width, this._positionY);
        this.context.strokeStyle = 'yellow';
        this.context.stroke();
        this.context.restore();
    }

    private adjustAngles() {
        this.angle += this.angularVelocity;
        this.angularVelocity *= this.angularDrag;
    }

    private calculatePosition() {
        this._positionX += this.velocityX;
        this._positionY += this.velocityY;
    }

    private calculateVelocity() {
        this.velocityX *= this.drag;
        this.velocityY *= this.drag;
    }

    private adjustVelocityBasedOnMovement() {
        if (this.arrowKeys.isKeyUpCurrentlyPressedDown) {
            this.velocityX -= Math.sin(this.angle) * this.power;
            this.velocityY -= Math.cos(this.angle) * this.power;
        }

        if (this.arrowKeys.isKeyDownCurrentlyPressedDown) {
            this.velocityX += Math.sin(this.angle) * this.power;
            this.velocityY += Math.cos(this.angle) * this.power;
        }

        if (this.arrowKeys.isKeyLeftCurrentlyPressedDown) {
            this.angularVelocity += this.turnSpeed;
        }

        if (this.arrowKeys.isKeyRightCurrentlyPressedDown) {
            this.angularVelocity -= this.turnSpeed;
        }
    }

    // https://www.mathsisfun.com/sine-cosine-tangent.html
    // Forget about this... https://stackoverflow.com/questions/20916953/get-distance-between-two-points-in-canvas
    // https://math.stackexchange.com/questions/143932/calculate-point-given-x-y-angle-and-distance
    performCollisionDetection(): void {

        const x2 = (this._positionX + (this.width / 2));
        const y2 = (this._positionY + (this.height / 2));
        const distance = Math.sqrt(Math.pow(x2 - this._positionX, 2) + Math.pow(y2 - this._positionY, 2));

        const borderX_TL = x2 + distance * Math.cos((-110 * Math.PI / 180) - this.angle);
        const borderY_TL = y2 + distance * Math.sin((-110 * Math.PI / 180) - this.angle);
        const borderX_TR = x2 + distance * Math.cos((-70 * Math.PI / 180) - this.angle);
        const borderY_TR = y2 + distance * Math.sin((-70 * Math.PI / 180) - this.angle);
        const borderX_BL = x2 + distance * Math.cos((-250 * Math.PI / 180) - this.angle);
        const borderY_BL = y2 + distance * Math.sin((-250 * Math.PI / 180) - this.angle);
        const borderX_BR = x2 + distance * Math.cos((-290 * Math.PI / 180) - this.angle);
        const borderY_BR = y2 + distance * Math.sin((-290 * Math.PI / 180) - this.angle);

        this.drawHitboxCircle(borderX_TL, borderY_TL);
        this.drawHitboxCircle(borderX_BL, borderY_BL);
        this.drawHitboxCircle(borderX_TR, borderY_TR);
        this.drawHitboxCircle(borderX_BR, borderY_BR);

        const line = {from: {x: 200, y: 250}, to: {x: 450, y: 260}};
        const isCollided = this.isCollisionDetected(borderX_TR, borderY_TR, borderX_TL, borderY_TL, line.from.x, line.from.y, line.to.x, line.to.y)
            || this.isCollisionDetected(borderX_TR, borderY_TR, borderX_BR, borderY_BR, line.from.x, line.from.y, line.to.x, line.to.y)
            || this.isCollisionDetected(borderX_BR, borderY_BR, borderX_BL, borderY_BL, line.from.x, line.from.y, line.to.x, line.to.y)
            || this.isCollisionDetected(borderX_BL, borderY_BL, borderX_TL, borderY_TL, line.from.x, line.from.y, line.to.x, line.to.y);

        if (isCollided) {
            this.velocityX = this.velocityX * -1.3;
            this.velocityY = this.velocityY * -1.3;
        }
    }

    drawHitboxCircle(x: number, y: number): void {
        this.context.save();
        this.context.beginPath();
        this.context.arc(x, y, 2, 0, 2 * Math.PI);
        this.context.fillStyle = "red";
        this.context.fill();
        this.context.restore();
    }

    drawDummyLine(): void {
        const line = {from: {x: 200, y: 250}, to: {x: 450, y: 260}};

        this.context.save();
        this.context.beginPath();
        this.context.moveTo(line.from.x, line.from.y);
        this.context.lineTo(line.to.x, line.to.y);
        this.context.strokeStyle = 'purple';
        this.context.lineWidth = 5;
        this.context.stroke();
        this.context.restore();
    }

    // http://www.jeffreythompson.org/collision-detection/line-line.php
    isCollisionDetected(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number): boolean {
        // calculate the distance to intersection point
        const uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
        const uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

        // optionally, draw a circle where the lines meet
        // const intersectionX = x1 + (uA * (x2 - x1));
        // const intersectionY = y1 + (uA * (y2 - y1));

        // if uA and uB are between 0-1, lines are colliding
        return uA >= -0.25 && uA <= 1.25 && uB >= 0 && uB <= 1;
    }

}