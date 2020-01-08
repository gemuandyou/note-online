import {DomSanitizer} from '@angular/platform-browser';
import {Pipe, PipeTransform} from '@angular/core';

/**
 * 动态HTML通过Angular信任。保证使用动态HTML时，样式生效。
 */
@Pipe({name: 'dynamicHtml'})
export class DynamicHtmlPipe implements PipeTransform {
    constructor(private sanitized: DomSanitizer) {
    }

    transform(html) {
        return this.sanitized.bypassSecurityTrustHtml(html);
    }
}
