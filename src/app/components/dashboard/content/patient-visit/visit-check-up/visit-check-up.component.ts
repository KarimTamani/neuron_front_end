import { Component, Input, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { CheckUpType } from 'src/app/classes/CheckUpType';
import { Visit } from 'src/app/classes/Visit';

@Component({
  selector: 'app-visit-check-up',
  templateUrl: './visit-check-up.component.html',
  styleUrls: ['./visit-check-up.component.css']
})
export class VisitCheckUpComponent implements OnInit {
  @Input() visit : Visit ; 
  public checkUpTypes : CheckUpType[] = [] ; 
  constructor(private apollo : Apollo) { }

  ngOnInit(): void {
    this.apollo.query({
      query: gql`
        {  
          getCheckUpTypes { id name checkUps { id name checkUpTypeId }}
        }`
    }
    ).pipe(map(value => (<any>value.data).getCheckUpTypes)).subscribe((data) => {
      this.checkUpTypes = data;
    })
  }

   
}
