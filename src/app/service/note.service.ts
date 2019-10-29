import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BaseService } from './base.service';
import { Page } from '../util/page';
import 'rxjs/add/operator/map';

@Injectable()
export class NoteService extends BaseService {

    /**
     * 获取所有笔记列表，时间排序
     * @param page 分页对象
     * @param author 笔记作者
     * @param tags: 标签列表
     * @param createDate 创建日期。格式:yyyy-MM-dd
     * @param searchKey 全文搜索关键字
     */
    allMds(page: Page, author?: string, tags?: number[], createDate?: string, searchKey?: string): Observable<any> {
        let tagsCondition = '';
        if (tags && tags.length > 0) {
            let condition = '(';
            tags.forEach((val: number, index: number, array: number[]) => {
                condition += val + ',';
            });
            tagsCondition = condition.substring(0, condition.length - 1) + ')';
        }
        return this.http.post(`/node-api/note/list`, {
            author: author,
            tags: tagsCondition,
            createDate: createDate,
            searchKey: searchKey,
            pageStart: page.pageStart,
            pageSize: page.pageSize
        });
    }

    /**
     * 根据笔记ID获取笔记列表，时间排序
     * @param ids 笔记ID集合
     */
    allMdsByIds(ids?: number[]): Observable<any> {
        return this.http.post(`/node-api/note/listByIds`, {
            ids: ids
        });
    }

    /**
     * 将文本渲染为html
     * @param text Markdown文本内容
     */
    renderToHtml(text: string): Observable<any> {
        // 注释的部分是转为 multipart/form-data 格式参数
        // const formData = new FormData();
        // formData.append('data', text);
        return this.http.post(`/node-api/note/renderToHtml`, { data: text });
    }

    /**
     * 将markdown文本保存到文件中
     * @param text Markdown文本内容
     */
    saveToMd(fileName: string, text: string): Observable<any> {
        return this.http.post(`/node-api/note/saveToMd`, { fileName: fileName, data: text });
    }

    /**
     * 删除笔记
     * @param id 笔记ID
     * @param author 笔记作者
     * @param noteUrl 笔记地址
     */
    deleteNote(id: number, author: string, noteUrl: string): Observable<any> {
        return this.http.post(`/node-api/note/delete`, { noteId: id, author: author, noteUrl: noteUrl });
    }

    /**
     * 将markdown文本保存到mysql中
     * @param noteTitle 笔记标题
     * @param noteUrl 笔记地址
     * @param noteIntroduction 笔记简介
     * @param noteContent 笔记内容
     * @param author 笔记作者
     */
    saveToMysql(noteTitle: string, noteUrl: string, noteIntroduction: string, noteContent: string, author: string): Observable<any> {
        return this.http.post(`/node-api/note/saveToMySql`, {
            noteTitle: noteTitle,
            noteUrl: noteUrl,
            noteIntroduction: noteIntroduction,
            noteContent: noteContent,
            author: author
        });
    }

    /**
     * 更新笔记到MySQL中
     * @param noteTitle 笔记标题
     * @param noteUrl 笔记地址
     * @param noteIntroduction 笔记简介
     * @param noteContent 笔记内容
     * @param author 笔记作者
     */
    modifyToMysql(noteTitle: string, noteUrl: string, noteIntroduction: string, noteContent: string, author: string): Observable<any> {
        return this.http.post(`/node-api/note/modifyToMySql`, {
            noteTitle: noteTitle,
            noteUrl: noteUrl,
            noteIntroduction: noteIntroduction,
            noteContent: noteContent,
            author: author
        });
    }

    /**
     * 从md文件中读取markdown格式内容
     * @param path markdown文件路径
     */
    readFromMd(path: string, absolutePath: boolean): Observable<any> {
        return this.http.post(`/node-api/note/readFromMd`, { path: path, absolute: absolutePath });
    }

    /**
     * 从mysql中根据参数条件读取笔记列表
     * @param author 作者
     * @param tags 标签ID列表
     * @param createDate 创建日期
     * @param page 分页对象
     */
    listByAuthorFromMysql(author: string, tags?: number[], createDate?: string, page?: Page): Observable<any> {
        let tagsCondition = '';
        if (tags && tags.length > 0) {
            let condition = '(';
            tags.forEach((val: number, index: number, array: number[]) => {
                condition += val + ',';
            });
            tagsCondition = condition.substring(0, condition.length - 1) + ')';
        }
        return this.http.post(`/node-api/note/listByAuthorFromMysql`, {
            author: author,
            tags: tagsCondition,
            createDate: createDate,
            pageStart: page.pageStart,
            pageSize: page.pageSize
        });
    }

    /**
     * 获取指定作者笔记的日期列表
     * @param author 作者
     */
    listDateByAuthorFromMysql(author: string): Observable<any> {
        return this.http.post(`/node-api/note/listDateByAuthorFromMysql`, { author: author });
    }

    /**
     * 获取指定作者笔记的日期列表
     * @param author 作者
     */
    listDateFromMysql(): Observable<any> {
        return this.http.post(`/node-api/note/listDateFromMysql`, {});
    }

    /**
     * 建立笔记和标签关系
     * @param noteId 笔记ID
     * @param tags 标签名列表
     */
    relNoteAndTagFromMysql(noteId: number, tags: string[]): Observable<any> {
        return this.http.post(`/node-api/note/relTags`, { noteId: noteId, tags: tags });
    }

    /**
     * 建立笔记和标签关系
     * @param noteId 笔记ID
     */
    getNoteTags(noteId: number): Observable<any> {
        return this.http.post(`/node-api/note/getNoteTags`, { noteId: noteId });
    }

    /**
     * 清除指定笔记的指定标签
     * @param noteId 笔记ID
     * @param tagId 标签ID
     */
    removeNoteTagRel(noteId: number, tagId: number): Observable<any> {
        return this.http.post(`/node-api/note/removeNoteTagRel`, { noteId: noteId, tagId: tagId });
    }

    /**
     * 公开指定笔记
     * @param noteId 笔记ID
     */
    publish(noteId: number): Observable<any> {
        return this.http.post(`/node-api/note/publish`, { noteId: noteId });
    }

    /**
     * 取消公开指定笔记
     * @param noteId 笔记ID
     */
    unpublish(noteId: number): Observable<any> {
        return this.http.post(`/node-api/note/unpublish`, { noteId: noteId });
    }

    /**
     * 关键字搜索
     * @param searchKey 搜索的关键字
     */
    search(searchKey: string): Observable<any> {
        return this.http.post('/node-api/note/search', { searchKey: searchKey });
    }

}
