export interface IExpense {
    id: string;
    naziv: string;
    datum_odhoda: string; // or Date if it's a Date object
    datum_prihoda: string; // or Dat
    kilometrina?: number;
    lokacija: string;
    opis?: string;
    oseba: string;
    cena?: number;
}
