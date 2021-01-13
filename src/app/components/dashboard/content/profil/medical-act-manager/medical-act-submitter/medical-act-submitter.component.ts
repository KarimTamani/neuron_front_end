import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { InteractionService } from 'src/app/services/interaction.service';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { MedicalAct } from 'src/app/classes/MedicalAct';

@Component({
  selector: 'app-medical-act-submitter',
  templateUrl: './medical-act-submitter.component.html',
  styleUrls: ['./medical-act-submitter.component.css']
})
export class MedicalActSubmitterComponent implements OnInit {
  public form: FormGroup = new FormGroup({
    name: new FormControl("", [
      Validators.required,
      Validators.minLength(3)
    ]),
    price: new FormControl(0, [
      Validators.required,
      this.numericAndPositive
    ])
  });
  @Output() closeEvent: EventEmitter<null>;
  public medicalAct: MedicalAct;
  public edit: boolean = false;

  constructor(private apollo: Apollo, private interactionService: InteractionService, private route: ActivatedRoute) {
    this.closeEvent = new EventEmitter<null>();
    this.medicalAct = new MedicalAct();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      var medicalAct = params["medical-act"];

      if (medicalAct) {
        // set the init medical act 
        // and set the edit to true  
        this.medicalAct = JSON.parse(medicalAct);
        this.edit = true;
      }
    })
  }

  submit() {
    if (!this.edit) {
      this.apollo.mutate({
        mutation: gql`
      mutation { 
        addMedicalAct(
          medicalAct : {
            name : "${this.form.value.name}" , 
            price : ${this.form.value.price}
          }
        ) { 
          id name price createdAt updatedAt
        }
      }
      `
      }).pipe(map(value => (<any>value.data).addMedicalAct)).subscribe((data) => {
        this.interactionService.medicalActCreated.next(data);
        this.closeEvent.emit();
      })
    } else {
      this.apollo.mutate({
        mutation: gql`
        
          mutation { 
            editMedicalAct(
              medicalActId : ${this.medicalAct.id} , 
              medicalAct : {
                name :  "${this.medicalAct.name}"  
                price : ${this.medicalAct.price}
              }
            ) 
          }
        `
      }).pipe(map(value => (<any>value.data).editMedicalAct)).subscribe((id) => {
        this.interactionService.medicalActEdited.next(this.medicalAct) ; 
        this.closeEvent.emit() ; 
      })
    }
  }


  private numericAndPositive(formControl: FormControl): ValidatorFn {
    let value = formControl.value;
    if (value == null)
      return null;
    if (!value.toString().match(/^[0-9]/) || (parseInt(value) <= 0))
      return <any>{
        "invalidNumber": true
      }
    return null;
  }
}
