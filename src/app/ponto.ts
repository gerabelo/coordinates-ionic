import { Component } from '@angular/core';

export class Ponto {
  constructor (id, description, phone, address, lat, lng, status, type) {
    this.id = id;
    this.description = description;
    this.phone = phone;
    this.address = address;
    this.lat = lat;
    this.lng = lng;
    this.status = status;
    this.type = type;
  }

  public id: String;
  public description: String;
  public phone: String;
	public address: String;
	public lat: String;
	public lng: String;
	public status: String;
  public type: {
      id: String;
      icon: String;
  }
}


    