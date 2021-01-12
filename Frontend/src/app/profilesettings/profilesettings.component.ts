import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { setStatus } from '../models/user';
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
  incorrectPassword = false;
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

  submitChangePassword(){

  }

  submitChangeName(){
    //example code
    var vorname = (<HTMLSelectElement>document.getElementById("inputVorname")).value
    var nachname = (<HTMLSelectElement>document.getElementById("inputNachname")).value
    var email = (<HTMLSelectElement>document.getElementById("inputEmail")).value

    
    if(nachname == "") console.log("nachname fehlt")
    this.errorMessage ="nachname fehlt"
    this.incorrectPassword = true;
    setTimeout(() => this.incorrectPassword = false, 2000);

    console.log("vorname: " + vorname)
    console.log("nachname: " + nachname)
    console.log("email: " + email)
  }

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

}
