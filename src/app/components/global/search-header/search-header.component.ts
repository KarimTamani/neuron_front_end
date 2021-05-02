import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Wilaya } from 'src/app/classes/Wilaya';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { InteractionService } from 'src/app/services/interaction.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-header',
  templateUrl: './search-header.component.html',
  styleUrls: ['./search-header.component.css']
})
export class SearchHeaderComponent implements OnInit {
  public wilayas : Wilaya[] = [] ;  
  public selectedWilaya : Wilaya ; 
  @Input() searchQuery : any = {} ; 
  @Input() advancedSearchOption : string ; 
  @Output() searchEvent : EventEmitter<any> ;
  @Output() addEvent : EventEmitter<null> ; 
  @Input() addOption : boolean = false ; 
  public subscriptions : Subscription[] = [ ] ;  
  constructor(private apollo : Apollo , private router : Router, private interactionService : InteractionService)  {
    this.searchEvent = new EventEmitter<any>() ; 
    this.addEvent = new EventEmitter<null>() ; 
  }

  ngOnInit(): void {
  
    this.apollo.query({
      query : gql`
        { 
          getAllWilayas { 
            id name communes { 
              id name
            }
          }
        }
      `
    }).pipe(map(value =>(<any>value.data).getAllWilayas)).subscribe((data) => { 
      this.wilayas = data ;  
    })
    this.subscriptions.push(this.interactionService.advancedSearchValidated.subscribe((searchQuery) => { 
      this.searchQuery = searchQuery ; 
      this.search() ; 
    }) ) ; 
  }
  
  public wilayaSelected() {
    // filter by if to find the selected wilaya 
    this.selectedWilaya = this.wilayas.find(wilaya => wilaya.id ==  this.searchQuery.wilayaId);
  }

  public search() {
    this.searchEvent.emit (this.searchQuery) ; 
  }

  public clear() { 
    this.searchQuery = {} ; 
    this.selectedWilaya = null ;
    
    this.searchEvent.emit(this.searchQuery) ; 
  }
  public openAdvancedSearch() { 
    
    this.router.navigate([] , { 
      queryParams : { 
        "pop-up-window" : true , 
        "window-page" : this.advancedSearchOption  , 
        "title" : "La recherche avancé"  , 
        "search-query" : encodeURIComponent(JSON.stringify(this.searchQuery)) 
      }
    }); 
  }
}
