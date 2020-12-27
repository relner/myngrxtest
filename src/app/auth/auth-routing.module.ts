import {NgModule} from '@angular/core'
import {Routes, RouterModule} from '@angular/router'
import { AuthComponent } from './components/auth/auth.component'
import { LoginComponent } from './components/login/login.component'
import { RegisterComponent } from './components/register/register.component'

const routes: Routes = [
  { path: 'auth', component: AuthComponent,
    children: [
      { path: '', redirectTo: 'register', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent }
    ]}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}