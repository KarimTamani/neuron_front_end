import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SUCCESS } from 'src/app/classes/Message';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-rdvsearch-header',
  templateUrl: './rdvsearch-header.component.html',
  styleUrls: ['./rdvsearch-header.component.css']
})
export class RDVSearchHeaderComponent implements OnInit {
  @Input() startDate : string ; 
  @Output() searchEvent : EventEmitter<any> ; 
  @Input() searchQuery : any = {} ; 
  constructor(private interactionService : InteractionService) {
    this.searchEvent = new EventEmitter<null>() ;  
  }

  ngOnInit(): void {}

  public clear() { 
    this.searchQuery = {} 
    this.startDate = null ; 
    this.searchEvent.emit(this.searchQuery)
    
  }

  public search() { 
    this.searchQuery.startDate = this.startDate ; 
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
