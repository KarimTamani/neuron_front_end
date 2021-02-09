import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Visit } from 'src/app/classes/Visit';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-patient-visit',
  templateUrl: './patient-visit.component.html',
  styleUrls: ['./patient-visit.component.css']
})
export class PatientVisitComponent implements OnInit {
  public page : number = 1 ; 
  public visit : Visit ; 
  constructor(private apollo : Apollo) {}
  ngOnInit(): void {


    this.apollo.query({
      query : gql`
      { 
        getCurrentVisit {
          id
          waitingRoom {
            id
            date
          }
          waitingRoomId 
          arrivalTime
          status
          startTime 
          endTime 
          order 
          payedMoney 
          debt 
          medicalActs {
            id name price 
          }
          symptoms {
            id name bodyPartId
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
          medicalFile {
            id
            birthday
            name 
            lastname 
            phone
            gender
            email
            address {
              id
              commune {
                name 
                wilaya {
                  id name 
                }
              }
            },
            antecedents { id name type}  
          }
        }
      }`
    }).pipe(map(value => (<any>value.data).getCurrentVisit)).subscribe((data) => { 
      this.visit = data ; 
    })
  }
  
  select($event) { 
    this.page = $event ; 
  }
}
