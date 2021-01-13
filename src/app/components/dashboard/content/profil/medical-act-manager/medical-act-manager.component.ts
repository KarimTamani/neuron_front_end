import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { MedicalAct } from 'src/app/classes/MedicalAct';
import { map } from 'rxjs/operators';
import { InteractionService } from 'src/app/services/interaction.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-medical-act-manager',
  templateUrl: './medical-act-manager.component.html',
  styleUrls: ['./medical-act-manager.component.css']
})
export class MedicalActManagerComponent implements OnInit {
  public medicalActs: MedicalAct[] = [];
  constructor(private apollo: Apollo, private interactionService: InteractionService, private router: Router) { }

  ngOnInit(): void {
    this.apollo.query({
      query: gql`
      { 
        getAllMedicalActs { 
          id 
          name 
          price 
          createdAt 
          updatedAt 
        }
      }
      `
    }).pipe(map(value => (<any>value.data).getAllMedicalActs)).subscribe((data) => {
      this.medicalActs = data;
    });
    this.interactionService.medicalActCreated.subscribe((medicalAct) => {
      this.medicalActs.splice(0, 0, medicalAct);
    })
  }



  public openEdit(medicalAct) {
    // open the medical act submitter with the medical act that we want to edit 
    this.router.navigate([], {
      queryParams:
      {
        'pop-up-window': true,
        'window-page': 'medical-act-submitter' , 
        'medical-act' : JSON.stringify(medicalAct) 
      }
    });
    // subscribe to the medical act editing subject 
    // and when the editing is done update the medical acts list 
    const subscription = this.interactionService.medicalActEdited.subscribe((medicalAct) => {
      const index = this.medicalActs.findIndex(value => value.id ==medicalAct.id) ; 
      console.log(index) ; 
      this.medicalActs[index] = medicalAct ; 
      console.log(this.medicalActs[index]) ; 
      subscription.unsubscribe() ; 
    })
  }

  public openDelete(medicalAct) {
    this.router.navigate([], {
      queryParams:
      {
        'pop-up-window': true,
        'window-page': 'yes-no-message' , 
        "message" : `Voulais vous vraiment suprimer lacte medical ${medicalAct.name} ?`
      }
    });
    const subscription = this.interactionService.yesOrNo.subscribe((response) => {
      // if the doctor realy want to remove the medical act 
      if (response == true) {
        this.apollo.mutate({
          mutation : gql`
            mutation {
              removeMedicalAct(medicalActId : ${medicalAct.id})
            }
          `
        }).pipe(map(value => (<any>value.data).removeMedicalAct)).subscribe((id) => {
          // get the index of the deleted medicl act and remove it from the medical acts array
          const index = this.medicalActs.findIndex(value => value.id == id) ; 
          this.medicalActs.splice(index , 1) ; 
        })
      }
      // remove subscription 
      subscription.unsubscribe();
    })
  }

}
