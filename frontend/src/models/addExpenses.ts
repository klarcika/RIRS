import { IUser } from "./user";

export interface IAddExpense{
    id: string;
    naziv: string;
    datum_odhoda: string;
    datum_prihoda: string;
    kilometrina: number;
    lokacija: string;
    opis: string;
    oseba: string;
}