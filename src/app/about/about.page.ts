import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  constructor(_location: Location) { }

  ngOnInit() {
  }

  goback() {
    // this.navCtrl.navigateBack;
    this._location.back();
  }

}
