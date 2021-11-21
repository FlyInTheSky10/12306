<template>
	<div class="stations-route">
		<div class="stations-header">
			<div class="header-back" @click="backToSearch">
			</div>
			<div class="header-depdes">
				车站选择
			</div>
		</div>
		<div class="station-list-wrapper" ref="stationlistwrapper" id="stationlistwrapper">
			<li class="station-list-letter">
				<ul v-for="stationList in buckets" :key="stationList.key">
					<div class="header">
						{{ String.fromCharCode(stationList.key + 65) }}
					</div>
					<li>
						<ul v-for="(station, index) in stationList.stationList" :key="index">
							<div class="body" @click="chooseStation(station.name)">
								{{ station.name }}
							</div>
						</ul>
					</li>
				</ul>
			</li>	
		</div>	
	</div>
</template>
<script>
	
	import BScroll from '@better-scroll/core';
	import { dynamicKeepAlive } from './mixins/dynamicKeepAlive';
	import Pinyin from '../utils/ChinesePY.js';
	
	export default {
		
		name: "stations",
		
		mixins: [dynamicKeepAlive],
		
		data() {
			return {
				stations: [],
				type: 0,
				buckets: []
			}
		},
		
		methods: {
			backToSearch() {
				this.$router.push({
					path: "/search",
					name: "search",
				});
			},
			chooseStation(name) {
				if (this.type == 0) {
					this.$store.commit("modifyDep", name);
				} else this.$store.commit("modifyDes", name);
				this.$nextTick(() => {
					this.$router.push({
						path: "/search",
						name: "search",
					});
				}, 20);
			},
			_initScroll() {
				this.scroll = new BScroll(this.$refs.stationlistwrapper, {
					probeType: 3,
					click: true
				});
			},
		},
		
		created() {
			this.stations = JSON.parse(this.$route.params.stations);
			this.type = this.$route.params.type;
			for (const i of this.stations.keys()) {
				Object.defineProperty(this.stations[i], "jp", {
					value: Pinyin.GetJP(this.stations[i].name),
					writable: false
				});
			}
			this.stations.sort((a, b) => {
				return a.jp < b.jp ? -1 : 1;
			});
			//console.log(this.type);
			for (let i = 0; i < 26; ++i) {
				this.buckets[this.buckets.length] = {
					stationList: this.stations.filter(station => station.jp[0] === String.fromCharCode(i + 65)),
					key: i
				};
			}
			//console.log(this.buckets);
			this.$nextTick(() => {
				let lwDOM = document.getElementById("stationlistwrapper");
				let bodyDOM = document.body;
				if (lwDOM && bodyDOM) {
					lwDOM.style.height = (bodyDOM.offsetHeight - 40) + "px";
				}
				setTimeout(() => {this._initScroll()}, 20);
			});
		},
		
		updated() {
			setTimeout(() => {
				if (this.scroll) this.scroll.refresh();
			}, 20);
		}
		
	}
</script>
<style>
.stations-route {
	position: absolute;
	left: 0;
	right: 0;
	height: 100%;
}
.stations-header {
	position: fixed;
	background-color: #3a98fa;
	width: 100%;
	text-align: center;
	vertical-align: middle;
	padding: 10px 0 10px 0;
}
.stations-header .header-depdes {
	color: white;
	font-size: 20px;
	margin: 0 80px 0 80px;
}
.stations-header .header-back {
	display: inline-block;
	width: 14px;
	height: 20.5px;
	vertical-align: top;
	background:url(../assets/back.png);
	background-size: 100% 100%;
	background-repeat:no-repeat;
	position: absolute;
	left: 15px;
}
.station-list-wrapper {
	margin-top: 45px;
	overflow: hidden;
}
.station-list-wrapper .station-list-letter ul .header {
	margin: 5px 10px 5px 10px;
	font-size: 10px;
}
.station-list-wrapper .station-list-letter ul .body {
	font-size: 15px;
	padding: 7.5px 10px 7.5px 10px;
	background-color: #FFF;
	border-bottom: 1px solid rgba(7, 17, 27, 0.1);
}
</style>