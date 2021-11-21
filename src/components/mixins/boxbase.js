export const boxbase = {
	data() {
		return {
			isShow: false,
			title: "",
			content: ""
		}
	},
	created() {
		console.log("boxbase mixin");
	},
	methods: {
		closeBox() {
			this.isShow = !this.isShow;
		}
	}
}