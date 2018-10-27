import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NoteService } from '../../service/note.service';
import { Note } from './note';
import { ParseStructure, NoteStructure } from '../../util/parse-struct';
import { Cookie } from '../../util/cookie';

@Component({
    selector: 'app-note-view',
    templateUrl: './note-view.component.html',
    styleUrls: ['./note-view.component.css', '../../common.css'],
    providers: [NoteService]
})
export class NoteViewComponent implements OnInit, AfterViewInit, OnDestroy {

    title = 'note-view';

    @ViewChild('notesViewer') notesViewer;
    notesViewerEle: any;
    // 笔记元数据
    noteId: number; // 笔记ID
    noteAuthor: string; // 笔记作者
    noteTitle: string; // 笔记标题
    noteCreateTime: number; // 笔记创建时间
    currentNoteUrl: string; // 当前笔记路径（编辑时）
    previewStructures: NoteStructure[]; // 笔记预览
    needPreview: boolean = false; // 是否显示笔记预览
    isPc: boolean = true; // 是否是PC端
    activeNum: number = -1; // 当前内容的预览标题序号
    isMe: boolean = false; // 是否是笔记作者

    constructor(private noteService: NoteService, private activateRoute: ActivatedRoute, private router: Router) {
        // 判断浏览器类型，区分移动端和PC端
        var style = document.createElement('link');
        style.rel = 'stylesheet';
        style.type = 'text/css';
        let isAndroid = navigator.appVersion.match(/android/gi);
        let isIPhone = navigator.appVersion.match(/iphone/gi);
        let isIPad = navigator.appVersion.match(/iPad/gi);
        this.isPc = !isAndroid && !isIPhone && !isIPad;
        if (!this.isPc) {
            style.href = 'assets/style/note-view.mobile.css';
        }
        document.head.appendChild(style);
    }

    ngOnInit(): void {
        // this.currentNoteUrl = this.activateRoute.snapshot.queryParams.url;
        // this.noteAuthor = this.activateRoute.snapshot.queryParams.author;
        // this.noteCreateTime = this.activateRoute.snapshot.queryParams.time;
        // this.noteTitle = this.activateRoute.snapshot.queryParams.title;
        let params = this.activateRoute.params["value"];
        this.noteId = params["id"];
        this.currentNoteUrl = params["url"];
        this.noteAuthor = params["author"];
        this.noteCreateTime = params["time"];
        this.noteTitle = params["title"];

        // TODO 加强用户安全性
        if (decodeURI(Cookie.getCookie('un')) === this.noteAuthor) {
            this.isMe = true;
        }

        if (this.currentNoteUrl) {
            this.noteService.readFromMd(this.currentNoteUrl, true).subscribe((res) => {
                if (res.data) {
                    this.noteService.renderToHtml(res.data).subscribe((res1) => {
                        this.notesViewerEle = this.notesViewer.nativeElement;
                        const style = '<link rel="stylesheet" href="assets/style/markdown.css">';
                        this.notesViewerEle.innerHTML = res1.data + style;
                        // 生成预览
                        const parseStructure = new ParseStructure();
                        this.previewStructures = parseStructure.parseStructure(this.notesViewer.nativeElement);
                    });
                }
            });
        }
    }

    ngAfterViewInit(): void {
        window.addEventListener("scroll", (ev) => {
            this.activeNum = -1;
            this.previewStructures.forEach(preview => {
                if (preview && preview.dom && (preview.dom.offsetTop - 60) < window.scrollY) {
                    this.activeNum++;
                    console.count("遍历预览标题，显示高亮");
                } else {
                    return;
                }
            });
        });
    }

    ngOnDestroy(): void {
    }

    /**
     * 预览定位
     * @param dom
     */
    positionPreview(dom: HTMLElement) {
        const htmlEle = document.getElementsByTagName('html')[0];
        htmlEle.scrollTop = dom.offsetTop - 60;
        this.needPreview = false;
    }

    /**
     * 阻止滚动冒泡
     * @param ev 事件
     */
    preventScroll(ev: any) {
        ev.stopPropagation();
        ev.preventDefault();
    }

    /**
     * 跳到笔记编辑页面
     * @param note 笔记对象
     */
    linkToEdit(note: Note): void {
        // this.router.navigate(['/note-editor'], { queryParams: { noteUrl: note.noteUrl, noteTitle: note.noteTitle, noteId: note.id } });
        this.router.navigate(['/note-editor', { noteUrl: this.currentNoteUrl, noteTitle: this.noteTitle, noteId: this.noteId, isme: this.isMe }]);
    }

}
