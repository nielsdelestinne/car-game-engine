import Drawable from "./components/drawable";
import Car from "./components/car/car";

export default class DrawingEngine {

    private canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;
    private readonly drawables: Drawable[];

    constructor(private id: string, private _width: number, private _height: number) {
        this.createCanvasElement();
        this.drawables = [
            new Car()
        ];
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

}