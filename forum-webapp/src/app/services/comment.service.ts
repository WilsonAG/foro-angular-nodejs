import { Injectable } from '@angular/core';
import { CONFIG } from './config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../models/CommentModel';

@Injectable({
    providedIn: 'root'
})
export class CommentService {
    public uri: string;

    constructor(private _http: HttpClient) {
        this.uri = CONFIG.uri;
    }

    add(token: string, comment: Comment, topicID: string): Observable<any> {
        const params = JSON.stringify(comment);
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);

        return this._http.post(this.uri + '/comment/topic/' + topicID, params, {
            headers
        });
    }

    delete(token: string, topicID: string, commentID: string): Observable<any> {
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', token);

        return this._http.delete(
            this.uri + '/comment/' + topicID + '/' + commentID,
            { headers }
        );
    }
}
