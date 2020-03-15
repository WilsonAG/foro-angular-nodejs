import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Topic } from '../../../models/TopicModel';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/UserModel';
import { NgForm } from '@angular/forms';
import { TopicService } from '../../../services/topic.service';

@Component({
    selector: 'app-edit',
    templateUrl: '../add/add.component.html',
    styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
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
        this.titlePage = 'Editar Tema';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.topic = new Topic(this.identity._id);
    }

    ngOnInit(): void {
        this.getTopic();
    }

    onSubmit(form: NgForm) {
        const id = this.topic._id;
        this._topicService.update(this.token, id, this.topic).subscribe(
            res => {
                if (res.topic) {
                    this.status = 'ok';
                    this.topic = res.topic;
                    this.message = 'El tema se ha actualizado correctamente.';
                    setTimeout(() => {
                        this._router.navigate(['/panel']);
                    }, 2000);
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

    getTopic() {
        this._route.params.subscribe((params: Params) => {
            const id = params.id;
            this._topicService.geTopic(id).subscribe(
                res => {
                    if (!res.topic) {
                        this._router.navigate(['/panel']);
                    } else {
                        this.topic = res.topic;
                    }
                },
                err => {
                    console.log(err);
                    // this.status = 'error';
                }
            );
        });
    }
}
