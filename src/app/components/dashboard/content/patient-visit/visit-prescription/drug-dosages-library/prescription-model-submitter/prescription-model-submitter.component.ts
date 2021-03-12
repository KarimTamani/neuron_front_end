import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  constructor(private apollo: Apollo, private interactionService: InteractionService) {
    this.prescriptionModel = new PrescriptionModel();
    this.closeEvent = new EventEmitter<null>();
  }

  ngOnInit(): void {


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

}
