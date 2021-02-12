import { Component, OnInit, Input } from '@angular/core';
import { Visit } from 'src/app/classes/Visit';

@Component({
  selector: 'app-visit-row',
  templateUrl: './visit-row.component.html',
  styleUrls: ['./visit-row.component.css']
})
export class VisitRowComponent implements OnInit {
  @Input() visit : Visit ; 
  constructor() { }

  ngOnInit(): void {
  }

}
