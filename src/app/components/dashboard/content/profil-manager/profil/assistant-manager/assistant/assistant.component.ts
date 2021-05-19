import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Assistant } from 'src/app/classes/Assistant';
import { InteractionService } from 'src/app/services/interaction.service';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-assistant',
  templateUrl: './assistant.component.html',
  styleUrls: ['./assistant.component.css']
})
export class AssistantComponent implements OnInit {
  @Input() assistant: Assistant;
  @Output() removeEvent : EventEmitter<number> ; 
  constructor(private interactionService: InteractionService, private router: Router, private apollo: Apollo) {
    this.removeEvent = new EventEmitter<number>() ; 
  }

  ngOnInit(): void {
   

  }
  askForDelete() {
    // open yes or no window and ask for confirmation of the deletion of the assistant 
    this.router.navigate([], {
      queryParams: {
        'pop-up-window': true,
        'window-page': 'yes-no-message',
        'message': `Voulais vous vraiment suprimé l'assistant(e) ${this.assistant.name} ${this.assistant.lastname} ?`
      }
    })
     // subscribe to the yes or no window 
     const subscription = this.interactionService.yesOrNo.subscribe((value) => {
      console.log(this.assistant.id) ; 
      if (value == true) {
        // doctor want to delete the assistant
        this.apollo.mutate({
          mutation: gql`
            mutation { 
              removeAssistant(assistantId: ${this.assistant.id})
            }  `
        }).pipe(map(value => (<any>value.data).removeAssistant)).subscribe((id) => {
          this.removeEvent.next(id) ; 
        })
      }
      subscription.unsubscribe() ; 
    })
  }
}
