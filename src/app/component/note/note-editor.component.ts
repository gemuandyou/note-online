import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NoteService } from '../../service/note.service';
import { TagService } from '../../service/tag.service';
import { FileService } from '../../service/file.service';
import { RollUtil } from '../../util/roll.util';
import { ParseStructure, NoteStructure } from '../../util/parse-struct';
import { Cookie } from '../../util/cookie';
import { ModalBoxComponent } from '../modalbox/modalbox.component';
import { Note } from './note';
import { Tag } from './tag';

@Component({
    selector: 'app-note-editor',
    templateUrl: './note-editor.component.html',
    styleUrls: ['./note-editor.component.css', '../../common.css'],
    providers: [NoteService, TagService, FileService, ModalBoxComponent]
})
export class NoteEditorComponent implements OnInit, AfterViewInit, OnDestroy {

    title = 'note-editor';

    @ViewChild('notesEditor') notesEditor;
    @ViewChild('notesViewer') notesViewer;
    @ViewChild('addTag') addTag;
    hideViewer: boolean; // 是否隐藏预览
    hideEditor: boolean; // 是否隐藏编辑
    notesEditorEle: any;
    notesViewerEle: any;
    roll: RollUtil;
    srcDom: any; // 被拖动的DOM
    // 笔记元数据
    noteId: number; // 笔记ID
    noteTitle: string; // 笔记标题
    noteTags: string[] = []; // 笔记标签，用“|”分割
    currentNoteUrl: string; // 当前笔记路径（编辑时）
    chooseTags: Tag[] = []; // 选择的标签列表
    chooseIndex: number = 0; // 选择的标签索引
    lastTagInputValue: string; // 上次输入的标签名，用于判断是否是第二次敲回车
    previewStructures: NoteStructure[]; // 笔记预览
    needPreview: boolean = false; // 是否显示笔记预览

    saveModalBoxComp: ModalBoxComponent;
    tagModalBoxComp: ModalBoxComponent;
    deleteModalBoxComp: ModalBoxComponent;

    constructor(
        private noteService: NoteService,
        private tagService: TagService,
        private fileService: FileService,
        private elementRef: ElementRef,
        private activateRoute: ActivatedRoute,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        // this.noteId = this.activateRoute.snapshot.queryParams.noteId;
        // this.currentNoteUrl = this.activateRoute.snapshot.queryParams.noteUrl;
        // this.noteTitle = this.activateRoute.snapshot.queryParams.noteTitle;
        let params = this.activateRoute.params['value'];
        this.noteId = params['noteId'];
        this.currentNoteUrl = params['noteUrl'];
        this.noteTitle = params['noteTitle'];
        this.notesEditorEle = this.notesEditor.nativeElement;
        // 加载笔记内容
        if (this.currentNoteUrl) { // 渲染编辑的内容
            this.noteService.readFromMd(this.currentNoteUrl, true).subscribe((res) => {
                if (res.data) {
                    this.notesEditorEle.innerText = res.data;
                    this.noteService.renderToHtml(res.data).subscribe((res1) => {
                        this.notesViewerEle = this.notesViewer.nativeElement;
                        const style = '<link rel="stylesheet" href="assets/style/markdown.css">';
                        this.notesViewerEle.innerHTML = res1.data + style;
                        // this.saveTempNote(this);
                    });
                }
            });
        } else {
            const username = decodeURI(decodeURI(Cookie.getCookie('un')));
            if (!username) {
                return;
            }
            this.noteService.readFromMd(username + '-temp.md', false).subscribe((res) => {
                if (res.data) {
                    this.notesEditorEle.innerText = res.data;
                    this.noteService.renderToHtml(res.data).subscribe((res1) => {
                        this.notesViewerEle = this.notesViewer.nativeElement;
                        const style = '<link rel="stylesheet" href="assets/style/markdown.css">';
                        this.notesViewerEle.innerHTML = res1.data + style;
                    });
                }
            });
        }
        // 监听粘贴事件
        this.notesEditorEle.addEventListener('paste', (e) => {
            const pasteItems = e.clipboardData.items;
            this.pasteHandle(pasteItems);
        });
    }

    ngAfterViewInit(): void {
        this.notesEditorEle = this.notesEditor.nativeElement;
        this.notesViewerEle = this.notesViewer.nativeElement;

        // 开启轮训，来保存文本到文件中
        // this.roll = new RollUtil(5000);
        // this.roll.start(this.saveTempNote, this);
    }

    ngOnDestroy(): void {
        if (this.roll) {
            this.roll.end();
        }
    }

    /**
     * 保存模态框初始化完毕后触发的对象
     * @param modalBoxComp 模态框模块对象
     */
    initSaveModal(modalBoxComp: ModalBoxComponent) {
        this.saveModalBoxComp = modalBoxComp;
        this.saveModalBoxComp.confirmEvent.subscribe(() => {
            this.saveNote();
        });
    }

