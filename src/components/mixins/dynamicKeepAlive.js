import { mapMutations } from 'vuex'

export const dynamicKeepAlive = {
	computed: {
		keepAliveList() {
			return this.$store.state.keepAliveList;
		}
	},
	watch: {
		keepAliveList(e) {
			let arrList = e.split(",");
			let name = this.$options.name;
			console.log(arrList);
			console.log(name);
			if (!arrList.includes(name)) {
				this.$destroy;
			}
		}
	},
	methods: {
		...mapMutations([
			"setKeepAliveList",
			"addKeepAliveRoute",
			"deleteKeepAliveRoute"
		])
	}
}