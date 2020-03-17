import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/UserModel';
import { CONFIG } from './config.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    public uri: string = CONFIG.uri;

    constructor(private _http: HttpClient) {}

    prueba() {
        console.log('testing');
    }

    register(user: User): Observable<any> {
        // convertir objeto a json string
        const params = JSON.stringify(user);

        // definir cabeceras
        const headers = new HttpHeaders().set(
            'Content-Type',
            'application/json'
        );

        // Hacer Peticion ajax
        return this._http.post(this.uri + '/register', params, { headers });
    }

    signUp(user: User, token = null): Observable<any> {
        // comprobar si llega token
        if (token != null) {
            user.token = token;
        }

        const params = JSON.stringify(user);
        const headers = new HttpHeaders().set(
            'Content-Type',
            'application/json'
        );

        return this._http.post(this.uri + '/login', params, { headers });
    }

    getIdentity(): User {
        const identity = JSON.parse(localStorage.getItem('identity'));
        if (identity) {
            return identity;
        } else {
            return null;
        }
    }

    getToken(): string {
        const token = localStorage.getItem('token');
        if (token) {
            return token;
        } else {
            return null;
        }
    }

    update(user: User): Observable<any> {
        const params = JSON.stringify(user);
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', this.getToken());
        return this._http.put(this.uri + '/user', params, { headers });
    }

    getUsers(): Observable<any> {
        return this._http.get(this.uri + '/users');
    }

    getUser(id: string): Observable<any> {
        return this._http.get(this.uri + '/users/' + id);
    }
}
