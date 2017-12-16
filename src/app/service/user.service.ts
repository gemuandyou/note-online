import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BaseService } from './base.service';
import { User } from '../component/user/user';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService extends BaseService {

    /**
     * 注册用户
     * @param user 用户对象
     */
    regist(user: User): Observable<any> {
        // 注释的部分是转为 multipart/form-data 格式参数
        // const formData = new FormData();
        // formData.append('data', user);
        return this.http.post(`/node-api/user/userRegist`, {
            username: user.name,
            password: user.password,
            gender: user.gender,
            age: user.age,
            phone: user.phone
        });
    }

    /**
     * 根据用户名获取用户
     * @param username 用户名
     */
    getUserByName(username: string): Observable<any> {
        return this.http.post(`/node-api/user/getUserByName`, {username: username});
    }

    /**
     * 登陆
     * @param username 用户名
     * @param password 密码
     */
    login(username: string, password: string): Observable<any> {
        return this.http.post(`/node-api/user/login`, {username: username, password: password});
    }

    /**
     * 验证登陆
     * @param username 用户名
     */
    verifyLogin(username: string): Observable<any> {
        return this.http.post(`/node-api/user/verifyLogin`, {username: username});
    }

    /**
     * 获取用户列表
     */
    userList(): Observable<any> {
        return this.http.post(`/node-api/user/list`, {});
    }

}
