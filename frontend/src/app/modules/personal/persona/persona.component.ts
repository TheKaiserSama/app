import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PersonaService } from '@services/persona/persona.service';

@Component({
	selector: 'app-persona',
	templateUrl: './persona.component.html',
	styleUrls: ['./persona.component.scss']
})
export class PersonaComponent implements OnInit, OnDestroy {

    private unsubscribe = new Subject();

	constructor(
        private personaService: PersonaService,
        private modalService: NgbModal
    ) { }

	ngOnInit(): void {
        this.personaService.closeFormPersona$
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((closeModal: boolean) => {
            if (closeModal) this.modalService.dismissAll();
        });
    }

    ngOnDestroy(): void {
        this.personaService.initStatePersona();
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
    
    open(content: any): void {
        const modalOptions: NgbModalOptions = {
            ariaLabelledBy: 'modal-basic',
            backdrop: 'static',
            keyboard: false,
            size: 'lg'
        };
        this.modalService.open(content, modalOptions).result
        .then((result: any) => { }, (reason: any) => {
            this.personaService.initStateCloseModal();
        });
    }

    editar(editar: boolean, content: any): void {
        if (editar) this.open(content);
    }

}