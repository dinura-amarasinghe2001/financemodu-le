import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class JpgAuthInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Check if it's a GET request and the URL ends with .jpg
    alert('adada')
    if (
      request.method === "GET" &&
      request.url.toLowerCase().endsWith(".jpg")
    ) {
      const token = localStorage.getItem("accessToken");
      const authReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next.handle(authReq);
    }

    // Otherwise, pass the request through without modification
    return next.handle(request);
  }
}


import { HttpInterceptorFn } from '@angular/common/http';

export const jpgAuthInterceptor: HttpInterceptorFn = (req, next) => {
  if ( req.url.toLowerCase().includes('.jpg')) {
   
    const token = 'YOUR_TOKEN_HERE'; // Replace this with dynamic token logic if needed
    const newReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(newReq);
  }

  return next(req);
};