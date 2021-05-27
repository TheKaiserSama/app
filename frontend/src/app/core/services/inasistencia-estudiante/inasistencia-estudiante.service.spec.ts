import { TestBed } from '@angular/core/testing';

import { InasistenciaEstudianteService } from './inasistencia-estudiante.service';

describe('InasistenciaEstudianteService', () => {
	let service: InasistenciaEstudianteService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(InasistenciaEstudianteService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
