import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SignUtil } from './util/sign.util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
    
    @ViewChild('navigation') navigation;
    @ViewChild('searchKey') searchDom;
    isPc: boolean = true; // 是否是PC端

    constructor(private router: Router) { 
        // 判断浏览器类型，区分移动端和PC端
        let isAndroid = navigator.appVersion.match(/android/gi);
        let isIPhone = navigator.appVersion.match(/iphone/gi);
        let isIPad = navigator.appVersion.match(/iPad/gi);
        this.isPc = !isAndroid && !isIPhone && !isIPad;
    }

    ngAfterViewInit() {
        if (!this.isPc) {
            this.navigation.nativeElement.remove();
            this.searchDom.nativeElement.style.width = '38%';
        }
    }

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
