<template>
	<div id="root">
		<router-view v-if="reload" v-slot="{ Component }">
			<transition :name="transitionName">
				<keep-alive :include="keepAliveList">
					<component :is="Component" />
				</keep-alive>
			</transition>
		</router-view>
		<alertbox ref="alertbox">
			<template v-slot:title="{ title }">{{ title }}</template>
			<template v-slot:content="{ content }">{{ content }}</template>
		</alertbox>
		<confirmbox ref="confirmbox">
			<template v-slot:title="{ title }">{{ title }}</template>
			<template v-slot:content="{ content }">{{ content }}</template>
		</confirmbox>
	</div>
	<img src="./assets/beginning.png" style="display: none;">
	<img src="./assets/terminal.png" style="display: none;">
	<img src="./assets/passing.png" style="display: none;">
	<img src="./assets/blue.png" style="display: none;">
	<img src="./assets/blue_long.png" style="display: none;">
	<img src="./assets/grey.png" style="display: none;">
	<img src="./assets/grey_long.png" style="display: none;">
	<img src="./assets/bluegrey_long.png" style="display: none;">
	<img src="./assets/hole_long.png" style="display: none;">
	<img src="./assets/hole.png" style="display: none;">
</template>

<script>

import alertbox from './components/alertbox';
import confirmbox from './components/confirmbox';

export default {
	
	components: {
		alertbox,
		confirmbox
	},
	
	provide() {
		return {
			buyticketExchange: this.buyticketExchange,
			reloadRoute: this.reloadRoute,
			showAlertbox: this.showAlertbox,
			showConfirmbox: this.showConfirmbox
		}
	},
	
	data() {
		return {
			reload: true,
			transitionName: ""
		}
	},
	
	created() {
		this.$nextTick(() => {
			let rootDOM = document.getElementById("root");
			let bodyDOM = document.body;
			if (rootDOM && bodyDOM) {
				rootDOM.style.height = bodyDOM.offsetHeight + "px";
			}
		});
	},
	
	methods: {
		buyticketExchange(query, trains) {
			this.$router.push({
				path: "/buyticket",
				name: "buyticket",
				params: {
					query: JSON.stringify({
						dep: query.des,
						des: query.dep,
						date: query.date,
						onlyhighspeed: query.onlyhighspeed
					}),
					trains: JSON.stringify(trains)
				}
			});
			this.reloadRoute();
		},
		reloadRoute() {
			this.reload = false;
			this.$nextTick(() => {
				this.reload = true;
			});
		},
		showAlertbox(title, content) {
			this.$refs.alertbox.showBox(title, content);
		},
		showConfirmbox(title, content, f) {
			this.$refs.confirmbox.showBox(title, content, f);
		},
	},
	
	watch: {
		$route(to, from) {
			//console.log(from); console.log(to);
			if (from.meta.index === undefined) this.transitionName = "";
			else if (to.meta.index > from.meta.index) {
				this.transitionName = "slide-left";
			} else this.transitionName = "slide-right";
		}
	},
	
	computed: {
		keepAliveList() {
			return this.$store.state.keepAliveList;
		}
	}
}

</script>

<style>
@import "static/reset.css";
html, body {
	height: 100%;
	background-color: #f0eff3;
}
#root {
}
.slide-left-enter-from {
 transform:translateX(100%);
}
.slide-left-enter-to {
 transform:translateX(0);
}
.slide-left-enter-active {
 transition: 0.3s;
}
.slide-left-leave-from {
 transform:translateX(0);
}
.slide-left-leave-to {
 transform:translateX(-100%);
}
.slide-left-leave-active {
 transition: 0.3s;
}

.slide-right-enter-from {
 transform:translateX(-100%);
}
.slide-right-enter-to {
 transform:translateX(0);
}
.slide-right-enter-active {
 transition: 0.3s;
}
.slide-right-leave-from {
 transform:translateX(0);
}
.slide-right-leave-to {
 transform:translateX(100%);
}
.slide-right-leave-active {
 transition: 0.3s;
}
</style>
