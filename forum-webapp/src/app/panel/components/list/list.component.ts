import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Topic } from '../../../models/TopicModel';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/UserModel';
import { NgForm } from '@angular/forms';
import { TopicService } from '../../../services/topic.service';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
    public titlePage: string;
    public topics: Array<Topic>;
    public identity: User;
    public token: string;
    public status: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _topicService: TopicService
    ) {
        this.titlePage = 'Mis temas';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
    }

    ngOnInit(): void {
        this.getTopics();
    }

    getTopics() {
        const userID = this.identity._id;
        this._topicService.getTopicsByUser(userID).subscribe(
            res => {
                if (res.topics) {
                    this.topics = res.topics;
                }
            },
            err => {
                console.log(err);
                this.status = 'error';
            }
        );
    }

    deleteTopic(id: string) {
        this._topicService.delete(this.token, id).subscribe(
            res => {
                this.getTopics();
            },
            err => {
                console.log(err);
            }
        );
    }
}
