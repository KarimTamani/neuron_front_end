import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { CheckUpType } from 'src/app/classes/CheckUpType';

@Component({
  selector: 'app-check-ups-models',
  templateUrl: './check-ups-models.component.html',
  styleUrls: ['./check-ups-models.component.css']
})
export class CheckUpsModelsComponent implements OnInit {
  public checkUpTypes : CheckUpType[] = [] ; 
  constructor(private apollo : Apollo) {}
  
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
