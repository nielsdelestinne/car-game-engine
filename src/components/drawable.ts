export default interface Drawable {
    draw(context: CanvasRenderingContext2D): void;
    readonly positionX: number;
    readonly positionY: number;

}