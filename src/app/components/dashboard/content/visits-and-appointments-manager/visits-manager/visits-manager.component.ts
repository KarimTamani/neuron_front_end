import { Component, NgZone, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Message, SUCCESS } from 'src/app/classes/Message';
import { Visit } from 'src/app/classes/Visit';
import { InteractionService } from 'src/app/services/interaction.service';
import { VirtualAssistantService } from 'src/app/services/virtual-assistant-service';

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
  public lastSearch: any = {};
  constructor(
    private apollo: Apollo, 
    private interactionService: InteractionService , 
    private virtualAssistantService : VirtualAssistantService, 
    private zone : NgZone) { }

  ngOnInit(): void {
    
    this.virtualAssistantService.onVACommand.subscribe((data) => { 
      if (data.component == "VISITS-AND-APPOINTMENTS-MANAGER") { 
        if (data.query && data.query.trim().length > 0) { 
          this.zone.run(() => {
              this.search({
                searchQuery: data.query
              });
            })
        }
      }
    })

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
      this.limit
    );

    this.interactionService.visitDeleted.subscribe((visit) => { 
      const index = this.visits.findIndex(value => value.id == visit.id) ; 
      if (index >= 0) 
        this.visits.splice(index , 1) ; 
    })
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
    this.offset = 0;
    this.lastSearch = $event;
    
    this.interactionService.showMessage.next(<Message>{
      message : "Recherche de visites" , 
      type : SUCCESS
    }) ; 

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
    this.offset = $event;
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
