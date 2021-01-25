import { Component, OnInit, Input } from '@angular/core';
import { Antecedent } from 'src/app/classes/Antecedent';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-antecedents-submitter',
  templateUrl: './antecedents-submitter.component.html',
  styleUrls: ['./antecedents-submitter.component.css']
})
export class AntecedentsSubmitterComponent implements OnInit {
  @Input() antecedents: Antecedent[] ;
  public submittedAntecedent: Antecedent = new Antecedent();
  public types: String[] = [];

  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    // get the antecdents types     
    this.apollo.query({
      query: gql`
        {
          getAntecedentTypes 
        }`
    }).pipe(map(value => (<any>value.data).getAntecedentTypes)).subscribe((data) => {
      this.types = data;
    })
  }

  public searchFunction: any = (query) => {
    // search function of the antecedents
    return this.apollo.query({
      query: gql`
        {
          searchAntecedents(antecedent : {
            name : "${query}" , 
            type : "${this.submittedAntecedent.type}"
          }) {
            id name type 
          }
        }`
    }).pipe(map(value => (<any>value.data).searchAntecedents));
  }

  public addAntecedent() {
    this.apollo.mutate({
      mutation: gql`
        mutation ADD_ANTECDENT($name : String! , $type : String) {
          addAntecedent(antecedent : {
            name : $name  , 
            type : $type 
          }){ 
            id name type
          }
        } 
      `,
      variables: {
        name: this.submittedAntecedent.name,
        type: this.submittedAntecedent.type
      }
    }).pipe(map(value => (<any>value.data).addAntecedent)).subscribe((data) => {
      console.log(data);
      this.antecedents.push(data);
      this.submittedAntecedent = new Antecedent();

    })


  }

  public deleteAntecedent(antecedent) {
    const index = this.antecedents.findIndex(value => value.id == antecedent.id);
    this.antecedents.splice(index, 1);
  }
}
