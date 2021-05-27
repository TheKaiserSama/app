import { TestBed } from '@angular/core/testing';

import { DirectorGrupoAdminService } from './director-grupo-admin.service';

describe('DirectorGrupoAdminService', () => {
	let service: DirectorGrupoAdminService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(DirectorGrupoAdminService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
