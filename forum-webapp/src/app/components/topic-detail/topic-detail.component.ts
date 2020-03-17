import { Component, OnInit } from '@angular/core';
import { TopicService } from '../../services/topic.service';
import { UserService } from '../../services/user.service';
import { Topic } from '../../models/TopicModel';
import { Comment } from '../../models/CommentModel';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/UserModel';
import { CommentService } from 'src/app/services/comment.service';
import { NgForm } from '@angular/forms';
import { CONFIG } from '../../services/config.service';

@Component({
    selector: 'app-topic-detail',
    templateUrl: './topic-detail.component.html',
    styleUrls: ['./topic-detail.component.css']
})
export class TopicDetailComponent implements OnInit {
    public topic: Topic;
    public comment: Comment;
    public identity: User;
    public token: string;
    public status: string;
    public uri: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _topicService: TopicService,
        private _userService: UserService,
        private _commentService: CommentService
    ) {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.comment = new Comment(this.identity._id);
        this.uri = CONFIG.uri;
    }

    ngOnInit(): void {
        this.getTopic();
    }

    getTopic() {
        this._route.params.subscribe(params => {
            const id = params.id;
            this._topicService.getTopic(id).subscribe(
                res => {
                    if (res.topic) {
                        this.topic = res.topic;
                    } else {
                        this._router.navigate(['/inicio']);
                    }
                },
                err => {
                    console.log(err);
                }
            );
        });
    }

    onSubmit(form: NgForm) {
        this._commentService
            .add(this.token, this.comment, this.topic._id)
            .subscribe(
                res => {
                    if (!res.topic) {
                        this.status = 'error';
                    } else {
                        this.status = 'ok';
                        this.topic = res.topic;
                        form.reset();
                    }
                },
                err => {
                    this.status = 'error';
                    console.log(err);
                }
            );
    }

    deleteComment(id: string) {
        this._commentService.delete(this.token, this.topic._id, id).subscribe(
            res => {
                if (!res.topic) {
                    this.status = 'error';
                } else {
                    this.status = 'ok';
                    this.topic = res.topic;
                }
            },
            err => {
                this.status = 'error';
                console.log(err);
            }
        );
    }
}
