<template>
	<div>
		<el-tag type="warning">载入中...</el-tag>
		<p>{{LOADING_TEXT.value}}</p>
	</div>
</template>
<script>
import { LOADING_TEXT } from '@/utils/const.js';

export default {
	data: () => ({
		LOADING_TEXT,
	}),
};
</script>
<style lang="sass" scoped>
</style>