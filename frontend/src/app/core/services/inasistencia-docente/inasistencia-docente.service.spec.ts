import { TestBed } from '@angular/core/testing';

import { InasistenciaDocenteService } from './inasistencia-docente.service';

describe('InasistenciaDocenteService', () => {
	let service: InasistenciaDocenteService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(InasistenciaDocenteService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
