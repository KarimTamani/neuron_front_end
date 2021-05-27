import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Appointment } from 'src/app/classes/Appointment';
import { DataService } from 'src/app/services/data.service';
import { InteractionService } from 'src/app/services/interaction.service';
import { VirtualAssistantService } from 'src/app/services/virtual-assistant-service';
import { AppointmentComponent } from '../../waiting-room/appointments-loader/appointment/appointment.component';

@Component({
  selector: 'app-rdvmanager',
  templateUrl: './rdvmanager.component.html',
  styleUrls: ['./rdvmanager.component.css']
})
export class RDVManagerComponent implements OnInit, OnDestroy {
  public offset: number = 0;
  public limit: number = 20;

  public count: number = 0;
  public appointments: Appointment[] = [];

  public startDate: string;
  public lastSearch: any = {};

  public status : string[] = [] ; 
  public subscription : Subscription[] = [] ; 
  constructor(
    private apollo: Apollo,
    private dataService: DataService,
    private virtualAssistantService: VirtualAssistantService,
    private interactionService : InteractionService , 
    private zone: NgZone, 
    private router : Router) { }

  ngOnInit(): void { 
    this.virtualAssistantService.onVACommand.subscribe((data) => {
      if (data.component == "VISITS-AND-APPOINTMENTS-MANAGER") {
        if (data.query && data.query.trim().length > 0) {
          this.zone.run(() => {

            this.search({
              searchQuery: data.query
            });
       
          })
        }
      }
    })
    // get the current date and time
    this.apollo.query({
      query: gql`
        { 
          getCurrentDate 
        }
      `
    }).pipe(map(value => (<any>value.data).getCurrentDate)).subscribe(data => {
      // load the appointments starting from the date of today 
      this.startDate = this.dataService.castDateYMD(data);

      this.loadAppointments(
        null,
        this.dataService.castDateYMD(data),
        null,
        this.offset,
        this.limit
      )
    }) ; 


    this.subscription.push( this.interactionService.clearAppointment.subscribe((appointment) => { 
 
      this.router.navigate([] , { 
        queryParams : { 
          "pop-up-window" : true , 
          "window-page" : "yes-no-message" , 
          "title" : "Suppression de rendez-vous" , 
          "message" : `Vous souhaitez supprimer le rendez-vous de ${appointment.visit.medicalFile.name} ${appointment.visit.medicalFile.lastname} ?`
        }
      })
      const subs = this.interactionService.yesOrNo.subscribe((response) => { 
        if (response) { 
          this.apollo.mutate({ 
            mutation : gql`
              mutation { 
                removeAppointment(appointmentId : ${appointment.id}) 
              }
            `
          }).pipe(map(value => (<any>value.data).removeAppointment)).subscribe((data) => { 
            const index = this.appointments.findIndex(value => value.id == appointment.id) ; 
            this.appointments.splice(index , 1) ; 
          })
        }
        subs.unsubscribe() ; 
      }) 

      this.subscription.push(subs) ; 
    }))
    
  }

  private loadAppointments(searchQuery = null, startDate = null, endDate = null, offset = null, limit = null) {

    this.apollo.query({
      query: gql`
        query SEARCH_APPOINTMENT($searchQuery : String , $startDate : String , $endDate : String , $offset : Int , $limit : Int){
          searchAppointments(
            searchQuery : $searchQuery , 
            startDate : $startDate , 
            endDate : $endDate , 
            offset : $offset , 
            limit : $limit 
          ) { 
            rows {
              id date time 
                visit {
                  id 
                  createdAt , 
                  medicalFile {
                    id name lastname birthday phone email
                  }
                }
              }
            
            count 
          }
        }`,
      variables: {
        searchQuery: searchQuery,
        startDate: startDate,
        endDate: endDate,
        offset: offset,
        limit: limit
      }
    }).pipe(map(value => (<any>value.data).searchAppointments)).subscribe((data) => {
      this.count = data.count;
      for (let index = 0; index < data.rows.length; index++) {
        data.rows[index].visit.createdAt = this.dataService.castDateYMD(new Date(parseInt(data.rows[index].visit.createdAt)).toISOString())
        data.rows[index].visit.createdAt = this.dataService.castFRDate(new Date(data.rows[index].visit.createdAt)) ; 
        data.rows[index].visit.medicalFile.birthday = this.dataService.castFRDate(new Date(data.rows[index].visit.medicalFile.birthday)) ; 
      }
      this.appointments = data.rows;
    })
  }
  public search($event) {
    this.offset = 0;
    this.lastSearch = $event;
    this.loadAppointments(
      $event.searchQuery,
      $event.startDate,
      $event.endDate,
      this.offset,
      this.limit
    )
  }
  public selectPage($event) {
    this.offset = $event;
    this.loadAppointments(
      this.lastSearch.searchQuery,
      this.lastSearch.startDate,
      this.lastSearch.endDate,
      this.offset,
      this.limit
    );
  }

  public castFrDate(date) { 
    return this.dataService.castFRDate(new Date(date)) ; 
  }
  public editAppointment(appointment) { 
    var visit = JSON.parse(JSON.stringify(appointment.visit)); 
    visit.appointment = appointment ; 

    this.router.navigate([] , {
      queryParams : { 
        "pop-up-window" : true , 
        "title" : "Modifier le Rendez-vous" , 
        "window-page" : "visit-appointment" , 
        "visit" : encodeURIComponent(JSON.stringify(visit))
      }
    })
    const subs =  this.interactionService.newAppointmentAdded.subscribe((app) => { 
      appointment.date = app.date ; 
      appointment.time = app.time ; 

      this.apollo.mutate({
        mutation: gql`
          mutation ADD_APPOINTMENT($appointment : AppointmentInput){ 
            addAppointment(appointment : $appointment) { 
              id date time 
            }
          }
        ` , variables: {
          appointment: {
            visitId: visit.id,
            date: appointment.date,
            time: (appointment.time) ? (appointment.time) : (null)
          }
        }
      }).pipe(map(value => (<any>value.data).addAppointment)).subscribe(() => { 

      })
  
    })  ; 
    this.subscription.push(subs) ; 
  }

  public ngOnDestroy() { 
    this.subscription.forEach(subs => { 
      subs.unsubscribe() ; 
    }) 
  }
}
