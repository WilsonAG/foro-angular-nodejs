import { Component, OnInit } from '@angular/core';

import { User } from '../../models/UserModel';

import { UserService } from '../../services/user.service';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    public titlePage: string;
    public user: User;
    public status: string;

    constructor(private _userService: UserService) {
        this.titlePage = 'Registro de Usuario';
        this.user = new User();
        // console.log(this.user);
    }

    ngOnInit(): void {
        this._userService.prueba();
    }

    onSubmit(form: NgForm) {
        this._userService.register(this.user).subscribe(
            res => {
                if (res.user && res.user._id) {
                    this.status = 'ok';
                    form.reset();
                } else {
                    this.status = 'error';
                }
            },
            err => {
                this.status = 'error';
                console.log(err);
            }
        );
    }
}
