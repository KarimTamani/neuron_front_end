import { Component, OnDestroy, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { DataService } from 'src/app/services/data.service';
import { WaitingRoom } from 'src/app/classes/WaitingRoom';
import { InteractionService } from 'src/app/services/interaction.service';
import { Subject } from 'rxjs/internal/Subject';
import { ActivatedRoute } from '@angular/router';
import { VirtualAssistantService } from 'src/app/services/virtual-assistant-service';
import { ALWAYS, YesNoVAResponse } from 'src/app/classes/VAResponse';

import { Subscription } from 'rxjs';
import { Message, SUCCESS } from 'src/app/classes/Message';

@Component({
  selector: 'app-waiting-room',
  templateUrl: './waiting-room.component.html',
  styleUrls: ['./waiting-room.component.css']
})
export class WaitingRoomComponent implements OnInit, OnDestroy {

  public currentMonth: number;
  public currentYear: number;
  public currentDay: number;
  public currentDate: string;
  public subscriptions: Subscription[] = [];
  public waitingRoom: WaitingRoom;
  public updateSubject: Subject<any>;
  public fromVa: boolean = false;
  public todayDate: string;
  public controllable: boolean = true;
  constructor(
    private apollo: Apollo,
    public dataService: DataService,
    private route: ActivatedRoute,
    private virtualAssistantService: VirtualAssistantService,
    private interactionService: InteractionService) {
    this.updateSubject = new Subject<any>();
  }

  ngOnInit(): void {
    var params = this.route.snapshot.queryParams;
    this.fromVa = params["from-va"] === "true";
    // get the current date
    this.apollo.query({
      query: gql`
        {
          getCurrentDate
        }
      `
    }).pipe(map(value => (<any>value.data).getCurrentDate)).subscribe((data) => {

      const date = new Date(data);
      this.currentDate = data;
      this.todayDate = this.dataService.castDateYMD(this.currentDate);

      this.currentMonth = date.getMonth();
      this.currentYear = date.getFullYear();
      this.currentDay = date.getDate();
      this.loadWaitingRoom(false, true);
    })

    this.subscriptions.push(this.interactionService.newVisitAdded.subscribe(() => {
      this.waitingRoom = null;
      this.loadWaitingRoom();
      this.interactionService.updateReport.next();
    }));

    this.subscriptions.push(this.virtualAssistantService.onVACommand.subscribe((data) => {

      if (data.command && data.command == "waiting-room-report") {

        var gain = 0;
        var waitingVisits = [];
        var visitsDone = [];
        // get the waiting visits 
        // and the don visitts so we can calculate the gain 
        if (this.waitingRoom && this.waitingRoom.visits.length > 0) {
          visitsDone = this.waitingRoom.visits.filter(visit => visit.status == "visit payed" || visit.status == "visit done");
          waitingVisits = <any[]>this.waitingRoom.visits.filter(visit => visit.status == "waiting" || visit.status == "in visit");
        }

        visitsDone.forEach(visit => gain += visit.payedMoney);

        this.virtualAssistantService.onVaResponse.next({
          message:
            `vous avez ${waitingVisits.length} visites en attente,
            ${visitsDone.length} visites effectuées,
            et la recette ${gain} dinar algérien.`,
          speakable: ALWAYS,
          yesNo: false
        })
      }
    }))
  }
  private loadWaitingRoom(update: boolean = false, first: boolean = false) {
    if (this.dataService.castDateYMD(this.currentDate) != this.todayDate)
      this.controllable = false;
    else
      this.controllable = true;

    this.apollo.query({
      query: gql`
        {
          getWaitingRoom(waitingRoom : {
            date : "${this.dataService.castDateYMD(this.currentDate)}"
          }) {
            id date visits {
              id 
              arrivalTime 
              status 
              order 
              startTime 
              endTime 

              waitingRoomId  
              debt 
              payedMoney 
              medicalFile {
                id 
                name 
                gender
                lastname
                birthday 
                phone 
                email
              }
              medicalActs {
                id 
                name 
                price
              }
              symptoms {
                id name
              }
              vitalSetting { 
                temperature 
                respiratoryRate  
                cardiacFrequency 
                bloodPressure 
                diuresis 
                weight  
                size  
                obesity 
                smoker  
              }
            }
          }
        }
      `
    }).pipe(map(value => (<any>value.data).getWaitingRoom)).subscribe((data) => {
      this.waitingRoom = data;
      // check if this is the first load and the page has been requested from va 
      // and waiting room exists and contains some visits
      if (this.waitingRoom && this.waitingRoom.visits.length != 0 && this.fromVa && first) {

        this.virtualAssistantService.onVaResponse.next(<YesNoVAResponse>{
          message: "vous voulez un résumé de la salle d'attente",
          speakable: ALWAYS,
          command: "résumé sur la salle d'attente",
          yesNo: true
        })
      }
      if (this.waitingRoom)
        this.interactionService.showMessage.next(<any>{
          message: "Salle d'attente "+ this.dataService.castFRDate(new Date(this.currentDate))+ " a été chargée"
        });


      if (update)
        this.updateSubject.next(this.waitingRoom);

    })
  }
  public createWaitingRoom() {
    this.apollo.mutate({
      mutation: gql`
        mutation {
          addWaitingRoom(waitingRoom : {
            date : "${this.dataService.castDateYMD(this.currentDate)}"
          }) {
            id date visits {
              id
            }
          }
        } 
      `
    }).pipe(map(value => (<any>value.data).addWaitingRoom)).subscribe((data) => {
      this.waitingRoom = data;
      this.waitingRoom.visits = [];

      this.interactionService.showMessage.next(<Message>{
        message: "Salle d'attente "+this.dataService.castFRDate(new Date(this.currentDate))+" a été créée " ,
        type: SUCCESS
      })
    })
  }

  public dateChanged($event: Date) {

    this.currentDate = $event.toISOString();

    this.currentMonth = $event.getMonth();
    this.currentYear = $event.getFullYear();
    this.currentDay = $event.getDate();


    this.loadWaitingRoom(true);

  }

  public ngOnDestroy() {
    this.subscriptions.forEach((subs) => {
      subs.unsubscribe();
    })
  }
}
