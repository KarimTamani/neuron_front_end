import { MedicalAct } from "./MedicalAct";
import { MedicalFile } from "./MedicalFile";
import { Symptom } from "./Symptom";
import { WaitingRoom } from "./WaitingRoom" ; 
export class Visit {


    public id: number;
    public arrivalTime: string;
    public startTime: string;
    public endTime: string;
    public payedMoney: number;
    public medicalActs: MedicalAct[];
    public medicalFile: MedicalFile;
    public waitingRoom : WaitingRoom ; 
    public symptoms: Symptom[];
    public status: string;
    public debt: number;
    public order: number;
    //public visitDrugDosages : [VisitDrugDosage] 
    //public checkUps : [CheckUp]



    


}