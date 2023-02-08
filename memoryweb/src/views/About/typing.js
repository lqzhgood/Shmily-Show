class Typing {
    working = false;

    elm = null;
    options = {
        speed: 50,
    };

    constructor(elm, options = {}) {
        this.elm = elm;
        this.options = Object.assign(this.options, options);
    }

    async w(string) {
        await this.c();

        if (this.working) return;
        this.working = true;

        for (let i = 1; i <= string.length; i++) {
            this.elm.innerText = string.substring(0, i);
            await this.delay();
        }

        this.working = false;
    }

    async c() {
        if (this.working) return;
        this.working = true;

        const t = this.elm.innerText;
        for (let i = t.length - 1; i >= 0; i--) {
            this.elm.innerText = t.substring(0, i);
            await this.delay(10); // 删除的速度往往更快
        }

        this.working = false;
    }

    delay(t = this.options.speed) {
        return new Promise(res => {
            setTimeout(res, t);
        });
    }
}

export default Typing;
