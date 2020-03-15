import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Topic } from '../../../models/TopicModel';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/UserModel';
import { NgForm } from '@angular/forms';
import { TopicService } from '../../../services/topic.service';

@Component({
    selector: 'app-add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
    public titlePage: string;
    public topic: Topic;
    public identity: User;
    public token: string;
    public status: string;
    public message: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _topicService: TopicService
    ) {
        this.titlePage = 'Crear nuevo tema';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.topic = new Topic(this.identity._id);
    }

    ngOnInit(): void {
        // console.log(this._topicService.prueba());
    }

    onSubmit(form: NgForm) {
        this._topicService.addTopic(this.token, this.topic).subscribe(
            res => {
                if (res.status === 'ok') {
                    this.status = 'ok';
                    this.topic = res.topic;
                    setTimeout(() => {
                        this._router.navigate(['/panel']);
                    }, 2000);
                    this.message = 'El tema se ha creado correctamente';
                } else {
                    this.status = 'error';
                    this.message = 'Algo salio mal, intentalo denuevo.';
                }
            },
            err => {
                console.log(err);
                this.status = 'error';
                this.message = 'Algo salio mal, intentalo denuevo.';
            }
        );
    }
}
