import {Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';

//var apiurl = 'http://192.168.1.10:3000/url/shortly.at/';
var apiurl = 'http://shortly.at:3000/url/shortly.at/';


//ALL only as example from one of my last projects


@Injectable()
export class ApiService
{
    
    constructor(private httpclient: HttpClient) {}

    getAllHTTP(): Observable<any> {
        return this.httpclient.get(apiurl);
    }


    async getByShortURLHTTP(shortURL:string): Promise<Observable<any>> {
        //var param = (<HTMLInputElement>document.getElementById("sURL")).value;
        return await this.httpclient.get(apiurl+shortURL);
    }


    postURLHTTP(toPost:URL): Observable<any> {
        return this.httpclient.post(apiurl, toPost);
    }

    deleteURLHTTP(shortURL:string): Observable<any>{
        return this.httpclient.delete(apiurl+shortURL);
    }

}