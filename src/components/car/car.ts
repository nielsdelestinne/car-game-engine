import Drawable from "../drawable";
import {fromEvent} from "rxjs";
import {filter} from "rxjs/operators";
import DrawingEngine from "../../drawingEngine";

export default class Car implements Drawable {

    private _positionX: number;
    private _positionY: number;

    private velocityX: number = 0;
    private velocityY: number = 0;
    private power: number = 0;
    private rotate: number = 0;
    private cDrag: number = 0.98;

    private readonly width: number = 25;
    private readonly height: number = 10;

    get positionX(): number {
        return this._positionX;
    }

    get positionY(): number {
        return this._positionY;
    }

    constructor(positionX: number = 20, positionY: number = 20) {

        this._positionX = positionX;
        this._positionY = positionY;


        const keyDowns = fromEvent(document, 'keydown');

        const keyPresses = keyDowns.pipe(
            filter((e: KeyboardEvent) => e.code === 'ArrowUp'
                || e.code === 'ArrowRight'
                || e.code === 'ArrowDown'
                || e.code === 'ArrowLeft'),
        );

        keyPresses.subscribe((event: KeyboardEvent) => {
            switch (event.code) {
                case 'ArrowUp':
                    this.power += 0.1;
                    break;
                case 'ArrowRight':
                    this.rotate += 0.01;
                    break;
                case 'ArrowDown':
                    this.power = 0;
                    break;
                case 'ArrowLeft':
                    this.rotate -= 0.01;
                    break;
            }
        })
    }

    draw(drawingEngine: DrawingEngine): void {
        this._positionX =  this.power === 0 ? this._positionX : this._positionX + this.power;
        this._positionY = this.power === 0 ? this._positionY : this._positionY + this.rotate;

        drawingEngine.context.fillStyle = 'black';
        if(this.power !== 0) {
            drawingEngine.context.rotate(this.rotate * Math.PI / 180 * this.power);
        }
        drawingEngine.context.fillRect(this._positionX, this._positionY, this.width, this.height);
    }

}