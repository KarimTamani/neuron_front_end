import { Component, OnInit } from '@angular/core';
import { Wilaya } from 'src/app/classes/Wilaya';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-search-header',
  templateUrl: './search-header.component.html',
  styleUrls: ['./search-header.component.css']
})
export class SearchHeaderComponent implements OnInit {
  public wilayas : Wilaya[] = [] ;  
  public selectedWilaya : Wilaya ; 
  public selectedWilayaId : number ; 
  constructor(private apollo : Apollo) {}

  ngOnInit(): void {
  
    this.apollo.query({
      query : gql`
        { 
          getAllWilayas { 
            id name communes { 
              id name
            }
          }
        }
      `
    }).pipe(map(value =>(<any>value.data).getAllWilayas)).subscribe((data) => { 
      this.wilayas = data ;  
    })
  
  }
  
  public wilayaSelected() {
    // filter by if to find the selected wilaya 
    this.selectedWilaya = this.wilayas.find(wilaya => wilaya.id ==  this.selectedWilayaId);
  }
}
