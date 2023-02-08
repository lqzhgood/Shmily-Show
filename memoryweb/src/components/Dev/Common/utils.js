import _ from 'lodash';

export function changeDirection(_m) {
    const isStr = _.isString(_m);
    const m = isStr ? JSON.parse(_m) : _.cloneDeep(_m);
    m.direction = m.direction === 'go' ? 'come' : 'go';
    const { sender, senderName, receiver, receiverName } = m;
    m.sender = receiver;
    m.senderName = receiverName;
    m.receiver = sender;
    m.receiverName = senderName;
    return isStr ? JSON.stringify(m, null, 4) : m;
}

/**
 * @name:
 * @description:
 * @param {*} inputElm 被插入的元素
 * @param {*} str 插入的字符串
 * @param {*} _text 当前输入框的值
 * @param {*} position 光标位置
 * @return {*}
 */
export function insertText(inputElm, str, _text, position) {
    let insert;
    if (!isNaN(position)) {
        insert = Number(position);
    } else {
        switch (position) {
            case 'end':
                insert = _text.length;
                break;
            case 'start':
                insert = 0;
                break;
        }
    }

    insert = insert ?? inputElm.selectionStart;

    const text = _text || inputElm.value;
    return text.substr(0, insert) + str + text.substr(insert);
}
