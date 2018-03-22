import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { map } from 'rxjs/operators/map';
import { HttpClient } from "@angular/common/http";
import {Observable} from "rxjs/Observable";


export class Message {
    id: string;
    type: string;
    time: number | string;
}

export class ChatMessage extends Message {
    userId: string;
    userName: string;
    userAvatar: string;
    toUserId: string;
    content: string;
    status: string;
}

export class RespondMessage extends Message {
    msgReceived: boolean;
}

export class UserInfo {
    id: string;
    name?: string;
    avatar?: string;
}

@Injectable()
export class ChatService {

    constructor(private http: HttpClient,
                private events: Events) {
    }

    getMsgList(toUserId): Observable<ChatMessage[]> {
        let msgListUrl = '';
        if (toUserId == '140000198202211138') {
            msgListUrl = './assets/mock/Hancock.json';
        }
        if (toUserId == '210000198410281948') {
            msgListUrl = './assets/mock/Luff.json';
        } 
        return this.http.get<any>(msgListUrl)
          .pipe(map(response => response.array));
    }

    getUserInfo(toUserId: string): Promise<UserInfo> {
        const Luff: UserInfo = {
            id: '140000198202211138',
            name: 'Luff',
            avatar: './assets/Luff.jpg'
        };
        const Hancock: UserInfo = {
            id: '210000198410281948',
            name: 'Hancock',
            avatar: './assets/Hancock.jpg'
        };
        return new Promise((resolve, reject) => {
            if (toUserId == '140000198202211138') {
                resolve(Hancock);
            }
            if (toUserId == '210000198410281948') {
                resolve(Luff);
            }
        });
    }

}
