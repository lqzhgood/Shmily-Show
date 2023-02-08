<template>
	<el-popover placement="top" popper-class="popover-detail" trigger="hover">
		<InfoDetail :msg="msg" />
		<slot slot="reference"></slot>
	</el-popover>
</template>
<script>
import InfoDetail from "./InfoDetail";


export default {
	name: 'Components-Msg-infoPopover',
	props: {
		msg: Object,
	},
    components:{
        InfoDetail,
    },
};
</script>
<style lang="sass">
.popover-detail
    padding: 5px
</style>