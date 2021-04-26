import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { CheckUpType } from 'src/app/classes/CheckUpType';
import { Visit } from 'src/app/classes/Visit';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-check-ups-models',
  templateUrl: './check-ups-models.component.html',
  styleUrls: ['./check-ups-models.component.css']
})
export class CheckUpsModelsComponent implements OnInit , OnDestroy{
  @Input() checkUpTypes : CheckUpType[] = [] ; 
  public subscriptions : Subscription[] = [] ;  
  @Input() visit : Visit ; 

  constructor(private apollo : Apollo , private router : Router, private interactionService : InteractionService) {}
  
  ngOnInit(): void {
    
    
  }


  public openSubmitter() { 
    this.router.navigate([] , { 
      queryParams : { 
        "pop-up-window" : true , 
        "window-page": "check-up-type-submitter" , 
        "title" : "Ajouter un type de bilan" 
      }
    }) ; 
    const subs = this.interactionService.checkUpTypeCreated.subscribe((data) => { 
      this.checkUpTypes.push(data) ; 
      subs.unsubscribe() ; 
    })
    this.subscriptions.push(subs) ; 
  }

  public ngOnDestroy() { 
    this.subscriptions.forEach(subs => subs.unsubscribe()) ; 
  }

  public delete($event) { 
    var index = this.checkUpTypes.findIndex( value => value.id == $event.id) ; 
    if (index >= 0) { 
      this.checkUpTypes.splice(index , 1 ) ; 
    }
  }
}
