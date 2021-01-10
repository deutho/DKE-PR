import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { user } from '../models/user';
import { createPerson, rootCreatePerson } from '../models/userNetwork';
import { networkingService } from '../services/networkingService';
import { userService } from '../services/userService';

@Component({
  selector: 'app-registrationpage',
  templateUrl: './registrationpage.component.html',
  styleUrls: ['./registrationpage.component.css'],
  providers: [networkingService]
})
export class RegistrationpageComponent implements OnInit {

  successfullyRegistered = false;
  response;
  userExistsAlready = false;
  errorMessage;

  constructor(private router: Router, private userService: userService, private networkingService: networkingService) { }

  ngOnInit(): void {
  }


  onSubmit(){
    let firstname :string = (<HTMLInputElement>document.getElementById('firstname')).value;
    let lastname :string = (<HTMLInputElement>document.getElementById('lastname')).value;
    let email :string = (<HTMLInputElement>document.getElementById('email')).value;
    let password :string = (<HTMLInputElement>document.getElementById('password')).value;
    let passwordConfirmation :string = (<HTMLInputElement>document.getElementById('passwordConfirmation')).value;
    let status = null;
    let data = new user(firstname, lastname, email, password, status)

    if(firstname == "" || lastname == "" || email == "" || password == ""){
      this.showErrorMessage("Es wurden nicht alle Felder ausgefüllt!")
      return
    }
    if(!this.validateEmail(email)) {
      this.showErrorMessage("Ungültige E-Mail Adresse!")
      return
    }
    if(password !== passwordConfirmation) {
      this.showErrorMessage("Passwörter stimmen nicht überein!")
      return
    }
    console.log("Input is valid")



    this.userService.registerUser(data)
    .then(observable => observable.subscribe(val => {
      if(val == null) {
        this.showErrorMessage("Dieser E-Mail Adresse existiert bereits!")
      }
      else {
        console.log(val)
        console.log("Benutzer in User-Datenbank angelegt")   
        this.addUserToNetwork(val.id + "", firstname + " " + lastname)     
        this.successfullyRegistered = true
        setTimeout(() => this.successfullyRegistered = false, 1500);
        // get Token - use login request
        this.userService.loginUser({"email":email, "passwort":password}).then(observable => observable.subscribe(val => {
          localStorage.setItem('token', val.token);
          localStorage.setItem('userId', val.userId);
          console.log(localStorage.getItem("token"))
          console.log(localStorage.getItem("userId"))
          console.log(val.userId)    
          
          
        }
          ))
        setTimeout(() => this.router.navigate(['']), 1500);
        
      }}
    ))

    
    
  }


  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  showErrorMessage(error: string){
    this.errorMessage = error
    this.userExistsAlready = true;
    setTimeout(() => this.userExistsAlready = false, 4000);
  }

  addUserToNetwork(id, name){
    let user = [new createPerson(id, name)]
    let rootUser= new rootCreatePerson(user);
    this.networkingService.addUserToNetwork(rootUser).then(observable => observable.subscribe(val => {
      console.log("Benutzer in Netzwek-Datenbank angelegt.")

      this.router.navigate([''])
    }))
    
  }
}
