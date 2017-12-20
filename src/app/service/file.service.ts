import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BaseService } from './base.service';
import 'rxjs/add/operator/map';

@Injectable()
export class FileService extends BaseService {

    /**
     * 上传文件到node编写的文件服务器（https://github.com/gemuandyou/node-file-server）
     * @param filePath 文件目录
     * @param file 文件
     */
    upload(filePath: string, file: File): Observable<any> {
        const formData = new FormData();
        formData.append('filePath', filePath);
        formData.append('file', file);
        return this.http.post(`/fileserver-api/api/uploadForm`, formData);
    }

}
