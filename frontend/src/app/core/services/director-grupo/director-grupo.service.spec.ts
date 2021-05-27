import { TestBed } from '@angular/core/testing';

import { DirectorGrupoService } from './director-grupo.service';

describe('DirectorGrupoService', () => {
	let service: DirectorGrupoService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(DirectorGrupoService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
