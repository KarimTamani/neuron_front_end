import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable()

export class TokenInterceptor implements HttpInterceptor {
    constructor() { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let auth = JSON.parse(localStorage.getItem("doctorAuth"));
        
        if (auth) {
            request = request.clone({
                setHeaders: {
                    Authorization: auth.token
                }
            });
        }
        return next.handle(request);
    }
}