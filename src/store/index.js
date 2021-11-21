import { createStore } from "vuex";

export default createStore({
	state() {
		return {
			keepAliveList: "blank",
			store_dep: "",
			store_des: ""
		}
	},
	mutations: {
		setKeepAliveList(state, arrListString) {
			state.keepAliveList = arrListString;
		},
		addKeepAliveRoute(state, routeName) {
			let arrList = state.keepAliveList.split(",");
			if (arrList.indexOf(routeName) !== -1) {
				return 0; // 已存在
			} else {
				arrList.push(routeName);
				state.keepAliveList = arrList.join();
			}
		},
		deleteKeepAliveRoute(state, routeName) {
			let arrList = state.keepAliveList.split(",");
			let pos = arrList.indexOf(routeName);
			if (pos === -1) {
				return 0; // 不存在
			} else {
				arrList.splice(pos, 1);
				state.keepAliveList = arrList.join();
			}
		},
		modifyDep(state, name) {
			state.store_dep = name;
		},
		modifyDes(state, name) {
			state.store_des = name;
		}
	}
});