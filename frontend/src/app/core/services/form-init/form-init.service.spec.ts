import { TestBed } from '@angular/core/testing';

import { FormInitService } from './form-init.service';

describe('FormInitService', () => {
	let service: FormInitService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(FormInitService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});