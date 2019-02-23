import Drawable from "./components/drawable";
import Soldier from "./components/soldier/soldier";
import BoundedSoldier from "./components/soldier/boundedSoldier";
import Car from "./components/car/car";

export default class DrawingEngine {

    private canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;
    private drawables: Drawable[];

    constructor(private id: string, private _width: number, private _height: number) {
        this.createCanvasElement();
        this.drawables = [
            new Car()
            // new BoundedSoldier(new Soldier(180, 40, 'orange', -1, 0)),
            // new BoundedSoldier(new Soldier(20, 40, 'blue', 1, 0)),
            // new BoundedSoldier(new Soldier(500, 40, 'green', -1, 0)),
            // new BoundedSoldier(new Soldier(130, 60, 'black', -1, -1)),
            // new BoundedSoldier(new Soldier(150, 10, 'white', -1, 1)),
            // new BoundedSoldier(new Soldier(170, 80, 'purple', 1, 1)),
            // new BoundedSoldier(new Soldier(190, 100, 'yellow', -1, -1)),
        ];
    }

    public draw(): HTMLCanvasElement {
        this.drawCanvas();
        this.performCollisionDetection();
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

    private performCollisionDetection() {
        for (let drawable of this.drawables) {
            for (let index = 1; index < this.drawables.length; index++) {
                if (drawable === this.drawables[index] && (
                     drawable.positionX + Soldier.WIDTH < this.drawables[index].positionX
                    || drawable.positionX > this.drawables[index].positionX + Soldier.WIDTH
                    || drawable.positionY + Soldier.HEIGHT < this.drawables[index].positionY
                    || drawable.positionY > this.drawables[index].positionY + Soldier.HEIGHT)) {
                    console.log("no hit");
                } else {
                    console.log("jahahaha");
                    let soldier = this.drawables[index] as BoundedSoldier;
                    soldier.inverseVelocityY();
                    soldier.inverseVelocityX();
                }
            }
        }
    }

    private drawDrawables() {
        for (let drawable of this.drawables) {
            drawable.draw(this);
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

}