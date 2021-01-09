import {Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';
import { loginUser, user } from '../models/user';

var apiurl = 'http://localhost:3000/auth/';


@Injectable()
export class userService
{
    
    constructor(private httpclient: HttpClient) {}

    async registerUser(user:user): Promise<Observable<any>> {       
        return await this.httpclient.post(apiurl + "register", user)
    }

    async loginUser(user: loginUser): Promise<Observable<any>> {
        return await this.httpclient.post(apiurl + "login", user)
    }

    async getUserData(id): Promise<Observable<any>> {
        return await this.httpclient.get(apiurl + "user/"+id)
    }


}