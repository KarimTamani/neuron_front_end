import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Profession } from 'src/app/classes/Profession';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-medical-file-advanced-search',
  templateUrl: './medical-file-advanced-search.component.html',
  styleUrls: ['./medical-file-advanced-search.component.css']
})
export class MedicalFileAdvancedSearchComponent implements OnInit , OnDestroy{
  @Output() closeEvent: EventEmitter<null>;
  public subscriptions: Subscription[] = [];
  public searchQuery : any = {} ; 
  public professions : Profession[] = [] ; 
  public showAntecedentsManager : boolean = false; 
  
  constructor(private route: ActivatedRoute , private apollo : Apollo , private interactionService : InteractionService) {
    this.closeEvent = new EventEmitter<null>();
  }
  ngOnInit(): void {
    this.subscriptions.push(
      this.route.queryParams.subscribe((params) => {
        this.searchQuery = JSON.parse(decodeURIComponent(params["search-query"])) ; 
        if (this.searchQuery.antecedents == undefined) 
          this.searchQuery.antecedents = [] ; 
          
      }) 
    )
    this.apollo.query({
      query : gql`
        {
          getAllProfessions {
            id name
          }
        }`
    }).pipe(map(value => (<any>value.data).getAllProfessions)).subscribe((data) => { 
      this.professions = data ; 
    })
  }
  
  public onDateChanged($event) { 
    this.searchQuery.startDate = $event.startDate ; 
    this.searchQuery.endDate = $event.endDate ; 
  }
  public valid() {  
    this.interactionService.advancedSearchValidated.next(this.searchQuery) ; 
    this.closeEvent.emit() ; 
  }
  
  
  ngOnDestroy() {
    this.subscriptions.forEach((subs) => { 
      subs.unsubscribe() ; 
    })
  }
}
