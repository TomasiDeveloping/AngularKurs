import {Actions, Effect, ofType} from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {AuthResponseData} from '../auth.service';
import {of} from 'rxjs';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable()
export class AuthEffects {
  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyB8Z2nlgcJ0OPCm-A7UW6KQo67yDjt98Do',
        {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        }
      )
        .pipe(
          map(resData => {
            const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
            return new AuthActions.Login({
              email: resData.email,
              userId: resData.localId,
              token: resData.idToken,
              expirationDate
            });
          }),
          catchError(errorResp => {
            let errorMessage = 'An unknown error occurred!';
            if (!errorResp.error || !errorResp.error.error) {
              return of(new AuthActions.LoginFail(errorMessage));
            }
            switch (errorResp.error.error.message) {
              case 'EMAIL_EXISTS':
                errorMessage = 'This email exists already!';
                break;
              case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email does not exist';
                break;
              case 'INVALID_PASSWORD':
                errorMessage = 'This password is not correct';
                break;
            }
            return of(new AuthActions.LoginFail(errorMessage));
          })
        );
    }),
  );

  @Effect(
    {dispatch: false}
    )
  authSuccess = this.actions$.pipe(
    ofType(AuthActions.LOGIN),
    tap(() => {
      this.router.navigate(['/']).then();
    })
  );

  constructor(private actions$: Actions,
              private http: HttpClient,
              public router: Router) {
  }
}
