import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';


import { Editor } from 'ngx-editor';
import { Subscription } from 'rxjs';
import { Certificat } from 'src/app/classes/Certificat';
import { Visit } from 'src/app/classes/Visit';
import { DataService } from 'src/app/services/data.service';
import { VirtualAssistantService } from 'src/app/services/virtual-assistant-service';

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
  private subscriptions : Subscription[] = [] ;  
  public toolbar = [
    ["bold", "italic", "underline"]
  ]
  constructor(private dataService: DataService, private virtualAssistantService: VirtualAssistantService) {
    this.certificat = new Certificat();
    this.backEvent = new EventEmitter<null>();
    this.saveEvent = new EventEmitter<Certificat>();
  }
  ngOnInit(): void {
    this.certificat.html = this.preprocessCertificat(this.certificat.html);
    this.htmlModel = this.certificat.html;
    this.editor = new Editor();
    // subscribe to the VA assistant 
    var subs   = this.virtualAssistantService.onVACommand.subscribe((data) => {
      // if it's default command 
      if (data.default) {
        if (this.certificat.html.endsWith("<p></p>")) {
          var start = this.certificat.html.slice(0, this.certificat.html.length - "</p>".length);
          this.certificat.html = start + data.default + "</p>";
        }else { 
          this.certificat.html += "<p>" + data.default + "</p>" ; 
        }
      }
    }) ; 

    this.subscriptions.push(subs) ; 

  }

  ngOnDestroy() {
    this.editor.destroy();
    this.subscriptions.forEach(subs => {
      subs.unsubscribe() ; 
    })
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
