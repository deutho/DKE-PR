import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { from, observable, Observable } from 'rxjs';
import { networkingService} from './../services/networkingService'
import { createPerson, responseGetPerson, rootCreatePerson} from '../models/userNetwork'
import { userService } from '../services/userService';
import { user } from '../models/user';
import { postingService } from '../services/postingService';
import { posting } from '../models/posting';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css'],
  providers: [networkingService,
              postingService]
})
export class MainpageComponent implements OnInit {

  constructor(private router: Router, private postingService: postingService, private networkingService: networkingService, private userService: userService) { }
  userID;
  vorname;
  nachname;
  email;
  status;
  following;
  followers;
  followingCount;
  followersCount;
  loaded = false;
  dataLoaded = false;
  dataSet = false;
  overlayIsActive = false;
  recommendedUser1: responseGetPerson = new responseGetPerson(0,"",[]);
  recommendedUser2: responseGetPerson = new responseGetPerson(0,"",[]);
  recommendedUser3: responseGetPerson = new responseGetPerson(0,"",[]);
  recommendedUser4: responseGetPerson = new responseGetPerson(0,"",[]);
  recommendedUser5: responseGetPerson = new responseGetPerson(0,"",[]);
  recommendedUser6: responseGetPerson = new responseGetPerson(0,"",[]);
  recommendedUser1Status: string;
  recommendedUser2Status: string;
  recommendedUser3Status: string;
  recommendedUser4Status: string;
  recommendedUser5Status: string;
  recommendedUser6Status: string;
  allPostings: posting[] = [];
  showRec1 = true;
  showRec2 = true;
  showRec3 = true;
  showRec4 = true;
  showRec5 = true;
  showRec6 = true;

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

  submitPost(){
    // public creator: String,
    // public emotion: String,
    // public content: String, 
    // public hashtags: String[]
    let emotion = (<HTMLSelectElement>document.getElementById("moodSelector")).value
    let content = (<HTMLTextAreaElement>document.getElementById("content")).value
    let hashtagsRaw = (<HTMLInputElement>document.getElementById("hashtags")).value
    if(emotion != "" && content != "" && hashtagsRaw != ""){
      var hashtags =  hashtagsRaw.split(" "); 
      for(let i = 0; i<hashtags.length; i++){
        let hashtagid = this.getRandomInt(10000000000).toString()
        this.networkingService.getUserFromNetwork(hashtagid)
        .then(observable => observable.subscribe(val => console.log(val)))
        .catch(error => {
          console.error()
          console.log("im catch teil")
          let user = [new createPerson(hashtagid, hashtags[i])]
          let rootUser= new rootCreatePerson(user);
          this.networkingService.addUserToNetwork(rootUser)
          .then(observable => observable.subscribe(val => console.log(val)))
          .catch(error => console.error())
        
        })



      }


      var name = localStorage.getItem("vorname")  + " " + localStorage.getItem("nachname");
      
      var payload = new posting(localStorage.getItem("userId"), emotion, content, hashtags, name, new Date())
      console.log(payload)
      this.postingService.postPosting(payload).then(observable => observable.subscribe(val => {      
        this.removeOverlay()
        this.allPostings = []
        this.getAllPostings()
      }))
    }
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  removeOverlay(){
    document.getElementById("popup").classList.remove("active");
    document.getElementById("wrapper").classList.remove("overlay");

  }

  checkForHashtags(){
    let hashtagsRaw = (<HTMLInputElement>document.getElementById("hashtags")).value
    var splitted = hashtagsRaw.split(" "); 
    var correctedHastags= [];
    splitted.forEach(word => {
      if(word[0] !== "#"){
        word = "#" + word    
      }
      correctedHastags.push(word)
    });
    (<HTMLInputElement>document.getElementById("hashtags")).value = correctedHastags.join(" ");
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
      this.following = val.followPersons
      this.followingCount = val.followPersons.length
      this.getFollowersOfUser(localStorage.getItem("userId"))
     
    }))
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

  async getUserFromNetwork(id: Number): Promise<Observable<user>>{
    return await this.networkingService.getUserFromNetwork(id);
  }

  getAllUsersFromNetwork(){
    this.networkingService.getAllUsersFromNetwork().then(observable => observable.subscribe(val => {
      var recommendetUsers:responseGetPerson[] = this.shuffleArray(val)

      let forDeletion = [parseInt(localStorage.getItem("userId"))]
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
  
  loadStatusForRecommendations(recommendetUsers){
    let status: string[];
    if(recommendetUsers.length>0) this.userService.getUserData(recommendetUsers[0].id_person).then(observable => observable.subscribe(val => this.recommendedUser1Status = val[0].status!==undefined?val[0].status:"Hey there!"))
    if(recommendetUsers.length>1) this.userService.getUserData(recommendetUsers[1].id_person).then(observable => observable.subscribe(val => this.recommendedUser2Status = val[0].status!==undefined?val[0].status:"Hey there!"))
    if(recommendetUsers.length>2) this.userService.getUserData(recommendetUsers[2].id_person).then(observable => observable.subscribe(val => this.recommendedUser3Status = val[0].status!==undefined?val[0].status:"Hey there!"))
    if(recommendetUsers.length>3) this.userService.getUserData(recommendetUsers[3].id_person).then(observable => observable.subscribe(val => this.recommendedUser4Status = val[0].status!==undefined?val[0].status:"Hey there!"))
    if(recommendetUsers.length>4) this.userService.getUserData(recommendetUsers[4].id_person).then(observable => observable.subscribe(val => this.recommendedUser5Status = val[0].status!==undefined?val[0].status:"Hey there!"))
    if(recommendetUsers.length>5) this.userService.getUserData(recommendetUsers[5].id_person).then(observable => observable.subscribe(val => this.recommendedUser6Status = val[0].status!==undefined?val[0].status:"Hey there!"))
    this.getAllPostings()
  }

  getAllPostings(){
    
    this.postingService.getPostingsOfUser(localStorage.getItem("userId")).then(observable => observable.subscribe(val => {
      for(var i = 0; i<val.postings.length; i++){
        this.allPostings.push(val.postings[i])
      }
      this.allPostings.sort((n1, n2) => {return n2.created.getTime() - n1.created.getTime() });
      // console.log(this.following)
      for(var i = 0; i<this.following.length; i++){
        this.postingService.getPostingsOfUser(this.following[i]).then(observable => observable.subscribe(val => {
          for(var i = 0; i<val.postings.length; i++){
            this.allPostings.push(val.postings[i])
          }
        }))
      }
      // console.log(this.allPostings)
      this.allPostings.sort((n1, n2) => {return n2.created.getTime() - n1.created.getTime() });
    }))
    // this.following.array.forEach(element => {
    //   console.log(element)
    // });
    console.log(this.allPostings)
    this.loaded = true
  }

  followUserInNetwork(originID, targetID){   
    this.networkingService.followUserInNetwork(originID, targetID).then(observable => observable.subscribe(val => console.log(val)))
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

  getPostingsOfUser(id){
    this.postingService.getPostingsOfUser(id).then(observable => observable.subscribe(val => console.log(val)))
  }

  dateFormatter(date: string){
    console.log(date)
    var year = parseInt(date.substring(0,4))
    var month = parseInt(date.substring(5,7))
    var day = parseInt(date.substring(8,10))
    var hour = parseInt(date.substring(11,13))
    var min = parseInt(date.substring(14,16))
    var sec = parseInt(date.substring(17,19))
    var correctDate: string;
    correctDate = day+"."+month+"."+year + "   " +hour+":"+min+":"+sec
    return correctDate

  }

}
