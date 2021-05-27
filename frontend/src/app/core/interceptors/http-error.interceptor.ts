import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

import { ErrorService } from '../services/error/error.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(private errorService: ErrorService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            retry(1),
            // retry(1),
            catchError((error: HttpErrorResponse) => {
                let errorMessage: string = '';
                if (error instanceof ErrorEvent) {
                    // errorMessage = `Client-side error: ${error.error.message}`;
                    errorMessage = `Client-side error: ${ error }`;
                } else {
                    // errorMessage = `Server-side error: ${error.status} ${error.message}
                    errorMessage = `Server-side error: ${ error }`;
                }

                console.log('Error Inteceptor -> ', errorMessage);
                this.errorService.errorLogin(error);
                return throwError(errorMessage);
            })
        );
    }

}