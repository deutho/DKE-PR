import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrationpage',
  templateUrl: './registrationpage.component.html',
  styleUrls: ['./registrationpage.component.css']
})
export class RegistrationpageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }


  onSubmit(){
    let firstname :string = (<HTMLInputElement>document.getElementById('firstname')).value;
    let lastname :string = (<HTMLInputElement>document.getElementById('lastname')).value;
    let email :string = (<HTMLInputElement>document.getElementById('email')).value;
    let password :string = (<HTMLInputElement>document.getElementById('password')).value;
    let dateOfBirth :string = (<HTMLInputElement>document.getElementById('dateOfBirth')).value;

    //Do some registration service stuff


    //redirect on successfull registration
    this.router.navigate(['/login'])
  }
}
