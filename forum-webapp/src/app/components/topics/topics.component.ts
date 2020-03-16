import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Topic } from '../../models/TopicModel';
import { TopicService } from '../../services/topic.service';

@Component({
    selector: 'app-topics',
    templateUrl: './topics.component.html',
    styleUrls: ['./topics.component.css']
})
export class TopicsComponent implements OnInit {
    public titlePage: string;
    public topics: Array<Topic>;
    public totalPages: number;
    public actualPage: number;
    public nextPage: number;
    public prevPage: number;
    public numberPages: any;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _topicService: TopicService
    ) {
        this.titlePage = 'Temas';
    }

    ngOnInit(): void {
        this._route.params.subscribe(params => {
            let page = +params.page;
            if (!page) {
                page = 1;
                this.prevPage = -1;
                this.nextPage = 2;
            }
            this.getTopics(page);
        });
    }

    getTopics(page: number = 1) {
        this._topicService.getTopics(page).subscribe(
            res => {
                if (res.topics) {
                    this.topics = res.topics;

                    // Navegacion de paginas
                    this.totalPages = res.totalPages;

                    const numberPages = [];

                    for (let i = 1; i <= this.totalPages; i++) {
                        numberPages.push(i);
                    }
                    this.numberPages = numberPages;

                    // prevPage
                    if (page > 1) {
                        this.prevPage = page - 1;
                    } else {
                        this.prevPage = -1;
                    }

                    // nextPage
                    if (page < this.totalPages) {
                        this.nextPage = page + 1;
                    } else {
                        this.nextPage = -1;
                    }
                } else {
                    this._router.navigate(['/inicio']);
                }
            },
            err => {
                console.log(err);
            }
        );
    }
}
