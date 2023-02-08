<template>
	<div>
		<div :key="i" v-for="(c,i) in commentAll">
			<Comment :comment="c" :paddingYear="false" />
		</div>
	</div>
</template>
<script>
import Comment from '@/components/Comment/';
import axiosJson from '@/plugins/axios-json';

export default {
	name: 'Dev-Comment',
	async mounted() {
		const m = await axiosJson.get('/comment/comments.json');
		this.commentAll = m.filter(v => v && v.html);
	},
	data: () => ({
		commentAll: [],
	}),
	components: {
		Comment,
	},
};
</script>
<style lang="sass" scoped>
</style>