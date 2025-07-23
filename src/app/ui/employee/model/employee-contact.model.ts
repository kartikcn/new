export class EmployeeContact {

        // phoneHome?: number | null;
        phoneWork?: number | null;
        phonePersonal?: number | null;
        faxNum?: string | null;
        altContactName?: string | null;
        altContactPhone?: number | null;

        constructor(values: object = {}) {
                Object.assign(this, values);
        }
}