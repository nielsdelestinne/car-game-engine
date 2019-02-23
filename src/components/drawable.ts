import DrawingEngine from "../drawingEngine";

export default interface Drawable {
    draw(drawingEngine: DrawingEngine): void;

    readonly positionX: number;
    readonly positionY: number;

}