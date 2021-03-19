import { NeuronCollection } from "./NeuronCollection";
import { Visit } from "./Visit";

export class NeuronResponse { 
    public id : number ; 
    public visit : Visit ; 
    public neuronPrediction : string ; 
    public doctorPrediction : string ; 
    public type : string ; 
    public createdAt : string ; 
    public input : string ; 
    public updatedAt : string ; 
    public neuronCollection :  NeuronCollection ; 
}