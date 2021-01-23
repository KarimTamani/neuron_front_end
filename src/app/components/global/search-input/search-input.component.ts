import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { MedicalFile } from 'src/app/classes/MedicalFile';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css']
})
export class SearchInputComponent implements OnInit {

  @Input() placeholder: string = "";
  @Input() searchFunction: any;
  @Output() resultSelected: EventEmitter<any>;
  @Input() submittedItem: any;
  @ViewChild("input", {}) input;

  public results: any[] = [];
  private handler: any = null;

  constructor() {
    this.resultSelected = new EventEmitter<any>();
  }
  ngOnInit(): void {
  }

  blur($event) {
    setTimeout(() => {
      this.results = [];
    }, 200);
  }
  select(item) {
    this.submittedItem.name = item.name;
    this.submittedItem.id = item.id;
    this.input.nativeElement.focus();

  }
  search($event) {
    // in case there is a handler for the search 
    // close it 
    if ($event.keyCode == 13) {

      this.resultSelected.emit(this.submittedItem);
      this.submittedItem = {};
      return;
    }


    if (this.handler)
      clearInterval(this.handler);
    // set a new hander every time the search is applied 
    this.handler = setTimeout(() => {
      // if the search query is empty set the results to empt list 
      if (this.submittedItem.name.trim().length == 0) {
        this.results = [];
      } else {
        let observable: Observable<any[]> = this.searchFunction(this.submittedItem.name);
        observable.subscribe(results => this.results = results);
      }
    }, 100);
  }
}
