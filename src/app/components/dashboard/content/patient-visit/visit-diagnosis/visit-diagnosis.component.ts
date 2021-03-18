import { Component, Input, OnInit } from '@angular/core';
import { Visit } from 'src/app/classes/Visit';

@Component({
  selector: 'app-visit-diagnosis',
  templateUrl: './visit-diagnosis.component.html',
  styleUrls: ['./visit-diagnosis.component.css']
})
export class VisitDiagnosisComponent implements OnInit {
  @Input() visit : Visit ; 
  constructor() { }

  ngOnInit(): void {
  }

}
