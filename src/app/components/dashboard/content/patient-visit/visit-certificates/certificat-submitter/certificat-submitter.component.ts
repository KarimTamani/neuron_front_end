import { Component, Input , OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag'; 
import { map } from 'rxjs/operators';
import { CertificatModel } from 'src/app/classes/CertificatModel';
@Component({
  selector: 'app-certificat-submitter',
  templateUrl: './certificat-submitter.component.html',
  styleUrls: ['./certificat-submitter.component.css']
})
export class CertificatSubmitterComponent implements OnInit {

  public certificatTypes: string[] = [
    "Certificat",
    "Compte-Rendu"
  ];
  public selectedType: string;
  public certificatModels: CertificatModel[] = [];

  @Input() certificat: any;

  constructor(private apollo: Apollo) {
    this.selectedType = this.certificatTypes[0];
  }

  ngOnInit(): void {

      this.apollo.query({
        query : gql`
          query {
            getCertificatModels {
              id title type html createdAt updatedAt type isPublic 
            }
          }`
      }).pipe(map(value => (<any>value.data).getCertificatModels)).subscribe((data) => { 
        this.certificatModels = data ; 
        console.log(data) ; 
      })
  }



  get selectedTypeCertificats() { 
    return this.certificatModels.filter (model => model.type == this.selectedType) ; 

  }



  /*
    public toolbar = [
      ["bold", "italic", "underline" ] 
    ] 
    */

}
