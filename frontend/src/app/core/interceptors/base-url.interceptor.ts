import { Injectable } from '@angular/core';
import { HttpHandler, HttpRequest, HttpInterceptor } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  	providedIn: 'root'
})
export class BaseURLInterceptor implements HttpInterceptor {

  	intercept(req: HttpRequest<any>, next: HttpHandler) {
		if (!req.url.match(/^http:\/\//)) {
			req = req.clone({
				url: environment.baseURL + req.url
			});
		}
		return next.handle(req);
	}
	  
}