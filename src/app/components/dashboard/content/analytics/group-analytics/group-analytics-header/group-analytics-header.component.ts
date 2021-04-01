import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-group-analytics-header',
  templateUrl: './group-analytics-header.component.html',
  styleUrls: ['./group-analytics-header.component.css']
})
export class GroupAnalyticsHeaderComponent implements OnInit {
  public options: any[] = [
    {
      id: 1,
      name: "Rapport d'age"
    },{
      id: 2,
      name: "Rapport des maladies"
    }, {
      id: 3,
      name: "Rapport De Sexe"
    }
  ];
  public selectedOption: any;

  @Output() selectOptionEvent: EventEmitter<any>;
  
  constructor() {
    this.selectedOption = this.options[0];
    this.selectOptionEvent = new EventEmitter<any>();

  }

  ngOnInit(): void {

  }

  next() {
    const index = this.options.findIndex(value => value.id == this.selectedOption.id);
    if (index < this.options.length - 1)
      this.selectedOption = this.options[index + 1];
    else
      this.selectedOption = this.options[0];

    this.selectOptionEvent.emit(this.selectedOption);
  }

  previous() {
    const index = this.options.findIndex(value => value.id == this.selectedOption.id);
    if (index > 0)
      this.selectedOption = this.options[index - 1];
    else
      this.selectedOption = this.options[this.options.length - 1];

    this.selectOptionEvent.emit(this.selectedOption);
  }

}
