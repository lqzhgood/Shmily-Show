<template>
	<div class="msg-common-text">
		<slot class="icon" name="icon"></slot>
		<slot>
			<div v-outerHTML="html"></div>
		</slot>
	</div>
</template>
<script>
export default {
	name: 'Msg-common-text',
	props: {
		html: String,
	},
	data: () => ({}),
};
</script>
<style lang="sass" scoped>
.msg-common-text
    max-width: 420px
    word-wrap: break-word
    border-radius: 2px
    width: 100%
    box-sizing: border-box
    display: inline-block
    ::v-deep
        .baseEmoji
            max-width: 28px !important
    .icon
        max-width: 20px !important
        vertical-align: text-top !important
        margin: 0 5px
</style>