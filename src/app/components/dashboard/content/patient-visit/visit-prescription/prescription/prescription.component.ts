import { Component, Input, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Cabinet } from 'src/app/classes/Cabinet';
import { Doctor } from 'src/app/classes/Doctor';
import { Visit } from 'src/app/classes/Visit';

@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.css']
})
export class PrescriptionComponent implements OnInit {
  @Input() visit : Visit ;  
  public doctor : Doctor ; 
  public cabinet : Cabinet ; 
  constructor(private apollo : Apollo) {

  }

  ngOnInit(): void {
    this.apollo.query({
      query : gql`
        { 
          getDoctorProfil {
            id name lastname speciality {
              id name
            }
            nameAr 
            lastnameAr
            phone 
            email 
            graduation 
            orderNumber 
          }
        }
      `
    }).pipe(map(value => (<any>value.data).getDoctorProfil)).subscribe((data) => { 
      this.doctor = data ; 
    });  

    this.apollo.query({
      query : gql`
        {
          getCabinet{
            name 
            header 
            headerAr 
            phone 
            email 
            address { 
              address commune {
                id name postalCode
                wilaya { 
                  id name
                }
              }
            }
            services {
              id name language
            }
          } 
        }`
    }).pipe(map(value => (<any>value.data).getCabinet)).subscribe((data) => { 
      this.cabinet = data ;  
    })
  }

}
