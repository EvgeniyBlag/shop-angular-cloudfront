import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NotificationService } from '../notification.service';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private readonly notificationService: NotificationService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.url.includes('dev/import')) {
      let authRequest = request;
      const username = localStorage.getItem('username');
      const userPassword = localStorage.getItem('password');

      if (username && userPassword) {
        const userCredentials = `${username}:${userPassword}`;
        authRequest = request.clone({
          headers: request.headers.set('Authorization', `Basic ${btoa(userCredentials)}`),
        });
      }

      return next.handle(authRequest).pipe(
        catchError(err => {
          alert(`${err.status} ${err.error.message}`);
          return throwError(() => err);
        })
      );
    }

    return next.handle(request);
  }
}
