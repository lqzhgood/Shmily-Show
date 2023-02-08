class Color {
    constructor() {
        this.colorArr = [
            '#5cdbd3',
            '#b37feb',
            '#fff566',
            '#69c0ff',
            '#95de64',
            '#ffc069',
            '#d3f261',
            '#85a5ff',
            '#ffd666',
            '#ff85c0',
        ];
        this.tmp = '';
        this.index = 0;
    }

    get(v) {
        if (v !== this.tmp) {
            this.tmp = v;
            this.index += 1;
            if (this.index >= this.colorArr.length) this.index = 0;
        }
        return this.colorArr[this.index];
    }
}

export const color = new Color();
