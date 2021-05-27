import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!req.headers.has("Content-Type")) {
            req = req.clone({
                headers: req.headers.set("Content-Type", "application/json")
            });
        }
        req = this.addAuthenticationToken(req);
        return next.handle(req);
    }

    private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
        const idToken = JSON.parse(localStorage.getItem('token'));

        // Si el token no existe, no lo agregamos a los headers
        if (!idToken) {
            return request;
        }

        // Si se esta llamando a un dominio externo entonces no agregamos el token
        if (!request.url.match(/localhost:3000\//)) {
            return request;
        }

        return request.clone({
            headers: request.headers.set('Authorization', 'Bearer ' + idToken)
        });
    }

}