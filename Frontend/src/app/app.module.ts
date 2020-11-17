import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { RegistrationpageComponent } from './registrationpage/registrationpage.component';
import { userService } from './services/userService';



@NgModule({
  declarations: [
    AppComponent,
    MainpageComponent,
    LoginpageComponent,
    RegistrationpageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [userService],
  bootstrap: [AppComponent]
})
export class AppModule { }
