import { TestBed } from '@angular/core/testing';

import { AnioLectivoService } from './anio-lectivo.service';

describe('AnioLectivoService', () => {
	let service: AnioLectivoService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(AnioLectivoService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});