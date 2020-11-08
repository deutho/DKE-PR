import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.css']
})
export class LoginpageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
    
  public async onSubmit() {
    
    
    let email :string = (<HTMLInputElement>document.getElementById('email')).value;
    let password :string = (<HTMLInputElement>document.getElementById('password')).value;
    
    //Do some login service request

    //redirect on successfull login
    this.router.navigate([''])
  
  }
}
