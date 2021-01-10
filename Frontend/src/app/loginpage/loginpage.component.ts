import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { loginUser } from '../models/user';
import { userService } from './../services/userService'


@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.css']
})
export class LoginpageComponent implements OnInit {

  constructor(private router: Router, private userService: userService) { }

  ngOnInit(): void {
  }
  email:string;
  password:string;
  public async onSubmit() {
    
    
    this.email = (<HTMLInputElement>document.getElementById('email')).value;
    this.password  = (<HTMLInputElement>document.getElementById('password')).value;
    
    //Do some login service request
    this.login()

    //redirect on successfull login
    // this.router.navigate([''])
  
  }

  login(){
    //static input
    let user = new loginUser(this.email, this.password)    
    this.userService.loginUser(user).then(observable => observable.subscribe(val => {
      localStorage.setItem('token', val.token);
      localStorage.setItem('userId', val.userId);
      console.log(localStorage.getItem("token"))
      console.log(localStorage.getItem("userId"))
      this.router.navigate([''])
    }
      ))

  }
}
