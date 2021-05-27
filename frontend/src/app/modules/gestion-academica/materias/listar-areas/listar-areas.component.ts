import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { SweetAlertResult } from 'sweetalert2';

import { AreaService } from '@services/area/area.service';
import { IArea } from '@interfaces/all.interface';
import { PopUp } from '@shared/pop-up';
import { compareFn } from '@shared/helpers/transform';

@Component({
	selector: 'app-listar-areas',
	templateUrl: './listar-areas.component.html',
	styleUrls: ['./listar-areas.component.scss']
})
export class ListarAreasComponent implements OnInit, OnDestroy {

	private unsubscribe = new Subject();
	collectionSize$: Observable<number> = this.areaService.collectionSize$;
	offset$: Observable<number> = this.areaService.offset$;
	areas$: Observable<IArea[]> = this.areaService.areas$;
	filter: FormControl = new FormControl('');
	compareFn = compareFn;
	
	constructor(public areaService: AreaService) { }

	ngOnInit(): void {
		this.areaService.getAreasPaginacion();
		this.getAreasFilter();
	}

	ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
	}

	onChange(value: string): void {
		this.areaService.pageSize = +value;
		this.areaService.updateTablaAreas();
	}
	
	onPageChange(page: number): void {
		this.areaService.page = page;
		this.areaService.updateTablaAreas();
	}

	validateOffset(): number {
		return this.areaService.validateOffset();
	}

	updateArea(area: IArea): void {
		this.areaService.setArea(area);
		this.areaService.shouldCreate(false);
	}

	destroyArea(area: IArea): void {
		PopUp.warning('Estas seguro?', 'El área se eliminara de manera permanente!')
		.then((result: SweetAlertResult) => {
			if (!result.value) return;
			this.areaService.destroyArea(area.id)
			.pipe(takeUntil(this.unsubscribe))
			.subscribe((res: any) => {
				if (!res) return;
				this.areaService.shouldCreate(true);
				this.areaService.setArea(null);
			});
		});
	}

	private getAreasFilter(): void {
		this.filter.valueChanges
		.pipe(
			debounceTime(300),
			distinctUntilChanged(),
			switchMap((searchTerm: string) => {
				this.areaService.searchTerm = searchTerm.toLowerCase();
				return this.areaService.requestApiAreas();
            }),
            takeUntil(this.unsubscribe)
		)
		.subscribe((areas: IArea[]) => this.areaService.handleSubscribeAreas(areas));
	}
	
}