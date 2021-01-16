import { Address } from "cluster";
import { Antecedent } from "./Antecedent";
import { Profession } from "./Profession";
export class MedicalFile {

    public id: number;
    public name: string;
    public lastname: string;
    public address: Address
    public phone: String;
    public email: String;
    public birthday: String;
    public gender: Boolean;
    public createdAt: String;
    public updatedAt: String;
    public antecedents: Antecedent[];
    public profession: Profession;
}