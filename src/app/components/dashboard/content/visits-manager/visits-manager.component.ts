import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Visit } from 'src/app/classes/Visit';

@Component({
  selector: 'app-visits-manager',
  templateUrl: './visits-manager.component.html',
  styleUrls: ['./visits-manager.component.css']
})
export class VisitsManagerComponent implements OnInit {
  public visits: Visit[] = [];
  public count: number = 0;
  public offset: number = 0;
  public limit: number = 20;
  public lastSearch : any = {} ; 
  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    this.searchVisits(
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      this.offset,
      this.limit);
  }

  private searchVisits(searchQuery = null, address = null, wilayaId = null, communeId = null, medicalActs = null, symptoms = null, debt = null, status = null, startDate = null, endDate = null, offset = null, limit = null) {
    this.apollo.query({
      query: gql`
        query ( 
            $searchQuery : String 
            $address : String 
            $wilayaId : ID
            $communeId : ID 
            $medicalActs : [ID!]  
            $symptoms : [ID!] 
            $debt : Boolean 
            $status : String 
            $startDate : String 
            $endDate : String
            $offset : Int 
            $limit : Int
          ){ 
          searchVisits(
            searchQuery :$searchQuery  
            address : $address 
            wilayaId : $wilayaId
            communeId : $communeId 
            medicalActs : $medicalActs  
            symptoms : $symptoms 
            debt : $debt 
            status : $status 
            startDate : $startDate 
            endDate : $endDate
            offset : $offset 
            limit : $limit
          ) {
            rows { 
            id 
            arrivalTime 
            status 
            startTime 
            endTime 
            debt 
            payedMoney
            order 
            createdAt
            medicalFile{
              id
              name 
              lastname 
              birthday 
              gender 
              email 
              phone 
              address {
                id address commune {
                  id name wilaya { 
                    id name
                  }
                }
              }
            }
            condition { 
              id name
            }
          }
          count 
          }
        }
      `,
      variables: {
        searchQuery: searchQuery,
        address: address,
        wilayaId: wilayaId,
        communeId: communeId,
        medicalActs: medicalActs,
        symptoms: symptoms,
        debt: debt,
        status: status,
        startDate: startDate,
        endDate: endDate,
        offset: offset,
        limit: limit
      }
    }).pipe(map(value => (<any>value.data).searchVisits)).subscribe((data) => {
      this.visits = data.rows;
      this.count = data.count;
    })
  }

  search($event) {
    this.offset = 0 ; 
    console.log($event) ; 
    this.lastSearch = $event  ; 
    this.searchVisits(
      $event.searchQuery,
      $event.address,
      $event.wilayaId,
      $event.communeId,
      (($event.medicalActs && $event.medicalActs.length > 0) ? ($event.medicalActs.map(value => value.id)) : ($event.medicalActs)),
      (($event.symptoms && $event.symptoms.length > 0) ? ($event.symptoms.map(value => value.id)) : ($event.symptoms)),
      $event.debt,
      $event.status,
      $event.startDate,
      $event.endDate,
      this.offset,
      this.limit
    ); 
  }
  selectPage($event) {
    this.offset = $event ; 
    this.searchVisits(
      this.lastSearch.searchQuery,
      this.lastSearch.address,
      this.lastSearch.wilayaId,
      this.lastSearch.communeId,
      this.lastSearch.medicalActs,
      this.lastSearch.symptoms,
      this.lastSearch.debt,
      this.lastSearch.status,
      this.lastSearch.startDate,
      this.lastSearch.endDate,
      this.offset,
      this.limit
    )
  }
}
