import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MatriculaService } from '@services/matricula/matricula.service';

@Component({
  	selector: 'app-form-matricula',
  	templateUrl: './form-matricula.component.html',
  	styleUrls: ['./form-matricula.component.scss']
})
export class FormMatriculaComponent implements OnInit, AfterViewInit, OnDestroy {

	@ViewChild('nav') nav: NgbNav;
	private unsubscribe = new Subject();
  	tabActive: number = 1;
	
	constructor(public matriculaService: MatriculaService) { }

	ngOnInit(): void { }

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
	
	ngAfterViewInit(): void {
		this.matriculaService.tabActive$
		.pipe(takeUntil(this.unsubscribe))
		.subscribe((tabActive: number) => {
			if (!tabActive) return;
			this.nav.select(tabActive);
		});
	}

}