import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SignUtil } from './util/sign.util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

    constructor(private router: Router) { }

    toSearch(searchKey: string): void {
        if (searchKey) {
            searchKey = encodeURI(searchKey);
            searchKey = SignUtil.encodingUrlSign(searchKey);
            location.href = '/note-list;searchKey=' + searchKey;
        } else {
            location.href = '/note-list';
        }
    }

}
