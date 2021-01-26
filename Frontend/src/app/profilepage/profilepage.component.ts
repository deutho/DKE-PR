import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { posting } from '../models/posting';
import { setStatus } from '../models/user';
import { responseGetPerson } from '../models/userNetwork';
import { networkingService } from '../services/networkingService';
import { postingService } from '../services/postingService';
import { userService } from '../services/userService';

@Component({
  selector: 'app-profilepage',
  templateUrl: './profilepage.component.html',
  styleUrls: ['./profilepage.component.css'],
  providers: [
    networkingService,
    postingService,
    userService
  ]
})
export class ProfilepageComponent implements OnInit {
  allPostings: posting[] = [];
  userMood: any;
  following;
  followers: any;
  followersCount: string;
  userID: string;
  vorname: string;
  nachname: string;
  email: string;
  status: string;
  profileID: string;
  followingCount: any;

  constructor(private router: Router, private networkingService: networkingService, private postingService: postingService, private userService: userService) { }
  overlayIsActive = false;
  loaded = true;
  recommendedUser1: responseGetPerson = new responseGetPerson("0","",[]);
  recommendedUser2: responseGetPerson = new responseGetPerson("0","",[]);
  recommendedUser3: responseGetPerson = new responseGetPerson("0","",[]);
  recommendedUser4: responseGetPerson = new responseGetPerson("0","",[]);
  recommendedUser5: responseGetPerson = new responseGetPerson("0","",[]);
  recommendedUser6: responseGetPerson = new responseGetPerson("0","",[]);
  recommendedUser1Status: string;
  recommendedUser2Status: string;
  recommendedUser3Status: string;
  recommendedUser4Status: string;
  recommendedUser5Status: string;
  recommendedUser6Status: string;
  showRec1 = true;
  showRec2 = true;
  showRec3 = true;
  showRec4 = true;
  showRec5 = true;
  showRec6 = true;
  userNameDropdown;
  recommendedUser1Emotion: string= "happy";
  recommendedUser2Emotion: string= "happy";
  recommendedUser3Emotion: string= "happy";
  recommendedUser4Emotion: string= "happy";
  recommendedUser5Emotion: string= "happy";
  recommendedUser6Emotion: string= "happy";
  ngOnInit(): void {
    if(localStorage.getItem("token") == null) {
      this.router.navigate(['login'])
    }
    this.userNameDropdown = localStorage.getItem("dropdownNavBar")
    this.loadProfileData()    

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

  loadProfileData(){
    this.userService.getUserData(localStorage.getItem("profileID"))
    .then(observable => observable.subscribe(val => {
      // val[0]      
      if(val[0][0] != undefined){
      localStorage.setItem('vorname', val[0][0].vorname)
      localStorage.setItem('nachname',val[0][0].nachname)
      localStorage.setItem('email',val[0][0].email)
      localStorage.setItem('status',val[0][0].status)
      this.userMood = "happy"
      }
      else{
        localStorage.setItem('vorname', localStorage.getItem("profileID"))
        localStorage.setItem('nachname',"")
        localStorage.setItem('email', "")
        localStorage.setItem('status',"")
        this.userMood = "hashtag"
      }
      this.setUserData()
    }))
  }

  async setUserData(){
    this.userID = localStorage.getItem("userId")
    this.profileID = localStorage.getItem("profileID")
    this.vorname = localStorage.getItem("vorname");
    this.nachname = localStorage.getItem("nachname");
    this.email = localStorage.getItem("email");
    localStorage.getItem("status") !== "null"? this.status = localStorage.getItem("status"):this.status = "";
    this.getUserFromNetworkInitial(this.userID)
    console.log("profileid")
    console.log(this.profileID)
    console.log(localStorage)
  }

  getUserFromNetworkInitial(id){
    this.networkingService.getUserFromNetwork(id).then(observable => observable.subscribe(val => {
      this.following = val.followPersons
      this.followingCount = val.followPersons.length
      this.getFollowersOfUser(localStorage.getItem("userId"))
      
    }))
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

  setProfilePageID(id){
    if(id == "local") id = this.userID
    localStorage.setItem("profileID", id)
    window.location.reload();
  }

  getFollowersOfUser(id) {
    this.networkingService.getFollowersOfUserFromNetwork(id).then(observable => observable.subscribe(val => {
      console.log(val)
      this.followers = val.followers
      if(val.followers !== undefined)this.followersCount = val.followers.length;
      else this.followersCount = '"Server response error"'
      this.getAllUsersFromNetwork()
    }))

  }


  
  setStatus(){
    var status = new setStatus((<HTMLSelectElement>document.getElementById("statusValueHTMLElement")).value)
    this.userService.setStatus(status, localStorage.getItem("userId")).then(observable => observable.subscribe(val => {
      // window.location.reload();
      (<HTMLSelectElement>document.getElementById("statusValueHTMLElement")).value = ""
      this.removeAllOverlays()
    }))    
  }

  openUserDropDown(){
    this.overlayIsActive = true;
    document.getElementById("users").style.display = "unset";
  }

  getAllUsersFromNetwork(){
    this.networkingService.getAllUsersFromNetwork().then(observable => observable.subscribe(val => {
      var recommendetUsers:responseGetPerson[] = this.shuffleArray(val)
      
      let forDeletion = [localStorage.getItem("userId")]
      forDeletion.join(this.following)
      for(let i= 0; i<this.following.length; i++){
        forDeletion.push(this.following[i])
      }
      recommendetUsers = recommendetUsers.filter(item => !forDeletion.includes(item.id_person))

      if(recommendetUsers.length>0) this.recommendedUser1 = recommendetUsers[0]
      if(recommendetUsers.length>1) this.recommendedUser2 = recommendetUsers[1]
      if(recommendetUsers.length>2) this.recommendedUser3 = recommendetUsers[2]
      if(recommendetUsers.length>3) this.recommendedUser4 = recommendetUsers[3]
      if(recommendetUsers.length>4) this.recommendedUser5 = recommendetUsers[4]
      if(recommendetUsers.length>5) this.recommendedUser6 = recommendetUsers[5]

      this.showRec1 = true;
      this.showRec2 = true;
      this.showRec3 = true;
      this.showRec4 = true;
      this.showRec5 = true;
      this.showRec6 = true;

      this.loadStatusForRecommendations(recommendetUsers)

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

  follow(userid, htmlElementid){
    this.followUserInNetwork(localStorage.getItem("userId"),userid)
    if(htmlElementid == 1) this.showRec1 = false;
    if(htmlElementid == 2) this.showRec2 = false;
    if(htmlElementid == 3) this.showRec3 = false;
    if(htmlElementid == 4) this.showRec4 = false;
    if(htmlElementid == 5) this.showRec5 = false;
    if(htmlElementid == 6) this.showRec6 = false;
  }

  followUserInNetwork(originID, targetID){   
    this.networkingService.followUserInNetwork(originID, targetID).then(observable => observable.subscribe(val => {
      this.allPostings = [];
      this.getAllPostings()}))
  }

  loadStatusForRecommendations(recommendetUsers){
    let status: string[];
    if(recommendetUsers.length>0) this.userService.getUserData(recommendetUsers[0].id_person).then(observable => observable.subscribe(val => this.recommendedUser1Status = val[0].status!==undefined?val[0].status:"Hey there!"))
    if(recommendetUsers.length>1) this.userService.getUserData(recommendetUsers[1].id_person).then(observable => observable.subscribe(val => this.recommendedUser2Status = val[0].status!==undefined?val[0].status:"Hey there!"))
    if(recommendetUsers.length>2) this.userService.getUserData(recommendetUsers[2].id_person).then(observable => observable.subscribe(val => this.recommendedUser3Status = val[0].status!==undefined?val[0].status:"Hey there!"))
    if(recommendetUsers.length>3) this.userService.getUserData(recommendetUsers[3].id_person).then(observable => observable.subscribe(val => this.recommendedUser4Status = val[0].status!==undefined?val[0].status:"Hey there!"))
    if(recommendetUsers.length>4) this.userService.getUserData(recommendetUsers[4].id_person).then(observable => observable.subscribe(val => this.recommendedUser5Status = val[0].status!==undefined?val[0].status:"Hey there!"))
    if(recommendetUsers.length>5) this.userService.getUserData(recommendetUsers[5].id_person).then(observable => observable.subscribe(val => this.recommendedUser6Status = val[0].status!==undefined?val[0].status:"Hey there!"))
    
    if(recommendetUsers.length>0) this.postingService.getPostingsOfUser(recommendetUsers[0].id_person).then(observable => observable.subscribe(val => val.postings[0] != undefined ? this.recommendedUser1Emotion = val.postings[0].emotion: this.recommendedUser1Emotion = "happy"))
    if(recommendetUsers.length>1) this.postingService.getPostingsOfUser(recommendetUsers[1].id_person).then(observable => observable.subscribe(val => val.postings[0] != undefined ? this.recommendedUser2Emotion = val.postings[0].emotion: this.recommendedUser2Emotion = "happy"))
    if(recommendetUsers.length>2) this.postingService.getPostingsOfUser(recommendetUsers[2].id_person).then(observable => observable.subscribe(val => val.postings[0] != undefined ? this.recommendedUser3Emotion = val.postings[0].emotion: this.recommendedUser3Emotion = "happy"))
    if(recommendetUsers.length>3) this.postingService.getPostingsOfUser(recommendetUsers[3].id_person).then(observable => observable.subscribe(val => val.postings[0] != undefined ? this.recommendedUser4Emotion = val.postings[0].emotion: this.recommendedUser4Emotion = "happy"))
    if(recommendetUsers.length>4) this.postingService.getPostingsOfUser(recommendetUsers[4].id_person).then(observable => observable.subscribe(val => val.postings[0] != undefined ? this.recommendedUser5Emotion = val.postings[0].emotion: this.recommendedUser5Emotion = "happy"))
    if(recommendetUsers.length>5) this.postingService.getPostingsOfUser(recommendetUsers[5].id_person).then(observable => observable.subscribe(val => val.postings[0] != undefined ? this.recommendedUser6Emotion = val.postings[0].emotion: this.recommendedUser6Emotion = "happy"))
    this.getAllPostings()
  }

  getAllPostings(){
    
    this.postingService.getPostingsOfUser(this.profileID).then(observable => observable.subscribe(val => {
      console.log(val)
      for(var i = 0; i<val.postings.length; i++){
        this.allPostings.push(val.postings[i])
      }
      if(this.allPostings !== undefined){
      this.allPostings.sort((n1, n2) => {return new Date(n2.created).getTime() - new Date(n1.created).getTime() });
      this.userMood = this.allPostings[0] != undefined? this.allPostings[0].emotion: this.userMood   
      }
    }))

    this.loaded = true
  }

  dateFormatter(date: string){7
    var year = parseInt(date.substring(0,4))
    var month = parseInt(date.substring(5,7))
    var day = parseInt(date.substring(8,10))
    var hour = date.substring(11,13)
    var min = date.substring(14,16)
    var sec = date.substring(17,19)
    var correctDate: string;
    correctDate = day+"."+month+"."+year + "   " +hour+":"+min+":"+sec
    return correctDate

  }


}
