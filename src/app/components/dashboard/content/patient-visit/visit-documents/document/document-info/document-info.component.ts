import { Component, Input, OnInit } from '@angular/core';
import { Document } from 'src/app/classes/Document';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-document-info',
  templateUrl: './document-info.component.html',
  styleUrls: ['./document-info.component.css']
})
export class DocumentInfoComponent implements OnInit {
  @Input() document: Document;
  public age: number;
  public createdAt: string;
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.age = this.dataService.calculateAge(
      this.document.visit.medicalFile.birthday,
      new Date(parseInt(this.document.createdAt))
    );

    this.createdAt = this.dataService.castFRDate(new Date(parseInt(this.document.createdAt)) )

  }

}
