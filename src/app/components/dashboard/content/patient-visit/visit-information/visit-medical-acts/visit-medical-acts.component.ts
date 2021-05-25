import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { MedicalAct } from 'src/app/classes/MedicalAct';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-visit-medical-acts',
  templateUrl: './visit-medical-acts.component.html',
  styleUrls: ['./visit-medical-acts.component.css']
})
export class VisitMedicalActsComponent implements OnInit , OnDestroy{
  public medicalActs: MedicalAct[] = [];
  @Input() selectedMedicalActs: MedicalAct[] = [];
  @Input() active : boolean = false ;
  @Input() valid : boolean = true ; 
  public totalPrice: number = 0;
  public subscriptions : Subscription[] = [] ;  
  constructor(
    private apollo: Apollo , 
    private interactionService : InteractionService , 
    private router : Router) { }

  ngOnInit(): void {
    this.apollo.query({
      query: gql`
        { 
          getAllMedicalActs {
            id name price
          }
        }
      `
    }).pipe(map(value => (<any>value.data).getAllMedicalActs)).subscribe((data) => {
      this.medicalActs = data;
      // calculate the total price of the visit 
      this.totalPrice = 0;
      this.selectedMedicalActs.forEach((act) => {
        this.totalPrice += act.price;
      })
    })

    this.subscriptions.push(
      this.interactionService.medicalActCreated.subscribe((medicalAct) => { 
        this.medicalActs.push(medicalAct) ; 
        this.selectedMedicalActs.push(medicalAct) ; 
      })
    )

  }

  public selectMedicalAct(medicalAct) {
    // if the medical act is allready selected remove it 
    // else push it 
    let index = this.selectedMedicalActs.findIndex(value => value.id == medicalAct.id);
    if (index >= 0) {
      this.selectedMedicalActs.splice(index, 1);
    } else
      this.selectedMedicalActs.push(medicalAct);
    // calculate the total price of the visit 
    this.totalPrice = 0;
    this.selectedMedicalActs.forEach((act) => {
      this.totalPrice += act.price;
    }); 

    this.interactionService.visitEdited.next() ; 
    if (this.medicalActs.length ==0) { 
      this.valid = false ; 
    } else { 
      this.valid = true ; 
    }
  }

  public isMedicalActSelected(medicalAct) {
    let index = this.selectedMedicalActs.findIndex(value => value.id == medicalAct.id);
    return index >= 0;
  }


  public open()  { 
    var medicalAct = new MedicalAct();
    medicalAct.name = "Consultation";

    this.router.navigate([], {
      queryParams:
      {
        'pop-up-window': true,
        'window-page': 'medical-act-submitter',
        'medical-act': encodeURIComponent( JSON.stringify(medicalAct) ) ,
        "title": "Ajouter au moins un Acte médicale"
      }
    });
  }


  public ngOnDestroy() { 
    this.subscriptions.forEach(subs => subs.unsubscribe()) 
  }
}
