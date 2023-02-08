<template>
    <div class="app-nav-wrap">
        <div class="app-nav" ref="nav">
            <div class="logo">
                <img src="./assets/xin.gif" class="icon" />
                <span class="slogan">SHMILY</span>
            </div>
            <div class="pages">
                <router-link class="page" :to="`/query`">Query</router-link>
                <router-link class="page" :to="`/statistic`">Statistic</router-link>
                <router-link class="page" :to="`/about`">About</router-link>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'App-Nav',
    data: () => ({}),
};
</script>
<style lang="sass" scoped>
.app-nav-wrap
    --animation-step-one-time: 0.3s
    --animation-step-two-time: 0.1s
    --animation-step-three-time: 0.3s
    --nav-width: 350px

    position: fixed
    z-index: 100
    top: -25px
    opacity: 0.8
    right: 200px
    padding-top: 10px
    transform: translateX(50%)
    transform-origin: center center
    transition: all var(--animation-step-one-time) ease-in-out calc(var(--animation-step-three-time) + var(--animation-step-two-time))
    &:hover
        opacity: 1
        top: 0px
        transition: all var(--animation-step-one-time) ease-in-out
        .app-nav
            padding: 4px 10px
            border-radius: 10px
            max-width: var(--nav-width)
            transition: padding var(--animation-step-two-time) ease-in var(--animation-step-one-time), border-radius var(--animation-step-two-time) ease-in var(--animation-step-one-time), max-width var(--animation-step-three-time) ease-out calc(var(--animation-step-one-time) + var(--animation-step-two-time))

    .app-nav
        border: 1px solid rgba(45, 82, 171 , 0.12)
        box-shadow:  0 0 6px 1px rgba(45,82,171, 0.16)
        background-color: rgba(235, 240, 251, 0.75)
        display: flex
        align-items: center
        justify-content: space-between
        overflow: hidden
        backdrop-filter: blur(10px) saturate(150%)

        padding: 0
        border-radius: 50%
        max-width: 30px

        transition: max-width var(--animation-step-three-time) ease-in, border-radius var(--animation-step-two-time) ease-out var(--animation-step-three-time), padding var(--animation-step-two-time) ease-out var(--animation-step-three-time)
        transform-origin: center center

        .logo
            flex: 0 0 auto
            margin-right: 50px
            display: flex
            align-items: center
            justify-content: space-between
            .icon
                box-shadow: 0 2px 12px 0 rgba(0,0,0,10%)
                padding: 5px
                background: #fff
                border-radius: 50%
                object-fit: scale-down
                display: inline-block
                max-width: 20px
                max-height: 20px
                flex: 0 0 auto
                margin-right: 10px
            .slogan
                color: rgba(0, 0, 0, 0)
                background: linear-gradient(to right, rgb(56, 103, 214), rgb(36,122,174 ))
                background-clip: text
                font-size: 12px
        .pages
            white-space: nowrap
            .page
                margin-right: 5px
                padding: 4px 6px
                border-radius: 6px
                display: inline-block
                color: rgba(45, 82, 171, 1)
                text-decoration: none
                font-size: 14px
                font-weight: 600
                transition: background-color 0.15s ease-in-out 0s
                &:hover,&.router-link-active
                    color: rgba(45, 82, 171, 0.5)
                    background: rgba(45, 82, 171, 0.1)
                &:last-child
                    margin-right: 0
</style>
