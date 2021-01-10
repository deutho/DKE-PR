import {Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';
import { loginUser, user } from '../models/user';
// mongodb://localhost:27017/postingDB
var apiurl = 'http://localhost:5000/router/';


@Injectable()
export class postingService
{
    
    constructor(private httpclient: HttpClient) {}

    async getPostingsOfUser(id: Number): Promise<Observable<any>> {
        return await this.httpclient.get(apiurl+id);
    }


}