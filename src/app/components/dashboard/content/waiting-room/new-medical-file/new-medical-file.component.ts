import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MedicalFile } from 'src/app/classes/MedicalFile';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Profession } from 'src/app/classes/Profession';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-new-medical-file',
  templateUrl: './new-medical-file.component.html',
  styleUrls: ['./new-medical-file.component.css']
})
export class NewMedicalFileComponent implements OnInit {
  public form: FormGroup = new FormGroup({
    name: new FormControl("", [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(20)
    ]),
    lastname: new FormControl("", [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(20)
    ]),
    email: new FormControl("", [
      Validators.email
    ]),
    phone: new FormControl("", [
      Validators.required,
      Validators.pattern(/^(00213|\+213|0)(5|6|7)[0-9]{8}$/)
    ]),
    birthday: new FormControl("", [
      Validators.required
    ]),
    address: new FormControl("", [
      Validators.minLength(4),
      Validators.maxLength(64),
    ]),
    wilayaId: new FormControl(null, [
      Validators.required
    ]),
    communeId: new FormControl(null, [
      Validators.required
    ])
  })


  public wilayas: any[] = [];
  public selectedWilaya: any = null;
  public professions : Profession[] = [] ; 
  
  @Input() medicalFile: MedicalFile;
  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    if (this.medicalFile == null)
      this.medicalFile = new MedicalFile();

    // get all the wilayas 
    this.apollo.query({
      query: gql`
      {
        getAllWilayas {
          id
          name
          communes {
            id 
            name
            postalCode
          }
        }
      }
      `
    }).pipe(map(value => (<any>value.data).getAllWilayas)).subscribe((data) => {
      this.wilayas = data;
    })

    this.apollo.query({
      query : gql`
        {
          getAllProfessions{
            id name
          }
        }`
    }).pipe(map(value => (<any>value.data).getAllProfessions)).subscribe((data) => {
      this.professions = data ; 
    })
  }
  public professionSearchFunction : any = (query : string) => { 
    return new Observable((observer ) => {
      observer.next(this.professions.filter(value => value.name.toLowerCase().includes(query.toLowerCase()))) ; 
      console.log(this.medicalFile) ; 
    })
  }

  wilayaSelected() {
    // filter by if to find the selected wilaya 
    this.selectedWilaya = this.wilayas.find(wilaya => wilaya.id == this.form.value.wilayaId);
    this.medicalFile.address.commune.id = null ;  

  }


}
