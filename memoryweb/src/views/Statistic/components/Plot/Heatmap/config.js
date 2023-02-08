export const CONFIG_YEAR = {
    autoFit: true,
    xField: 'year',
    yField: 'month',
    shape: 'week-boundary-polygon',
    meta: {
        month: {
            type: 'cat',
            values: ['', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        },
        day: {
            type: 'cat',
        },
        year: {
            type: 'cat',
        },
        count: {
            sync: true,
        },
        date: {
            type: 'cat',
        },
    },
    xAxis: {
        position: 'top',
        tickLine: null,
        line: null,
        label: {
            offset: 12,
            style: {
                fontSize: 12,
                fill: '#666',
                textBaseline: 'top',
            },
        },
    },
    yAxis: {
        grid: null,
        label: {
            formatter(t) {
                return t ? `${t} 月` : '';
            },
        },
    },
};

export const CONFIG_WEEK = {
    autoFit: false,
    height: 140,
    xField: 'week',
    yField: 'weekday',
    shape: 'week-boundary-polygon',
    meta: {
        weekday: {
            type: 'cat',
            values: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        },
        week: {
            type: 'cat',
            values: [...new Array(54).keys()].map(v => String(v)),
        },
        count: {
            sync: true,
        },
        date: {
            type: 'cat',
        },
    },
    xAxis: {
        position: 'top',
        tickLine: null,
        line: null,
        label: {
            autoHide: false,
            offset: 4,
            style: {
                fontSize: 12,
                fill: '#666',
                textBaseline: 'top',
            },
            formatter: val => {
                let m;
                if (val == 2) {
                    m = 1;
                } else if (val == 7) {
                    m = 2;
                } else if (val == 11) {
                    m = 3;
                } else if (val == 15) {
                    m = 4;
                } else if (val == 20) {
                    m = 5;
                } else if (val == 24) {
                    m = 6;
                } else if (val == 28) {
                    m = 7;
                } else if (val == 33) {
                    m = 8;
                } else if (val == 37) {
                    m = 9;
                } else if (val == 42) {
                    m = 10;
                } else if (val == 46) {
                    m = 11;
                } else if (val == 51) {
                    m = 12;
                } else {
                    return '';
                }
                return m + '月';
            },
            yAxis: {
                grid: null,
            },
        },
    },
};

export const CONFIG_DAY = {
    autoFit: false,
    height: 160,
    xField: 'day',
    yField: 'hour',
    shape: 'day-boundary-polygon',
    meta: {
        hour: {
            type: 'cat',
            values: [...new Array(24).keys()],
        },
        day: {
            type: 'cat',
            values: [...new Array(367).keys()].slice(1),
        },
        count: {
            sync: true,
        },
        date: {
            type: 'cat',
        },
    },
    xAxis: {
        position: 'top',
        tickLine: null,
        line: null,
        label: {
            autoHide: false,
            offset: 4,
            style: {
                fontSize: 12,
                fill: '#666',
                textBaseline: 'top',
            },
            formatter: val => {
                return val % 30 == 15 ? Math.ceil(val / 30) + '月' : '';
            },
        },
        yAxis: {
            grid: null,
        },
    },
};
