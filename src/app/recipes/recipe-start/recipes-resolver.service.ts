import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Recipe} from '../recipe.model';
import {DataStorageService} from '../../shared/data-storage.service';
import {Observable, of} from 'rxjs';
import {RecipeService} from '../recipe.service';
import * as fromApp from '../../store/app.reducer';
import {Store} from '@ngrx/store';
import * as RecipeActions from '../../recipes/store/recipe.ations';
import { Actions, ofType} from '@ngrx/effects';
import {map, switchMap, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RecipesResolverService implements Resolve<Recipe[]> {

  constructor(private dataStoreService: DataStorageService,
              private recipeService: RecipeService,
              private store: Store<fromApp.AppState>,
              private actions$: Actions) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Recipe[]> | Promise<Recipe[]> | Recipe[] {
    // const recipes = this.recipeService.getRecipes();
    //
    // if (recipes.length === 0) {
    //   return this.dataStoreService.fetchRecipes();
    // } else {
    //   return recipes;
    // }
    return this.store.select('recipes').pipe(
      take(1),
      map(recipeState => {
      return recipeState.recipes;
    }),
      switchMap(recipes => {
        if (recipes.length === 0) {
          this.store.dispatch(new RecipeActions.FetchRecipes());
          return this.actions$.pipe(
            ofType(RecipeActions.SET_RECIPES),
            take(1)
          );
        } else {
          return of(recipes);
        }
      })
      );
  }
}
