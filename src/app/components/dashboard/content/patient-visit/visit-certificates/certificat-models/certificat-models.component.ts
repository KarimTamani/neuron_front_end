import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { CertificatModel } from 'src/app/classes/CertificatModel';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-certificat-models',
  templateUrl: './certificat-models.component.html',
  styleUrls: ['./certificat-models.component.css']
})
export class CertificatModelsComponent implements OnInit {
  public certificatModels: CertificatModel[] = [];
  public openModelSubmitter : boolean = false  ; 
  public type : string = "Certificat" ; 

  @Output() closeEvent : EventEmitter<null> ; 

  constructor(private route: ActivatedRoute , private apollo : Apollo, private InteractionService : InteractionService) {
    this.closeEvent = new EventEmitter<null>() ; 
  }
  ngOnInit(): void {
    var params = this.route.snapshot.queryParams ; 
    if (params["type"]) { 
      this.type = params["type"] ; 
    }  
    this.apollo.query({
      query: gql`
          query {
            getCertificatModels {
              id title type html createdAt updatedAt type isPublic 
            }
          }`
    }).pipe(map(value => (<any>value.data).getCertificatModels)).subscribe((data) => {
      this.certificatModels = data ; 
    })
     
  }

  get certificatTypeBased() { 
    return this.certificatModels.filter(value => value.type == this.type);
  }

  public select(model) { 
    this.InteractionService.certificatModelSelected.next(model) ; 
    this.closeEvent.emit() ; 
  }

}
