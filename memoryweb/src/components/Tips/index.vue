<template>
	<div :class="type" class="tips">
		<slot></slot>
	</div>
</template>
<script>
export default {
	name: 'ComponentsTips',
	props: {
		type: String,
	},
};
</script>
<style lang="sass" scoped>
.tips
    background: rgba(236,248,255,.9)
    border-left: 4px solid rgba(80,191,255,.8)
    padding: 10px 20px
    border-top-left-radius: 5px
    border-bottom-left-radius: 5px
    font-size: 14px
    color: #333
    text-shadow: 0 0 3px rgba(0,0,0,.1)
    &.danger
        background: #ffccc7 !important
        border-left: 4px solid rgba(245, 34, 45,.8)
</style>