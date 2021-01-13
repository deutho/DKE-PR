import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {setEmail, setNachname, setStatus, setVorname, setPasswort, loginUser} from '../models/user';


import { networkingService } from '../services/networkingService';
import { postingService } from '../services/postingService';
import { userService } from '../services/userService';

@Component({
  selector: 'app-profilesettings',
  templateUrl: './profilesettings.component.html',
  styleUrls: ['./profilesettings.component.css'],
  providers: [
    networkingService,
    postingService,
    userService
  ]
})
export class ProfilesettingsComponent implements OnInit {
  overlayIsActive: boolean;
  userNameDropdown;
  userSettings = false;
  userPasswort = false;
  passwortchanged = false;
  settingsChanged = false;
  errorMessage;

  constructor(private router: Router, private userService: userService, private networkingService: networkingService, private postingService: postingService) { }

  ngOnInit(): void {
    this.userNameDropdown = localStorage.getItem("dropdownNavBar")
  }


  logout(){
    this.router.navigate(['login'])
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("vorname");
    localStorage.removeItem("nachname");
    localStorage.removeItem("email");
    localStorage.removeItem("status");
  }

  setStatus(){
    var status = new setStatus((<HTMLSelectElement>document.getElementById("statusValueHTMLElement")).value)
    this.userService.setStatus(status, localStorage.getItem("userId")).then(observable => observable.subscribe(val => {
      window.location.reload();
    }))
  }

  removeAllOverlays() {
    document.getElementById("notification").style.display = "none";
    document.getElementById("users").style.display = "none";
    this.overlayIsActive = false;
  }

  showNotifications(){
    this.overlayIsActive = true;
    document.getElementById("notification").style.display = "unset";
    // document.getElementById("wrapper").setAttribute('aria-disabled', 'false');
    // document.getElementById("wrapper").classList.add("overlay");
    // document.getElementById("wrapper").classList.add("overlay-transparent");
  }

  openUserDropDown(){
    this.overlayIsActive = true;
    document.getElementById("users").style.display = "unset";
  }

  submitChangePassword()
  {
    var oldpassword :string = (<HTMLInputElement>document.getElementById('oldPassword')).value;
    var password :string = (<HTMLInputElement>document.getElementById('newPassword')).value;
    var passwordConfirmation :string = (<HTMLInputElement>document.getElementById('repeatPassword')).value;

    if(oldpassword == "" || password == "" || passwordConfirmation == ""){
      this.showErrorMessage2("Es wurden nicht alle Felder ausgefüllt!")
      return
    }

    let user = new loginUser(localStorage.getItem("email"), oldpassword);

    this.userService.loginUser(user).then(observable => observable.subscribe(val => {
      if(val == null) {
        console.log("Altes Passwort ist falsch!")
        //Error message not working
        this.showErrorMessage2("Altes Passwort ist falsch!")
      }
      else{

        if(password !== passwordConfirmation) {

          console.log("Passwörter stimmen nicht überein")
          this.showErrorMessage2("Passwörter stimmen nicht überein")
          return
        }
        else{
          var passwort = new setPasswort(password);
          this.passwortchanged = true;
          this.userService.setPasswort(passwort, localStorage.getItem("userId")).then(observable => observable.subscribe(val => {
            window.location.reload();
          }))
        }
      }
      }
    ))

  }

  submitChangeNameEmail(){
    //example code
    var vorname = (<HTMLSelectElement>document.getElementById("inputVorname")).value
    var nachname = (<HTMLSelectElement>document.getElementById("inputNachname")).value
    var email = (<HTMLSelectElement>document.getElementById("inputEmail")).value

    if(vorname != ""){
      var firstname = new setVorname(vorname);
      this.settingsChanged = true;
      this.userService.setVorname(firstname, localStorage.getItem("userId")).then(observable => observable.subscribe(val => {
        window.location.reload();
      }))
    }
    if(nachname != ""){
      var lastname = new setNachname(nachname);
      this.settingsChanged = true;
      this.userService.setNachname(lastname, localStorage.getItem("userId")).then(observable => observable.subscribe(val => {
        window.location.reload();
      }))
    }
    if(email != "")
    {
      if(!this.validateEmail(email))
      {
        console.log("Ungültige E-Mail Adresse!")
        this.showErrorMessage("Ungültige E-Mail Adresse!")
        return
      }
      else{
        var e_mail = new setEmail(email);
        this.settingsChanged = true;
        this.userService.setEmail(e_mail, localStorage.getItem("userId")).then(observable => observable.subscribe(val => {
          window.location.reload();
        }))
        localStorage.setItem('email', email);
      }
    }

    console.log("vorname: " + vorname)
    console.log("nachname: " + nachname)
    console.log("email: " + email)
  }

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  showErrorMessage(error: string){
    this.errorMessage = error
    this.userSettings = true;
    setTimeout(() => this.userSettings = false, 4000);
  }

  showErrorMessage2(error: string){
    this.errorMessage = error
    this.userPasswort = true;
    setTimeout(() => this.userPasswort = false, 4000);
  }

}
