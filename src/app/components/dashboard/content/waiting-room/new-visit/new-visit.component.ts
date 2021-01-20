import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { MedicalAct } from 'src/app/classes/MedicalAct';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-new-visit',
  templateUrl: './new-visit.component.html',
  styleUrls: ['./new-visit.component.css']
})
export class NewVisitComponent implements OnInit {
  @Output() closeEvent: EventEmitter<null>;
  public medicalActs : MedicalAct[] = [] ; 
  constructor(private apollo : Apollo) {
    this.closeEvent = new EventEmitter<null>();
  }
  ngOnInit(): void {
    // get the medical acts to calculate the price of the visit
    this.apollo.query({
      query : gql`
        { 
          getAllMedicalActs {
            id name price
          } 
        } `
    }).pipe(map(value => (<any>value.data).getAllMedicalActs)).subscribe((data) => { 
      this.medicalActs = data ; 
    })
  }
}