    /**
     * 保存模态框初始化完毕后触发的对象
     * @param modalBoxComp 模态框模块对象
     */
    initDeleteModal(modalBoxComp: ModalBoxComponent) {
        this.deleteModalBoxComp = modalBoxComp;
        this.deleteModalBoxComp.confirmEvent.subscribe(() => {
            this.deleteNote();
        });
    }

    /**
     * 设置标签模态框初始化完毕后触发的对象
     * @param modalBoxComp 模态框模块对象
     */
    initTagModal(modalBoxComp: ModalBoxComponent) {
        this.tagModalBoxComp = modalBoxComp;
        this.tagModalBoxComp.confirmEvent.subscribe(() => {
            this.saveNoteTagRel();
        });
    }

    /**
     * 编辑器中内容变动
     * @param event 事件
     */
    changeEdit(event): void {
        const editor = this.notesEditorEle.innerText;
        if (!editor) {
            return;
        }

        this.saveTempNote(editor);

        // 仅仅输入回车后才会执行下面的渲染HTML操作，这样是为了提高性能
        // 不过这样需要在保存前输入一个回车，不然可能会影响预览的展示
        if (13 != event.keyCode) {
            return;
        }

        this.noteService.renderToHtml(editor).subscribe((res) => {
            const style = '<link rel="stylesheet" href="assets/style/markdown.css">';
            this.notesViewerEle.innerHTML = res.data + style + '<div class="soon"></div>';
            const script = document.createElement('script');
            script.type = 'text/javascript';
            const scriptText = document.createTextNode('(()=>{' +
                'var domEditor = document.getElementsByClassName("editor")[0];' +
                'var domViewer = document.getElementsByClassName("viewer")[0];' +
                'if (domEditor && domViewer && domEditor.scrollTop > (domEditor.scrollHeight - 1000)) {' +
                'domEditor.scrollTop = domEditor.scrollHeight;' +
                'domViewer.scrollTop = domViewer.scrollHeight;' +
                '}' +
                '})();');
            script.appendChild(scriptText);
            const handle = setInterval(() => {
                if (this.notesViewerEle.querySelectorAll('.soon')) {
                    this.notesViewerEle.appendChild(script);
                    clearInterval(handle);
                }
                // console.warn(this.notesViewerEle.querySelectorAll('.soon'));
            }, 100);
        });
    }

    /**
     * 保存文本内容到临时文件
     */
    saveTempNote(text: string): void {
        const username = decodeURI(decodeURI(Cookie.getCookie('un')));
        if (!text && !username) {
            return;
        }
        this.noteService.saveToMd(username + '-temp.md', text).subscribe((res) => {
            // console.log(res);
        });
    }

    /**
     * 保存文本内容到文件
     */
    saveNote(): void {
        // TODO 渲染HTML后保存，这里为了性能，省略此步骤，只需在保存前在编辑中输入回车即可

        const editor = this.notesEditorEle.innerText;
        const username = decodeURI(Cookie.getCookie('un'));
        if (!editor || !username) {
            return;
        }
        let path = username + '/' + new Date().getTime() + '.md';
        if (this.currentNoteUrl) {
            path = username + this.currentNoteUrl.substring(this.currentNoteUrl.lastIndexOf('/'));
        }
        this.noteService.saveToMd(path, editor).subscribe((res) => {
            const noteIntroduction = this.notesViewer.nativeElement.innerText.substring(0, 100) + '...';
            if (this.currentNoteUrl) { // 更新笔记
                this.noteService.modifyToMysql(this.noteTitle, res.data, noteIntroduction, editor, username).subscribe((res1) => {
                    console.log(res1);
                });
            } else { // 添加笔记
                this.noteService.saveToMysql(this.noteTitle, res.data, noteIntroduction, editor, username).subscribe((res1) => {
                    console.log(res1);
                });
            }
        });
    }

    /**
     * 删除笔记
     */
    deleteNote(): void {
        const username = decodeURI(Cookie.getCookie('un'));
        if (!username) {
            return;
        }
        this.noteService.deleteNote(this.noteId, username, this.currentNoteUrl).subscribe((res) => {
            if (res && res.data && res.data.results) {
                this.router.navigate(['/note-mine']);
            }
        });
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
        const notesViewEle = this.notesViewer.nativeElement;
        notesViewEle.scrollTop = dom.offsetTop;
        this.needPreview = false;
    }

    /**
     * 打开保存模态框
     */
    openSaveModal(): void {
        this.saveModalBoxComp.openModal('保存笔记', { 'width': '38%' });
    }

    /**
     * 打开删除模态框
     */
    openDeleteModal(): void {
        this.deleteModalBoxComp.openModal('确认删除', { 'width': '38%' });
    }

