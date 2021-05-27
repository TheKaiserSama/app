import { TestBed } from '@angular/core/testing';

import { NotificacionDocenteService } from './notificacion-docente.service';

describe('NotificacionDocenteService', () => {
	let service: NotificacionDocenteService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(NotificacionDocenteService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
