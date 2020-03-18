import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/UserModel';
import { CONFIG } from '../../services/config.service';
import { TopicService } from '../../services/topic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Topic } from '../../models/TopicModel';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    public titlePage: string;
    public user: User;
    public topics: Array<Topic>;
    public uri: string;

    constructor(
        private _userService: UserService,
        private _topicService: TopicService,
        private _route: ActivatedRoute,
        private _router: Router
    ) {
        this.uri = CONFIG.uri;
    }

    ngOnInit(): void {
        this._route.params.subscribe(params => {
            const userID = params.id;
            this.getUser(userID);
            this.getTopics(userID);
        });
    }

    getUser(userID: string) {
        this._userService.getUser(userID).subscribe(
            res => {
                if (res.user) {
                    this.user = res.user;
                } else {
                    // do something
                }
            },
            err => {
                console.log(err);
            }
        );
    }

    getTopics(userID: string) {
        this._topicService.getTopicsByUser(userID).subscribe(
            res => {
                if (res.topics) {
                    this.topics = res.topics;
                }
            },
            err => {
                console.log(err);
            }
        );
    }
}
