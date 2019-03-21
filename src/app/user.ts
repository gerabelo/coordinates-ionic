export class User {
  constructor() { }
  // constructor (id, username, short_name, phone, full_name, dateCreated, lastUpdate, status, email, login, password) {
  //   this.id = id;
  //   this.username = username;
  //   this.short_name = short_name;
  //   this.phone = phone;
  //   this.full_name = full_name;
  //   this.dateCreated = dateCreated;
  //   this.lastUpdate = lastUpdate;
  //   this.status = status;
  //   this.email = email;
  //   this.login = login;
  //   this.password = password;
  // }
  public _id: String;
  public username: String;
  public short_name: String;
  public full_name: String;
  public status: String;
  public dateCreated: Date;
  public lastUpdate: Date;
  public email: String;
  public phone: String;
  public login: String;
  public password: String;
}