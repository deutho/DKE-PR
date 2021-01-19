import {Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';
import { loginUser, user } from '../models/user';
import { posting } from '../models/posting';
// mongodb://localhost:27017/postingDB
var apiurl = 'http://localhost:5050/';


@Injectable()
export class notificationService
{
    
    constructor(private httpclient: HttpClient) {}

    async getNotifications(user): Promise<Observable<any>> {
        return await this.httpclient.get(apiurl+user);
    }

    async addNotification(user, message: string): Promise<Observable<any>> {
        message = message.replace(" ", "%20")
        return await this.httpclient.post(apiurl + user + "/" + message , null);
    }

    async removeNotification(user, message): Promise<Observable<any>> {
        return await this.httpclient.delete(apiurl + user + "/" + message);
    }

    async removeAllNotifications(user): Promise<Observable<any>> {
        return await this.httpclient.delete(apiurl + user);
    }


}