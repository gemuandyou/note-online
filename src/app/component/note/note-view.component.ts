import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NoteService } from '../../service/note.service';
import { Note } from './note';
import { ParseStructure, NoteStructure } from '../../util/parse-struct';

@Component({
  selector: 'app-note-view',
  templateUrl: './note-view.component.html',
  styleUrls: ['./note-view.component.css', '../../common.css'],
  providers: [NoteService]
})
export class NoteViewComponent implements OnInit, AfterViewInit, OnDestroy {

  title = 'note-view';

  @ViewChild('notesViewer') notesViewer;
  notesViewerEle: any;
  // 笔记元数据
  noteAuthor: string; // 笔记作者
  noteTitle: string; // 笔记标题
  noteCreateTime: number; // 笔记创建时间
  currentNoteUrl: string; // 当前笔记路径（编辑时）
  previewStructures: NoteStructure[]; // 笔记预览
  needPreview: boolean = false; // 是否显示笔记预览

  constructor(private noteService: NoteService, private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    // this.currentNoteUrl = this.activateRoute.snapshot.queryParams.url;
    // this.noteAuthor = this.activateRoute.snapshot.queryParams.author;
    // this.noteCreateTime = this.activateRoute.snapshot.queryParams.time;
    // this.noteTitle = this.activateRoute.snapshot.queryParams.title;
    let params = this.activateRoute.params["value"];
    this.currentNoteUrl = params["url"];
    this.noteAuthor = params["author"];
    this.noteCreateTime = params["time"];
    this.noteTitle = params["title"];
    if (this.currentNoteUrl) {
      this.noteService.readFromMd(this.currentNoteUrl, true).subscribe((res) => {
        if (res.data) {
          this.noteService.renderToHtml(res.data).subscribe((res1) => {
            this.notesViewerEle = this.notesViewer.nativeElement;
            const style = '<link rel="stylesheet" href="assets/style/markdown.css">';
            this.notesViewerEle.innerHTML = res1.data + style;
          });
        }
      });
    }
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
  }

  /**
   * 预览笔记
   * <p>每次点击重新生成笔记结构</p>
   */
  previewNote(): void {
    const parseStructure = new ParseStructure();
    this.previewStructures = parseStructure.parseStructure(this.notesViewer.nativeElement);
    this.needPreview = !this.needPreview;
  }

  /**
   * 预览定位
   * @param dom
   */
  positionPreview(dom: HTMLElement) {
    const htmlEle = document.getElementsByTagName('html')[0];
    htmlEle.scrollTop = dom.offsetTop - 60;
    this.needPreview = false;
  }

  /**
   * 阻止滚动冒泡
   * @param ev 事件
   */
  preventScroll(ev: any) {
    ev.stopPropagation();
    ev.preventDefault();
  }

}
