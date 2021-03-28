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
  public submittedModel : CertificatModel ; 
  @Output() closeEvent : EventEmitter<null> ; 

  constructor(private route: ActivatedRoute , private apollo : Apollo, private InteractionService : InteractionService) {
    this.closeEvent = new EventEmitter<null>() ; 
  }
  ngOnInit(): void {
    
    this.apollo.query({
      query: gql`
          query {
            getCertificatModels {
              id title type html createdAt updatedAt type isPublic 
            }
          }`
    }).pipe(map(value => (<any>value.data).getCertificatModels)).subscribe((data) => {
      this.certificatModels = data ; 
      if (this.certificatModels.length >= 2 ) { 
        this.submittedModel = this.certificatModels[1]  ; 
      }
    })
     
  }

  public select(model) { 
    this.InteractionService.certificatModelSelected.next(model) ; 
    this.closeEvent.emit() ; 
  }

  public back() { 
    this.openModelSubmitter = false ; 
  }

  public save($event) { 
    this.certificatModels.push($event) ; 
    this.openModelSubmitter = false ; 
  }
}
