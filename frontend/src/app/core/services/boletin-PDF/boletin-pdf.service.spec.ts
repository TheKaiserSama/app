import { TestBed } from '@angular/core/testing';

import { BoletinPDFService } from './boletin-pdf.service';

describe('BoletinPDFService', () => {
	let service: BoletinPDFService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(BoletinPDFService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
