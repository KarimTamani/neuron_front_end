import { Component, Input, OnInit } from '@angular/core';
import { Document } from 'src/app/classes/Document';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {
  @Input() document : Document ; 
  constructor() { }

  ngOnInit(): void { 
  }

}
