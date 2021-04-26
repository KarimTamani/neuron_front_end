import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { CheckUp } from 'src/app/classes/CheckUp';
import { CheckUpType } from 'src/app/classes/CheckUpType';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-check-up-type-submitter',
  templateUrl: './check-up-type-submitter.component.html',
  styleUrls: ['./check-up-type-submitter.component.css']
})
export class CheckUpTypeSubmitterComponent implements OnInit {
  public form : FormGroup = new FormGroup({
    name : new FormControl("" , [
      Validators.required , 
      Validators.minLength(3)
    ])
  }); 
  public checkUpType : CheckUpType ; 
  public checkUp : CheckUp ; 
  @Input() type : string = "check-up-type" ; 

  @Output() closeEvent : EventEmitter<CheckUpType> ; 

  constructor(
    private apollo : Apollo , 
    private interactionService : InteractionService , 
    private route : ActivatedRoute) {
    this.closeEvent = new EventEmitter<CheckUpType>() ; 

  }

  ngOnInit(): void {
    var params = this.route.snapshot.queryParams ; 
    if (params["check-up-type"])  
      this.checkUpType = JSON.parse(decodeURIComponent(params["check-up-type"])) ; 
    else  
      this.checkUpType = new CheckUpType() ; 
    if (params["check-up"] )  
      this.checkUp = JSON.parse(decodeURIComponent(params["check-up"])) ;
    else 
      this.checkUp = new CheckUp() ; 
   
  }


  public add() { 
    this.apollo.mutate({
      mutation : gql`
      
        mutation {
          addCheckUpType(checkUpType: { name : "${this.form.value.name}"}) {
            id name isPublic 
          }
        }
      `
    }).pipe(
      map(value => (<any>value.data).addCheckUpType)
    ).subscribe((data) => { 
      data.checkUps = [] ; 
      this.interactionService.checkUpTypeCreated.next(data) ; 
      this.closeEvent.emit() ; 
    })
  }

  public edit() { 
    this.apollo.mutate({
      mutation : gql`
      
        mutation {
          editCheckUpType(checkUpTypeId : ${this.checkUpType.id} , checkUpType: { name : "${this.form.value.name}"}) 
        }
      `
    }).pipe(
      map(value => (<any>value.data).addCheckUpType)
    ).subscribe((data) => { 
      this.interactionService.checkUpTypeEdited.next(this.checkUpType) ; 
      this.closeEvent.emit() ; 
    })
  }

  public addCheckUp() { 
    this.apollo.mutate({
      mutation : gql`
        mutation {
          addCheckUp(checkUp : {name : "${this.form.value.name}" , checkUpTypeId : ${this.checkUpType.id}}) {
            id name isPublic checkUpTypeId 
          }
        }`
    }).pipe(
      map(value => (<any>value.data).addCheckUp)
    ).subscribe((data) => { 
      
      this.checkUp = data ; 
      this.checkUp.checkUpType = this.checkUpType ; 
      this.interactionService.checkUpCreated.next(this.checkUp) ; 
      this.closeEvent.emit() ; 
    })
  }

  public editCheckUp() {  
    this.apollo.mutate({
      mutation : gql`
        mutation {
          editCheckUp(checkUpId : ${this.checkUp.id} , checkUp : { name : "${this.form.value.name}" , checkUpTypeId : ${this.checkUp.checkUpTypeId}}) 
        }
      `
    }).pipe(map(value => (<any>value.data).editCheckUp)).subscribe((data) => { 
      this.interactionService.checkUpEdited.next(this.checkUp) ; 
      this.closeEvent.emit() ; 
    })
  }


}
