import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, Output, Input,
  EventEmitter, enableProdMode } from '@angular/core';
import { NoteService } from '../../service/note.service';
import { RollUtil } from '../../util/roll.util';
import { Cookie } from '../../util/cookie';

/**
 * prevent error : Expression has changed after it was checked. Previous value: 'true'. Current value: 'false'.
 * cause: Modify properties serveral times in a component.
 */
enableProdMode();

@Component({
  selector: 'app-modal-box',
  templateUrl: './modalbox.component.html',
  styleUrls: ['./modalbox.component.css', '../../common.css']
})
export class ModalBoxComponent implements OnInit, AfterViewInit, OnDestroy {

  @Output() showEvent: EventEmitter<any> = new EventEmitter();
  @Output() confirmEvent: EventEmitter<any> = new EventEmitter();
  @ViewChild('modalBox') modalBox;
  @Input() identify: string;
  title = '提示';
  show: boolean;
  style: {};
  bgClose: boolean = true; // 点击背景是否关闭

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.showEvent.emit(this);
  }

  ngOnDestroy(): void {
  }

  /**
   * 打开模态框
   * @param title 模态框标题
   * @param style 模态框样式（modal-detail）
   * @param options 模态框选项。如：控制按钮显示
   */
  openModal(title: string, style?: {}, options?: Options): void {
    this.title = title;
    this.show = true;
    this.style = style;
    this.handleOptions(options);
  }

  /**
   * 关闭模态框
   */
  closeModal(): void {
    if (this.bgClose) {
      this.show = false;
    }
  }

  /**
   * 确认
   */
  confirmModal(): void {
    this.closeModal();
    this.confirmEvent.emit();
  }

  /**
   * 处理模态框选项
   * @param options 模态框选项。如：控制按钮显示
   */
  handleOptions(options: Options): void {
    if (!options) {
      options = new Options();
    }
    this.bgClose = options.bgClose;
    console.log(this.bgClose);
    // make sure these button is loaded . After loading, show these button.
    const handle = setInterval(() => {
      const rootEle = this.modalBox.nativeElement;
      if (rootEle.querySelectorAll('button')) {
        clearInterval(handle);
        options.btn.forEach(element => {
          switch (element) {
            case 'confirm':
              const confirmDom = rootEle.querySelector('.confirm');
              if (confirmDom) {
                confirmDom.style.display = 'inline-block';
              }
              break;
            case 'cancel':
              const cancelDom = rootEle.querySelector('.cancel');
              if (cancelDom) {
                cancelDom.style.display = 'inline-block';
              }
              break;
          }
        });
      }
      console.log('loadding modal button...');
    }, 10);
    setTimeout(() => {
      clearInterval(handle);
    }, 5000);
  }

}

class Options {
  btn?: string[] = ['confirm', 'cancel'];
  bgClose?: boolean = true;
}
