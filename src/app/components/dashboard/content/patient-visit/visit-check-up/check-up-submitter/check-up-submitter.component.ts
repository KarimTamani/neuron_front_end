import { Component, Input, NgZone, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { CheckUp } from 'src/app/classes/CheckUp';
import { CheckUpType } from 'src/app/classes/CheckUpType';
import { VirtualAssistantService } from 'src/app/services/virtual-assistant-service';

@Component({
  selector: 'app-check-up-submitter',
  templateUrl: './check-up-submitter.component.html',
  styleUrls: ['./check-up-submitter.component.css']
})
export class CheckUpSubmitterComponent implements OnInit {
  @Input() checkUps: CheckUp[];
  @Input() checkUpTypes: CheckUpType[] = [];
  public checkUpsList: CheckUp[] = [];
  public name: string;
  public handler: any;
  constructor(private apollo: Apollo, private zone: NgZone, private virtualAssistantService: VirtualAssistantService) { }

  ngOnInit(): void {
    var checkUps: CheckUp[] = [];
    this.checkUpTypes.forEach((type) => {
      checkUps = checkUps.concat(type.checkUps)
    });
    this.virtualAssistantService.onVACommand.subscribe((data) => {
      this.zone.run(() => {
        if (data.default) {
          for (let index = 0; index < checkUps.length; index++) {

            if (data.default.includes(checkUps[index].name.toLocaleLowerCase()) && 
            this.checkUps.findIndex(value => value.id == checkUps[index].id) < 0) { 
            
              this.checkUps.push(checkUps[index]);
            
            }
          }
        }
      })
    })
  }


  public search($event) {
    if (this.handler)
      clearInterval(this.handler);
    if (this.name && this.name.trim().length > 0)
      this.handler = setTimeout(() => {
        this.apollo.query({
          query: gql`{
            searchCheckUps(name : "${this.name}") { id name checkUpTypeId }
          }`
        }).pipe(map(value => (<any>value.data).searchCheckUps)).subscribe((data) => {
          this.checkUpsList = data;
        })
      }, 200);
    else
      this.checkUpsList = [];
  }
} 
