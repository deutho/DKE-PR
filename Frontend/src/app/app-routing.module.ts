import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { RegistrationpageComponent } from './registrationpage/registrationpage.component';


const routes: Routes = [
  {
    path: 'login',
    component: LoginpageComponent
  },
  { path: 'register',
    component: RegistrationpageComponent
  },
  {
    path: '',
    component: MainpageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }