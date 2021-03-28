import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-visit-background',
  templateUrl: './no-visit-background.component.html',
  styleUrls: ['./no-visit-background.component.css']
})
export class NoVisitBackgroundComponent implements OnInit {
  @Input() message : string ; 
  constructor() { }

  ngOnInit(): void {
  }

}
