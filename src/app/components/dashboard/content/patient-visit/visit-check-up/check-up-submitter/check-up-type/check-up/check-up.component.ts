import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { CheckUp } from 'src/app/classes/CheckUp';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-check-up',
  templateUrl: './check-up.component.html',
  styleUrls: ['./check-up.component.css']
})
export class CheckUpComponent implements OnInit , OnDestroy {
  @Input() checkUp: CheckUp;
  @Input() selectedCheckUps: CheckUp[];
  @Input() controllable : boolean = false ; 

  public selected: boolean = false;
  public selectEvent: EventEmitter<CheckUp>;
  public subscriptions : Subscription[] = [] ; 
  
  @Output() deleteEvent : EventEmitter<CheckUp> ; 

  constructor(private interactionService: InteractionService , private router : Router , private apollo : Apollo) {
    this.selectEvent = new EventEmitter<CheckUp>(); 
    this.deleteEvent = new EventEmitter<CheckUp>() ; 
  }

  ngOnInit(): void {
    if ( this.selectedCheckUps != null ) {
      const index = this.selectedCheckUps.findIndex((checkUp) => checkUp.id == this.checkUp.id);
      if (index >= 0)
        this.selected = true;
    }

  }

  public select() {
    
    const index = this.selectedCheckUps.findIndex((checkUp) => checkUp.id == this.checkUp.id);
    if (index >= 0) {
      this.selectedCheckUps.splice(index, 1);
    } else {
      this.selectedCheckUps.push(this.checkUp);
    }
    this.selected = !this.selected;
    this.interactionService.visitEdited.next();

  }

  public edit() { 
    this.router.navigate([] , { 
      queryParams : { 
        "pop-up-window" : true , 
        "window-page" : "check-up-submitter" , 
        "check-up" : encodeURIComponent(JSON.stringify(this.checkUp)) , 
        "title" : "Modifer le parémetre de bilan"
      }
    }); 

    const subs = this.interactionService.checkUpEdited.subscribe((data) => { 
      this.checkUp = data ; 
      subs.unsubscribe() ; 
    })
    
    this.subscriptions.push(subs) ; 
  } 

  public delete() { 

    this.router.navigate([] , { 
      queryParams: { 
        "pop-up-window" : true , 
        "window-page" : "yes-no-message" , 
        "message" : "Voulais vous vraiments suprimer le paramétre de bilan " + this.checkUp.name , 
        "title" :"Suprission de parametre de bilan" 
      }
    }) ; 

    const subs = this.interactionService.yesOrNo.subscribe(response => { 
      if ( response ) {   
       this.apollo.mutate({
         mutation : gql`
          mutation {
            removeCheckUp(checkUpId : ${this.checkUp.id}) 
          }
         `
       }) .pipe(map(value => (<any>value.data).removeCheckUp)).subscribe((data) => { 
        this.deleteEvent.emit(this.checkUp) ; 
       })
      }
      subs.unsubscribe() ; 
    }) ; 

    this.subscriptions.push(subs) ; 
  }



  public ngOnDestroy() { 
    this.subscriptions.forEach(subs => subs.unsubscribe()) ; 
  }
}
