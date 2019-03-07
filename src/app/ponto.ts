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
  }
}