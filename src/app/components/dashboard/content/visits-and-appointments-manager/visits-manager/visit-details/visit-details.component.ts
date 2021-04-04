import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Visit } from 'src/app/classes/Visit';

@Component({
  selector: 'app-visit-details',
  templateUrl: './visit-details.component.html',
  styleUrls: ['./visit-details.component.css']
})
export class VisitDetailsComponent implements OnInit {
  @Input() visitId: number;
  public visit : Visit ; 
  public totalPrice : number = 0 ; 
  public moreDetails : boolean = true  ; 
   
  constructor(private route: ActivatedRoute, private apollo: Apollo) {

  }

  ngOnInit(): void {


    var params = this.route.snapshot.queryParams;
    if (params["visit-id"])
      this.visitId = parseInt(params["visit-id"]);

    this.apollo.query({
      query: gql`
          { 
            getVisit(visitId : ${this.visitId}) { 
              id
              waitingRoom {
                id
                date
              }
              appointment { 
                id date time 
              }
              waitingRoomId 
              arrivalTime
              status
              startTime 
              endTime 
              clinicalExam
              order 
              payedMoney 
              createdAt 
              updatedAt
              condition {
                id name
              }
              debt 
              medicalActs {
                id name price 
              }
              symptoms {
                id name bodyPartId
              }
              checkUps { id name checkUpTypeId }
              certificats { id html certificatModel { id type title}}
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
              visitDrugDosages {
                dosage { name } drug { name } qsp unitNumber 
              }
              medicalFile {
                id
                birthday
                name 
                lastname 
                phone
                gender
                profession { 
                  id name 
                }
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
    }).pipe(map(value => (<any>value.data).getVisit)).subscribe((data) => { 
      this.visit = data ;  
      if ( this.visit.medicalActs ) 
        this.visit.medicalActs.forEach(act => { 
          this.totalPrice += act.price ;
        })
    })
  }
}
