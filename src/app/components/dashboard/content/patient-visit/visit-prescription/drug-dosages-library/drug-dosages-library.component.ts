import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { PrescriptionModel } from 'src/app/classes/PrescriptionModel';

@Component({
  selector: 'app-drug-dosages-library',
  templateUrl: './drug-dosages-library.component.html',
  styleUrls: ['./drug-dosages-library.component.css']
})
export class DrugDosagesLibraryComponent implements OnInit {
  public name : string ; 
  public prescriptionModels : PrescriptionModel[] = [] ; 
  @Output() useEvent : EventEmitter<PrescriptionModel> ; 
  constructor(private apollo : Apollo) { 
    this.useEvent = new EventEmitter<PrescriptionModel>() ;
     }

  ngOnInit(): void {  
    this.searchPrescriptionModel() 
  }

  private searchPrescriptionModel() { 
    this.apollo.query({
      query : gql`
      query SEARCH_PRESCRIPTION_MODEL($name : String){ 
        searchPrescriptionModel(name : $name) {
          id name drugDosages {
            id drug {id name} dosage { id name } qsp unitNumber
          }
        }
      }` , variables : { 
        name : this.name 
      }
    }).pipe(map(value => (<any>value.data).searchPrescriptionModel )).subscribe(data => { 
      this.prescriptionModels = data ; 
     })
  }

  public use($event) {  
    this.useEvent.emit($event) ; 
  }
}

