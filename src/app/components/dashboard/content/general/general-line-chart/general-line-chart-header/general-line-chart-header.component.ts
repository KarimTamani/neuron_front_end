import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-general-line-chart-header',
  templateUrl: './general-line-chart-header.component.html',
  styleUrls: ['./general-line-chart-header.component.css']
})
export class GeneralLineChartHeaderComponent implements OnInit {
  public selectedOption: string;
  @Output() periodSelectedEvent: EventEmitter<number>;
  
  public options: string[] = [

    "ce joure",
    "cet semain",
    "ce mois",
    "ce trimester",
    "ce semester",
    "cette année",
  ];
  constructor(private dataService : DataService) {

    this.selectedOption = this.options[0];
    this.periodSelectedEvent = new EventEmitter<number>();
  }

  ngOnInit(): void {
  
  }


  public selectPeriod() {
    // every time a period selected 
    // calculate the dates intervales 

    switch (this.selectedOption) {

      case this.options[0]:
        this.periodSelectedEvent.emit(this.dataService.DAY);
        break;
      case this.options[1]:
        this.periodSelectedEvent.emit(this.dataService.WEEK);
        break;
      case this.options[2]:
        this.periodSelectedEvent.emit(this.dataService.MONTH);
        break;
      case this.options[3]:
        this.periodSelectedEvent.emit(this.dataService.TRIMESTER);
        break;
      case this.options[4]:
        this.periodSelectedEvent.emit(this.dataService.SEMESTER);
        break;
      case this.options[5]:
        this.periodSelectedEvent.emit(this.dataService.YEAR);
        break;
      default:
        break;
    }
  }

}
