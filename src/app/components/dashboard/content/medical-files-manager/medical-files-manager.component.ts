import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { MedicalFile } from 'src/app/classes/MedicalFile';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-medical-files-manager',
  templateUrl: './medical-files-manager.component.html',
  styleUrls: ['./medical-files-manager.component.css']
})
export class MedicalFilesManagerComponent implements OnInit {
  public medicalFiles: MedicalFile[] = [];
  constructor(private apollo: Apollo) {}    
  ngOnInit(): void {
    this.searchMedicalFiles(); 
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
          ) { 
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
      this.medicalFiles = data ; 
    })
  }

  public search($event) { 
    
  }
}
