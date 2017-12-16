import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NoteService } from '../../service/note.service';
import { UserService } from '../../service/user.service';
import { TagService } from '../../service/tag.service';
import { RollUtil } from '../../util/roll.util';
import { Cookie } from '../../util/cookie';
import { Note } from './note';
import { Tag } from './tag';

@Component({
    selector: 'app-note-mine',
    templateUrl: './note-mine.component.html',
    styleUrls: ['./note-mine.component.css', '../../common.css'],
    providers: [NoteService, UserService, TagService]
})
export class NoteMineComponent implements OnInit, OnDestroy {

    title = 'note-mine';
    notes: Note[] = [];
    dates: String[] = [];
    username: string;
    noteTags: Tag[] = [];
    conditionDateField: string;
    conditionTags: number[] = [];

    constructor(private noteService: NoteService, private userService: UserService, private tagService: TagService,
        private router: Router) { }

    ngOnInit(): void {
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
                    }
                });
            } else {
                this.router.navigate(['/user-regist']);
            }
        });
    }

    ngOnDestroy(): void {
    }

    /**
     * 根据参数条件获取这个人的笔记列表
     */
    getList(): void {
        this.noteService.listByAuthorFromMysql(this.username, this.conditionTags, this.conditionDateField).subscribe((res1) => {
            if (res1 && res1.data && res1.data.results) {
                this.notes = res1.data.results;
            }
        });
    }

    /**
     * 跳到笔记编辑页面
     * @param note 笔记对象
     */
    linkToEdit(note: Note): void {
        this.router.navigate(['/note-editor'], { queryParams: { noteUrl: note.noteUrl, noteTitle: note.noteTitle, noteId: note.id } });
    }

    /**h
     * 根据日期查询这个人的笔记列表
     * @param date 日期
     */
    conditionDate(date: string): void {
        this.conditionDateField = date;
        this.getList();
    }

    /**h
     * 根据日期查询这个人的笔记列表
     * @param tagId 标签名
     */
    conditionTag(tagId: number): void {
        if (!tagId) {
            this.conditionTags = [];
        } else {
            this.conditionTags.push(tagId);
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
