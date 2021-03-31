import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { VisitDrugDosage } from 'src/app/classes/VisitDrugDosage';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-drug-submitter',
  templateUrl: './drug-submitter.component.html',
  styleUrls: ['./drug-submitter.component.css']
})
export class DrugSubmitterComponent implements OnInit {
  @Input() visitDrugDosages: VisitDrugDosage[] = [];
  public submittedVisitDrugDosage: VisitDrugDosage;
  public submitedQSP: any = {
    name: ""
  };
  // init the form control to set the name of the drug and the dosage required 
  public form: FormGroup = new FormGroup({
    drug: new FormControl("", [
      Validators.required,
      Validators.minLength(3)
    ]),
    dosage: new FormControl("", [
      Validators.required,
      Validators.minLength(3)
    ]),
    unitNumber: new FormControl("", [
      Validators.minLength(3)
    ])
  })
  constructor(private apollo: Apollo , private interactionService : InteractionService) {
    this.submittedVisitDrugDosage = new VisitDrugDosage();
    this.submittedVisitDrugDosage.drug.name = "";
    this.submittedVisitDrugDosage.dosage.name = "";

  }


  public searchDrugFunction: any = (query) => {
    // search drugs based on query name
    return this.apollo.query({
      query: gql`
        {
          searchDrugs (name : "${query}"){
            id name
          }
        }`
    }).pipe(map(value => (<any>value.data).searchDrugs));
  }

  public searchDosageFunction: any = (query) => {
    // search on drug dosage based on the name of the drug 
    // and the name of the drug
    return this.apollo.query({
      query: gql`
        query SEARCH_DOSAGE($drugName : String , $dosage : String){ 
          searchDosages(drugName : $drugName , dosage : $dosage) { 
            id name
          }
        }`,
      variables: {
        drugName: (this.submittedVisitDrugDosage.drug.name) ? (this.submittedVisitDrugDosage.drug.name) : (null),
        dosage: query
      }
    }).pipe(map(value => (<any>value.data).searchDosages))
  }

  public searchQSPFunction: any = (query) => {
    // search for qsp to help the doctor chossing an existing qsp's 
    return this.apollo.query({
      query: gql`
        query SEARCH_QSP ($qsp : String){
          searchQSP(qsp : $qsp) { 
            name
          }
        }` ,
      variables: {
        qsp: query
      }
    }).pipe(map(value => (<any>value.data).searchQSP));
  }
  ngOnInit(): void {
   
  }

  public editVisitDrugDosage($event) { 
    this.submittedVisitDrugDosage  = $event ; 
    this.submitedQSP = { name : $event.qsp } ; 
    this.deleteVisitDrugDosage($event) ;  
    this.interactionService.visitEdited.next() ; 
  }

  public deleteVisitDrugDosage($event) {
    // get the index of the visit drug soage that we want to delete 
    // by comparing every attribute because the if is not defined
    const index = this.visitDrugDosages.findIndex(value =>
      $event.drug.name == value.drug.name &&
      $event.dosage.name == value.dosage.name &&
      $event.unitNumber == value.unitNumber &&
      $event.qsp == value.qsp
    );
    this.visitDrugDosages.splice(index , 1) ; 
    this.interactionService.visitEdited.next() ; 
  
  }
  public add() {
    // whene we add a visit drug dosage to the visit 
    // we must check the form validation first 
    // becuase we are using our custom search input 
    // we need to make the validation this way 
    (<any>this.form.controls.drug).touched = true;
    (<any>this.form.controls.dosage).touched = true;

    this.form.setValue({
      drug: this.submittedVisitDrugDosage.drug.name,
      dosage: this.submittedVisitDrugDosage.dosage.name,
      unitNumber: this.submittedVisitDrugDosage.unitNumber
    });

    this.submittedVisitDrugDosage.qsp = this.submitedQSP.name;
    if (this.form.invalid)
      return;

    this.visitDrugDosages.push(this.submittedVisitDrugDosage);
    this.submittedVisitDrugDosage = new VisitDrugDosage() ; 
    this.submitedQSP = { 
      name : "" 
    }

    this.interactionService.visitEdited.next() ; 

  }
  public clear() {
    this.submittedVisitDrugDosage = new VisitDrugDosage();
  }
}
