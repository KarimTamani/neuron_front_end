import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';


import { Editor } from 'ngx-editor';
import { Certificat } from 'src/app/classes/Certificat';
import { Visit } from 'src/app/classes/Visit';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-certificat-editor',
  templateUrl: './certificat-editor.component.html',
  styleUrls: ['./certificat-editor.component.css']
})
export class CertificatEditorComponent implements OnInit, OnDestroy {
  @Input() certificat: Certificat;
  @Input() visit: Visit;
  @Input() isEdit: boolean = false;

  @Output() backEvent: EventEmitter<null>;
  @Output() saveEvent: EventEmitter<Certificat>;

  private htmlModel: string;
  public editor: Editor;
  public toolbar = [
    ["bold", "italic", "underline"]
  ]
  constructor(private dataService: DataService) {
    this.certificat = new Certificat();
    this.backEvent = new EventEmitter<null>();
    this.saveEvent = new EventEmitter<Certificat>();
  
  }
  ngOnInit(): void {
    this.certificat.html = this.preprocessCertificat(this.certificat.html);
    this.htmlModel = this.certificat.html;
    this.editor = new Editor();
  }

  ngOnDestroy() {
    this.editor.destroy();
  }

  


  private preprocessCertificat(html: string): string {
    if (!html)
      return "";
    let doctorAuth = JSON.parse(localStorage.getItem("doctorAuth"));

    let fullname = doctorAuth.doctor.name + " " + doctorAuth.doctor.lastname;
    fullname = fullname.charAt(0).toLocaleUpperCase() + fullname.slice(1);
    html = html.replace(/_\s*(\w+)/, `<strong>${fullname}</strong>`);

    let patientFullname = this.visit.medicalFile.name + " " + this.visit.medicalFile.lastname;
    patientFullname = patientFullname.charAt(0).toLocaleUpperCase() + patientFullname.slice(1);
    html = html.replace(/_\s*(\w+)/, `<strong>${patientFullname}</strong>`);

    let patientBirthday = this.dataService.castFRDate(new Date(this.visit.medicalFile.birthday));
    html = html.replace(/_\s*(\w+)/, `<strong>${patientBirthday}</strong>`);

    let patientAge = this.dataService.calculateAge(this.visit.medicalFile.birthday, new Date(parseInt(this.visit.createdAt)));
    html = html.replace(/_\s*(\w+)/, `<strong>${patientAge} Ans </strong>`);

    return html;
  }
  public back() {
    this.certificat.html = this.htmlModel;
    this.backEvent.emit();
  }

  public restart() {
    this.certificat.html = this.htmlModel;
  }
  public save() {
    this.saveEvent.emit(this.certificat);
  }
  public edit() { 
    this.backEvent.emit();
  }
}
