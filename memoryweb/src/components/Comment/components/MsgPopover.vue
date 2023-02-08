<template>
	<div>
		<InfoDetail :msg="msg" class="InfoDetail" />
		<MsgInner :msg="msg" />
	</div>
</template>
<script>
import MsgInner from '@/components/Msg/components/MsgInner';
import InfoDetail from "@/components/Msg/components/InfoDetail";

export default {
    name: "Components-Comment-msgPopover",
    props:{
        msgId:String,
    },
    computed:{
        msgAll() {
			return this.$store.state.msgAll;
		},
        msg(){
            return this.msgAll.find(msg => msg.id === this.msgId);
        },
    },
    components:{
        MsgInner,
        InfoDetail,
    },
};
</script>
<style lang="sass" scoped>
.InfoDetail
    margin-bottom: 10px
</style>