
import { Antecedent } from "./Antecedent";
import { Profession } from "./Profession";
import { Address } from './Address';
export class MedicalFile {

    public id: number;
    public name: string;
    public lastname: string;
    public address: Address
    public phone: String;
    public email: String;
    public birthday: String;
    public gender: Boolean = true;
    public createdAt: String;
    public updatedAt: String;
    public antecedents: Antecedent[] = [];
    public profession: Profession;


    public constructor () {
        this.address = new Address() ; 
        this.profession = new Profession() ; 
    }
}