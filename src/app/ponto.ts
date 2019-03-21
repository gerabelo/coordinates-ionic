import { Component } from '@angular/core';

export class Ponto {
  constructor (id, lat, lng, status, typeId, files, userId) {
    this.id = id;
    this.lat = lat;
    this.lng = lng;
    this.status = status;
    this.typeId = typeId;
    this.files = files;
    this.userId = userId;
  }

  public id: string;
  public lat: string;
	public lng: string;
	public status: string;
  public typeId: string;  
  public files: String[] = [];
  public userId: String;  
}