import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MedicalFile } from 'src/app/classes/MedicalFile';

@Component({
  selector: 'app-mini-medical-file',
  templateUrl: './mini-medical-file.component.html',
  styleUrls: ['./mini-medical-file.component.css']
})
export class MiniMedicalFileComponent implements OnInit {
  @Input() medicalFile: MedicalFile;
  @Output() closeEvent: EventEmitter<null>;
  @Output() editEvent: EventEmitter<null>;
  @Output() clickEvent : EventEmitter<MedicalFile> ; 

  @Input() disabelShadow : boolean = false; 
  @Input() controllable : boolean = true ; 
  @Input() clickable : boolean = false ;  


  constructor() {
    this.closeEvent = new EventEmitter<null>();
    this.editEvent = new EventEmitter<null>();
    this.clickEvent = new EventEmitter<MedicalFile>() ; 

  }

  ngOnInit(): void {

  }

  editMedicalFile() {
    this.editEvent.emit();
  }

  closeMedicalFile() {
    this.closeEvent.emit();
  }

  public click() { 
    this.clickEvent.emit(this.medicalFile) ; 
  }

}
