import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

import { MateriaService } from '@services/materia/materia.service';
import { IMateria } from '@interfaces/all.interface';
import { compareFn } from '@shared/helpers/transform';

@Component({
	selector: 'app-listar-materias',
	templateUrl: './listar-materias.component.html',
	styleUrls: ['./listar-materias.component.scss']
})
export class ListarMateriasComponent implements OnInit {

	private subscribe = new Subject();
	@Output() editar = new EventEmitter<boolean>();
	collectionSize$: Observable<number> = this.materiaService.collectionSize$;
	offset$: Observable<number> = this.materiaService.offset$;
	materias$: Observable<IMateria[]> = this.materiaService.materias$;
	filter: FormControl = new FormControl('');
	compareFn = compareFn;

	constructor(public materiaService: MateriaService) { }

	ngOnInit(): void {
		this.materiaService.getMaterias();
		this.getMateriasFilter();
	}

	onChange(value: string): void {
		this.materiaService.pageSize = +value;
		this.materiaService.updateTablaMaterias();
	}
	
	onPageChange(page: number): void {
		this.materiaService.page = page;
		this.materiaService.updateTablaMaterias();
	}

	validateOffset(): number {
		return this.materiaService.validateOffset();
	}

	updateMateria(materia: IMateria): void {
		if (!materia && !materia.id) return;
		this.materiaService.setMateria(materia);
		this.materiaService.shouldCreate(false);
		this.editar.emit(true);
	}

	destroyMateria(materia: IMateria): void {
		if (!materia && !materia.id) return;
        this.materiaService.destroyMateria(materia.id);
	}

	private getMateriasFilter(): void {
		this.filter.valueChanges
		.pipe(
			debounceTime(300),
			distinctUntilChanged(),
			switchMap((searchTerm: string) => {
				this.materiaService.searchTerm = searchTerm.toLowerCase();
				return this.materiaService.requestApiMaterias();
            }),
            takeUntil(this.subscribe)
		)
		.subscribe((materias: IMateria[]) => this.materiaService.handleSubscribeMaterias(materias));
	}

}