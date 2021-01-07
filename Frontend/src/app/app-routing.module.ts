import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FriendspageComponent } from './friendspage/friendspage.component';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { ProfilepageComponent } from './profilepage/profilepage.component';
import { RegistrationpageComponent } from './registrationpage/registrationpage.component';


const routes: Routes = [
  {
    path: 'login',
    component: LoginpageComponent
  },
  { path: 'register',
    component: RegistrationpageComponent
  },
  { path: 'friends',
    component: FriendspageComponent
  },
  { path: 'profilepage',
  component: ProfilepageComponent
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