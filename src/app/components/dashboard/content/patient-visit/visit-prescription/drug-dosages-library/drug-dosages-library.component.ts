import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { PrescriptionModel } from 'src/app/classes/PrescriptionModel';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-drug-dosages-library',
  templateUrl: './drug-dosages-library.component.html',
  styleUrls: ['./drug-dosages-library.component.css']
})
export class DrugDosagesLibraryComponent implements OnInit {
  public name: string;
  public prescriptionModels: PrescriptionModel[] = [];
  @Output() useEvent: EventEmitter<PrescriptionModel>;
  constructor(private apollo: Apollo, private router: Router, private interactionService: InteractionService) {
    this.useEvent = new EventEmitter<PrescriptionModel>();
  }

  ngOnInit(): void {
    this.searchPrescriptionModel()
  }

  private searchPrescriptionModel() {
    this.apollo.query({
      query: gql`
      query SEARCH_PRESCRIPTION_MODEL($name : String){ 
        searchPrescriptionModel(name : $name) {
          id name drugDosages {
            id drug {id name} dosage { id name } qsp unitNumber
          }
        }
      }` , variables: {
        name: this.name
      }
    }).pipe(map(value => (<any>value.data).searchPrescriptionModel)).subscribe(data => {
      this.prescriptionModels = data;
    })
  }

  public use($event) {
    this.useEvent.emit($event);
  }

  public openSubmitter() {
    this.router.navigate([], {
      queryParams: {
        "pop-up-window": true,
        "window-page": "prescription-model-submitter",
        "title": "Ajouter un nouveau modèle de traitements"
      }
    });
    const subscription = this.interactionService.addprescriptionModel.subscribe((prescriptionModel) => {
      this.prescriptionModels.splice(0, 0, prescriptionModel);
      subscription.unsubscribe();
    })
  }

}

