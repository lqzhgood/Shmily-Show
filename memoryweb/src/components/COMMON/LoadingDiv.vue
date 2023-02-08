<template>
	<div
		:class="{loading}"
		:element-loading-text="LOADING_TEXT.value"
		class="_isLoadingDiv"
		v-bind="$attrs"
		v-loading="loading"
		v-on="$listeners"
	>
		<slot></slot>
	</div>
</template>
<script>
import { LOADING_TEXT } from '@/utils/const.js';

export default {
	props: {
		loading: {
			type: Boolean,
			default: false,
		},
	},
	data: () => ({
		LOADING_TEXT,
	}),
};
</script>
<style lang="sass" scoped>
._isLoadingDiv.loading
    min-height: 200px
</style>