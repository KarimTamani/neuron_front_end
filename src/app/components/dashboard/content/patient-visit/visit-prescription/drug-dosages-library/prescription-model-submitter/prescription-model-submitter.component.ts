import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { PrescriptionModel } from 'src/app/classes/PrescriptionModel';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-prescription-model-submitter',
  templateUrl: './prescription-model-submitter.component.html',
  styleUrls: ['./prescription-model-submitter.component.css']
})
export class PrescriptionModelSubmitterComponent implements OnInit {
  @Output() closeEvent: EventEmitter<null>;
  public prescriptionModel: PrescriptionModel;
  public isEdit : boolean = false ; 
  constructor(private apollo: Apollo, private interactionService: InteractionService, private route : ActivatedRoute) {
    this.prescriptionModel = new PrescriptionModel();
    this.closeEvent = new EventEmitter<null>();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => { 
      
      if (params["prescription-model"]) { 
        this.prescriptionModel = JSON.parse( decodeURIComponent(params["prescription-model"]) ) ; 
        this.isEdit = true ; 
      }
    })

  }
  public add() {
    this.apollo.query({
      query: gql`
        mutation ADD_PRESCRIPTION_MODEL($prescriptionModel : PrescriptionModelInput!) { 
          addPrescriptionModel(prescriptionModel : $prescriptionModel) { 
            id name drugDosages {
              id drug { id name } dosage { id name } qsp unitNumber 
            }
          }
        }
      `, variables: {
        prescriptionModel:{ 
          name : this.prescriptionModel.name , 
          drugDosages : this.prescriptionModel.drugDosages.map(function(drugDosage) { 
            return {
              drug : { 
                name : drugDosage.drug.name , 
              } , 
              dosage : { 
                name : drugDosage.dosage.name 
              }, 
              unitNumber : drugDosage.unitNumber , 
              qsp : drugDosage.qsp 
            }
          })
        } 
      }
    }).pipe(map(value => (<any>value.data).addPrescriptionModel)).subscribe((data) => {
      this.prescriptionModel = data;
      this.interactionService.addprescriptionModel.next(this.prescriptionModel);
      this.closeEvent.emit();
    })
  }

  public edit() { 
    this.apollo.query({
      query: gql`
        mutation EDIT_PRESCRIPTION_MODEL($prescriptionModel : PrescriptionModelInput!) { 
          editPrescriptionModel(prescriptionModelId : ${this.prescriptionModel.id} , prescriptionModel : $prescriptionModel) 
        }
      `, variables: {
        prescriptionModel:{ 
          name : this.prescriptionModel.name , 
          drugDosages : this.prescriptionModel.drugDosages.map(function(drugDosage) { 
            return {
              drug : { 
                name : drugDosage.drug.name , 
              } , 
              dosage : { 
                name : drugDosage.dosage.name 
              }, 
              unitNumber : drugDosage.unitNumber , 
              qsp : drugDosage.qsp 
            }
          })
        } 
      }
    }).pipe(map(value => (<any>value.data).addPrescriptionModel)).subscribe((data) => {
      
      this.interactionService.editPrescriptionModel.next(this.prescriptionModel);
      this.closeEvent.emit();
    })
    
  }

}
