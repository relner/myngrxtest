import {Injectable} from '@angular/core'
import {createEffect, Actions, ofType} from '@ngrx/effects'
import {map, catchError, switchMap, tap} from 'rxjs/operators'
import {HttpErrorResponse} from '@angular/common/http'

import {AuthService} from '../../services/auth.service'
import {CurrentUserInterface} from 'src/app/shared/types/currentUser.interface'
import {of} from 'rxjs'
import {PersistanceService} from 'src/app/shared/services/persistance.service'
import {Router} from '@angular/router'
import { loginAction, loginFailureAction, loginSuccessAction } from '../actions/login.action'

@Injectable()
export class LoginEffect {

  constructor(private actions$: Actions, private authService: AuthService, private persistanceService: PersistanceService, private router: Router) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginAction),

      switchMap(({request}) => {
        return this.authService.login(request).pipe(
          map((currentUser: CurrentUserInterface) => {
            this.persistanceService.set('accessToken', currentUser.token)
            return loginSuccessAction({currentUser})
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              loginFailureAction({errors: errorResponse.error.errors})
            )
          })
        )

      })
    )
  )

  redirectAfterLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginSuccessAction),

      tap(() => {
        this.router.navigateByUrl('/')
      })

    ),
    {dispatch: false}
  )

}
