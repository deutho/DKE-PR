import { Component, OnInit } from '@angular/core';
import { observable } from 'rxjs';
import { subscriptions } from '../models/subscriptions';
import { setStatus } from '../models/user';
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
  userIdInProcess;
  subs: subscriptions[];
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
  
  unfollow(id){
    this.networkingService.unfollowUserInNetwork(localStorage.getItem("userId"), id).then(observable => observable.subscribe(val => console.log(val)))
    window.location.reload();
  }

  openUserDropDown(){
    this.overlayIsActive = true;
    document.getElementById("users").style.display = "unset";
  }

  setProfilePageID(id){
    localStorage.setItem("profileID", id)
  }

  setStatus(){
    var status = new setStatus((<HTMLSelectElement>document.getElementById("statusValueHTMLElement")).value)
    this.userService.setStatus(status, localStorage.getItem("userId")).then(observable => observable.subscribe(val => {
      // window.location.reload();
      (<HTMLSelectElement>document.getElementById("statusValueHTMLElement")).value = ""
      this.removeAllOverlays()
    }))    
  }

  getFollowing(){
    this.subs = [] ;
    //get subscriptions
    this.networkingService.getSubscriptionsOfUserFromNetwork(localStorage.getItem("userId")).then(observable => observable.subscribe(val => {
      var subscriptionIds: string[] = val.subscriptions
      // console.log(subscriptionIds)
      for(var i = 0; i<subscriptionIds.length; i++){
        this.subs.push(new subscriptions(subscriptionIds[i], "happy", subscriptionIds[i], null))
        this.userIdInProcess = subscriptionIds[i];
        // console.log(this.userIdInProcess)

        if(subscriptionIds[i][0] == "#") subscriptionIds[i] = "%23" + subscriptionIds[i].substring(1,subscriptionIds[i].length)
        this.userService.getUserData(this.userIdInProcess).then(observable => observable.subscribe(val => {
          if(val[0][0] != undefined){
            var indexPostition = this.subs.findIndex(x => x.userId == val[0][0].id);
            this.subs[indexPostition].name = val[0][0].vorname + " " +  val[0][0].nachname
            this.subs[indexPostition].status = val[0][0].status
          //   console.log(val[0][0].id)
          // console.log(val[0][0].vorname)
          // console.log(val[0][0].nachname)
          // console.log(val[0][0].status)
          }
          else{

          }
        }))



        // console.log(subs)

        //get all postings of the person i am following do determine the mood
        if(subscriptionIds[i][0] == "#") subscriptionIds[i] = "%23" + subscriptionIds[i].substring(1,subscriptionIds[i].length)
        this.postingService.getPostingsOfUser(subscriptionIds[i]).then(observable => observable.subscribe(val => {       
          val.postings.sort((n1, n2) => {return new Date(n2.created).getTime() - new Date(n1.created).getTime() })
          var emotion = val.postings[0]!=undefined?val.postings[0].emotion:"happy"
          if(val.postings[0] !== undefined) {
            var indexPostition = this.subs.findIndex(x => x.userId == val.postings[0].creator);
            this.subs[indexPostition].emotion = val.postings[0].emotion
          }
          
          // console.log(this.subs)
          
        }))
      }
      
    }))
    console.log(this.subs)
    this.loaded = true;
  }

}
