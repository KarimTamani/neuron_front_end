import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-documents-and-diagnosis',
  templateUrl: './documents-and-diagnosis.component.html',
  styleUrls: ['./documents-and-diagnosis.component.css']
})
export class DocumentsAndDiagnosisComponent implements OnInit {
  public selectedOption : string = "documents" ; 
  constructor(private router : Router) { }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateOptions()
      }
    })
    this.updateOptions() ; 
  }
  private updateOptions() {
    if (this.router.url.endsWith("documents"))
      this.selectedOption = "documents";
    else if (this.router.url.endsWith("diagnosis"))
      this.selectedOption = "diagnosis";
  }

}
