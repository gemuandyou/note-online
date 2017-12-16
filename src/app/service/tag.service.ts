import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BaseService } from './base.service';
import { Tag } from '../component/note/tag';
import 'rxjs/add/operator/map';

@Injectable()
export class TagService extends BaseService {

    /**
     * 保存标签
     * @param tag 标签对象
     */
    save(tag: Tag): Observable<any> {
        return this.http.post(`/node-api/tag/save`, {
            tagName: tag.tagName,
            creator: tag.creator
        });
    }

    /**
     * 根据参数条件查询标签列表
     * @param tagName 标签名
     */
    list(tagName?: string): Observable<any> {
        return this.http.post(`/node-api/tag/list`, { tagName: tagName });
    }

    /**
     * 获取指定标签
     * @param tagName 标签名
     */
    get(tagName: string): Observable<any> {
        return this.http.post(`/node-api/tag/get`, { tagName: tagName });
    }

}
