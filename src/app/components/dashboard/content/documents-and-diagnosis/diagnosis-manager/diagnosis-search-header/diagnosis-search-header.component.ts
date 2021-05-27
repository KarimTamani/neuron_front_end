import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SUCCESS } from 'src/app/classes/Message';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-diagnosis-search-header',
  templateUrl: './diagnosis-search-header.component.html',
  styleUrls: ['./diagnosis-search-header.component.css']
})
export class DiagnosisSearchHeaderComponent implements OnInit {
  public diagnosisOptions: string[] = [
    "Tout",
    "Diagnostic symptomatique",
    "Diagnostics avancés"
  ];
  public selectedOption: string;
  public searchQuery: any = {};

  @Output() searchEvent: EventEmitter<any>;
  constructor(private interactionService : InteractionService) {
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
    this.searchEvent.emit(this.searchQuery) ; 
  }

  public search() {
    this.searchEvent.emit(this.searchQuery) ;  
    this.interactionService.showMessage.next({
      message : "Recherche effectuée" , 
      type : SUCCESS
    })
  }


  public keyup($event) {  
    if ($event.key == "Enter") { 
      this.search() ; 
    }
  }

}
