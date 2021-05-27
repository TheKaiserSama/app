import { TestBed } from '@angular/core/testing';

import { PlanDocenteService } from './plan-docente.service';

describe('CargaAcademicaDocenteService', () => {
	let service: PlanDocenteService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(PlanDocenteService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});