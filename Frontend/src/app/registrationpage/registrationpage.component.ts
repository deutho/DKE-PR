import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { user } from '../models/user';
import { userService } from '../services/userService';

@Component({
  selector: 'app-registrationpage',
  templateUrl: './registrationpage.component.html',
  styleUrls: ['./registrationpage.component.css']
})
export class RegistrationpageComponent implements OnInit {

  successfullyRegistered = false;
  response;

  constructor(private router: Router, private userService: userService) { }

  ngOnInit(): void {
  }


  onSubmit(){
    let firstname :string = (<HTMLInputElement>document.getElementById('firstname')).value;
    let lastname :string = (<HTMLInputElement>document.getElementById('lastname')).value;
    let email :string = (<HTMLInputElement>document.getElementById('email')).value;
    let password :string = (<HTMLInputElement>document.getElementById('password')).value;
    let dateOfBirth :string = (<HTMLInputElement>document.getElementById('dateOfBirth')).value;
    let data = new user(firstname, lastname, email, password, dateOfBirth)
    // Do some registration service stuff
    console.log(data)
    this.userService.registerUser(data).subscribe(
      values => {
        console.log(values.data)
        this.response = values.data.message;
        if(this.response == "Benutzer registriert!") {
          setTimeout(() => this.successfullyRegistered = true, 2500);
          this.router.navigate(['/login'])
        }
      }
    )

    //redirect on successfull registration
    
  }
}