    /**
     * 打开设置标签模态框
     */
    openTagModal(): void {
        this.chooseTags = [];
        this.addTag.nativeElement.value = '';
        this.noteService.getNoteTags(this.noteId).subscribe((res) => {
            if (res && res.data && res.data.results) {
                this.noteTags = [];
                res.data.results.forEach((tag, index) => {
                    this.noteTags.push(tag.tagName);
                });
            }
        });
        this.tagModalBoxComp.openModal('笔记标签', { 'width': '83%' });
    }

    /**
     * 选择标签
     * @param dom 输入框元素
     */
    chooseEnter(dom: any): void {
        if (this.chooseTags && this.chooseTags[this.chooseIndex - 1]) { // 已选择标签
            this.noteTags.push(this.chooseTags[this.chooseIndex - 1].tagName);
            this.chooseIndex = 0;
        } else { // 未选择标签
            if (dom.value) {
                // 根据输入内容搜索标签
                this.tagService.list(dom.value).subscribe((res) => {
                    if (res && res.data && res.data.results[0]) {
                        this.chooseTags = res.data.results;
                        // 检查是否存在此标签
                        if (dom.value === this.lastTagInputValue) {
                            this.tagService.get(dom.value).subscribe((res1) => {
                                if (res1 && res1.data && !res1.data.results[0]) {
                                    this.noteTags.push(dom.value);
                                    // 保存标签
                                    this.saveTag(dom);
                                }
                            });
                        }
                    }
                    if (res && res.data && !res.data.results[0] && dom.value === this.lastTagInputValue) {
                        this.noteTags.push(dom.value);
                        // 保存标签
                        this.saveTag(dom);
                    }
                    this.lastTagInputValue = dom.value;
                });
            }
        }
    }

    /**
     * 新增标签
     * @param dom 输入框DOM元素
     */
    saveTag(dom: any): void {
        const tag = new Tag();
        tag.tagName = dom.value;
        const username = decodeURI(decodeURI(Cookie.getCookie('un')));
        tag.creator = username;
        this.tagService.save(tag).subscribe(() => {
            dom.value = '';
        });
    }

    /**
     * 建立当前笔记和标签的关系
     */
    saveNoteTagRel(): void {
        const tags = [];
        const tmp = {};
        this.noteTags.forEach((value, index) => {
            if (!tmp[value]) {
                tags.push(value);
                tmp[value] = index;
            }
        });
        this.noteService.relNoteAndTagFromMysql(this.noteId, tags).subscribe((res) => {
            console.log(res);
        });
    }

    /**
     * 选择标签
     * @param ev 事件
     * @param dom DOM元素
     * @param direction down:向下选择;up:向上选择
     */
    chooseTag(ev: Event, dom: any, direction: string): void {
        switch (direction) {
            case 'down':
                this.chooseIndex = this.chooseIndex >= this.chooseTags.length ? this.chooseIndex : this.chooseIndex + 1;
                break;
            case 'up':
                this.chooseIndex = this.chooseIndex <= 0 ? this.chooseIndex : this.chooseIndex - 1;
                break;
        }
        // 将光标移动到最后
        const valTmp = dom.value;
        dom.value = '';
        dom.focus();
        dom.value = valTmp;
    }

    /**
     * 移除指定标签
     * @param tagName 标签名
     */
    removeTag(tagName: string): void {
        this.noteTags.forEach((tag, index) => {
            if (tag === tagName) {
                this.noteTags.splice(index, 1);
            }
        });
    }

    // ======拖拽布局罗盘======

