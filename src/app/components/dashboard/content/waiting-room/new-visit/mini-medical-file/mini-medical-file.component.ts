import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MedicalFile } from 'src/app/classes/MedicalFile';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-mini-medical-file',
  templateUrl: './mini-medical-file.component.html',
  styleUrls: ['./mini-medical-file.component.css']
})
export class MiniMedicalFileComponent implements OnInit {
  @Input() medicalFile: MedicalFile;
  @Output() closeEvent: EventEmitter<null>;
  @Output() editEvent: EventEmitter<null>;
  @Output() clickMedicalFile : EventEmitter<MedicalFile> ; 

  @Input() disabelShadow : boolean = false; 
  @Input() controllable : boolean = true ; 
  @Input() clickable : boolean = false ; 
  @Input() currentDate : Date ;  

  public birthday : string ;  
  public age : number ; 

  constructor(private dataService : DataService) {
    this.closeEvent = new EventEmitter<null>();
    this.editEvent = new EventEmitter<null>();
    this.clickMedicalFile = new EventEmitter<MedicalFile>() ; 
  }

  ngOnInit(): void {
    
    this.birthday = this.dataService.castFRDate(new Date(this.medicalFile.birthday)) ; 
    this.age = this.dataService.calculateAge(this.medicalFile.birthday , new Date(this.currentDate)) ;   
    console.log(this.age) ; 
  }

  editMedicalFile() {
    this.editEvent.emit();
  }

  closeMedicalFile() {
    this.closeEvent.emit();
  }

  public click() { 
    this.clickMedicalFile.emit(this.medicalFile) ; 
  }

}
