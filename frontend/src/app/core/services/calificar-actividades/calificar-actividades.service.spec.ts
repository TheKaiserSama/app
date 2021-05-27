import { TestBed } from '@angular/core/testing';

import { CalificarActividadesService } from './calificar-actividades.service';

describe('CalificarActividadesService', () => {
	let service: CalificarActividadesService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(CalificarActividadesService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
