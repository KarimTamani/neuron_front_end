import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SUCCESS } from 'src/app/classes/Message';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-debt-search-header',
  templateUrl: './debt-search-header.component.html',
  styleUrls: ['./debt-search-header.component.css']
})
export class DebtSearchHeaderComponent implements OnInit {
  @Input() searchQuery: any = {}
  @Output() searchEvent: EventEmitter<any>;
  constructor(private interactionService : InteractionService) {
    this.searchEvent = new EventEmitter<any>();
  }

  ngOnInit(): void {
  }


  public clear() {
    this.searchQuery = {};
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
