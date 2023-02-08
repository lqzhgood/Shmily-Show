<template>
	<div>Refresh Page...</div>
</template>
<script>
export default {
	name: 'PageRefresh',
	beforeRouteEnter(to, from, next) {
		next(vm => {
			vm.$router.replace(from.fullPath);
		});
	},
};
</script>