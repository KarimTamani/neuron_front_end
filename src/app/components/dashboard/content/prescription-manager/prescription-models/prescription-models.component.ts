import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { PrescriptionModel } from 'src/app/classes/PrescriptionModel';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-prescription-models',
  templateUrl: './prescription-models.component.html',
  styleUrls: ['./prescription-models.component.css']
})
export class PrescriptionModelsComponent implements OnInit {
  public name: string;
  public prescriptionModels: PrescriptionModel[] = [];
  public searchHandler: any = null;
  @Output() useEvent: EventEmitter<PrescriptionModel>;

  constructor(private apollo: Apollo, private router: Router, private interactionService: InteractionService) {
    this.useEvent = new EventEmitter<PrescriptionModel>();
  }

  ngOnInit(): void {
    this.searchPrescriptionModel();

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

  public edit($event) {
    this.router.navigate([], {
      queryParams: {
        "pop-up-window": true,
        "window-page": "prescription-model-submitter",
        "title": "Ajouter un nouvelle model de traitements",
        "prescription-model": decodeURIComponent(JSON.stringify($event))
      }
    });
    const subscription = this.interactionService.editPrescriptionModel.subscribe((prescriptionModel) => {
      const index = this.prescriptionModels.findIndex(value => value.id == prescriptionModel.id);
      this.prescriptionModels.splice(index, 1, prescriptionModel);
      this.useEvent.emit(prescriptionModel);

      subscription.unsubscribe();
    })
  }
  public delete($event) {
    this.router.navigate([], {
      queryParams: {
        "pop-up-window": true,
        "window-page": "yes-no-message",
        "title": "Suppression du modèle de traitement",
        "message": "Voulez vous vraiment supprimer le mode de traitement " + $event.name + " ?"
      }
    });

    const subscription = this.interactionService.yesOrNo.subscribe((response) => {
      if (response) {
        this.apollo.mutate({
          mutation: gql`
            mutation { 
              removePrescriptionModel(prescriptionModelId : ${$event.id})
            }
          `
        }).pipe(map(value => (<any>value.data).removePrescriptionModel)).subscribe((id) => {
          if (id == $event.id) {
            const index = this.prescriptionModels.findIndex(value => value.id == id)
            this.prescriptionModels.splice(index, 1);
            this.useEvent.emit(null);
          }
        })
      }
      subscription.unsubscribe();
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
        "title": "Ajouter un nouveau model de traitements"
      }
    });
    const subscription = this.interactionService.addprescriptionModel.subscribe((prescriptionModel) => {
      this.prescriptionModels.splice(0, 0, prescriptionModel);
      subscription.unsubscribe();
    })

  }



  public search($event) {

    if (this.searchHandler != null)
      clearInterval(this.searchHandler);

    this.searchHandler = setTimeout(() => {
        this.searchPrescriptionModel();
      
    }, 200);

  }
}
