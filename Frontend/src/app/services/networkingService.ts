import {Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';
import {rootCreatePerson} from '../models/userNetwork'
import { user } from '../models/user';

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
    async getUserFromNetwork(id): Promise<Observable<any>> {
        return await this.httpclient.get(apiurl+id);
    }

    async addUserToNetwork(user:rootCreatePerson): Promise<Observable<any>> {
        return await this.httpclient.post(apiurl + "createPerson", user);
    }

    async followUserInNetwork(originID, targetID): Promise<Observable<any>> {
        return await this.httpclient.post(apiurl + "followById/" + originID + "/" + targetID, null);
    }

    async deleteUserFromNetwork(user): Promise<Observable<any>> {
        return await this.httpclient.delete(apiurl + "deletePersonById/" + user);
    }

    async getAllUsersFromNetwork(): Promise<Observable<any>> {
        return await this.httpclient.get(apiurl+"allPersons");
    }

    async getFollowersOfUserFromNetwork(id: Number): Promise<Observable<any>> {
        return await this.httpclient.get(apiurl+"follower/"+id);
    }


}