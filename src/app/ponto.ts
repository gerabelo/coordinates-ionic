import { Component } from '@angular/core';

export class Ponto {
  constructor (id, lat, lng, status, typeId, files, userId) {
    this._id = id;
    this.lat = lat;
    this.lng = lng;
    this.status = status;
    this.typeId = typeId;
    this.files = files;
    this.userId = userId;
  }

  public _id: string;
  public description: string;
  public address: string;
  public phone: string;
  public lat: string;
	public lng: string;
  public status: string;
  public website: string;
  public created_at: string;
  public typeId: string;  
  public files: String[] = [];
  public userId: String;  
}


// type: {
//         id: String,
//         icon: String
// },
// user: {
//         username: String,
//         short_name: String,
//         full_name: String
// }