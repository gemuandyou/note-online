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

        // 修改看板娘样式并添加拖动
        const live2dHandle = setInterval(() => {
            console.count('loading live2d');
            const live2D = document.getElementById('live2d-widget');
            const live2DCanvas = document.getElementById('live2dcanvas');
            if (live2D && live2DCanvas) {
                clearInterval(live2dHandle);
                console.log(live2D);
                live2D.style.pointerEvents = 'auto';

                live2D.onmousedown = function (event: MouseEvent) {
                    event = event || <MouseEvent>window.event;
                    const diffX = event.clientX - live2D.offsetLeft;
                    const diffY = event.clientY - live2D.offsetTop;
                    document.onmousemove = function (event: MouseEvent) {
                        event = event || <MouseEvent>window.event;
                        let moveX = event.clientX - diffX;
                        let moveY = event.clientY - diffY;
                        if (moveX < 0) {
                            moveX = 0
                        } else if (moveX > window.innerWidth - live2D.offsetWidth) {
                            moveX = window.innerWidth - live2D.offsetWidth
                        }
                        if (moveY < 0) {
                            moveY = 0
                        } else if (moveY > window.innerHeight - live2D.offsetHeight) {
                            moveY = window.innerHeight - live2D.offsetHeight
                        }
                        live2D.style.left = moveX + 'px';
                        live2D.style.top = moveY + 'px'
                    }
                    document.onmouseup = function (event) {
                        this.onmousemove = null;
                        this.onmouseup = null;
                    }
                }
            }
        }, 500);
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
