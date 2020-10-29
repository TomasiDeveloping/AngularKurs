import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataStorageService} from '../shared/data-storage.service';
import {AuthService} from '../auth/auth.service';
import {Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  collapsed = true;
  private userSub: Subscription;
  public isAuthentication = false;

  constructor(private dataStorageService: DataStorageService,
              private authService: AuthService,
              private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
   // this.userSub =  this.authService.user.subscribe(user => {
   //   this.isAuthentication = !!user;
   // });

    // With NgRx
    this.userSub =  this.store.select('auth')
      .pipe(map(authState => {
        return authState.user;
      }))
      .subscribe(user => {
      this.isAuthentication = !!user;
    });
  }

  onSaveData(): void {
    this.dataStorageService.storeRecipes();
  }

  onFetchData(): void {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  onLogout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
