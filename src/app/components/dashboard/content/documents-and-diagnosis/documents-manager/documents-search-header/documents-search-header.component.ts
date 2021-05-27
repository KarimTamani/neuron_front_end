import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SUCCESS } from 'src/app/classes/Message';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-documents-search-header',
  templateUrl: './documents-search-header.component.html',
  styleUrls: ['./documents-search-header.component.css']
})
export class DocumentsSearchHeaderComponent implements OnInit {
  public searchQuery: any = {}
  @Output() searchEvent: EventEmitter<any>;
  constructor(private interactionService : InteractionService) {
    this.searchEvent = new EventEmitter<any>();
  }

  ngOnInit(): void {
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
    console.log($event) ; 
    if ($event.key == "Enter") { 
      this.search() ; 
    }
  }




}


