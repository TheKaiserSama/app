import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Injectable({
	providedIn: 'root'
})
export class ErrorService {

	constructor() { }

	errorLogin(error: HttpErrorResponse) {
		Swal.fire({
			icon: 'error',
			title: error.error.name || error.name,
			text: error.error.message || error.statusText
		})
	}

}