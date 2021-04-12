import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from "graphql-tag";
import { map } from "rxjs/operators";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public showPopUpWindow: boolean = false;
  public isActive: boolean = false;
  constructor(private route: ActivatedRoute, private router: Router, private apollo: Apollo) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((paramMap) => {
      // extract the pop up window 
      let popUpWindow = paramMap.get("pop-up-window")
      // if the pop up window exiets in the url 
      // convert it to boolean and assign it to the popUpWindow Attribute  
      if (popUpWindow)
        try {
          this.showPopUpWindow = JSON.parse(popUpWindow)
        } catch (error) {
          this.showPopUpWindow = false
        }
      else
        this.showPopUpWindow = false;
    })

    this.apollo.query({
      query: gql`
        query {
          getCurrentDate
        }
        `
    }).pipe(map(result => (<any>result.data).getCurrentDate)).subscribe(data => {
      // get current data time and doctor last feed back time 
      let currentDate = new Date(data);
      let doctorAuth = JSON.parse(localStorage.getItem("doctorAuth"));
      // substract the last feed back time from th current time and cast it to days 
      let deltaTime = currentDate.getTime() - new Date(doctorAuth.doctor.lastFeedback).getTime();
      deltaTime = deltaTime / 1000 / 3600 / 24;
      // if the period is more or equals to 3 days then show a new window of feedback 

      if (deltaTime >= 4) {
        this.router.navigate([], {
          queryParams: {
            "pop-up-window": true,
            'window-page': "feedback-window",
            "title": "Votre opinion sur notre service"
          }
        })
      }
    })

    /*

    var speechRecognition = window.SpeechRecognition || (<any>window).webkitSpeechRecognition;
    var recognition = new speechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'fr-FR';
    recognition.onspeechend = function () {

    }
    recognition.onresult = function (event) {
      /*
      console.log(event);
      var current = event.resultIndex;
      console.log(event.results[current][0].transcript);
     var interim_transcript = "" ; 

     for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        console.log("final : " , event.results[i][0].transcript) ;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
    
 

    }

    recognition.onstart = function () {
      console.log("start recording ...");
    }

    recognition.start();

    */

    /*
    
    */


  }

  closePopUp() {
    this.router.navigate([], { queryParams: null })
  }

  public active() {
    this.isActive = !this.isActive;
  }
}

