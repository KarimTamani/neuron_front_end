import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { CheckUpType } from 'src/app/classes/CheckUpType';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-check-ups-models',
  templateUrl: './check-ups-models.component.html',
  styleUrls: ['./check-ups-models.component.css']
})
export class CheckUpsModelsComponent implements OnInit , OnDestroy{
  public checkUpTypes : CheckUpType[] = [] ; 
  public subscriptions : Subscription[] = [] ;  
  constructor(private apollo : Apollo , private router : Router, private interactionService : InteractionService) {}
  
  ngOnInit(): void {
    this.apollo.query({
      query: gql`
        {  
          getCheckUpTypes { id name isPublic checkUps  { id name checkUpTypeId isPublic}}
        }`
    }
    ).pipe(map(value => (<any>value.data).getCheckUpTypes)).subscribe((data) => {
      this.checkUpTypes = data;
    })
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
}