    /**
     * 允许拖拽，取消默认事件
     * @param ev 拖拽事件
     */
    allowDrop(ev): void {
        ev.preventDefault();
    }
    /**
     * 拖动
     * @param ev 拖拽事件
     * @param targetDom 拖到的DOM
     */
    drag(ev, targetDom) {
        this.srcDom = targetDom;
        ev.dataTransfer.setData('text/plain', targetDom.innerHTML);
    }
    /**
     * 拖动释放
     * @param ev 拖拽释放事件
     * @param targetDom 拖到的DOM
     */
    drop(ev, targetDom) {
        ev.preventDefault();
        if (this.srcDom !== targetDom) {
            if (!this.srcDom.getAttribute('class') || !this.srcDom.getElementsByClassName('viewer-grid')) {
                return;
            }
            const gridDom = this.srcDom.getElementsByClassName('viewer-grid')[0];
            if (gridDom && gridDom.getAttribute('class') && gridDom.getAttribute('class').indexOf('viewer-grid') !== -1) {
                this.srcDom.innerHTML = targetDom.innerHTML;
                targetDom.innerHTML = ev.dataTransfer.getData('text/plain');
                const ele = this.elementRef.nativeElement;
                const viewer: HTMLDivElement = ele.querySelectorAll('.viewer').item(0);
                const editor: HTMLDivElement = ele.querySelectorAll('.editor').item(0);
                const content: HTMLDivElement = ele.querySelectorAll('.content').item(0);
                if (targetDom.getAttribute('class')) {
                    if (targetDom.getAttribute('class').indexOf('viewer-top') !== -1) { // viewer on top
                        // content style
                        content.style.height = 'calc(100% - 60px)';
                        // viewer style
                        viewer.style.width = 'calc(100% - 20px)';
                        viewer.style.height = '50%';
                        viewer.style.padding = '10px 10px 0 10px';
                        viewer.style.overflow = 'auto';
                        // editor style
                        editor.style.width = 'calc(100% - 20px)';
                        editor.style.height = 'calc(50% - 30px)';
                        editor.style.overflow = 'auto';
                    }
                    if (targetDom.getAttribute('class').indexOf('viewer-left') !== -1) { // viewr on left
                        // content style
                        content.style.height = '';
                        content.style.width = 'calc(100% - 130px)';
                        // viewer style
                        viewer.style.width = 'calc(50% - 20px)';
                        viewer.style.height = '';
                        viewer.style.padding = '10px 10px 0 10px';
                        viewer.style.overflow = '';
                        viewer.style.setProperty('float', 'left');
                        // editor style
                        editor.style.width = 'calc(50% - 30px)';
                        editor.style.height = '';
                        editor.style.minHeight = '100px';
                        editor.style.overflow = '';
                        editor.style.setProperty('float', 'left');
                    }
                    if (targetDom.getAttribute('class').indexOf('viewer-right') !== -1) { // viewer on right
                        // content style
                        content.style.height = '';
                        content.style.width = 'calc(100% - 130px)';
                        // editor style
                        editor.style.width = 'calc(50% - 20px)';
                        editor.style.height = '';
                        editor.style.padding = '10px 10px 0 10px';
                        editor.style.overflow = '';
                        editor.style.setProperty('float', 'right');
                        // viewer style
                        viewer.style.width = 'calc(50% - 30px)';
                        viewer.style.height = '';
                        viewer.style.minHeight = '100px';
                        viewer.style.overflow = '';
                        viewer.style.setProperty('float', 'right');
                    }
                }
            }
        }
    }

    /**
     * 粘贴内容
     * @param pasteItems
     */
    pasteHandle(pasteItems): void {
        const pasteSel = window.getSelection();
        // 在编译器中 获取光标位置
        const pasteRng = pasteSel.getRangeAt(0);
        const beforeEc = pasteRng.endContainer;
        const beforeEo = pasteRng.endOffset;
        const pasteRngTmp = document.createRange();
        pasteRngTmp.setStart(beforeEc, beforeEo);
        for (const item of pasteItems) {
            // HTML内容
            if (item.kind === 'string' && 'text/html' === item.type) {
                // TODO 粘贴的是HTML
            }
            // 普通文本
            if (item.kind === 'string' && 'text/plain' === item.type) {
                // TODO 粘贴的是普通的字符串
            }
            // 文件
            if (item.kind === 'file' && /image\//.test(item.type)) { // 粘贴图片
                const blob = item.getAsFile();
                const reader = new FileReader();
                // reader.onload = (event) => {
                //     const eventTarget: any = event.target;

                //     // 在编辑器中 获取光标位置，直接生成图片
                //     // const sel = window.getSelection();
                //     // const rng = sel.getRangeAt(0);
                //     // rng.deleteContents();
                //     // const imgEle = document.createElement('img');
                //     // imgEle.src = eventTarget.result;
                //     // rng.insertNode(imgEle);
                //     // rng.collapse(true);
                //     // sel.removeAllRanges();
                //     // sel.addRange(rng);

                // };
                // 在编译器中 获取光标位置，生成图片标签
                const sel = window.getSelection();
                let rng = sel.getRangeAt(0);
                rng.deleteContents();

                let cpImgUrl: String = ''; // 粘贴过来的图片，解析后生成路径

                // 保存截图
                const username = decodeURI(decodeURI(Cookie.getCookie('un')));
                const newFile = new File([blob], new Date().getTime() + blob.name);
                this.fileService.upload('/note-online/' + username, newFile).subscribe((resp) => {
                    if (resp) {
                        cpImgUrl = '/fileserver-api' + resp;
                        const imgTagTextEle = document.createTextNode('![](' + cpImgUrl + ')');
                        rng.insertNode(imgTagTextEle);
                        rng = rng.cloneRange();
                        rng.collapse(false);
                        sel.removeAllRanges();
                        sel.addRange(rng);
                    }
                });
                reader.readAsDataURL(blob);
                break;
            }
        }
    }
}
