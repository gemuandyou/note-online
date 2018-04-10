import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LocationStrategy, HashLocationStrategy, PathLocationStrategy } from '@angular/common';
import { NodeInterceptor } from './interceptor/node.interceptor';
import { NoteModule } from './component/note/note.module';
import { UserModule } from './component/user/user.module';

/**
 * 配置根路由
 */
const routes: Routes = [
  // 默认
  {
    path: '',
    redirectTo: '/note-list',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    NoteModule,
    UserModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: NodeInterceptor,
    multi: true
  },
  {
    provide: LocationStrategy,
    // useClass: HashLocationStrategy,
    useClass: PathLocationStrategy
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
