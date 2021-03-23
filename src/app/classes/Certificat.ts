import { CertificatModel } from "./CertificatModel";
import { Visit } from "./Visit";

export class Certificat { 
    public id : number ; 
    public html : string ; 
    public certificatModel : CertificatModel ;
    public visitId : number ; 
    public visit : Visit ; 
}