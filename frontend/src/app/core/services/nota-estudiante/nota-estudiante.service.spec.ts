import { TestBed } from '@angular/core/testing';

import { NotaEstudianteService } from './nota-estudiante.service';

describe('NotaEstudianteService', () => {
	let service: NotaEstudianteService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(NotaEstudianteService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});