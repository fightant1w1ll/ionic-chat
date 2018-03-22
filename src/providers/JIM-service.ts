import { Injectable } from "@angular/core";
import md5 from 'md5';
import uuid from 'uuid';
import moment from 'moment';

declare let JMessage: any;

@Injectable()
export class JIM{

    private __MasterSercet = '934c6a71548fbfa842a155f6';
    private appkey = 'aa9ffdc83d63ff28d375128f';
    private random_str = uuid();
    private timestamp = moment().format('x');
    private signature = md5(`appkey=${this.appkey}&timestamp=${this.timestamp}&random_str=${this.random_str}&key=${this.__MasterSercet}`);
    private flag: number = 0;
    private _JMessage;

    constructor(){
        this._JMessage = new JMessage({
            debug : true
        });
    }

    init(flag?: boolean, onSuccess?: (data: Object) => void, onFail?: (error: Object) => void){
        let option = {
            "appkey": this.appkey,
            "random_str":  this.random_str,
            "signature":  this.signature,
            "timestamp":  this.timestamp,
            "flag": flag? 1 : this.flag
        }
        this._JMessage.init(option)
            .onSuccess(data => {
                console.log(data);
            })
            .onFail(onFail);
    }

    hello(): void{
        console.log(`hello ts`);
    }
}