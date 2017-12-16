import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserRegistComponent } from './user-regist.component';

/**
 * 配置根路由
 */
const routes: Routes = [
  // 用户注册路由
  {
    path: 'user-regist',
    component: UserRegistComponent
  }
];

@NgModule({
  declarations: [
    UserRegistComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class UserModule {}
