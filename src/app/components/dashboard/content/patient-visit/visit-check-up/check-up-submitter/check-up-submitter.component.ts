import { Component, Input, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { CheckUp } from 'src/app/classes/CheckUp';
import { CheckUpType } from 'src/app/classes/CheckUpType';

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
  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    
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
          this.checkUpsList = data ;  
        })
      }, 200);
    else 
      this.checkUpsList = []; 
  }
} 
