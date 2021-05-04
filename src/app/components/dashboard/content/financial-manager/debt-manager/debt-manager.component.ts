import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { timeStamp } from 'console';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Visit } from 'src/app/classes/Visit';
import { DataService } from 'src/app/services/data.service';
import { InteractionService } from 'src/app/services/interaction.service';
import { VirtualAssistantService } from 'src/app/services/virtual-assistant-service';

@Component({
  selector: 'app-debt-manager',
  templateUrl: './debt-manager.component.html',
  styleUrls: ['./debt-manager.component.css']
})
export class DebtManagerComponent implements OnInit , OnDestroy {
  public offset: number = 0;
  public limit: number = 20;

  public visits: Visit[] = [];
  public count: number = 0;

  public lastSearch : any = {} ; 
  public subscription : Subscription[] = [] ; 

  
  constructor(
    private apollo: Apollo , 
    private dataService : DataService , 
    private virtualAssistantService : VirtualAssistantService , 
    private interactionService : InteractionService , 
    private zone : NgZone, 
    private router : Router) {
  }
  ngOnInit(): void {

    this.virtualAssistantService.onVACommand.subscribe((data) => { 
      if (data.component == "FINANCIAL-MANAGER") { 
        if (data.query && data.query.trim().length > 0) { 
          this.zone.run(() => {

              this.search({
                searchQuery: data.query
              });

            })
        }

      }
    })

    this.loadDebt(
      null,
      null,
      null,
      this.offset,
      this.limit
    );
  }
  private loadDebt(searchQuery = null, startDate = null, endDate = null, offset = null, limit = null) {
    this.apollo.query({
      query: gql`
        query SEARCH_DEBT($searchQuery : String , $startDate : String , $endDate : String , $offset  : Int , $limit : Int) { 
          searchVisits(
            searchQuery : $searchQuery , 
            startDate : $startDate , 
            endDate : $endDate , 
            offset : $offset ,
            debt : true ,  
            limit : $limit 
          ) { 
            rows { 
            id 
            payedMoney
            startTime 
            endTime 
            debt
            createdAt 
            medicalActs {
              id name price
            } 
            medicalFile {
              id name lastname birthday phone email 
            }
          }
          count 
          }
        }
      ` , variables: {
        searchQuery: searchQuery,
        startDate: startDate,
        endDate: endDate,
        offset: this.offset,
        limit: this.limit
      }
    }).pipe(map(value => (<any>value.data).searchVisits)).subscribe(data => {
      for (let index = 0; index < data.rows.length; index++) {
        data.rows[index].createdAt = this.dataService.castDateYMD(new Date(parseInt(data.rows[index].createdAt)).toISOString())
      }
      this.visits = data.rows;
      this.count = data.count;
    })

  }

  public search($event) {
    this.offset = 0 ; 
    this.lastSearch = $event  ; 
    this.loadDebt(
      $event.searchQuery , 
      $event.startDate , 
      $event.endDate , 
      this.offset , 
      this.limit
    ) ; 

  }

  public selectPage ($event) { 
    this.offset = $event ; 
    this.loadDebt(
      this.lastSearch.searchQuery , 
      this.lastSearch.startDate , 
      this.lastSearch.endDate , 
      this.offset , 
      this.limit  
    ) ;
  }

  public editDebt(visit) { 
    this.router.navigate([] , { 
      queryParams : { 
        "pop-up-window" : true , 
        "window-page" : "edit-debt" , 
        "title" : "Régler le crédit de " + visit.medicalFile.name + " " + visit.medicalFile.lastname , 
        "visit" : encodeURIComponent(JSON.stringify(visit))
      }
    }) ; 

    
    const subs = this.interactionService.visitPayed.subscribe((data) => { 
      var index = this.visits.findIndex( value => value.id == visit.id) ;
      if (index >= 0 ) { 
        this.visits.splice(index , 1) ; 
      }
      subs.unsubscribe() ; 
    })

    this.subscription.push(subs) ; 
  }

  public ngOnDestroy () { 
    this.subscription.forEach(subs => { 
      subs.unsubscribe() ; 
    })
  }


  public frDate ( date : string) { 
    return this.dataService.castFRDate(new Date(date)) ; 
  }
}
