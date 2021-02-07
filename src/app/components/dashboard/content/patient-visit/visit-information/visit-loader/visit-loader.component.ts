import { Component, OnInit, Output, Input } from '@angular/core';
import { Visit } from 'src/app/classes/Visit';
import { MedicalFile } from 'src/app/classes/MedicalFile';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-visit-loader',
  templateUrl: './visit-loader.component.html',
  styleUrls: ['./visit-loader.component.css']
})
export class VisitLoaderComponent implements OnInit {
  @Input() visit: Visit ;
  public edit: boolean = false;
  public types : string[] = [];  
  public submittedMedicalFile: MedicalFile;
  public selectedType : string ; 
  constructor(private apollo : Apollo) {
    this.visit = new Visit () ; 
    this.submittedMedicalFile = new MedicalFile() ; 
  }
  ngOnInit(): void {
     // get the antecdents types     
     this.apollo.query({
      query: gql`
        {
          getAntecedentTypes 
        }`
    }).pipe(map(value => (<any>value.data).getAntecedentTypes)).subscribe((data) => {
      this.types = data;
    })
  }

  selectMedicalFile($event) {
    this.visit.medicalFile = $event;
    this.submittedMedicalFile = new MedicalFile() ; 
  }


  public searchFunction: any = (query) => {
    // define the search medical files function
    return this.apollo.query({
      query: gql`
          {
            searchMedicalFiles(searchQuery : "${query}") {
              id 
              name 
              lastname 
              phone 
              email 
              birthday 
              gender
            }
          }`
    }).pipe(map(result => (<any>result.data).searchMedicalFiles));
  }

}
