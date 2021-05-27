import Swal, { SweetAlertResult } from 'sweetalert2';

export const PopUp = {
    success: function (title: string, text: string): Promise<SweetAlertResult> {
        return Swal.fire({
            icon: 'success',
            title: title,
            text: text,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            timer: 2000
        })
    },
    warning: function (title: string, text: string): Promise<SweetAlertResult> {
        return Swal.fire({
			icon: 'warning',
			title: title,
			text: text,
			showCancelButton: true,
			cancelButtonText: 'Cancelar',
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Si, eliminalo!'
		})
    },
    question: function (title: string, text: string): Promise<SweetAlertResult> {
        return Swal.fire({
            icon: 'question',
            title: title,
            text: text,
            showCancelButton: true,
            showCloseButton: true,
            cancelButtonText: 'Cancelar',
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Si, hazlo!'
        });
    },
    info: function (title: string, text: string): Promise<SweetAlertResult> {
        return Swal.fire({
            icon: 'info',
            title: title,
            text: text,
        });
    }
}