import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Editor } from 'ngx-editor';
@Component({
  selector: 'app-certificat-submitter',
  templateUrl: './certificat-submitter.component.html',
  styleUrls: ['./certificat-submitter.component.css']
})
export class CertificatSubmitterComponent implements OnInit, OnDestroy {
  public editor: Editor;
  public html: string = "";
  @Input() certificat : any ; 

  
  public toolbar = [
    ["bold", "italic", "underline" ] 
  ] 
  constructor() { }

  ngOnInit(): void {
    console.log(this.certificat) ; 
    this.editor = new Editor();
  }


  ngOnDestroy() {
    this.editor.destroy();
  }

  public save() { 
    console.log(this.certificat.content) ; 
  }

}
