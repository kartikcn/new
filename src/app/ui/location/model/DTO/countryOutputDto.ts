import { Ctry } from '../../../../model/country-list.model';

export class CountryOutputDto{
    ctry:Ctry;

  constructor(ctry: Ctry) {
    this.ctry = ctry;
    }
}

