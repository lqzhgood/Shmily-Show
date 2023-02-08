<template>
	<div class="snippets">
		<div>
			<el-tag
				:key="v.label"
				:title="titleValue(v)"
				:type="v.type || 'warning'"
				@click="clickTag(v)"
				class="tag"
				v-for="v in snippets"
			>{{ v.label }}</el-tag>
		</div>
		<hr />
		<div>
			<slot></slot>
		</div>
	</div>
</template>
<script>
export default {
	name: 'HTML_INPUT_SNIPPETS',
	props: {
		snippets: {
			require: true,
			type: Array,
			default() {
				return [];
			},
		},
	},
	data: () => ({}),
	methods: {
		clickTag(v) {
			v.fn ? v.fn() : this.insertSnippet(v.str || this.simpleElm(v.label));
		},
		insertSnippet(...args) {
			this.$parent.insertSnippet(...args);
		},
		simpleElm(...args) {
			return this.$parent.simpleElm(...args);
		},
        titleValue(v){
             // 没有快捷键和描述不显示
            if (!v.key && !v.des) {
                return '';
            }
            const qk = v.key ? `Ctrl+${v.key}` : '';
            const des = v.des;
            return qk&&des ? `${qk}\n${des}` : qk||des;
        },
	},
};
</script>
<style lang="sass" scoped>
.snippets
    margin-bottom: 5px
    .tag
        cursor: pointer
        margin: 0 5px 5px 0
        &:last-child
            margin-right: 0
</style>
