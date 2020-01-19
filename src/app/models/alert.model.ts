export class Alert {
  messages:string[];
  type:string;

  private allowedTypes:string[] = ["primary" , "danger", "success", "warning"];

  constructor () {
    this.messages = new Array<string>();
  }

  setType (type:string) {
    if (this.allowedTypes.includes(type))
      this.type = type;
    else
      alert("Wrong alert type.");
  }

  clearMessages () {
    this.messages = new Array<string>();
  }

  addMessage (message:string) {
    this.messages.push(message);
  }

  hasAnyMessages():boolean {
    return this.messages.length != 0;
  }

  hasOneMessage():boolean {
    return this.messages.length == 1;
  }
}
