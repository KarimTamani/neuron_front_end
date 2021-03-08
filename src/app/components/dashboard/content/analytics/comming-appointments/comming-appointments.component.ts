import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Appointment } from 'src/app/classes/Appointment';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-comming-appointments',
  templateUrl: './comming-appointments.component.html',
  styleUrls: ['./comming-appointments.component.css']
})
export class CommingAppointmentsComponent implements OnInit {

  public appointments : Appointment[] = []
  constructor(private apollo : Apollo , private dataService : DataService) { }

  ngOnInit(): void {
    
    this.apollo.query({
      query : gql`
        {
          getCurrentDate
        }
      `
    }).pipe(map(value => (<any>value.data).getCurrentDate)).subscribe((data) => { 
      const currentDate = this.dataService.castDateYMD(data)  ;

      this.apollo.query({
        query : gql`
          {
            searchAppointments(startDate : "${currentDate}") { 
              rows {
                date 
                time 
                visit {
                  medicalFile {
                    id 
                    name 
                    lastname 
                    gender 
                    birthday
                    phone 
                    email
                  }
                }
              }
            }
          }`
      }).pipe(map( value => (<any>value.data).searchAppointments.rows)).subscribe((data) => { 
        this.appointments = data ; 
        console.log(this.appointments) ; 
      })
    })
  }

}
