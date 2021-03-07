import { Component, Input, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-analytics-header',
  templateUrl: './analytics-header.component.html',
  styleUrls: ['./analytics-header.component.css']
})
export class AnalyticsHeaderComponent implements OnInit {
  @Input() startDate: string;
  @Input() endDate: string;
  public selectedOption: string;


  public primaryOption: number;
  public secondaryOption: number;

  public options: string[] = [

    "ce joure",
    "cet semain",
    "ce mois",
    "ce trimester",
    "ce semester",
    "cette année",
  ];
  constructor(private dataService: DataService) {
    this.selectedOption = this.options[0];
  }

  ngOnInit(): void {
    this.primaryOption = 1;
    this.secondaryOption = 2;
  }

  public selectPeriod() {
    // every time a period selected 
    // calculate the dates intervales 
    switch (this.selectedOption) {

      case this.options[0]:
        this.startDate = this.dataService.castDateYMD(this.dataService.dateMinusPeriod(this.endDate, this.dataService.DAY));
        break;
      case this.options[1]:
        this.startDate = this.dataService.castDateYMD(this.dataService.dateMinusPeriod(this.endDate, this.dataService.WEEK));
        break;
      case this.options[2]:
        this.startDate = this.dataService.castDateYMD(this.dataService.dateMinusPeriod(this.endDate, this.dataService.MONTH));
        break;
      case this.options[3]:
        this.startDate = this.dataService.castDateYMD(this.dataService.dateMinusPeriod(this.endDate, this.dataService.TRIMESTER));
        break;
      case this.options[4]:
        this.startDate = this.dataService.castDateYMD(this.dataService.dateMinusPeriod(this.endDate, this.dataService.SEMESTER));
        break;
      case this.options[5]:
        this.startDate = this.dataService.castDateYMD(this.dataService.dateMinusPeriod(this.endDate, this.dataService.YEAR));
        break;
      default:
        break;
    }
  }

  public selectOption(option) {
    if (this.primaryOption === option || this.secondaryOption === option) {
      if (option === this.primaryOption)
        this.primaryOption = null;
      else if (option === this.secondaryOption)
        this.secondaryOption = null;
      return;
    }
    if (this.primaryOption === null) {
      this.primaryOption = option
      return;
    }
    if (this.secondaryOption === null) {
      this.secondaryOption = option
      return;
    }
    
    this.secondaryOption = option ; 
  }
}
