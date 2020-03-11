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
}
