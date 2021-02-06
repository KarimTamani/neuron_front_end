import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patient-visit',
  templateUrl: './patient-visit.component.html',
  styleUrls: ['./patient-visit.component.css']
})
export class PatientVisitComponent implements OnInit {
  public page : number = 1 ; 
  constructor() {}
  ngOnInit(): void {}
  select($event) { 
    this.page = $event ; 
  }
}
