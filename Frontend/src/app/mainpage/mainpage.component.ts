import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { networkingService} from './../services/networkingService'
import { createPerson, responseGetPerson, rootCreatePerson} from '../models/userNetwork'
import { userService } from '../services/userService';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css'],
  providers: [networkingService]
})
export class MainpageComponent implements OnInit {

  constructor(private router: Router, private networkingService: networkingService, private userService: userService) { }
  userID;
  vorname;
  nachname;
  email;
  status;
  following;
  loaded = false;
  dataLoaded = false;
  dataSet = false;
  overlayIsActive = false;


  ngOnInit(): void {
    if(localStorage.getItem("token") == null) {
      this.router.navigate(['login'])
    }
    this.loadUserData()
  }

  async setUserData(){
    this.userID = localStorage.getItem("userId")
    this.vorname = localStorage.getItem("vorname");
    this.nachname = localStorage.getItem("nachname");
    this.email = localStorage.getItem("email");
    localStorage.getItem("status") !== "null"? this.status = localStorage.getItem("status"):this.status = "";
    this.getUserFromNetwork(this.userID)
    
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

  newPost(){
    document.getElementById("popup").classList.add("active");
    document.getElementById("wrapper").classList.add("overlay");
  }

  removeOverlay(){
    document.getElementById("popup").classList.remove("active");
    document.getElementById("wrapper").classList.remove("overlay");

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

  //add user to network
  addUserToNetwork(id, name){
    //static input
    let user = [new createPerson(id, name)]
    let rootUser= new rootCreatePerson(user);
    this.networkingService.addUserToNetwork(rootUser).then(observable => observable.subscribe(val => console.log(val)))
  }

  //delete user from network
  deleteUserFromNetwork(){
    //static input
    var userid = 2;
    this.networkingService.deleteUserFromNetwork(userid).then(observable => observable.subscribe(
      values => {
        console.log(values.data)        
      }
    ))
  }

  getUserFromNetwork(id: Number){
    this.networkingService.getUserFromNetwork(id).then(observable => observable.subscribe(val => {
      this.following = val.followPersons.length
      this.loaded=true
    }))
  }

  followUserInNetwork(originID, targetID){   
    this.networkingService.followUserInNetwork(originID, targetID).then(observable => observable.subscribe(val => console.log(val)))
  }

  loadUserData(){
    this.userService.getUserData(localStorage.getItem("userId"))
    .then(observable => observable.subscribe(val => {
      // val[0]      
      localStorage.setItem('vorname', val[0][0].vorname)
      localStorage.setItem('nachname',val[0][0].nachname)
      localStorage.setItem('email',val[0][0].email)
      localStorage.setItem('status',val[0][0].status)
      this.setUserData()
    }))
  }

}
