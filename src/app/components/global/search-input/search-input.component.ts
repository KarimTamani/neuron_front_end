import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { MedicalFile } from 'src/app/classes/MedicalFile';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css']
})
export class SearchInputComponent implements OnInit {

  @Input() placeholder: string = "";
  @Input() searchFunction: any;
  @Output() itemSelected: EventEmitter<any>;
  @Output() searchSubmitted : EventEmitter<any> ; 
  @Output() onChange : EventEmitter<any> ; 

  @Input() submittedItem: any;
  @Input() formControlName : string ; 
  @ViewChild("input", {}) input;
  @Input() type : string = "name"
  @Input() valid : boolean = true ; 
  public results: any[] = [];
  private handler: any = null;

  constructor(private dataService : DataService) {
    this.itemSelected = new EventEmitter<any>();
    this.searchSubmitted = new EventEmitter<any>() ; 
    this.onChange = new EventEmitter<any>() ; 
  }
  ngOnInit(): void {
  }

  blur($event) {
    setTimeout(() => {
      this.results = [];
    }, 200);
  }

  change($event ) {  
    this.onChange.emit( this.submittedItem ) ; 
    
  }
  select(item) {
    this.submittedItem.name = item.name;
    this.submittedItem.id = item.id;
    this.input.nativeElement.focus();
    this.itemSelected.emit (item) ; 

  }
  search($event) {
    // in case there is a handler for the search 
    // close it 
    if ($event.keyCode == 13) {

      this.searchSubmitted.emit(this.submittedItem);
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

  public frDate ( date : string ) { 
    return this.dataService.castFRDate(new Date ( date )) ; 
  }
}
