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

  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    this.searchVisits();
  }

  private searchVisits(searchQuery = null, address = null, wilayaId = null, communeId = null, medicalActs = null, symptoms = null, debt = null, status = null, startDate = null, endDate = null, offset = null, limit = null) {
    this.apollo.query({
      query: gql`
        query ( 
            $searchQuery : String 
            $address : String 
            $wilayaId : ID
            $communeId : ID 
            $medicalActs : [Int!]  
            $symptoms : [Int!] 
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
            id 
            arrivalTime 
            status 
            startTime 
            endTime 
            debt 
            payedMoney
            order 
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
        startDate: startDate,
        endDate: endDate,
        status: status,
        offset: offset,
        limit: limit
      }
    }).pipe(map(value => (<any>value.data).searchVisits)).subscribe((data) => {
      this.visits = data;
    })
  }

  search($event) {
    this.searchVisits(
      $event.searchQuery ,  
      $event.address ,
      $event.wilayaId ,
      $event.communeId,
      $event.medicalActs ,
      $event.symptoms ,
      $event.debt ,
      $event.startDate ,
      $event.endDate ,
      $event.status,
      $event.offset ,
      $event.limit 
    )
  }
}
