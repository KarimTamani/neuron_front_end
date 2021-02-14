import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { MedicalAct } from 'src/app/classes/MedicalAct';
import { Symptom } from 'src/app/classes/Symptom';
import { InteractionService } from 'src/app/services/interaction.service';

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
  public submittedSymptom: Symptom;
  public selectedSymptoms: Symptom[] = [];
  public status: string[] = [];
  public withDebt: boolean = true;
  public noDebt: boolean = true;
  constructor(private router: ActivatedRoute, private apollo: Apollo , private interactionService : InteractionService) {
    this.closeEvent = new EventEmitter<null>();
    this.submittedSymptom = new Symptom();
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.router.queryParams.subscribe((params) => {
        if (params["search-query"]) {
          this.searchQuery = JSON.parse(decodeURIComponent(params["search-query"]));
          if (this.searchQuery.medicalActs === undefined)
            this.searchQuery.medicalActs = [];
          if (this.searchQuery.symptoms === undefined)
            this.searchQuery.symptoms = [];

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
    });
    // get visit status  
    this.apollo.query({
      query: gql`
        {
          getVisitStatus
        }
      `
    }).pipe(map(value => (<any>value.data).getVisitStatus)).subscribe((data) => {
      this.status = data;
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
      this.selectedSymptoms.splice(0, 0, data);
    })
  }
  removeSymptom(symptom) {
    const index = this.selectedSymptoms.findIndex((value) => value.id == symptom.id);
    this.selectedSymptoms.splice(index, 1);
  }

  public selectDebt(debt) {
  
    if (debt == "debt") {
      if (this.noDebt == true)
        this.withDebt = !this.withDebt;
      this.searchQuery.debt = true;
    } else {
      if (this.withDebt == true)
        this.noDebt = !this.noDebt;
      this.searchQuery.debt = false;
    }
  }

  public onDateIntervalChange($event) {
    this.searchQuery.startDate = $event.startDate ; 
    this.searchQuery.endDate = $event.endDate ; 
  }
  public submit() {
    if (this.withDebt && this.noDebt) 
      this.searchQuery.debt = null ; 
    else if (this.withDebt) 
      this.searchQuery.debt = true ; 
    else if (this.noDebt) 
      this.searchQuery.debt = false ; 
    this.searchQuery.symptoms = this.selectedSymptoms.map(symptom => symptom.id);
    
    this.interactionService.advancedSearchValidated.next(this.searchQuery) ; 
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subs) => {
      subs.unsubscribe();
    })
  }
}
