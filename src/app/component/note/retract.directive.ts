/**
 * 预览笔记的时候不同层级添加缩进
 * Created by Gemu on 2017/6/2.
 */
import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
    selector: '[retract]'
})
export class RetractDirective {

    constructor(private ele:ElementRef) {
    }

    @Input() set retract(len:number) {
        let prefix: string = "";
        for (let i = 0; i < len; i++) {
            prefix += "<div style='display:inline-block; text-indent:1em'>&nbsp;</div>";
        }
        this.ele.nativeElement.innerHTML = prefix;
    }
}