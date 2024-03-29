import Drawable from "../drawable";
import {Line} from "../line";
import {Point} from "../point";
import {CollisionBody} from "../collisionbody";

export class Obstruct implements Drawable, CollisionBody {

    private readonly line: Line;
    private color: string;
    private originalColor: string;
    private wasHit: boolean;

    constructor(from: Point, to: Point, color: string) {
        this.line = new Line(from, to);
        this.color = color;
        this.originalColor = color;
    }

    draw(context: CanvasRenderingContext2D): void {
        context.save();
        context.beginPath();
        context.moveTo(this.line.from.x, this.line.from.y);
        context.lineTo(this.line.to.x, this.line.to.y);
        context.strokeStyle = this.color;
        context.lineWidth = 5;
        context.stroke();
        context.restore();
        this.wasHit = false;
    }

    get body(): Line[] {
        return [this.line];
    }

    isHit(): void {
        setTimeout(() =>{this.color = this.originalColor}, 500);
        this.color = 'red';
    }

}