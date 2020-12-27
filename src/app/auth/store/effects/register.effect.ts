import {Injectable} from '@angular/core'
import {createEffect, Actions, ofType} from '@ngrx/effects'
import {map, catchError, switchMap, tap} from 'rxjs/operators'
import {HttpErrorResponse} from '@angular/common/http'

import {registerAction, registerSuccessAction, registerFailureAction, loginAction, loginSuccessAction, loginFailureAction} from '../actions/register.action'
import {AuthService} from '../../services/auth.service'
import {CurrentUserInterface} from 'src/app/shared/types/currentUser.interface'
import {of} from 'rxjs'
import {PersistanceService} from 'src/app/shared/services/persistance.service'
import {Router} from '@angular/router'

@Injectable()
export class RegisterEffect {

  constructor(private actions$: Actions, private authService: AuthService, private persistanceService: PersistanceService, private router: Router) {}

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(registerAction),

      switchMap(({request}) => {
        return this.authService.register(request).pipe(
          map((currentUser: CurrentUserInterface) => {
            this.persistanceService.set('accessToken', currentUser.token)
            return registerSuccessAction({currentUser})
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              registerFailureAction({errors: errorResponse.error.errors})
            )
          })
        )

      })
    )
  )

  redirectAfterSubmit$ = createEffect(() =>
      this.actions$.pipe(
        ofType(registerSuccessAction),

        tap(() => {
          this.router.navigateByUrl('/')
        })

      ),
    {dispatch: false}
  )

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
