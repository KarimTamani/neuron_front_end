import { Component, OnInit, Input } from '@angular/core';
import { MedicalFile } from 'src/app/classes/MedicalFile';

@Component({
  selector: 'app-mini-medical-file',
  templateUrl: './mini-medical-file.component.html',
  styleUrls: ['./mini-medical-file.component.css']
})
export class MiniMedicalFileComponent implements OnInit {
  @Input() medicalFile : MedicalFile ; 
  constructor() {}

  ngOnInit(): void {
    
  }

}
