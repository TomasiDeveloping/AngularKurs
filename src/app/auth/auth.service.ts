import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // constructor(private http: HttpClient,
  //             private router: Router,
  //             private store: Store<fromApp.AppState>) {}

  constructor(private store: Store<fromApp.AppState>) {}
  // user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  // NGRX
  setLogoutTimer(expirationDuration: number): void {
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(new AuthActions.Logout());
    }, expirationDuration);
  }

  clearLogoutTimer(): void {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  // private static handleError(errorResp: HttpErrorResponse): Observable<never> {
  //   let errorMessage = 'An unknown error occurred!';
  //   if (!errorResp.error || !errorResp.error.error) {
  //     return throwError(errorMessage);
  //   }
  //   switch (errorResp.error.error.message) {
  //     case 'EMAIL_EXISTS':
  //       errorMessage = 'This email exists already!';
  //       break;
  //     case 'EMAIL_NOT_FOUND':
  //       errorMessage = 'This email does not exist';
  //       break;
  //     case 'INVALID_PASSWORD':
  //       errorMessage = 'This password is not correct';
  //       break;
  //   }
  //   return throwError(errorMessage);
  // }

  // Not use with NgRX

  // signup(email: string, password: string): Observable<AuthResponseData>{
  //   return this.http.post<AuthResponseData>(
  //     'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyB8Z2nlgcJ0OPCm-A7UW6KQo67yDjt98Do',
  //     {
  //       email,
  //       password,
  //       returnSecureToken: true
  //     }
  //   ).pipe(catchError(AuthService.handleError),
  //     tap(resData => {
  //       this.handleAuthentication(
  //         resData.email,
  //         resData.localId,
  //         resData.idToken,
  //         +resData.expiresIn
  //       );
  //     })
  //   );
  // }

  // login(email: string, password: string): Observable<AuthResponseData> {
  //   return this.http.post<AuthResponseData>(
  //     'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyB8Z2nlgcJ0OPCm-A7UW6KQo67yDjt98Do',
  //     {
  //       email,
  //       password,
  //       returnSecureToken: true
  //     }
  //   ).pipe(catchError(AuthService.handleError),
  //     tap(resData => {
  //       this.handleAuthentication(
  //         resData.email,
  //         resData.localId,
  //         resData.idToken,
  //         +resData.expiresIn
  //       );
  //     })
  //   );
  // }

  // autoLogin(): void {
  //   const userData: {
  //     email: string;
  //     id: string;
  //     _token: string;
  //     _tokenExpirationDate: string;
  //   } = JSON.parse(localStorage.getItem('userData'));
  //   if (!userData) {
  //     return;
  //   }
  //   const loadedUser = new User(
  //     userData.email,
  //     userData.id,
  //     userData._token,
  //     new Date(userData._tokenExpirationDate)
  //   );
  //
  //   if (loadedUser.token) {
  //    // this.user.next(loadedUser);
  //     this.store.dispatch(
  //       new AuthActions.AuthenticateSuccess({
  //         email: loadedUser.email,
  //         userId: loadedUser.id,
  //         token: loadedUser.token,
  //         expirationDate: new Date(userData._tokenExpirationDate)
  //       })
  //     );
  //     const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
  //     this.autoLogout(expirationDuration);
  //   }
  // }

  // logout(): void {
  //  // this.user.next(null);
  //   this.store.dispatch(new AuthActions.Logout());
  //  // this.router.navigate(['/auth']).then();
  //   localStorage.removeItem('userData');
  //   if (this.tokenExpirationTimer) {
  //     clearTimeout(this.tokenExpirationTimer);
  //   }
  //   this.tokenExpirationTimer = null;
  // }

  // autoLogout(expirationDuration: number): void {
  //   this.tokenExpirationTimer = setTimeout(() => {
  //     this.logout();
  //   }, expirationDuration);
  // }

  // private handleAuthentication(email: string, userId: string, token: string, expiresIn: number): void {
  //   const expirationDate = new Date(
  //     new Date().getTime() + expiresIn * 1000
  //   );
  //   const user = new User(
  //     email,
  //     userId,
  //     token,
  //     expirationDate
  //   );
  //   // this.user.next(user);
  //   this.store.dispatch(new AuthActions.AuthenticateSuccess({email, userId, token, expirationDate  }));
  //   this.autoLogout(expiresIn * 1000);
  //   localStorage.setItem('userData', JSON.stringify(user));
  // }
}
