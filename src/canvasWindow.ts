export default class CanvasWindow {

    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    constructor(private id: string, private width: number, private height: number) {
        this.createCanvasElement();
    }

    public drawCanvas(): HTMLCanvasElement {
        this.context = this.canvas.getContext("2d");
        this.context.fillStyle = 'green';
        this.context.fillRect(0, 0, this.width, this.height);
        return this.canvas;
    }

    private createCanvasElement(): void {
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('id', this.id);
        this.canvas.setAttribute('width', String(this.width));
        this.canvas.setAttribute('height', String(this.height));
    }

}