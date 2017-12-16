/**
 * 解析笔记结构得到预览
 * Created by gemu on 4/3/17.
 */
export class ParseStructure {

    /**
     * 解析
     * @param dom 要解析的页面节点
     * @returns 预览结构
     */
    parseStructure(dom: HTMLElement): NoteStructure[] {
        const structures: NoteStructure[] = [];
        const tagPriority = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
        // const tagPriority = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span']; // 加粗字体也算结构
        // 解析的优先级
        const tagDoms: NodeListOf<Element> = dom.getElementsByTagName('*');
        for (let i = 0; i < tagDoms.length; i++) {
            const tagDom: Element = tagDoms.item(i);
            // 加粗字体也算结构
            // if (tagDom.nodeName.toLowerCase() === 'span' && tagDom.getAttribute("style") != "font-weight: bold;") {
            //    continue;
            // }

            const index = tagPriority.indexOf(tagDom.nodeName.toLowerCase());
            if (index !== -1) {
                const structure: NoteStructure = {name: '', dom: null, tier: 0};
                structure.name = tagDom.textContent;
                structure.dom = tagDom;
                structure.tier = index;
                structures.push(structure);
            }
        }
        return structures;
    }

}

export interface NoteStructure {
    /**
     * 预览节点名
     */
    name: string;
    /**
     * 预览的节点
     */
    dom: Element;
    /**
     * 节点层级
     */
    tier: number;
    /**
     * 节点下的直接子节点
     */
    childrenStructure?: NoteStructure[];
    /**
     * 预览节点连接(目前没啥用)
     */
    link?: string;
}