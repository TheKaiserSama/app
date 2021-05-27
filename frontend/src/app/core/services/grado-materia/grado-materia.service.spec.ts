import { TestBed } from '@angular/core/testing';

import { GradoMateriaService } from './grado-materia.service';

describe('GradoMateriaService', () => {
	let service: GradoMateriaService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(GradoMateriaService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});