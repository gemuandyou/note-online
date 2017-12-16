import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { User } from './user';
import { Cookie } from '../../util/cookie';

@Component({
    selector: 'app-user-regist',
    templateUrl: './user-regist.component.html',
    styleUrls: ['./user-regist.component.css', '../../common.css'],
    providers: [UserService]
})
export class UserRegistComponent {

    title = 'user-regist';
    registUser: User = new User();
    loginUser: User = new User();
    confirmPassword: string;

    constructor(private userService: UserService, private router: Router) { }

    /**
     * 登录
     */
    login(): void {
        if (this.loginUser && this.loginUser.name) {
            this.userService.login(this.loginUser.name, this.loginUser.password).subscribe((res) => {
                if (res && res.data && res.data.results) {
                    console.log(this.loginUser.name + '登录成功');
                    Cookie.setCookie('un', encodeURI(this.loginUser.name), 7);
                    this.router.navigate(['/note-mine']);
                }
            });
        }
    }

    /**
     * 注册
     */
    regist(): void {
        if (this.registUser
            && this.registUser.name
            && this.registUser.password === this.confirmPassword
            && (!this.registUser.phone || this.registUser.phone.length <= 11)) {
            // select user by name
            this.userService.getUserByName(this.registUser.name).subscribe((res) => {
                if (res && res.data && res.data.results) {
                    if (!res.data.results[0]) {
                        this.userService.regist(this.registUser).subscribe((res1) => {
                            console.log(this.registUser.name + '注册成功');
                            Cookie.setCookie('un', encodeURI(this.registUser.name), 7);
                            this.router.navigate(['/note-mine']);
                        });
                    } else {
                        alert('用户已存在');
                    }
                }
            });
        }
    }

}
