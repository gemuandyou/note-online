import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalBoxModule } from '../modalbox/modalbox.module';
import { NoteListComponent } from './note-list.component';
import { NoteEditorComponent } from './note-editor.component';
import { NoteMineComponent } from './note-mine.component';
import { NoteViewComponent } from './note-view.component';
import { RetractDirective } from './retract.directive';
import {DynamicHtmlPipe} from '../pipe/DynamicHtmlPipe';

/**
 * 配置根路由
 */
const routes: Routes = [
  // 共享笔记列表路由
  {
    path: 'note-list',
    component: NoteListComponent
  },
  // 我的笔记列表路由
  {
    path: 'note-mine',
    component: NoteMineComponent
  },
  // 我的笔记编辑器路由
  {
    path: 'note-editor',
    component: NoteEditorComponent
  },
  // 笔记视图路由
  {
    path: 'note-view',
    component: NoteViewComponent
  }
];

@NgModule({
    declarations: [
        NoteListComponent,
        NoteEditorComponent,
        NoteMineComponent,
        NoteViewComponent,
        RetractDirective,
        DynamicHtmlPipe
    ],
  imports: [
    CommonModule,
    FormsModule,
    ModalBoxModule,
    RouterModule.forChild(routes)
  ]
})
export class NoteModule {}
