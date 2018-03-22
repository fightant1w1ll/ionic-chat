import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  toUser1 : {toUserId: string, toUserName: string};
  toUser2 : {toUserId: string, toUserName: string};

  toUserList: {toUserId: string, toUserName: string, photo: string, lastWords: string}[] = [];

  constructor() {
    this.toUserList.push({
      toUserId:'140000198202211138',
      toUserName:'路飞',
      photo: 'Luff.jpg',
      lastWords: 'yi ge zu'
    });
    this.toUserList.push({
      toUserId: '210000198410281948',
      toUserName: '汉库克',
      photo: 'Hancock.jpg',
      lastWords: 'See You'
    });
  }


}
