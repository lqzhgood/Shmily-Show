<template>
	<el-input
		:rows="rows"
		@focus="moveCursor()"
		@keydown.tab.exact.native.prevent="moveCursor()"
		ref="input"
		type="textarea"
		v-bind="$attrs"
		v-model="text"
		v-on="$listeners"
	></el-input>
</template>
<script>
export default {
	name: 'Dev-Common-HtmlInput-Input',
	model: {
		prop: 'value',
		event: 'input',
	},
	props: {
		rows: {
			type: Number,
			require: true,
			default: 5,
		},
		value: String,
	},
	data: () => ({}),
	computed: {
		text: {
			get() {
				return this.value;
			},
			set(v) {
				this.$emit('input', v);
			},
		},
	},
	methods: {
		moveCursor(...args) {
			this.$parent.moveCursor(...args);
		},
		getInput() {
			return this.$refs.input.getInput();
		},
		focus() {
			this.$refs.input.focus();
		},
	},
};
</script>
<style lang="sass" scoped>
</style>