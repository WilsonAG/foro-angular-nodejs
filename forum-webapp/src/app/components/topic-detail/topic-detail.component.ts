import { Component, OnInit } from '@angular/core';
import { TopicService } from '../../services/topic.service';
import { Topic } from '../../models/TopicModel';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-topic-detail',
    templateUrl: './topic-detail.component.html',
    styleUrls: ['./topic-detail.component.css']
})
export class TopicDetailComponent implements OnInit {
    public topic: Topic;
    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _topicService: TopicService
    ) {}

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
}
