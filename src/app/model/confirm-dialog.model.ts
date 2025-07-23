export class ConfirmBoxDialogModel {
        title: string;
        message: string;
        submessage: string;
        constructor(title: string, message: string, submessage: string) {
                this.title = title;
                this.message = message;
                this.submessage = submessage;
        }
}