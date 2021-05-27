import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DocenteService } from '@services/docente/docente.service';

@Component({
	selector: 'app-form-docente',
	templateUrl: './form-docente.component.html',
	styleUrls: ['./form-docente.component.scss']
})
export class FormDocenteComponent implements OnInit, AfterViewInit, OnDestroy {

    private unsubscribe = new Subject();
	@ViewChild('nav') nav: NgbNav;
	tabActive: number = 1;
	  
	constructor(public docenteService: DocenteService) { }

	ngOnInit(): void { }

	ngAfterViewInit(): void {
        this.docenteService.tabActive$
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