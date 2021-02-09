import { Component, OnInit, Input } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Visit } from 'src/app/classes/Visit';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-visit-information',
  templateUrl: './visit-information.component.html',
  styleUrls: ['./visit-information.component.css']
})
export class VisitInformationComponent implements OnInit {
  @Input() visit : Visit ; 
  constructor(private apollo : Apollo) { }

  ngOnInit(): void {
      
  }

}
