import { Component, OnInit, Input } from '@angular/core';
import { Visit } from 'src/app/classes/Visit';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-visits-list',
  templateUrl: './visits-list.component.html',
  styleUrls: ['./visits-list.component.css']
})
export class VisitsListComponent implements OnInit {
  @Input() visits :Visit[] = [] ; 
  constructor() { }

  ngOnInit(): void {
  }


  

}
