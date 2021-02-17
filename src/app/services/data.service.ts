import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public DAY = 60 * 60 * 24 ; 
  public WEEK = this.DAY * 7  ;
  public MONTH = this.DAY * 30 ; 
  public TRIMESTER = this.MONTH * 4 ; 
  public SEMESTER = this.MONTH * 6 ; 
  public YEAR = this.MONTH * 356 ; 

  public monthes: string[] = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "October",
    "Novembre",
    "Décembre"
  ];

  public days: string[] = [
    "Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"
  ];

  constructor() { }

  public calculateImc(weight: number, height: number) {
    // a function to calculate the imc bassed from the weight and the height   
    let imc = weight / (height * height / 100) * 100;
    imc = Math.round(imc * 100) / 100;
    return imc;
  }

  public calculateAge(birthday: string , currentDate : Date) {
    // a simple function to calculate the age of the patient 
    // and round it 
    let birthTime = new Date(birthday).getTime();
    
    const currentTime = currentDate.getTime();

    var deltaTime = (currentTime - birthTime);
    var age = deltaTime / (1000 * 365 * 24 * 60 * 60)
    return Math.round(age);
  }


  public getImcInterpretation(imc: number) {
    // get the interpretation of the imc 
    if (imc < 18.5)
      return "Insuffisance pondérale (maigreur)";
    else if (imc < 25)
      return "Corpulence normale";
    else if (imc < 30)
      return "Surpoids";
    else if (imc < 35)
      return "Obésité modérée";
    else if (imc < 40)
      return "Obésité sévère";
    else
      return "Obésité morbide ou massive"

  }


  public castDateYMD(date) {
    if (date == null)
      return null;
    var dateObject = new Date(date)
    var day: any = dateObject.getDate();
    var month: any = dateObject.getMonth() + 1;
    var year: any = dateObject.getFullYear();

    if (day < 10)
      day = "0" + day;

    if (month < 10)
      month = "0" + month;

    year = "" + year;
    return `${year}-${month}-${day}`;
  }


  public castDateMDY(date) {
    if (date == null)
      return null;
    var dateObject = new Date(date);
    var day: any = dateObject.getDate();
    var month: any = dateObject.getMonth() + 1;
    var year: any = dateObject.getFullYear();

    if (day < 10)
      day = "0" + day;

    if (month < 10)
      month = "0" + month;

    year = "" + year;
    return month + "/" + day + "/" + year;
  }
  public getTime(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    if (hours < 10)
      hours = "0" + hours;
    if (minutes < 10)
      minutes = "0" + minutes;

    return `${hours}:${minutes}`
  }


  public getPeriod(startTime, endTime) {
    var startTimeMinutes = this.convertIntoMinutes(startTime);
    var endTimeMinutes = this.convertIntoMinutes(endTime);
    return this.convertMinutesIntoTime(endTimeMinutes - startTimeMinutes)
  }


  public convertMinutesIntoTime(minutes) {
    var hours  :any = Math.trunc(minutes / 60);
    minutes = minutes % 60;
    if (hours <= 9) {
      hours = "0" + hours;
    }

    if (minutes <= 9) {
      minutes = "0" + minutes;
    }
    return hours + ":" + minutes;
  }
  public convertIntoMinutes(time) {
    var hours = parseInt(time.split(":")[0]);
    var minutes = parseInt(time.split(":")[1]);
    return hours * 60 + minutes;
  }

  public dateMinusPeriod(date : string , period : number ) { 
    var dateObj = new Date (date) ; 
    var time = dateObj.getTime() ; 
    time -= (period * 1000) ; 
    var result = new Date(time) ; 
    return result ; 
  }
}
