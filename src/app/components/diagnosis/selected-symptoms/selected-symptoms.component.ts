import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from "graphql-tag"  ;
import { map } from "rxjs/operators" ; 
@Component({
  selector: 'app-selected-symptoms',
  templateUrl: './selected-symptoms.component.html',
  styleUrls: ['./selected-symptoms.component.css']
})
export class SelectedSymptomsComponent implements OnInit {
  public searchQuery: string = "";
  public searchResult: any[] = [];
  @Input() selectedSymptoms: any[] = [];

  // create an event emitter to emit every time a symptom updated 
  @Output() symptomsUpdated: EventEmitter<null>;
  constructor(private apollo : Apollo) {
    this.symptomsUpdated = new EventEmitter<null>();
  }

  ngOnInit(): void {
  }
  search() {
    // apply search every new ket hit 
    // if the search query is empty , empty the search result 
    // else if the search query exists apply search on the symptoms  

    if (this.searchQuery.trim().length == 0)
      this.searchResult = []
    else {
      //  this.searchResult = this.symptoms.filter((symptom) => symptom.disease_name.toLowerCase().includes(this.searchQuery.toLowerCase()))
      this.apollo.query({
        query : gql`{
            searchSymptom(symptom : "${this.searchQuery.trim()}" , language : "fr") {
              id , name , body_part_id 
            }
          } 
        `
      }).pipe(map(result => (<any>result.data).searchSymptom)).subscribe((data) => {
        this.searchResult = data ; 
      })

    }
  }

  selectSymptom(symptom) {
    // every time a symptom selected clear the search result and search query 
    this.selectedSymptoms.splice(0, 0, symptom)
    this.searchQuery = ""
    this.searchResult = []
    this.symptomsUpdated.emit() ; 
    // update on add new symptom 
    //this.updateBodyAreaSymptoms();
  }

  deleteSymptom(symptom) {
    // set the symptom selectetion to false to update the all symptoms components
    // and deleted from the selected symptoms so we dont draw it in the human body component     
    symptom.selected = false;
    var index = this.selectedSymptoms.findIndex((value) => value.id == symptom.id)
    this.selectedSymptoms.splice(index, 1);
    this.symptomsUpdated.emit();
  }

}
