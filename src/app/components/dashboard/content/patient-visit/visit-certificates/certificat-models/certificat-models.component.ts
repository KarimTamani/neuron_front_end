import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CertificatModel } from 'src/app/classes/CertificatModel';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-certificat-models',
  templateUrl: './certificat-models.component.html',
  styleUrls: ['./certificat-models.component.css']
})
export class CertificatModelsComponent implements OnInit {
  public models: CertificatModel[] = [];
  @Output() closeEvent : EventEmitter<null> ; 

  constructor(private route: ActivatedRoute , private InteractionService : InteractionService) {
    this.closeEvent = new EventEmitter<null>() ; 
  }

  ngOnInit(): void {
    var params = this.route.snapshot.queryParams
    this.models = JSON.parse(decodeURIComponent(params.models));
  }

  public select(model) { 
    this.InteractionService.certificatModelSelected.next(model) ; 
    this.closeEvent.emit() ; 
  }


}
