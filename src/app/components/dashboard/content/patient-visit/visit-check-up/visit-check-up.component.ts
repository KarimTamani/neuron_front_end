import { Component, Input, OnInit } from '@angular/core';
import { Visit } from 'src/app/classes/Visit';

@Component({
  selector: 'app-visit-check-up',
  templateUrl: './visit-check-up.component.html',
  styleUrls: ['./visit-check-up.component.css']
})
export class VisitCheckUpComponent implements OnInit {
  @Input() visit : Visit ; 
  constructor() { }

  ngOnInit(): void {


  }

   
}
