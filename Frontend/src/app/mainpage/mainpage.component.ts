import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { networkingService} from './../services/networkingService'
import { createPerson, rootCreatePerson} from '../models/userNetwork'

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css'],
  providers: [networkingService]
})
export class MainpageComponent implements OnInit {

  constructor(private router: Router, private networkingService: networkingService) { }

  overlayIsActive = false;


  ngOnInit(): void {
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
    var userid = 1;
    this.networkingService.deleteUserFromNetwork(userid).then(observable => observable.subscribe(
      values => {
        console.log(values.data)        
      }
    ))
  }

  getUserFromNetwork(id: Number){
    var response = this.networkingService.getUserFromNetwork(id).then(observable => observable.subscribe(val => console.log(val)))
  }

  followUserInNetwork(originID, targetID){   
    this.networkingService.followUserInNetwork(originID, targetID).then(observable => observable.subscribe(val => console.log(val)))
  }

}
