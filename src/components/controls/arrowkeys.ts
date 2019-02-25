// @ts-ignore
import {fromEvent, merge} from "rxjs";
// @ts-ignore
import {Observable} from 'rxjs/Rx';
// @ts-ignore
import {filter} from "rxjs/operators";

export class ArrowKeys {

    private _isKeyUpCurrentlyPressedDown = false;
    private _isKeyDownCurrentlyPressedDown = false;
    private _isKeyLeftCurrentlyPressedDown = false;
    private _isKeyRightCurrentlyPressedDown = false;

    public constructor() {
        this.enable();
    }

    private enable(): void {
        this.observeArrowKeyPresses()
            .subscribe((event: KeyboardEvent) => {
                switch (event.code) {
                    case 'ArrowUp':
                        this._isKeyUpCurrentlyPressedDown = event.type === 'keydown';
                        break;
                    case 'ArrowRight':
                        this._isKeyRightCurrentlyPressedDown = event.type === 'keydown';
                        break;
                    case 'ArrowDown':
                        this._isKeyDownCurrentlyPressedDown = event.type === 'keydown';
                        break;
                    case 'ArrowLeft':
                        this._isKeyLeftCurrentlyPressedDown = event.type === 'keydown';
                        break;
                }
            })
    }

    private observeArrowKeyPresses(): Observable<KeyboardEvent> {
        const keyDowns = fromEvent(document, 'keydown');
        const keyUps = fromEvent(document, 'keyup');
        return merge(keyDowns, keyUps)
            .pipe(
                filter((e: KeyboardEvent) =>
                    e.code === 'ArrowUp'
                    || e.code === 'ArrowRight'
                    || e.code === 'ArrowDown'
                    || e.code === 'ArrowLeft'
                    || e.code === 'Space')
            );
    }

    get isKeyUpCurrentlyPressedDown(): boolean {
        return this._isKeyUpCurrentlyPressedDown;
    }

    get isKeyDownCurrentlyPressedDown(): boolean {
        return this._isKeyDownCurrentlyPressedDown;
    }

    get isKeyLeftCurrentlyPressedDown(): boolean {
        return this._isKeyLeftCurrentlyPressedDown;
    }

    get isKeyRightCurrentlyPressedDown(): boolean {
        return this._isKeyRightCurrentlyPressedDown;
    }
}
