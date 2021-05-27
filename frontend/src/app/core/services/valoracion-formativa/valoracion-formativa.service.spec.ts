import { TestBed } from '@angular/core/testing';

import { ValoracionFormativaService } from './valoracion-formativa.service';

describe('ValoracionFormativaService', () => {
	let service: ValoracionFormativaService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(ValoracionFormativaService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
