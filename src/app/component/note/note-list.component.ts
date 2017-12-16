import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NoteService } from '../../service/note.service';
import { UserService } from '../../service/user.service';
import { TagService } from '../../service/tag.service';
import { RollUtil } from '../../util/roll.util';
import { Page } from '../../util/page';
import { Note } from './note';
import { Tag } from './tag';
import { User } from '../user/user';

@Component({
    selector: 'app-note-list',
    templateUrl: './note-list.component.html',
    styleUrls: ['./note-list.component.css', '../../common.css'],
    providers: [NoteService, UserService, TagService, DatePipe]
})
export class NoteListComponent implements OnInit {

    title = 'note-list';
    page: Page = new Page(1, -1);
    notes: Note[] = [];
    users: User[] = [];
    noteTags: Tag[] = [];
    conditionTags: number[] = [];
    conditionUserName: string;

    constructor(private noteService: NoteService, private userService: UserService, private tagService: TagService,
        private router: Router, private datePipe: DatePipe) { }

    ngOnInit(): void {
        this.getList();
        this.getTags();
        this.userService.userList().subscribe((res) => {
            if (res && res.data && res.data.results) {
                this.users = res.data.results;
            }
        });
    }

    /**
     * 跳转到笔记视图
     * @param note 笔记对象
     */
    linkToView(note: Note): void {
        this.router.navigate(['/note-view'], {
            queryParams: {
                url: note.noteUrl,
                author: note.author,
                title: note.noteTitle,
                time: this.datePipe.transform(note.createDate, 'yyyy-MM-dd HH:mm:ss')
            }
        });
    }

    /**
     * 根据不同参数条件获取笔记列表
     * @param author 用户名
     * @param tags 标签列表
     * @param createDate 日期
     */
    getList(createDate?: string): void {
        this.noteService.allMds(this.page, this.conditionUserName, this.conditionTags, createDate).subscribe((res) => {
            if (res && res.data && res.data.results) {
                this.notes = res.data.results;
            }
        });
    }

    /**
     * 根据用户条件查询用户列表
     * @param username 用户名
     */
    conditionUser(username: string): void {
        this.conditionUserName = username;
        this.getList();
    }

    /**
     * 根据标签条件查询用户列表
     * @param tagId 标签ID
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
