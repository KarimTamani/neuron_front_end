import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-yes-no-message',
  templateUrl: './yes-no-message.component.html',
  styleUrls: ['./yes-no-message.component.css']
})
export class YesNoMessageComponent implements OnInit {
  public message : string ; 
  @Output() closeEvent : EventEmitter<null> ; 
  constructor(private route : ActivatedRoute , private interactionService : InteractionService) {
    this.closeEvent = new EventEmitter<null>() ; 
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.message = params.message 
    })
  }

  submit(value : boolean) {
    this.interactionService.yesOrNo.next(value) ; 
    this.closeEvent.emit() ; 
  }



}
