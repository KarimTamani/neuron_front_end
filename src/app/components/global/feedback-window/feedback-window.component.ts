import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from "graphql-tag";
import { map } from "rxjs/operators";

@Component({
  selector: 'app-feedback-window',
  templateUrl: './feedback-window.component.html',
  styleUrls: ['./feedback-window.component.css']
})
export class FeedbackWindowComponent implements OnInit {
  public specialities: any[] = [];
  public marks: any[] = [];
  public notice : String = "" ; 

  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    // get neuron specialities from the server to draw the fuck
    this.apollo.query({
      query: gql`
        {
          getNeuronSpecialities {id , name , collections {id , name }}
        }
      `
    }).pipe(map(result => (<any>result.data).getNeuronSpecialities)).subscribe((data) => {
      this.specialities = data;

    })
  }

  setMark(collection, mark) {
    // if the mark is allready selected un mark it 
    // else set the collection mark to the given mark 

   
    if (collection.mark == mark) {

      for (let index = 0; index < this.marks.length; index++) {
        if (this.marks[index].collectionId == collection.id) {
          this.marks.splice(index, 1)
          break;
        }
      }

      collection.mark = null;
    } else {
      if (collection.mark == null) {
        // if it's the first mark for a specific collection just push it into the marks array  
        this.marks.splice(0, 0, {
          collectionId: collection.id,
          mark: mark
        })
      } else {

        // else get the index of the collection and update the mark
        for (let index = 0; index < this.marks.length; index++) {
          if (this.marks[index].collectionId == collection.id) {
            this.marks[index].mark = mark;

            break;
          }
        }
      }
      collection.mark = mark;
    }
  }




  sendFeedback() {
    // send feed back of the doctor 
    console.log(this.marks)
    this.apollo.mutate({
      mutation : gql`
        mutation ADD_FEEDBACK($notice : String! , $feedbacks : [CollectionMark!]!){
          addFeedback(feedback : {
            notice : $notice , 
            feedbacks : $feedbacks
          })
        }`
        ,variables : {
          notice : this.notice , 
          feedbacks : this.marks
        }
    }).pipe(map(result => (<any>result.data).addFeedback)) .subscribe((data) => {
      // get the doctor auth from the localstorage updat it and save it again 
      let doctorAuth = JSON.parse(localStorage.getItem("doctorAuth")) ; 
      doctorAuth.doctor.lastFeedback = data ; 
      
      localStorage.setItem("doctorAuth" , JSON.stringify(doctorAuth)) ; 
    })
  }
}
