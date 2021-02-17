import { Component, Input, OnInit } from '@angular/core';
import { Visit } from 'src/app/classes/Visit';

@Component({
  selector: 'app-prescription-drug-dosages',
  templateUrl: './prescription-drug-dosages.component.html',
  styleUrls: ['./prescription-drug-dosages.component.css']
})
export class PrescriptionDrugDosagesComponent implements OnInit {
  @Input() visit : Visit ; 
  constructor() { }

  ngOnInit(): void {
  }

}
