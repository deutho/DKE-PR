import {Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';
import {rootCreatePerson} from '../models/userNetwork'

var apiurl = 'http://localhost:8083/neo4j/';
// var apiurl = 'http://shortly.at:3000/';


//ALL only as example from one of my last projects


@Injectable()
export class networkingService
{
    
    constructor(private httpclient: HttpClient) {}

    // getAllHTTP(): Observable<any> {
    //     return this.httpclient.get(apiurl);
    // }


    // async getByShortURLHTTP(shortURL:string): Promise<Observable<any>> {
    //     //var param = (<HTMLInputElement>document.getElementById("sURL")).value;
    //     return await this.httpclient.get(apiurl+shortURL);
    // }


    addUserToNetwork(user:rootCreatePerson): Observable<any> {
        return this.httpclient.post(apiurl + "createPerson", user);
    }

    // deleteUserFromNetwork(user:rootDeletePerson): Observable<any> {
    //     return this.httpclient.delete(apiurl + "deletePerson", user);
    // }

    deleteUserFromNetwork(user: Number): Observable<any> {
        return this.httpclient.delete(apiurl + "deletePersonById/" + user);
    }

    // deleteURLHTTP(shortURL:string): Observable<any>{
    //     return this.httpclient.delete(apiurl+shortURL);
    // }

}