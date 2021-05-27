import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PersonaService } from '@services/persona/persona.service';

@Component({
	selector: 'app-form-gestion-usuario',
	templateUrl: './form-gestion-usuario.component.html',
	styleUrls: ['./form-gestion-usuario.component.scss']
})
export class FormGestionUsuarioComponent implements OnInit, OnDestroy {

	private unsubscribe = new Subject();
	@ViewChild('nav') nav: NgbNav;
	tabActive: number = 1;
	
	constructor(public personaService: PersonaService) { }

	ngOnInit(): void { }

	ngAfterViewInit(): void {
        this.personaService.tabActive$
		.pipe(takeUntil(this.unsubscribe))
		.subscribe((tabActive: number) => {
			if (!tabActive) return;
			this.nav.select(tabActive);
		});
    }
    
    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
	}
	
}