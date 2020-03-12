import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/UserModel';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    public titlePage: string;
    public user: User;
    public status: string;
    public identity: User;
    public token: string;

    constructor(
        private _userService: UserService,
        private _route: ActivatedRoute,
        private _router: Router
    ) {
        this.titlePage = 'Inicia sesion';
        this.user = new User();
    }

    ngOnInit(): void {}

    onSubmit(form: NgForm) {
        this._userService.signUp(this.user).subscribe(
            res => {
                if (res.user && res.user._id) {
                    // Guardar usuario en una propiedad
                    this.identity = res.user;
                    localStorage.setItem(
                        'identity',
                        JSON.stringify(this.identity)
                    );

                    this._userService.signUp(this.user, true).subscribe(
                        res2 => {
                            if (res2.token) {
                                this.token = res2.token;
                                localStorage.setItem('token', this.token);
                                this.status = 'ok';
                            } else {
                                this.status = 'error';
                            }
                        },
                        err2 => {
                            console.log(err2);
                            this.status = 'error';
                        }
                    );
                } else {
                    this.status = 'error';
                }
            },
            err => {
                console.log(err);
                this.status = 'error';
            }
        );
    }
}
