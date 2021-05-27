import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { ApiInstitucionService } from '@api/api-institucion.service';
import { IInstitucion } from '@interfaces/all.interface';
import { PopUp } from '@shared/pop-up';

@Injectable({
	providedIn: 'root'
})
export class InstitucionService {

	private _institucion$ = new BehaviorSubject<IInstitucion>(null);
	private _loading$ = new BehaviorSubject<boolean>(false);
	institucion$: Observable<IInstitucion> = this._institucion$.asObservable();
	loading$: Observable<boolean> = this._loading$.asObservable();

	constructor(private apiInstitucionService: ApiInstitucionService) { }

	getInstitucionByPk(id: number): void {
		this.apiInstitucionService.getInstitucionByPk(id);
	}

	getInstituciones(): void {
		this._loading$.next(true);
		this.apiInstitucionService.getInstituciones().
		subscribe((instituciones: IInstitucion[]) => {
			this._loading$.next(false);
			if (!instituciones || instituciones.length == 0) return;
			this.setInstitucion(instituciones[0]);
		});
	}

	createInstitucion(institucion: IInstitucion): void {
		this.apiInstitucionService.createInstitucion(institucion).
		subscribe((created: boolean) => {
			const message = created ? 'Institución creada exitosamente.' : 'Ya existe una institución creada.';
			PopUp.success('Operación exitosa!', message);
			this.getInstituciones();
		});
	}

	updateInstitucion(id: number, institucion: IInstitucion): void {
		this.apiInstitucionService.updateInstitucion(id, institucion).
		subscribe((res: any) => {
			const message = res.updated ? 'Información actualizada' : 'Ningún registro actualizado';
			PopUp.success('Operación exitosa!', message);
			this.getInstituciones();
		});
	}

	setInstitucion(institucion: IInstitucion): void {
		this._institucion$.next(institucion);
	}

}