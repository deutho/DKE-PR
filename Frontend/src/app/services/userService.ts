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

    // getAllHTTP(): Observable<any> {
    //     return this.httpclient.get(apiurl);
    // }


    // async getByShortURLHTTP(shortURL:string): Promise<Observable<any>> {
    //     //var param = (<HTMLInputElement>document.getElementById("sURL")).value;
    //     return await this.httpclient.get(apiurl+shortURL);
    // }


    // postURLHTTP(toPost:URL): Observable<any> {
    //     return this.httpclient.post(apiurl, toPost);
    // }

    // deleteURLHTTP(shortURL:string): Observable<any>{
    //     return this.httpclient.delete(apiurl+shortURL);
    // }

    registerUser(user:user): Observable<any> {
        console.log("in user Service: ", user)
        return this.httpclient.post(apiurl, user);
    }


}