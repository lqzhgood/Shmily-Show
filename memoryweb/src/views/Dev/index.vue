<template>
	<div>
		<ul :key="v.path" v-for="v in list">
			<router-link :to="`/dev/${v.path}`">{{v.path}}</router-link>
		</ul>
		<router-view />
	</div>
</template>
<script>
export default {
	name: 'Dev-Index',
	mounted() {
		this.$store.commit('app/setInitOk');
	},
	data: () => ({
		list: [{ path: 'face/view' }, { path: 'face/md5' }, { path: 'file/time' }, { path: 'comment' }],
	}),
};
</script>
<style lang="sass" scoped>
</style>