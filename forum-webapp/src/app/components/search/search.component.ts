import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Topic } from '../../models/TopicModel';
import { TopicService } from '../../services/topic.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
    public titlePage: string;
    public topics: Array<Topic>;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _topicService: TopicService
    ) {
        this.titlePage = 'Pagina de busqueda';
    }

    ngOnInit(): void {
        this._route.params.subscribe(params => {
            const search = params.topic;
            this.titlePage = 'Resultado de la busqueda para: ' + search;
            this.getTopics(search);
        });
    }

    getTopics(search: string) {
        this._topicService.search(search).subscribe(
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
