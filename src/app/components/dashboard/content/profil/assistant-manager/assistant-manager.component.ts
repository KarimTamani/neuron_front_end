import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { Assistant } from 'src/app/classes/Assistant';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-assistant-manager',
  templateUrl: './assistant-manager.component.html',
  styleUrls: ['./assistant-manager.component.css']
})
export class AssistantManagerComponent implements OnInit {
  public assistants: Assistant[] = [];
  constructor(private apollo: Apollo , private interactionService : InteractionService) { }

  ngOnInit(): void {

    this.apollo.query({
      query: gql`
        {
          getCabinet { 
            assistants { 
              id 
              name 
              lastname 
              phone 
              email 
              gender 
              createdAt 
              updatedAt 
            }
          }
        }  
      `
    }).pipe(map(value => (<any>value.data).getCabinet)).subscribe((data) => {
      if (data) {
        this.assistants = data.assistants ; 
        console.log(this.assistants) ; 
      }
    })
    this.interactionService.assistantCreated.subscribe((assistant : Assistant) => {
      this.assistants.splice(0 , 0 , assistant) ; 
    })

  }

  public remove(id) {
    const index = this.assistants.findIndex(value => value.id == id) ; 
    this.assistants.splice(index , 1) ; 
  }
}
