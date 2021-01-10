import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { from, Observable } from 'rxjs';
import { networkingService} from './../services/networkingService'
import { createPerson, responseGetPerson, rootCreatePerson} from '../models/userNetwork'
import { userService } from '../services/userService';
import { user } from '../models/user';

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
  recommendedUser1: responseGetPerson;
  recommendedUser2: responseGetPerson;
  recommendedUser3: responseGetPerson;
  recommendedUser4: responseGetPerson;
  recommendedUser5: responseGetPerson;
  recommendedUser6: responseGetPerson;
  recommendedUser1Status: string;
  recommendedUser2Status: string;
  recommendedUser3Status: string;
  recommendedUser4Status: string;
  recommendedUser5Status: string;
  recommendedUser6Status: string;


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
    this.getUserFromNetworkInitial(this.userID)
    
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

  getUserFromNetworkInitial(id: Number){
    this.networkingService.getUserFromNetwork(id).then(observable => observable.subscribe(val => {
      this.following = val.followPersons.length
      this.getAllUsersFromNetwork()
     
    }))
  }

  async getUserFromNetwork(id: Number): Promise<Observable<user>>{
    return await this.networkingService.getUserFromNetwork(id);
  }

  getAllUsersFromNetwork(){
    this.networkingService.getAllUsersFromNetwork().then(observable => observable.subscribe(val => {
      var recommendetUsers:responseGetPerson[] = this.shuffleArray(val)
      if(recommendetUsers.length>0) this.recommendedUser1 = recommendetUsers[0]
      if(recommendetUsers.length>1) this.recommendedUser2 = recommendetUsers[1]
      if(recommendetUsers.length>2) this.recommendedUser3 = recommendetUsers[2]
      if(recommendetUsers.length>3) this.recommendedUser4 = recommendetUsers[3]
      if(recommendetUsers.length>4) this.recommendedUser5 = recommendetUsers[4]
      if(recommendetUsers.length>5) this.recommendedUser6 = recommendetUsers[5]

      this.loadStatusForRecommendations(recommendetUsers)

      this.loaded=true}))
  }
  
  loadStatusForRecommendations(recommendetUsers){
    let status: string[];
    if(recommendetUsers.length>0) this.userService.getUserData(recommendetUsers[0].id_person).then(observable => observable.subscribe(val => this.recommendedUser1Status = val[0].status!==undefined?val[0].status:"Hey there!"))
    if(recommendetUsers.length>1) this.userService.getUserData(recommendetUsers[1].id_person).then(observable => observable.subscribe(val => this.recommendedUser2Status = val[0].status!==undefined?val[0].status:"Hey there!"))
    if(recommendetUsers.length>2) this.userService.getUserData(recommendetUsers[2].id_person).then(observable => observable.subscribe(val => this.recommendedUser3Status = val[0].status!==undefined?val[0].status:"Hey there!"))
    if(recommendetUsers.length>3) this.userService.getUserData(recommendetUsers[3].id_person).then(observable => observable.subscribe(val => this.recommendedUser4Status = val[0].status!==undefined?val[0].status:"Hey there!"))
    if(recommendetUsers.length>4) this.userService.getUserData(recommendetUsers[4].id_person).then(observable => observable.subscribe(val => this.recommendedUser5Status = val[0].status!==undefined?val[0].status:"Hey there!"))
    if(recommendetUsers.length>5) this.userService.getUserData(recommendetUsers[5].id_person).then(observable => observable.subscribe(val => this.recommendedUser6Status = val[0].status!==undefined?val[0].status:"Hey there!"))
    console.log(status)
  }

  followUserInNetwork(originID, targetID){   
    this.networkingService.followUserInNetwork(originID, targetID).then(observable => observable.subscribe(val => console.log(val)))
  }

  follow(userid){
    this.followUserInNetwork(localStorage.getItem("userId"),userid)
    
  }

  print(content){
    console.log(content)
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

  shuffleArray(arr):responseGetPerson[] {
    var currentIndex = arr.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = arr[currentIndex];
        arr[currentIndex] = arr[randomIndex];
        arr[randomIndex] = temporaryValue;
    }

    return arr;

  }

}
