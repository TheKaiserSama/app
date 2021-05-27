import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class HeaderService {

	private _visible$: BehaviorSubject<boolean>;
	public visible$: Observable<boolean>;

    constructor() {
        this._visible$ = new BehaviorSubject<boolean>(false);
        this.visible$ = this._visible$.asObservable();
    }

    hide() {
        this._visible$.next(false);
    }

    show() {
        this._visible$.next(true);
    }

    toggle() { }
	
}