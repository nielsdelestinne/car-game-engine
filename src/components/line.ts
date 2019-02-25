import {Point} from "./point";

export class Line {

    private readonly _from: Point;
    private readonly _to: Point;

    get from(): Point {
        return this._from;
    }

    get to(): Point {
        return this._to;
    }

    constructor(from: Point, to: Point) {
        this._from = from;
        this._to = to;
    }
}