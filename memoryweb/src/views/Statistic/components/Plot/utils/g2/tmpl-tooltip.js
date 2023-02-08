import { DEFAULT_AVATAR_COME, DEFAULT_AVATAR_GO } from '@/views/Statistic/const.js';

export function tmplTitle(title, listHtml, options = {}) {
    const { moreClass = '' } = options;
    return `<div class="wrap ${moreClass}">
                <div class="title">
                    <b class="year">${title}</b>
                    <b class="total">总数</b>
                    <span class="avatar">
                        <img src="${DEFAULT_AVATAR_COME}" title="收-聊天窗左侧"/>
                    </span>
                    <span class="avatar">
                        <img src="${DEFAULT_AVATAR_GO}" title="发-聊天窗右侧"/>
                    </span>
                </div>
                <div class="list">${listHtml}</div>
            </div>`;
}

export function tmplListItem(source, color, count, come, comeP, go, goP, typeHTML) {
    return `<div class="list-item ${source}">
                <div class="row source">
                    <div class="label">
                        <span class="marker" style="background: ${color};"></span>
                        <span class="name"><b>${source}</b></span>
                    </div>
                    <div class="count">${count}</div>
                    <div class="come">${come}</div>
                    <div class="comeP">${comeP}<span class="p">%</span></div>
                    <div class="go">${go}</div>
                    <div class="goP">${goP}<span class="p">%</span></div>
                </div>
                ${typeHTML}
            </div>`;
}

export function tmplType(source, type, count, go, goP, come, comeP) {
    return `<div class="row type">
                <div class="label">
                    <img class="icon" src="/static/icon/type/${source}-${type}.png"/>
                    <span class="name">${type}:</span>
                </div>
                <div class="count">${count}</div>
                <div class="come">${come}</div>
                <div class="comeP">${comeP}<span class="p">%</span></div>
                <div class="go">${go}</div>
                <div class="goP">${goP}<span class="p">%</span></div>
            </div>`;
}
