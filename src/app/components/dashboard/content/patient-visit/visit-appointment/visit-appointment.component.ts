import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Appointment } from 'src/app/classes/Appointment';
import { Visit } from 'src/app/classes/Visit';
import { DataService } from 'src/app/services/data.service';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-visit-appointment',
  templateUrl: './visit-appointment.component.html',
  styleUrls: ['./visit-appointment.component.css']
})
export class VisitAppointmentComponent implements OnInit {
  public visit: Visit;
  public currentDate: string = "";
  @Output() closeEvent: EventEmitter<null>;

  public form: FormGroup = new FormGroup({
    date: new FormControl("", [
      Validators.required,
      this.futureValidator(this)
    ]),
  });

  public minutes: string[] = [];
  public hours: string[] = [];

  public selectedHour : string = null ; 
  public selectedMinute : string = null ; 


  constructor(private route: ActivatedRoute, private interactionService: InteractionService, private apollo: Apollo, private dataService: DataService) {
    this.closeEvent = new EventEmitter<null>();
    // init minutes 
    for (let index = 0; index < 4; index++) {
      var minute: any = index * 15
      if (minute == 0)
        minute = "00";
      else 
        minute = "" + minute ; 
      this.minutes.push(minute) ; 
    }
    // init hours  
    for (let hour = 8 ; hour < 20 ; hour ++) { 
      if ( hour < 10) { 
        this.hours.push("0" + hour) ; 
      }else {
        this.hours.push("" + hour) ; 
      }
    }
  }

  ngOnInit(): void {

    this.route.queryParams.subscribe((params) => {
      if (params["visit"]) {
        this.visit = JSON.parse(decodeURIComponent(params["visit"]))
        if (this.visit.appointment == null) { 
          this.visit.appointment = new Appointment();
        }else { 
          if (this.visit.appointment.time) { 
            this.selectedHour = this.visit.appointment.time.split(":")[0] ;
            this.selectedMinute = this.visit.appointment.time.split(":")[1] ;
          }
        }
      }
    });
    this.apollo.query({
      query: gql`{ 
          getCurrentDate
        }`
    }).pipe(map(value => (<any>value.data).getCurrentDate)).subscribe((data) => {
      this.currentDate = this.dataService.castDateYMD(data);
    })
  }


  public submit() {
    this.interactionService.newAppointmentAdded.next(<any>{
      date: this.form.value.date,
      time: (this.selectedHour) ? (`${this.selectedHour}:${this.selectedMinute}`) : (null)
    });
    this.closeEvent.emit();
    
  }

  public hourChanged() { 
    this.selectedMinute = "00" ; 
  }


  public clear() {


    this.closeEvent.emit()  ;
    this.interactionService.clearAppointment.next(this.visit.appointment) ; 
    this.form.value.date = null ; 
    this.visit.appointment.date = null ; 
    this.selectedMinute = null ; 
    this.selectedHour = null ; 
    
  }


  private futureValidator(visitAppointment): any {
    return (formControl: FormControl) => {
      let date = formControl.value;
      date = visitAppointment.dataService.castDateYMD(date);
      if (visitAppointment.currentDate > date) {

        return {
          future: {
            date: date
          }
        }
      }
      return null;
    }
  }
}
