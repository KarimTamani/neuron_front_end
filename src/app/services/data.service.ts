import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  public calculateImc(weight: number, height: number) {
    // a function to calculate the imc bassed from the weight and the height   
    let imc = weight / (height * height / 100) * 100;
    imc = Math.round(imc * 100) / 100;
    return imc;
  }

  public calculateAge(birthday: string) {
    // a simple function to calculate the age of the patient 
    // and round it 
    let birthTime = new Date(birthday).getTime();
    const currentTime = new Date().getTime();

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

}
