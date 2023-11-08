<template>
    <MsgWrap noPadding>
        <div class="user-card">
            <div class="user-card-title">
                <img :src="icon" class="user-card-img left" data-is-icon />
                <div class="user-card-text">
                    <h4>
                        <p>{{ name }}</p>
                        <p class="info">{{ info }}</p>
                        <pre :title="sign" class="user-card-sign">{{ sign }}</pre>
                    </h4>
                </div>
            </div>
            <div class="user-card-bottom">
                <span>{{ province }} {{ city }}</span>
                <span :title="username" class="user-card-id">{{ id }}</span>
            </div>
        </div>
    </MsgWrap>
</template>
<script>
import _ from 'lodash';

export default {
    name: 'Msg-Wechat-userCard',
    props: {
        msg: Object,
    },
    data: () => ({}),
    computed: {
        data() {
            return this.msg.$Wechat.data;
        },
        icon() {
            return _.get(this.data, '$url_cover') || '/static/msg/source/Wechat/img/person.jpg';
        },
        name() {
            const data = this.data;
            return _.get(data, 'msg.nickname');
        },
        info() {
            const data = this.data;
            return _.get(data, 'msg.certinfo');
        },
        sign() {
            const data = this.data;
            return _.get(data, 'msg.sign');
        },
        id() {
            const data = this.data;
            return _.get(data, 'msg.alias');
        },
        username() {
            const data = this.data;
            return _.get(data, 'msg.username');
        },
        province() {
            const data = this.data;
            return _.get(data, 'msg.province');
        },
        city() {
            const data = this.data;
            return _.get(data, 'msg.city');
        },
    },
};
</script>
<style lang="sass" scoped>
.user-card
    width: 240px
    background-color: #fff
    display: inline-block

    &-title
        border-radius: 2px 2px 0px 0px
        padding: 10px 10px 0px 10px
        display: flex

    &-img
        width: 40px
        height: 40px
        flex: 0 0 auto

    &-text
        margin-left: 10px
        flex: 1 1 auto

    &-text h4
        line-height: 20px
        font-size: 15px
        margin: 0
        padding: 0
        color: #333
        max-width: 180px
        min-height: 50px
        font-weight: 500
        word-wrap: break-word
        p
            margin: 0
        .info
            font-size: 12px
        pre
            margin: 5px 0

    &-sign
        white-space: break-spaces
        font-size: 12px
        color: #999

    &-bottom
        line-height: 22px
        padding: 0 10px
        font-size: 12px
        color: #999
        border-top: 1px solid #e4e4e4
        .user-card-id
            float: right
</style>
