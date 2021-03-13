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
  public checkUpTypes : CheckUpType[] = [] ; 
  constructor(private apollo: Apollo) { }

  ngOnInit(): void { 
    this.apollo.query({
      query: gql`
        {  
          getCheckUpTypes { id name checkUps { id name }}
        }`
    }
    ).pipe(map(value => (<any>value.data).getCheckUpTypes)).subscribe((data) => {
      this.checkUpTypes = data ;  
    })
  }

}
