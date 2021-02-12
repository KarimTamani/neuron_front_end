import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Visit } from 'src/app/classes/Visit';

@Component({
  selector: 'app-visits-manager',
  templateUrl: './visits-manager.component.html',
  styleUrls: ['./visits-manager.component.css']
})
export class VisitsManagerComponent implements OnInit {
  public visits : Visit[] = []
  constructor(private apollo : Apollo) { }

  ngOnInit(): void {
    this.apollo.query({
      query : gql`
        { 
          searchVisits {
            id 
            arrivalTime 
            status 
            startTime 
            endTime 
            debt 
            payedMoney
            order 
            medicalFile{
              id
              name 
              lastname 
              birthday 
              gender 
              email 
              phone 
              address {
                id address commune {
                  id name wilaya { 
                    id name
                  }
                }
              }
            }
            condition { 
              id name
            }
          }
        }
      `
    }).pipe(map(value =>(<any>value.data).searchVisits)).subscribe((data) => { 
      this.visits = data ; 
    })
  }
}
