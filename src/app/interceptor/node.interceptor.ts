import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

/**
 * angular请求拦截器
 */
@Injectable()
export class NodeInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // console.log('------angular interceptor start------');
        // console.log(req);
        // console.log('------angular interceptor end------');
        return next.handle(req);
    }
}
