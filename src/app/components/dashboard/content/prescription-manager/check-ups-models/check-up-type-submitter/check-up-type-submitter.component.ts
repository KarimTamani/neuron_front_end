import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
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
  @Output() closeEvent : EventEmitter<CheckUpType> ; 

  constructor(
    private apollo : Apollo , 
    private interactionService : InteractionService , 
    private route : ActivatedRoute) {
    this.closeEvent = new EventEmitter<CheckUpType>() ; 

  }

  ngOnInit(): void {
    var params = this.route.snapshot.queryParams ; 

    if (params["check-up-type"]) { 
      this.checkUpType = JSON.parse(decodeURIComponent(params["check-up-type"])) ; 
      console.log(this.checkUpType) ; 
    }else { 
      this.checkUpType = new CheckUpType() ; 
    }
  
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


}
