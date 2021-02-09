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
  constructor() {
    this.closeEvent = new EventEmitter<null>();
    this.editEvent = new EventEmitter<null>();
  }

  ngOnInit(): void {

  }

  editMedicalFile() {
    this.editEvent.emit();
  }

  closeMedicalFile() {
    this.closeEvent.emit();
  }

}
