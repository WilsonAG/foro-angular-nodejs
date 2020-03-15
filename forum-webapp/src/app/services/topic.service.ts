import { Injectable } from '@angular/core';
import { CONFIG } from './config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Topic } from '../models/TopicModel';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TopicService {
    public uri: string;

    constructor(private _http: HttpClient) {
        this.uri = CONFIG.uri;
    }

    addTopic(token: string, topic: Topic): Observable<any> {
        const params = JSON.stringify(topic);
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);

        return this._http.post(this.uri + '/topic', params, { headers });
    }

    getTopicsByUser(userID: string): Observable<any> {
        const headers = new HttpHeaders().set(
            'Content-Type',
            'application/json'
        );

        return this._http.get(this.uri + '/user-topics/' + userID, { headers });
    }

    geTopic(id: string): Observable<any> {
        return this._http.get(this.uri + '/topic/' + id);
    }

    update(token: string, id: string, topic: Topic): Observable<any> {
        const params = JSON.stringify(topic);
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);

        return this._http.put(this.uri + '/topic/' + id, params, { headers });
    }

    delete(token: string, id: string): Observable<any> {
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);
        return this._http.delete(this.uri + '/topic/' + id, { headers });
    }
}
