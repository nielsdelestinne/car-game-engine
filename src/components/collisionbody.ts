import {Line} from "./line";

export interface CollisionBody {
    body: Line[];
    isHit(): void
}