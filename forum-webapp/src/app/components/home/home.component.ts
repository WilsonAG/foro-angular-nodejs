import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    public titlePage: string;

    constructor() {
        this.titlePage = 'Bienvenido al foro de programacion';
    }

    ngOnInit(): void {}
}
