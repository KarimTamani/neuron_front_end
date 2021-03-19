import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-diagnosis-search-header',
  templateUrl: './diagnosis-search-header.component.html',
  styleUrls: ['./diagnosis-search-header.component.css']
})
export class DiagnosisSearchHeaderComponent implements OnInit {
  public diagnosisOptions: string[] = [
    "Tout",
    "Diagnostique Symptomatiques",
    "Diagnostique Avancées"
  ];
  public selectedOption: string;
  public searchQuery: any = {};

  @Output() searchEvent: EventEmitter<any>;
  constructor() {
    this.searchEvent = new EventEmitter<any>();
    this.selectedOption = this.diagnosisOptions[0];
  }

  ngOnInit(): void {
  }
  optionSelected() {
    switch (this.selectedOption) {
      case this.diagnosisOptions[0]:
        this.searchQuery.type = null;
        break;
      case this.diagnosisOptions[1]:
        this.searchQuery.type = "text";
        break;
      case this.diagnosisOptions[2]:
        this.searchQuery.type = "image";
        break;
      default:
        break;
    }
  }

  public clear() {
    this.searchQuery = {};
  }

  public search() {
    this.searchEvent.emit(this.searchQuery) ;  
  }
}
