import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class FooterService {

    private _visible$: BehaviorSubject<boolean>;
	visible$: Observable<boolean>;

    constructor() {
        this._visible$ = new BehaviorSubject<boolean>(false);
        this.visible$ = this._visible$.asObservable();
    }

    hide(): void {
        this._visible$.next(false);
    }

    show(): void {
        this._visible$.next(true);
    }

    toggle() { }
	
}