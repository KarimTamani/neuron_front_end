
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from "graphql-tag";
import { Subscription } from 'rxjs';
import { map } from "rxjs/operators";
import { Message } from 'src/app/classes/Message';
import { Visit } from 'src/app/classes/Visit';
import { InteractionService } from 'src/app/services/interaction.service';
import { VirtualAssistantService } from 'src/app/services/virtual-assistant-service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit , OnDestroy {
  public showPopUpWindow: boolean = false;
  public showEditVisit : boolean = false ; 
  public editedVisit : Visit ; 
  public isActive: boolean = false;
  public showMessage : boolean = false ; 
  public message : Message ;  
  public subscriptions : Subscription[] = [] ; 

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private apollo: Apollo , 
    private interactionService : InteractionService, 
    private virtualAssistantService : VirtualAssistantService
    ) { }

  ngOnInit(): void {
    this.subscriptions.push(this.route.queryParamMap.subscribe((paramMap) => {
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
    }))

    this.subscriptions.push(this.apollo.query({
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
    }))

    this.subscriptions.push(this.interactionService.openEditVisitWindow.subscribe((visit) => { 
      if (visit) { 
        this.showEditVisit = true ; 
      }else { 
        this.showEditVisit = false ; 
      }
      this.editedVisit = visit ; 
    }))

    this.subscriptions.push(this.interactionService.showMessage.subscribe((data) => {
      this.message = data ; 
      this.showMessage = true ; 
    }))

    this.subscriptions.push(this.virtualAssistantService.onVACommand.subscribe((data) => { 
      if ( data.command == "get-next-visit") { 
        this.apollo.query({
          query : gql`
            {
              getNextVisit{
                id 
                arrivalTime 
                status 
                waitingRoomId 
                medicalActs { 
                  id price name 
                }
                medicalFile { 
                  lastname name birthday phone email gender 
                }
              }
            }`
        }).pipe(map(value => (<any>value.data).getNextVisit)).subscribe((data) => { 
          if (data) { 
              this.router.navigate([] , { 
                queryParams : { 
                  "pop-up-window" : true , 
                  "window-page" : "next-visit" , 
                  "title" : "la prochaine visite" , 
                  "visit" : encodeURIComponent(JSON.stringify(data))
                }
              })
          }else {
             
          }
        })
      }
    }))
    this.subscriptions.push(
      this.interactionService.blackBackgroundActive.subscribe((request) => { 
        this.isActive = request ; 
      })
    )
  }

  closePopUp() {
    this.router.navigate([], { queryParams: null })
  }

  public active() {
    this.isActive = !this.isActive;
  }


  public closeEditVisit() { 
    this.showEditVisit = false ; 
    this.editedVisit = null ; 
  }


  public closeMessage() { 
    this.showMessage = false ; 
  }

  public ngOnDestroy() { 
    this.subscriptions.forEach(subs => subs.unsubscribe())  ;
  }
}

