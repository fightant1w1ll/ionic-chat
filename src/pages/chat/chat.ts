import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { Events, Content, TextInput } from 'ionic-angular';
import { ChatService, ChatMessage, UserInfo } from "../../providers/chat-service";
// import {JIM} from '../../providers/JIM-service';
import moment from 'moment';

@IonicPage()
@Component({
    selector: 'page-chat',
    templateUrl: 'chat.html',
})
export class Chat {

    @ViewChild(Content) content: Content;
    @ViewChild('chat_input') messageInput: TextInput;
    msgList: ChatMessage[] = [];
    user: UserInfo;
    toUser: UserInfo;
    editorMsg = '';
    showEmojiPicker = false;

    webSocket: WebSocket = null;

    constructor(navParams: NavParams,
                private chatService: ChatService,
                // private JIM: JIM,
                private events: Events,) {
        // Get the navParams toUserId parameter
        this.toUser = {
            id: navParams.get('toUserId'),
            name: navParams.get('toUserName')
        };
        // Get mock user information
        this.chatService.getUserInfo(this.toUser.id)
        .then((res) => {
            this.user = res;
            this.initWebSocket();
        });


        /**
        // JIM初始化
        JIM.init(true, data => {
            console.log(data);
        }, err => {
            console.error(err);
        });
         */
    }

    initWebSocket(){
        this.webSocket = new WebSocket('ws://localhost:8081/hellows/chat/' + this.user.id);
        //连接发生错误的回调方法  
        this.webSocket.onerror = () => {
            console.log("WebSocket连接发生错误");
        }

        //连接成功建立的回调方法 
        this.webSocket.onopen = () => {
            console.log("连接成功");
        }

        //接收到消息的回调方法  
        this.webSocket.onmessage = (event) => {
            let mfs: ChatMessage = JSON.parse(event.data);
            console.log(mfs);
            this.pushNewMsg(mfs);
        }

        //连接关闭的回调方法  
        this.webSocket.onclose = () => {
            console.log("断开连接");
        }
    }

    ionViewWillLeave() {
        // unsubscribe
        this.events.unsubscribe('chat:received');
    }

    ionViewDidEnter() {
        //get message list
        // this.getMsg();

        // Subscribe to received  new message events
        this.events.subscribe('chat:received', msg => {
            this.pushNewMsg(msg);
        })
    }

    onFocus() {
        this.showEmojiPicker = false;
        this.content.resize();
        this.scrollToBottom();
    }

    switchEmojiPicker() {
        this.showEmojiPicker = !this.showEmojiPicker;
        if (!this.showEmojiPicker) {
            this.messageInput.setFocus();
        }
        this.content.resize();
        this.scrollToBottom();
    }

    /**
     * @name getMsg
     * @returns {Promise<ChatMessage[]>}
     */
    private getMsg() {
        // Get mock message list
        return this.chatService
        .getMsgList(this.toUser.id)
        .subscribe(res => {
            this.msgList = res;
            this.scrollToBottom();
        });
    }

    /**
     * @name sendMsg
     */
    // sendMsg() {
    //     if (!this.editorMsg.trim()) return;

    //     // Mock message
    //     const id = Date.now().toString();
    //     let newMsg: ChatMessage = {
    //         messageId: Date.now().toString(),
    //         userId: this.user.id,
    //         userName: this.user.name,
    //         userAvatar: this.user.avatar,
    //         toUserId: this.toUser.id,
    //         time: Date.now(),
    //         message: this.editorMsg,
    //         status: 'pending'
    //     };

    //     this.pushNewMsg(newMsg);
    //     this.editorMsg = '';

    //     if (!this.showEmojiPicker) {
    //         this.messageInput.setFocus();
    //     }

    //     this.chatService.sendMsg(newMsg)
    //     .then(() => {
    //         let index = this.getMsgIndexById(id);
    //         if (index !== -1) {
    //             this.msgList[index].status = 'success';
    //         }
    //     })
    // }
    sendMsg(){
        if (!this.editorMsg.trim()) return;
        let newMsg: ChatMessage = {
            messageId: moment().format('x'),
            userId: this.user.id,
            userName: this.user.name,
            userAvatar: this.user.avatar,
            toUserId: this.toUser.id,
            time: moment().format('YYYY-MM-DD HH:mm:ss'),
            content: this.editorMsg,
            status: 'pending'
        };
        this.webSocket.send(JSON.stringify(newMsg));
        this.pushNewMsg(newMsg);
        this.editorMsg = '';
        if (!this.showEmojiPicker) {
            this.messageInput.setFocus();
        }
    }

    /**
     * @name pushNewMsg
     * @param msg
     */
    pushNewMsg(msg: ChatMessage) {
        const userId = this.user.id,
              toUserId = this.toUser.id;
        // Verify user relationships
        if (msg.userId === userId && msg.toUserId === toUserId) {
            this.msgList.push(msg);
        } else if (msg.toUserId === userId && msg.userId === toUserId) {
            this.msgList.push(msg);
        }
        this.scrollToBottom();
    }

    getMsgIndexById(id: string) {
        return this.msgList.findIndex(e => e.messageId === id)
    }

    scrollToBottom() {
        setTimeout(() => {
            if (this.content.scrollToBottom) {
                this.content.scrollToBottom();
            }
        }, 400)
    }
}
