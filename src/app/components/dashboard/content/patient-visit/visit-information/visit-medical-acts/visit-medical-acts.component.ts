import { Component, OnInit, Input } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { MedicalAct } from 'src/app/classes/MedicalAct';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-visit-medical-acts',
  templateUrl: './visit-medical-acts.component.html',
  styleUrls: ['./visit-medical-acts.component.css']
})
export class VisitMedicalActsComponent implements OnInit {
  public medicalActs: MedicalAct[] = [];
  @Input() selectedMedicalActs: MedicalAct[] = [];
  @Input() active : boolean = false ;
  @Input() valid : boolean = true ; 
  public totalPrice: number = 0;
  constructor(private apollo: Apollo , private interactionService : InteractionService) { }

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

}
