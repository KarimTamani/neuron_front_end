import { Component, OnInit, Input } from '@angular/core';
import { Visit } from 'src/app/classes/Visit';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-visit-row',
  templateUrl: './visit-row.component.html',
  styleUrls: ['./visit-row.component.css']
})
export class VisitRowComponent implements OnInit {
  @Input() visit : Visit ; 
  public visitPeriod : string ; 
  constructor(private dataService : DataService) { }

  ngOnInit(): void {
    if (this.visit.status == "visit done" || this.visit.status == "visit payed") { 
      this.visitPeriod = this.dataService.getPeriod(this.visit.startTime , this.visit.endTime) ;  
    }
  }

}
