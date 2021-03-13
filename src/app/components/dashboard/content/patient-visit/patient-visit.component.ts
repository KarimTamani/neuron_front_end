import { Component, OnDestroy, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Visit } from 'src/app/classes/Visit';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Condition } from 'src/app/classes/Condition';
import { VitalSetting } from 'src/app/classes/VitalSetting';
import { InteractionService } from 'src/app/services/interaction.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-patient-visit',
  templateUrl: './patient-visit.component.html',
  styleUrls: ['./patient-visit.component.css']
})
export class PatientVisitComponent implements OnInit, OnDestroy {
  public page: number = 4;
  public visit: Visit;
  public subscriptions: Subscription[] = [];
  constructor(private apollo: Apollo, private interactionServide: InteractionService) {
    this.visit = new Visit();
  }
  ngOnInit(): void {
    this.apollo.query({
      query: gql`
      { 
        getCurrentVisit {
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
          checkUps {
            id name checkUpType { id name }
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
      if (data)
        this.visit = data;
      this.initVisit();
    });

    this.subscriptions.push(this.interactionServide.newAppointmentAdded.subscribe((data) => {
      this.visit.appointment = data;
    }));
  }

  private initVisit() {
    if (this.visit.condition == null)
      this.visit.condition = new Condition();
    if (this.visit.visitDrugDosages == null)
      this.visit.visitDrugDosages = [];
    if (this.visit.vitalSetting == null)
      this.visit.vitalSetting = new VitalSetting();
    if (this.visit.medicalActs == null)
      this.visit.medicalActs = [];
    if (this.visit.symptoms == null)
      this.visit.symptoms = [];
    if (this.visit.checkUps == null)
      this.visit.checkUps = [];
  }
  select($event) {
    this.page = $event;
  }


  public visitSelected($event) {
    this.visit = $event;
    this.initVisit();
  }


  public ngOnDestroy() {
    this.subscriptions.forEach((subs) => {
      subs.unsubscribe();
    })
  }
}
