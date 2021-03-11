import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Appointment } from 'src/app/classes/Appointment';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-rdvmanager',
  templateUrl: './rdvmanager.component.html',
  styleUrls: ['./rdvmanager.component.css']
})
export class RDVManagerComponent implements OnInit {
  public offset: number = 0;
  public limit: number = 1;

  public count: number = 0;
  public appointments: Appointment[] = [];

  public startDate: string;
  public lastSearch: any = {};
  constructor(private apollo: Apollo, private dataService: DataService) { }

  ngOnInit(): void {
    // get the current date and time
    this.apollo.query({
      query: gql`
        { 
          getCurrentDate 
        }
      `
    }).pipe(map(value => (<any>value.data).getCurrentDate)).subscribe(data => {
      // load the appointments starting from the date of today 
      this.startDate = this.dataService.castDateYMD(data);

      this.loadAppointments(
        null,
        this.dataService.castDateYMD(data),
        null,
        this.offset,
        this.limit
      )
    })
  }

  private loadAppointments(searchQuery = null, startDate = null, endDate = null, offset = null, limit = null) {

    this.apollo.query({
      query: gql`
        query SEARCH_APPOINTMENT($searchQuery : String , $startDate : String , $endDate : String , $offset : Int , $limit : Int){
          searchAppointments(
            searchQuery : $searchQuery , 
            startDate : $startDate , 
            endDate : $endDate , 
            offset : $offset , 
            limit : $limit 
          ) { 
            rows {
              id date time 
                visit {
                  createdAt , 
                  medicalFile {
                    id name lastname birthday phone email
                  }
                }
              }
            
            count 
          }
        }`,
      variables: {
        searchQuery: searchQuery,
        startDate: startDate,
        endDate: endDate,
        offset: offset,
        limit: limit
      }
    }).pipe(map(value => (<any>value.data).searchAppointments)).subscribe((data) => {
      this.count = data.count;
      for (let index = 0; index < data.rows.length; index++) {
        data.rows[index].visit.createdAt = this.dataService.castDateYMD(new Date(parseInt(data.rows[index].visit.createdAt)).toISOString())
      }
      this.appointments = data.rows;
    })
  }
  public search($event) {
    this.offset = 0;
    this.lastSearch = $event;
    this.loadAppointments(
      $event.searchQuery,
      $event.startDate,
      $event.endDate,
      this.offset,
      this.limit
    )
  }
  public selectPage($event) {
    this.offset = $event;
    this.loadAppointments(
      this.lastSearch.searchQuery,
      this.lastSearch.startDate,
      this.lastSearch.endDate,
      this.offset,
      this.limit
    );
  }
}
