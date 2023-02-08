const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const { FILE_OUTPUT_JSON_MSG, DIR_OUTPUT_IMPORT_MSG, GROUP_SEND = [], GROUP_RECEIVE = [] } = require('../../config');

const { getJSON } = require('../../utils/index');

const { sortSearchDictAndForm } = require('../../../src/common.js');

const msgJson = getJSON(FILE_OUTPUT_JSON_MSG);

const SEND_OTHER = { label: '其他', children: [] };
const RECEIVE_OTHER = { label: '其他', children: [] };

const dict = msgJson.reduce(
    (pre, cV) => {
        const {
            source,
            device,
            type,

            direction,

            sender,
            senderName,

            receiver,
            receiverName,
        } = cV;

        if (cV.ms <= pre.time[0]) pre.time[0] = cV.ms;
        if (cV.ms >= pre.time[1]) pre.time[1] = cV.ms;

        let sameSource = pre.source.find(s => s.label === source);
        if (!sameSource) {
            sameSource = { label: source, type: [], os: [] };
            pre.source.push(sameSource);
        }
        if (!sameSource.type.includes(type)) sameSource.type.push(type);

        // 细分 os Arr 的 type
        if (get$Value(cV) && get$Value(cV).os) {
            let sameOs = sameSource.os.find(o => o.label === get$Value(cV).os);
            if (!sameOs) {
                sameOs = { label: get$Value(cV).os, type: [] };
                sameSource.os.push(sameOs);
            }
            if (!sameOs.type.includes(type)) sameOs.type.push(type);
        }

        if (!pre.device.includes(device)) pre.device.push(device);
        if (!pre.direction.includes(direction)) pre.direction.push(direction);

        if (sender && senderName) {
            const _send = { sender, senderName };
            let _sendFoundInGroup = false;
            // 查看是否在已有的字典项里面
            for (let i = 0; i < pre.send.length; i++) {
                const g = pre.send[i];

                if (!g.groupBy) continue; // 不需要分组
                if (g.groupBy.some(n => n === _send.sender)) {
                    if (!g.children.some(v => _.isEqual(v, _send))) {
                        g.children.push(_send);
                    }

                    _sendFoundInGroup = true;
                    break;
                }
            }
            if (!_sendFoundInGroup) {
                if (!SEND_OTHER.children.some(v => _.isEqual(v, _send))) {
                    SEND_OTHER.children.push(_send);
                }
            }
        }

        if (receiver && receiverName) {
            const _receive = { receiver, receiverName };
            let _receiveFoundInGroup = false;
            for (let i = 0; i < pre.receive.length; i++) {
                const g = pre.receive[i];

                if (!g.groupBy) continue; // 不需要分组
                if (g.groupBy.some(n => n === _receive.receiver)) {
                    if (!g.children.some(v => _.isEqual(v, _receive))) {
                        g.children.push(_receive);
                    }

                    _receiveFoundInGroup = true;
                    break;
                }
            }
            if (!_receiveFoundInGroup) {
                if (!RECEIVE_OTHER.children.some(v => _.isEqual(v, _receive))) {
                    RECEIVE_OTHER.children.push(_receive);
                }
            }
        }

        if (source === 'CallLog' && cV.$CallLog.duration > pre.$CallLog.duration[1]) {
            pre.$CallLog.duration[1] = cV.$CallLog.duration;
        }

        return pre;
    },
    {
        time: [Date.now(), 0], // min max
        source: [
            //  {
            //     label: QQ,
            //     type: [ PC,Phone]
            //     os: [
            //         label:'',
            //         type: [ Android , iOS]
            //    ]
            // },
        ],
        device: [],
        direction: [],
        send: GROUP_SEND.concat(SEND_OTHER),
        receive: GROUP_RECEIVE.concat(RECEIVE_OTHER),
        $CallLog: { duration: [0, 0] },
    },
);

// 排除掉空的 Group
dict.send = dict.send.map(g => (g.children.length === 0 ? undefined : g)).filter(g => g);
dict.receive = dict.receive.map(g => (g.children.length === 0 ? undefined : g)).filter(g => g);

const sort = sortSearchDictAndForm(dict, 'DICT');

function get$Value(m) {
    const key = Object.keys(m).filter(k => k != '$Dev' && k.startsWith('$'));
    return m[key];
}

fs.writeFileSync(path.join(DIR_OUTPUT_IMPORT_MSG, './msgDict.json'), JSON.stringify(sort, null, 4));
