import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from "graphql-tag";
import { map } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { InteractionService } from 'src/app/services/interaction.service';
import { Message, SUCCESS } from 'src/app/classes/Message';
@Component({
  selector: 'app-general-information',
  templateUrl: './general-information.component.html',
  styleUrls: ['./general-information.component.css']
})
export class GeneralInformationComponent implements OnInit {
  public doctor: any = {};
  public specialities: any[] = [];
  public selectedSpeciality = null;
  // form validation for doctor signup 
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
    nameAr : new FormControl("" ,[
      Validators.minLength(4)  
    ]), 
    lastnameAr : new FormControl("" ,[
      Validators.minLength(4) 
    ]), 
    email: new FormControl("", [
      Validators.required,
      Validators.email
    ]),
    phone: new FormControl("", [
      Validators.required,
      Validators.pattern(/^(00213|\+213|0)(5|6|7)[0-9]{8}$/)
    ]),
    graduation: new FormControl("", [
      Validators.minLength(4),
      Validators.maxLength(20)
    ]),
    orderNumber: new FormControl("", [
      Validators.minLength(4),
      Validators.maxLength(20)
    ]),
    specialityId: new FormControl("", [

    ])
  });

  constructor(private apollo: Apollo , private interactionService : InteractionService) { }
  ngOnInit(): void {
    // get the doctor profil from the apollo server
    this.apollo.query<any>({
      query: gql`
      { 
        getDoctorProfil {
          id
          name
          lastname 
          nameAr 
          lastnameAr
          lastFeedback 
          premiumRequest 
          phone
          email 
          graduation 
          gender
          orderNumber 
          speciality { id name }
        }
      }`
    }).pipe(map(value => value.data.getDoctorProfil)).subscribe((data) => {
      this.doctor = data;
      if (this.doctor.speciality)
        this.selectedSpeciality = this.doctor.speciality.id
      if (this.doctor.gender === null) 
        this.doctor.gender = true ; 
    });
    // get all the specialities that we have 
    this.apollo.query({
      query: gql`
      { 
        getAllSpecialities{
          id name
        }
      }
      `
    }).pipe(map(value => (<any>value.data).getAllSpecialities)).subscribe((data) => {
      this.specialities = data;

    })
  }
  submit() {
    this.apollo.mutate({
      mutation: gql`
      mutation EDIT_DOCTOR($name : String! , $lastname : String! , $email : String! , $phone : String! , $nameAr : String , $lastnameAr : String , $orderNumber : String , $graduation : String , $specialityId : ID , $gender : Boolean){
        editDoctor(doctorInput : {
          name : $name  , 
          lastname : $lastname , 
          email : $email , 
          phone :  $phone , 
          gender : $gender
          graduation : $graduation , 
          orderNumber : $orderNumber 
          specialityId : $specialityId, 
          nameAr : $nameAr ,
          lastnameAr : $lastnameAr ,
        })  {
          token , 
          doctor {
            id
            name
            lastname 
            nameAr 
            lastnameAr
            lastFeedback 
            premiumRequest 
            phone
            email 
            graduation 
            gender
            orderNumber 
            speciality { id name }
          }
        }
      }
      ` , variables : { 
        name : this.form.value.name , 
        lastname : this.form.value.lastname , 
        nameAr : this.form.value.nameAr , 
        lastnameAr : this.form.value.lastnameAr , 
        gender : this.form.value.gender , 
        email : this.form.value.email , 
        graduation : this.form.value.graduation , 
        orderNumber : this.form.value.orderNumber , 
        phone : this.form.value.phone , 
        specialityId : this.form.value.specialityId 
      }
    }).pipe(map(value => (<any>value.data).editDoctor)).subscribe((data) => {
      var doctorAuth = JSON.parse( localStorage.getItem("doctorAuth") )  ; 
      var cabinet = doctorAuth.doctor.cabinet ; 
      data.doctor.cabinet = cabinet ; 

      localStorage.setItem("doctorAuth", JSON.stringify(data)) ; 
      this.interactionService.profilEdited.next(data.doctor) ; 


      this.interactionService.showMessage.next(<Message>{
        message : "Votre profil est modifié" , 
        type : SUCCESS
      })
    })
  }
}
