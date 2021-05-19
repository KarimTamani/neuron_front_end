import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Assistant } from 'src/app/classes/Assistant';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-assistant-submitter',
  templateUrl: './assistant-submitter.component.html',
  styleUrls: ['./assistant-submitter.component.css']
})
export class AssistantSubmitterComponent implements OnInit {
  // form validation for doctor signup 
  public form: FormGroup = new FormGroup({
    name: new FormControl("", [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(20)
    ]),
    lastname: new FormControl("", [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(20)
    ]),
    email: new FormControl("", [
      Validators.email
    ]),
    phone: new FormControl("", [
      Validators.required,
      Validators.pattern(/^(00213|\+213|0)(5|6|7)[0-9]{8}$/)
    ]) , 
    password : new FormControl("" , [
      Validators.required , 
      Validators.minLength(7),
      Validators.maxLength(20)
    ]) , 
    confirmPassword : new FormControl("" , [
      Validators.required  , 
      Validators.minLength(7),
      Validators.maxLength(20)
    ])
  }, { validators: this.ConfirmedValidator("password", "confirmPassword") });
  // init assistant 
  public assistant : Assistant ;
  @Output() closeEvent : EventEmitter<null> ; 
  constructor(private apollo : Apollo , private interactionSerice : InteractionService) {
    this.assistant = new Assistant() ; 
    this.closeEvent = new EventEmitter<null>() ; 
  }
  ngOnInit(): void {
  }
  public submit() {
    this.apollo.mutate({
      mutation : gql`
      mutation {
        addAssistant(
          assistant : {
            name : "${this.form.value.name}" , 
            lastname : "${this.form.value.lastname}" , 
            phone : "${this.form.value.phone}" , 
            email :  "${this.form.value.email}" , 
            password : "${this.form.value.password}" , 
            confirmPassword : "${this.form.value.confirmPassword}" , 
            gender : ${this.assistant.gender}
          }
        ){id , name , lastname , phone ,gender , email }
      }
      `
    }).pipe(map(value  => (<any>value.data).addAssistant)).subscribe((data) => {
      this.interactionSerice.assistantCreated.next(data) ; 
      this.closeEvent.emit() ; 
    })
  }
  // password confirmation validation 
  public ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup): any => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }
}
