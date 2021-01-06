import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css']
})
export class MainpageComponent implements OnInit {

  constructor() { }

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

}
