import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.css']
})
export class PatientsListComponent implements OnInit {
  @Input() header : string ; 
  @Input() color : string ; 
  constructor() { }

  ngOnInit(): void {
  }

}
