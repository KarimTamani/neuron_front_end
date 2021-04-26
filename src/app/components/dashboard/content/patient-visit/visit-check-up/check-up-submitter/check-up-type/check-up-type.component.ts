import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { CheckUp } from 'src/app/classes/CheckUp';
import { CheckUpType } from 'src/app/classes/CheckUpType';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-check-up-type',
  templateUrl: './check-up-type.component.html',
  styleUrls: ['./check-up-type.component.css']
})
export class CheckUpTypeComponent implements OnInit, OnDestroy {
  @Input() checkUpType: CheckUpType;
  @Input() selectedCheckUps: CheckUp[];
  @Input() controllable: boolean = false;
  @Output() deleteEvent : EventEmitter<CheckUpType> ; 
  public subscriptions: Subscription[] = [];
  public expand: boolean = false;

  constructor(
    private router: Router, 
    private interactionService: InteractionService , 
    private apollo : Apollo) {
      this.deleteEvent = new EventEmitter<CheckUpType>() ; 
  }
  ngOnInit(): void {
    console.log(this.selectedCheckUps) ; 
  }

  public edit() {
    this.router.navigate([], {
      queryParams: {
        "pop-up-window": true,
        "window-page": "check-up-type-submitter",
        "title": "Modifer le type de bilan",
        "check-up-type": encodeURIComponent(JSON.stringify(this.checkUpType))
      }
    });
    const subs = this.interactionService.checkUpTypeEdited.subscribe(data => {
      this.checkUpType.name = data.name;
      subs.unsubscribe();
    })

    this.subscriptions.push(subs);
  }

  public delete() {
 
    this.router.navigate([] , { 
      queryParams :  { 
        "pop-up-window" : true ,
        "window-page" : "yes-no-message" , 
        "message" : "Voulais vous vraiment suprimer le "+this.checkUpType.name , 
        "title" : "Suprission d'un bilan" 
      }
    }); 
    const subs = this.interactionService.yesOrNo.subscribe((response) => {
      if (response) { 
        this.apollo.mutate({
          mutation : gql`
          mutation {   
            removeCheckUpType(checkUpTypeId : ${this.checkUpType.id}) 
          }`
        }).pipe(
          map(value => (<any>value.data).removeCheckUpType)
        ).subscribe((data) => { 
          this.deleteEvent.emit(this.checkUpType) ; 
        })        
      }
      subs.unsubscribe() ; 
    })
    this.subscriptions.push( subs ) ; 
  }

  public ngOnDestroy() {
    this.subscriptions.forEach(subs => subs.unsubscribe());
  }


  public addCheckUp() { 
    this.router.navigate([] , { 
      queryParams : { 
        "pop-up-window" : true , 
        "window-page" : "check-up-submitter" , 
        "title" : "Ajoter un paramétre de bilan" , 
        "check-up-type" : encodeURIComponent(JSON.stringify(this.checkUpType))
      }
    }); 


    const subs = this.interactionService.checkUpCreated.subscribe((checkUp) => { 

      this.checkUpType.checkUps.push(checkUp) ; 
      subs.unsubscribe() ; 
    })

    this.subscriptions.push(subs) ;  
  
  }


  public onCheckUpDeleted($event) { 

    var index = this.checkUpType.checkUps.findIndex(value => value.id == $event.id) ; 
    if ( index >= 0) { 
      this.checkUpType.checkUps.splice(index , 1) ; 
    }
  }
}
