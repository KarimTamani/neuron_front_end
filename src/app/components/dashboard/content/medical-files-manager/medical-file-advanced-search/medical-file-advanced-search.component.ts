import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-medical-file-advanced-search',
  templateUrl: './medical-file-advanced-search.component.html',
  styleUrls: ['./medical-file-advanced-search.component.css']
})
export class MedicalFileAdvancedSearchComponent implements OnInit {
  @Output() closeEvent : EventEmitter<null> ; 
  
  constructor() {
    this.closeEvent = new EventEmitter<null>()  ; 
  }

  ngOnInit(): void {
  }

}
