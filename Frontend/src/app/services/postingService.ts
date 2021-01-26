import {Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';
import { loginUser, user } from '../models/user';
import { posting } from '../models/posting';
// mongodb://localhost:27017/postingDB
var apiurl = 'http://localhost:5000/router/';


@Injectable()
export class postingService
{
    
    constructor(private httpclient: HttpClient) {}

    async getPostingsOfUser(id): Promise<Observable<any>> {
        return await this.httpclient.get(apiurl+id);
    }

    async postPosting(posting:posting): Promise<Observable<any>> {
        return await this.httpclient.post(apiurl + "create", posting);
    }


}