import { Component, NgZone, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { MedicalFile } from 'src/app/classes/MedicalFile';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { InteractionService } from 'src/app/services/interaction.service';
import { VirtualAssistantService } from 'src/app/services/virtual-assistant-service';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';

@Component({
  selector: 'app-medical-files-manager',
  templateUrl: './medical-files-manager.component.html',
  styleUrls: ['./medical-files-manager.component.css']
})
export class MedicalFilesManagerComponent implements OnInit {
  public medicalFiles: MedicalFile[] = [];
  public count : number ; 
  public offset : number = 0 ; 
  public limit : number =  10 ; 
  public lastSearch : any = {}  ;
  public currentDate : Date ; 
  

  constructor(
    private apollo: Apollo , 
    private router : Router , 
    private interactionService : InteractionService , 
    private virtualAssistantService : VirtualAssistantService , 
    private zone : NgZone) {}

  ngOnInit(): void {
    this.apollo.query({
      query : gql`
        {
          getCurrentDate 
        }`
    }).pipe(map(value => (<any>value.data).getCurrentDate)).subscribe((data) => { 
      this.currentDate = data ; 
    })
    // subscribe to the delete event of the medicalFile  
    this.interactionService.medicalFileDeleted.subscribe((medicalFile) => { 
      const index = this.medicalFiles.findIndex(value => value.id == medicalFile.id) ; 
      if (index >= 0) { 
        this.medicalFiles.splice(index , 1) ; 
      }
    }) ; 

    this.virtualAssistantService.onVACommand.subscribe((data) => { 
      if (data.component == "MEDICAL-FILES") { 
        if (data.query && data.query.trim().length > 0) { 
          this.zone.run(() => {
            if (data.query && data.query.trim().length > 0) {
              this.search({
                searchQuery: data.query
              });
            }
          })
        }
      }
    })

    this.searchMedicalFiles(
      null , 
      null ,  
      null , 
      null, 
      null , 
      null , 
      null , 
      null , 
      this.offset , 
      this.limit 
    ); 

  }
  private searchMedicalFiles(
    searchQuery = null, address = null, communeId = null, wilayaId = null, professionId = null, antecedents = null, startDate = null, endDate = null, offset = null, limit = null
  ) {
    this.apollo.query({
      query: gql`
        query (

          $searchQuery : String , 
          $address : String
          $communeId : ID , 
          $wilayaId : ID , 
          $professionId : ID , 
          $antecedents : [ID!] , 
          $startDate : String , 
          $endDate : String , 
          $offset : Int , 
          $limit : Int 
        ) { 
          searchMedicalFiles(
            searchQuery : $searchQuery , 
            address : $address
            communeId : $communeId , 
            wilayaId : $wilayaId , 
            professionId : $professionId , 
            antecedents : $antecedents , 
            startDate : $startDate , 
            endDate : $endDate , 
            offset : $offset , 
            limit : $limit       
          )  { 
          rows { 
            id 
            name 
            lastname 
            phone 
            gender
            email 
            birthday 
            profession {
              id name 
            }
          }
          count 
        }
        }
        
      ` , variables: {
        searchQuery: searchQuery,
        address: address,
        communeId: communeId,
        wilayaId: wilayaId,
        professionId: professionId,
        antecedents: antecedents,
        startDate: startDate,
        endDate: endDate,
        offset: offset,
        limit: limit
      }
    }).pipe(map(value => (<any>value.data).searchMedicalFiles)).subscribe((data) => { 
      this.count = data.count ; 
      this.medicalFiles = data.rows ; 
    })
  }

  public search($event) { 
    this.offset = 0 ; 
    this.lastSearch = $event ; 

    this.searchMedicalFiles(
        $event.searchQuery , 
        $event.address , 
        $event.communeId , 
        $event.wilayaId , 
        $event.professionId , 
        ($event.antecedents && $event.antecedents.length > 0) ? ($event.antecedents.map(value => value.id)) : ($event.antecedents)  , 
        $event.startDate , 
        $event.endDate , 
        this.offset , 
        this.limit 
      )  
  }

  public selectPage($event) { 
 
    this.offset = $event ; 

    this.searchMedicalFiles(
      this.lastSearch.searchQuery , 
      this.lastSearch.address , 
      this.lastSearch.communeId , 
      this.lastSearch.wilayaId , 
      this.lastSearch.professionId , 
      this.lastSearch.antecedents , 
      this.lastSearch.startDate , 
      this.lastSearch.endDate , 
      this.offset , 
      this.limit 
    ) ; 

  }

  public add() { 
    this.router.navigate([] , { 
      queryParams : { 
        "title" : "Ajouter un nouveau dossier Médical" , 
        "window-page" : "medical-file-submitter" , 
        "pop-up-window" : true , 
      }
    }); 
    const subscription = this.interactionService.newMedicalFile.subscribe((data) => { 
      this.search({

      })
      subscription.unsubscribe() ; 
    })
  }

  public clickEvent($event) { 
    this.router.navigate([]  , { 
      queryParams : { 
        "window-page" : "medical-file-details" , 
        "pop-up-window" : true , 
        "title" : "Dossier Médical" , 
        "medical-file-id" : $event.id , 
        "current-date" : this.currentDate  
      }
    })
  }
}
