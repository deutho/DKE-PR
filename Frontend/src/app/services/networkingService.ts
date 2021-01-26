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

    async getUserFromNetwork(id): Promise<Observable<any>> {
        return await this.httpclient.get(apiurl+id);
    }

    async addUserToNetwork(user:rootCreatePerson): Promise<Observable<any>> {
        return await this.httpclient.post(apiurl + "createPerson", user);
    }

    async followUserInNetwork(originID, targetID): Promise<Observable<any>> {
        return await this.httpclient.post(apiurl + "followById/" + originID + "/" + targetID, null);
    }

    async followHashtag(originID, targetID): Promise<Observable<any>> {
        return await this.httpclient.post(apiurl + "followHashtag/" + originID + "/" + targetID, null);
    }

    async unfollowUserInNetwork(originID, targetID): Promise<Observable<any>> {
        return await this.httpclient.delete(apiurl + "unfollowById/" + originID + "/" + targetID);
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

    async addHashtagToNetwork(hashtag): Promise<Observable<any>> {
        return await this.httpclient.post(apiurl + "createHashtag/" + hashtag, null);
    }

    async getSubscriptionsOfUserFromNetwork(id): Promise<Observable<any>> {
        return await this.httpclient.get(apiurl+"subscriptions/"+id);
    }

    async getSubscriptionsOfHashtagsFromNetwork(id): Promise<Observable<any>> {
        return await this.httpclient.get(apiurl+"subscribedHashtags/"+id);
    }

    async getAllHashtags(): Promise<Observable<any>> {
        return await this.httpclient.get(apiurl+"allHashtags");
    }
    
}