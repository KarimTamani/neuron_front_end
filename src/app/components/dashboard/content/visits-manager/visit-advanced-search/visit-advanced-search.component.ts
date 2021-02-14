import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { MedicalAct } from 'src/app/classes/MedicalAct';
import { Symptom } from 'src/app/classes/Symptom';

@Component({
  selector: 'app-visit-advanced-search',
  templateUrl: './visit-advanced-search.component.html',
  styleUrls: ['./visit-advanced-search.component.css']
})
export class VisitAdvancedSearchComponent implements OnInit, OnDestroy {
  @Output() closeEvent: EventEmitter<null>;
  public subscriptions: Subscription[] = [];
  public searchQuery: any = {};
  public medicalActs: MedicalAct[] = [];
  public submittedSymptom : Symptom ; 
  public selectedSymptoms : Symptom[] = [] ; 
  constructor(private router: ActivatedRoute, private apollo: Apollo) {
    this.closeEvent = new EventEmitter<null>();
    this.submittedSymptom = new Symptom() ; 
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.router.queryParams.subscribe((params) => {
        if (params["search-query"]) {
          this.searchQuery = JSON.parse(decodeURIComponent(params["search-query"]));
          this.searchQuery.medicalActs = [] ; 
          this.searchQuery.symptoms = []  ;
        }

      })
    )
    this.apollo.query({
      query: gql`
        { 
          getAllMedicalActs {
            id name price 
          }
        }`
    }).pipe(map(value => (<any>value.data).getAllMedicalActs)).subscribe((data) => {
      this.medicalActs = data;
    })
  }

  public symptomsSearchFunction: any = (query) => {
    // search for symptoms by name
    return this.apollo.query({
      query: gql`
        {
          searchSymptom(symptom : "${query}") { 
            id name 
          }
        }`
    }).pipe(map(value => (<any>value.data).searchSymptom));
  }
  public isMedicalActSelected(medicalAct) {
    let index = this.searchQuery.medicalActs.findIndex(value => value == medicalAct.id);
    return index >= 0;
  }

  public selectMedicalAct(medicalAct) {
    // if the medical act is allready selected remove it 
    // else push it 
    let index = this.searchQuery.medicalActs.findIndex(value => value.id == medicalAct.id);
    if (index >= 0) {
      this.searchQuery.medicalActs.splice(index, 1);
    } else
      this.searchQuery.medicalActs.push(medicalAct.id);
  }


  public symptomSelected($event) {
    this.apollo.mutate({
      mutation: gql`
        mutation { 
          addSymptom(symptom : { 
            name : "${$event.name}"
          }) {
            id name 
          }
        }
      `
    }).pipe(map((response) => (<any>response.data).addSymptom)).subscribe((data) => {
      this.selectedSymptoms.splice(0, 0, data );
    })
  }
  removeSymptom(symptom) {
    const index = this.selectedSymptoms.findIndex((value) => value.id == symptom.id);
    this.selectedSymptoms.splice(index, 1);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subs) => {
      subs.unsubscribe();
    })
  }
}
