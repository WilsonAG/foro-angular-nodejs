import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/UserModel';
import { NgForm } from '@angular/forms';
import { CONFIG } from '../../services/config.service';

@Component({
    selector: 'app-user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
    public titlePage: string;
    public user: User;
    public identity: User;
    public token: string;
    public status: string;
    public afuConfig: object;
    public uri: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService
    ) {
        this.titlePage = 'Ajustes de usuario';
        this.identity = _userService.getIdentity();
        this.token = _userService.getToken();
        this.user = this.identity;
        this.uri = CONFIG.uri;
        this.afuConfig = {
            multiple: false,
            formatsAllowed: '.jpg, .jpeg, .png, .gif',
            maxSize: '50',
            uploadAPI: {
                url: this.uri + '/upload-avatar',
                headers: {
                    Authorization: this.token
                }
            },
            theme: 'attachPin',
            hideProgressBar: false,
            hideResetBtn: true,
            hideSelectBtn: false,
            replaceTexts: {
                attachPinBtn: 'Sube tu foto de perfil.'
            }
        };
    }

    ngOnInit(): void {}

    onSubmit(form: NgForm) {
        this._userService.update(this.user).subscribe(
            res => {
                if (res.status === 'ok') {
                    localStorage.setItem('identity', JSON.stringify(this.user));
                    this.status = 'ok';
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

    avatarUpload(data: any) {
        const dataObj = JSON.parse(data.response);
        this.user.image = dataObj.user.image;
    }
}
