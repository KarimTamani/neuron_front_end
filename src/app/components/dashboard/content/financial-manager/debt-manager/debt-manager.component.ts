import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { timeStamp } from 'console';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Visit } from 'src/app/classes/Visit';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-debt-manager',
  templateUrl: './debt-manager.component.html',
  styleUrls: ['./debt-manager.component.css']
})
export class DebtManagerComponent implements OnInit {
  public offset: number = 0;
  public limit: number = 20;

  public visits: Visit[] = [];
  public count: number = 0;

  public lastSearch : any = {} ; 
  
  constructor(private apollo: Apollo , private dataService : DataService) {

  }
  ngOnInit(): void {
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
}
