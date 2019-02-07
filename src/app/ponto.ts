import { Component } from '@angular/core';

export class Ponto {
  constructor (_id, description, address, lat, lng, status, type) {
    this._id = _id;
    this.description = description;
    this.address = address;
    this.lat = lat;
    this.lng = lng;
    this.status = status;
    this.type = type;
  }

  public _id: String;
	public description: String;
	public address: String;
	public lat: String;
	public lng: String;
	public status: String;
  public type: any;
  //public type: mongoose.Schema.Types.Mixed;

}


    