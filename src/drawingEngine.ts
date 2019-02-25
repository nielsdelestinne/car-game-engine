import Drawable from "./components/drawable";
import Car from "./components/car/car";
import {Obstruct} from "./components/obstructions/obstruct";
import {Point} from "./components/point";
import {CollisionBody} from "./components/collisionbody";
import {Line} from "./components/line";

export default class DrawingEngine {

    private canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;
    private readonly drawables: Drawable[];
    private readonly collisionBodies: CollisionBody[];

    constructor(private id: string, private _width: number, private _height: number) {
        this.createCanvasElement();
        const objects: any = [
            new Car(),
            new Obstruct(new Point(50, 200), new Point(250, 210), 'green'),
            new Obstruct(new Point(50, 220), new Point(40, 250), 'blue'),
        ];
        this.drawables = objects;
        this.collisionBodies = objects;
    }

    public draw(): HTMLCanvasElement {
        this.drawCanvas();
        this.drawDrawables();
        return this.canvas;
    }

    get context(): CanvasRenderingContext2D {
        return this._context;
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

    private drawDrawables() {
        for (let i = 0; i < this.collisionBodies.length - 1; i++) {
            for (let j = 1; j < this.collisionBodies.length; j++) {
                this.performCollisionDetection(this.collisionBodies[i], this.collisionBodies[j]);
            }
        }
        for (let drawable of this.drawables) {
            drawable.draw(this.context);
        }
    }

    private drawCanvas() {
        this._context = this.canvas.getContext("2d");
        this._context.fillStyle = 'gray';
        this._context.fillRect(0, 0, this._width, this._height);
    }

    private createCanvasElement(): void {
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('id', this.id);
        this.canvas.setAttribute('width', String(this._width));
        this.canvas.setAttribute('height', String(this._height));
    }

    // https://www.mathsisfun.com/sine-cosine-tangent.html
    // Forget about this... https://stackoverflow.com/questions/20916953/get-distance-between-two-points-in-canvas
    // https://math.stackexchange.com/questions/143932/calculate-point-given-x-y-angle-and-distance
    performCollisionDetection(collisionBody1: CollisionBody, collisionBody2: CollisionBody): void {

        for (let cbLine1 of collisionBody1.body) {
            for (let cbLine2 of collisionBody2.body) {

                const isCollided = this.isCollisionDetected(cbLine1, cbLine2);

                if (isCollided) {
                    console.log("HIT");
                    // this.velocityX = this.velocityX * -1.3;
                    // this.velocityY = this.velocityY * -1.3;
                }
            }
        }

    }

    // http://www.jeffreythompson.org/collision-detection/line-line.php
    isCollisionDetected(line1: Line, line2: Line): boolean {
        // calculate the distance to intersection point
        const x1 = line1.from.x;
        const x2 = line1.to.x;
        const x3 = line2.from.x;
        const x4 = line2.to.x;
        const y1 = line1.from.y;
        const y2 = line1.to.y;
        const y3 = line2.from.y;
        const y4 = line2.to.y;

        const uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
        const uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

        // optionally, draw a circle where the lines meet
        // const intersectionX = x1 + (uA * (x2 - x1));
        // const intersectionY = y1 + (uA * (y2 - y1));

        // if uA and uB are between 0-1, lines are colliding
        return uA >= -0.25 && uA <= 1.25 && uB >= 0 && uB <= 1;
    }

}