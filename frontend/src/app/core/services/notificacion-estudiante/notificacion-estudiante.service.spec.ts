import { TestBed } from '@angular/core/testing';

import { NotificacionEstudianteService } from './notificacion-estudiante.service';

describe('NotificacionEstudianteService', () => {
	let service: NotificacionEstudianteService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(NotificacionEstudianteService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
