import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NoteService } from '../../service/note.service';
import { UserService } from '../../service/user.service';
import { TagService } from '../../service/tag.service';
import { Page } from '../../util/page';
import { Cookie } from '../../util/cookie';
import { Note } from './note';
import { Tag } from './tag';

@Component({
    selector: 'app-note-mine',
    templateUrl: './note-mine.component.html',
    styleUrls: ['./note-mine.component.css', '../../common.css'],
    providers: [NoteService, UserService, TagService]
})
export class NoteMineComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('calendar') calendarView;

    title = 'note-mine';
    page: Page = new Page(1, 10);
    notes: Note[] = [];
    dates: { createDate: '', noteCount: '' }[] = [];
    username: string;
    noteTags: Tag[] = [];
    conditionDateField: string;
    conditionTags: number[] = [];
    isResetCondition: boolean = false; // 是否重新获取笔记列表分页数据，而不是累加分页的数据
    calendar: GMCalendar;
    haveMore: boolean = true;

    constructor(private noteService: NoteService, private userService: UserService, private tagService: TagService,
        private router: Router) {
        console.log(this.page);
    }

    ngOnInit(): void {
        // TODO 加强用户安全性
        this.username = decodeURI(Cookie.getCookie('un'));
        if (!this.username) {
            this.router.navigate(['/user-regist']);
        }
        this.userService.verifyLogin(this.username).subscribe((res) => {
            if (res && res.data && res.data.results) {
                // 获取这个人的所有笔记
                this.getList();
                // 获取所有标签
                this.getTags();
                // 获取这个人的所有笔记的日期列表
                this.noteService.listDateByAuthorFromMysql(this.username).subscribe((res1) => {
                    if (res1 && res1.data && res1.data.results) {
                        this.dates = res1.data.results;

                        let redDates = [];

                        this.dates.forEach(data => {
                            redDates.push({ date: data.createDate.replace(/-0/g, '-'), value: data.noteCount });
                        });

                        let calendarSettings = {
                            width: '100%',
                            height: '200px',
                            redTip: redDates
                        };
                        this.calendar.refreshSetting(calendarSettings);
                    }
                });
            } else {
                this.router.navigate(['/user-regist']);
            }
        });
    }

    ngAfterViewInit(): void {
        window.addEventListener('scroll', this.windowScroll.bind(this));

        let redDates = [];

        this.dates.forEach(data => {
            redDates.push({ date: data.createDate.replace('-0', '-'), value: data.noteCount });
        });

        let calendarSettings = {
            width: '100%',
            height: '200px',
            redTip: redDates
        };

        this.calendar = new GMCalendar(this.calendarView.nativeElement, calendarSettings);

        this.calendar.on('dateClick', params => {
            this.conditionDate('' + params.year + '-' +
                (params.month < 10 ? '0' : '') + params.month + '-' +
                (params.day < 10 ? '0' : '') + params.day);
        });
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
        const scrollTop = htmlDom.scrollTop || window.scrollY; // 移动端中scrollTop无效，需要获取window的scrollY
        const scrollHeight = htmlDom.scrollHeight;
        const clientHeight = htmlDom.clientHeight;
        if (scrollHeight <= scrollTop + clientHeight && scrollTop !== 0) {
            this.page.pageNo = (this.page.pageNo || 0) + 1;
            this.getList();
        }
    }
    /**
     * 根据参数条件获取这个人的笔记列表
     */
    getList(): void {
        this.noteService.listByAuthorFromMysql(this.username, this.conditionTags, this.conditionDateField, this.page).subscribe((res) => {
            if (res && res.data && res.data.results) {
                this.haveMore = res.data.results.length == this.page.pageSize;
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
     * 跳到笔记编辑页面
     * @param note 笔记对象
     */
    linkToEdit(note: Note): void {
        // this.router.navigate(['/note-editor'], { queryParams: { noteUrl: note.noteUrl, noteTitle: note.noteTitle, noteId: note.id } });
        this.router.navigate(['/note-editor', {
            noteUrl: note.noteUrl,
            noteTitle: encodeURIComponent(note.noteTitle),
            noteId: note.id,
            isme: note.isme
        }]);
    }

    /**h
     * 根据日期查询这个人的笔记列表
     * @param date 日期
     */
    conditionDate(date?: string): void {
        if (this.conditionDateField !== date) {
            this.isResetCondition = true;
        }
        this.conditionDateField = date;
        this.notes = [];
        this.page = new Page(1, 10);
        this.getList();
    }

    /**h
     * 根据日期查询这个人的笔记列表
     * @param tagId 标签名
     */
    conditionTag(tagId?: number): void {
        const tagsLen = this.conditionTags.length;
        if (!tagId) {
            this.conditionTags = [];
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
        this.page = new Page(1, 10);
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

    /**
     * 分页获取笔记
     */
    getMoreNote(): void {
        this.page.pageNo = (this.page.pageNo || 0) + 1;
        this.getList();
    }

}
