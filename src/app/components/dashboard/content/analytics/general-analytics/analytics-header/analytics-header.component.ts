import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-analytics-header',
  templateUrl: './analytics-header.component.html',
  styleUrls: ['./analytics-header.component.css']
})
export class AnalyticsHeaderComponent implements OnInit {

  public selectedOption: string;
  public primaryOption: number = null;
  public secondaryOption: number = null;
  @Input() showOptions : boolean = true ; 
  @Input() title : string = "Vos Statistiques"

  @Output() periodSelectedEvent: EventEmitter<number>;
  public options: string[] = [

    "Joure",
    "Semaine",
    "Mois",
    "Trimester",
    "Semester",
    "Année",
  ];
  constructor(
    private dataService: DataService,
     private router: Router, 
     private route: ActivatedRoute , 
     private interactionService : InteractionService) {
    this.selectedOption = this.options[2];
    this.periodSelectedEvent = new EventEmitter<number>();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params["primaryOption"] == null && params["secondaryOption"] == null) {
        this.primaryOption = 1;
        this.secondaryOption = 2;
      } else {
        if (params["primaryOption"])
          this.primaryOption = parseInt(params["primaryOption"]);
        if (params["secondaryOption"])
          this.secondaryOption = parseInt(params["secondaryOption"]);
      }
    });


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
    this.interactionService.showMessage.next(<any>{
      message : "la période sélectionnée : " + this.selectedOption  ,
    })
  }

  public selectOption(option) {
    if (this.primaryOption === option || this.secondaryOption === option) {
      if (this.primaryOption == null || this.secondaryOption == null)
        return;

      if (option === this.primaryOption)
        this.primaryOption = null;

      else if (option === this.secondaryOption)
        this.secondaryOption = null;
    }

    else if (this.primaryOption === null) {
      this.primaryOption = option
    }
    else if (this.secondaryOption === null)
      this.secondaryOption = option

    else
      this.secondaryOption = option;

    var queryParams = {};

    if (this.primaryOption)
      queryParams["primaryOption"] = this.primaryOption;

    if (this.secondaryOption)
      queryParams["secondaryOption"] = this.secondaryOption;

    this.router.navigate([], {
      queryParams: queryParams
    })
  }
}
