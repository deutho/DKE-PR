import { Component, OnInit } from '@angular/core';
import { networkingService } from '../services/networkingService';
import { postingService } from '../services/postingService';
import { userService } from '../services/userService';

@Component({
  selector: 'app-friendspage',
  templateUrl: './friendspage.component.html',
  styleUrls: ['./friendspage.component.css'],
  providers: [
    networkingService,
    postingService,
    userService
            ]
})
export class FriendspageComponent implements OnInit {

  constructor( private networkingService: networkingService, private postingService: postingService, private userService: userService) { }
  overlayIsActive = false;
  following;
  loaded = false;


  ngOnInit(): void {
    this.getFollowing();
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

  getFollowing(){
    this.networkingService.getSubscriptionsOfUserFromNetwork(localStorage.getItem("userId"))
    this.loaded = true;
  }

}
