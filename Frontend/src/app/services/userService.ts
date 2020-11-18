import {Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';
import { user } from '../models/user';

var apiurl = 'http://localhost:3000/auth/register';


@Injectable()
export class userService
{
    
    constructor(private httpclient: HttpClient) {}

    registerUser(user:user): Observable<any> {
        return  this.httpclient.post(apiurl, user);
    }


}