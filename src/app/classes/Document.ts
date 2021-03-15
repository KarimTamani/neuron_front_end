import { Visit } from "./Visit";

export class Document {
    public id: number;
    public name: string;
    public path: string;
    public description: string ;
    public visitId : number ;  
    public visit : Visit ; 
}