import { Component } from '@angular/core';

export class Ponto {
  constructor (id, description, phone, address, lat, lng, status, type, website) {
    this.id = id;
    this.description = description;
    this.phone = phone;
    this.address = address;
    this.lat = lat;
    this.lng = lng;
    this.status = status;
    this.type = type;
    this.website = website;
  }

<<<<<<< HEAD
  public id: String;
  public description: String;
  public phone: String;
  public address: String;
  public website: String;
	public lat: String;
	public lng: String;
	public status: String;
  public type: {
      id: String;
      icon: String;
=======
  public id: string;
  public description: string;
  public phone: string;
  public address: string;
  public website: string;
	public lat: string;
	public lng: string;
	public status: string;
  public type: {
      id: string;
      icon: string;
>>>>>>> 47eaa016899c9598c7f1582eff4a060f20e93bbf
  }
}


    