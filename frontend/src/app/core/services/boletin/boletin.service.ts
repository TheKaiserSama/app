import { Injectable } from '@angular/core';
import { IBoletin, ICreateUpdateBoletin } from '@interfaces/all.interface';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { ApiBoletinService } from '@api/api-boletin.service';

@Injectable({
	providedIn: 'root'
})
export class BoletinService {

	private _boletinesPorPeriodo$ = new BehaviorSubject<IBoletin[]>([]);
	boletinesPorPeriodo$: Observable<IBoletin[]> = this._boletinesPorPeriodo$.asObservable();

	constructor(private apiBoletinService: ApiBoletinService) { }

	getBoletinesPorPeriodo(boletinParams: IBoletin): void {
		this.apiBoletinService.getBoletinesPorPeriodo(boletinParams).
		subscribe((boletines: IBoletin[]) => this._boletinesPorPeriodo$.next(boletines));
	}

	createBoletin(infoBoletin: ICreateUpdateBoletin, boletinParams: IBoletin): Observable<boolean> {
		Swal.fire({
			icon: 'info',
            allowOutsideClick: false,
            text: 'Por favor, espere un momento'
        });
		Swal.showLoading();

		return this.apiBoletinService.createBoletin(infoBoletin).pipe(
			concatMap((wasCreated: boolean) => {
				if (wasCreated) {
					this.getBoletinesPorPeriodo(boletinParams);
					Swal.close();
					return of(true);
				}
				return of(false);
			})
		);
	}

	updateBoletin(id: number, infoBoletin: ICreateUpdateBoletin): Observable<boolean> {
		Swal.fire({
			icon: 'info',
            allowOutsideClick: false,
            text: 'Por favor, espere un momento'
        });
		Swal.showLoading();

		return this.apiBoletinService.updateBoletin(id, infoBoletin).pipe(
			concatMap(({ affectedRowsCount }) => {
				Swal.close();
				return of(true);
			})
		);
	}

	destroyBoletin(id: number): Observable<any> {
		return this.apiBoletinService.destroyBoletin(id);
	}

}
