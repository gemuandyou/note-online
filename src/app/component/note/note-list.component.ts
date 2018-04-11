import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NoteService } from '../../service/note.service';
import { UserService } from '../../service/user.service';
import { TagService } from '../../service/tag.service';
import { RollUtil } from '../../util/roll.util';
import { Page } from '../../util/page';
import { Note } from './note';
import { Tag } from './tag';
import { User } from '../user/user';
import { SignUtil } from '../../util/sign.util';

@Component({
    selector: 'app-note-list',
    templateUrl: './note-list.component.html',
    styleUrls: ['./note-list.component.css', '../../common.css'],
    providers: [NoteService, UserService, TagService, DatePipe]
})
export class NoteListComponent implements OnInit, AfterViewInit, OnDestroy {

    title = 'note-list';
    page: Page = new Page(1, 10);
    notes: Note[] = [];
    users: User[] = [];
    noteTags: Tag[] = [];
    conditionTags: number[] = [];
    conditionUserName: string;
    conditionCreateDate: string;
    isResetCondition: boolean = false; // 是否重新获取笔记列表分页数据，而不是累加分页的数据
    searchKey: string; // 搜索条件

    constructor(private noteService: NoteService, private userService: UserService, private tagService: TagService,
        private router: Router, private datePipe: DatePipe, private activateRoute: ActivatedRoute) { }

    ngOnInit(): void {
        let params = this.activateRoute.params['value'];
        this.searchKey = SignUtil.decodingUrlSign(params['searchKey']);
        this.getList();
        this.getTags();
        this.userService.userList().subscribe((res) => {
            if (res && res.data && res.data.results) {
                this.users = res.data.results;
            }
        });
    }

    ngAfterViewInit(): void {
        window.addEventListener('scroll', this.windowScroll.bind(this));
    }

    ngOnDestroy(): void {
        window.removeEventListener('scroll', this.windowScroll.bind(this));
    }

    /**
     * window的滚动事件
     * @param ev 滚动事件
     */
    windowScroll(ev): void {
        const htmlDom = document.getElementsByTagName('html')[0];
        const scrollTop = htmlDom.scrollTop;
        const scrollHeight = htmlDom.scrollHeight;
        const clientHeight = htmlDom.clientHeight;
        if (scrollHeight <= scrollTop + clientHeight && scrollTop !== 0) {
            this.page.pageNo = (this.page.pageNo || 0) + 1;
            this.getList();
        }
    }

    /**
     * 跳转到笔记视图
     * @param note 笔记对象
     */
    linkToView(note: Note): void {
        // this.router.navigate(['/note-view'], {
        //     queryParams: {
        //         url: note.noteUrl,
        //         author: note.author,
        //         title: note.noteTitle,
        //         time: this.datePipe.transform(note.createDate, 'yyyy-MM-dd HH:mm:ss')
        //     }
        // });
        this.router.navigate(['/note-view', {
            url: note.noteUrl,
            author: note.author,
            title: note.noteTitle,
            time: this.datePipe.transform(note.createDate, 'yyyy-MM-dd HH:mm:ss')
        }]);
    }

    /**
     * 根据不同参数条件获取笔记列表
     * @param author 用户名
     * @param tags 标签列表
     * @param createDate 日期
     */
    getList(createDate?: string): void {
        if (createDate) {
            this.conditionCreateDate = createDate;
        }
        this.noteService.allMds(this.page, this.conditionUserName, this.conditionTags, this.conditionCreateDate, this.searchKey).subscribe((res) => {
            if (res && res.data && res.data.results) {
                if (this.isResetCondition) {
                    this.notes = res.data.results;
                    this.isResetCondition = false;
                } else {
                    this.notes = this.notes.concat(res.data.results);
                }
                if (res.data.results.length <= 0) {
                    this.page.pageNo = this.page.pageNo > 1 ? this.page.pageNo - 1 : 1;
                }
            }
        });
    }

    /**
     * 根据用户条件查询用户列表
     * @param username 用户名
     */
    conditionUser(username: string): void {
        if (this.conditionUserName !== username || !username) {
            this.isResetCondition = true;
        }
        this.conditionUserName = username;
        this.getList();
    }

    /**
     * 根据标签条件查询用户列表
     * @param tagId 标签ID
     */
    conditionTag(tagId: number): void {
        const tagsLen = this.conditionTags.length;
        if (!tagId) {
            this.conditionTags = [];
            this.isResetCondition = true; 
        } else {
            if (this.conditionTags.indexOf(tagId) !== -1) {
                this.conditionTags.splice(this.conditionTags.indexOf(tagId), 1);
            } else {
                this.conditionTags.push(tagId);
            }
        }
        if (tagsLen !== this.conditionTags.length) {
            this.isResetCondition = true; 
        }
        this.getList();
    }

    /**
     * 获取所有标签
     */
    getTags(): void {
        this.tagService.list().subscribe((res) => {
            if (res && res.data && res.data.results) {
                this.noteTags = res.data.results;
            }
        });
    }

}
