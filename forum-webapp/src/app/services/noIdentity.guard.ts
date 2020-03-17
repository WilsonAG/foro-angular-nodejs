import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class NoIdentityGuard implements CanActivate {
    constructor(private _router: Router, private _userService: UserService) {}

    canActivate() {
        const identity = this._userService.getIdentity();

        if (identity && identity.name) {
            this._router.navigate(['/inicio']);
            return false;
        } else {
            return true;
        }
    }
}
