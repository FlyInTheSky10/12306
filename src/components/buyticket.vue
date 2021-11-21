<template>
	<div class="buyticket-route">
		<div class="buyticket-header">
			<div class="header-back" @click="backToSearch">
			</div>
			<div class="header-depdes" @click="exchangeDepDes">
				{{ getDep  + " &lt;&gt; " + getDes }}
			</div>
		</div>
		<div class="list-wrapper" ref="listwrapper" id="listwrapper">
			<ul class="trainsList" id="trainwrapper">
				<li v-for="train in validTrains" :key="train.key">
					<div class="train">
						<div class="tick-box">
							<div class="from-box">
								<p class="time">{{ getTimeFromMin(train.depStation.arriveTime + train.train.time) }}</p>
								<div class="pre-station">
									<div :class="train.depType"></div>
									{{ getDep }}
								</div>
							</div>
							<div class="middle-box">
								<p class="traincode">{{ (train.direct === 0) ? train.train.go : train.train.back }}</p>
								<p class="pre-spendtime" @click="openScheduleList(train, $event)">
									{{ spendTimeFormalize(train.timeLength) }}
									<span class="arrowbutton"></span>
								</p>
							</div>
							<div class="to-box">
								<p class="time">{{ getTimeFromMin(train.depStation.arriveTime + train.train.time + train.timeLength) }}</p>
								<div class="pre-station">
									<div :class="train.desType"></div>
									{{ getDes }}
								</div>
							</div>
							
						</div>
						<div class="ticket-box">
							<div class="ticket">
								商务: <span>有</span>
							</div>
							<div class="ticket">
								一等: <span>有</span>
							</div>
							<div class="ticket">
								二等: <span>有</span>
							</div>
						</div>
						<div class="schedule-box" v-if="train.isShow">
							<table class="schedule-list">
								<thead>
									<tr>
										<th class="stationName">站名</th>
										<th class="middleTime">到时</th>
										<th class="middleTime">发时</th>
										<th class="stayTime">停留</th>
									</tr>
								</thead>
							</table>
							<div class="schedule-list-box">
								<div class="track">
									<div 
										v-for="station in train.train.stations" 
										:key="station.key" 
										:class="computeStationTypeForTrack(station, train.train)">
									</div>
								</div>
								<table class="schedule-list">
									<tbody>
										<tr v-for="station in train.train.stations" :key="station.key">
											<td class="item" :class="stationType(train.train, station.key)">
												{{ station.name }}
											</td>
											<td class="middleTime item" :class="stationType(train.train, station.key)">
												{{ getTimeFromMin(station.arriveTime + train.train.time) }}
											</td>
											<td class="middleTime item" :class="stationType(train.train, station.key)">
												{{ getTimeFromMin(station.departTime + train.train.time) }}
											</td>
											<td class="stayTime item" :class="stationType(train.train, station.key)">
												{{ (spendTimeFormalize(station.stayTime) === "0分") ? "----" : spendTimeFormalize(station.stayTime) }}
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	
	import BScroll from '@better-scroll/core';
	import { dynamicKeepAlive } from './mixins/dynamicKeepAlive';
	
	export default {
		
		name: "buyticket",
		
		inject: ["buyticketExchange", "reloadRoute", "showAlertbox", "showConfirmbox"],
		
		mixins: [dynamicKeepAlive],
		
		data() {
			return {
				query: null,
				trains: null,
				validTrains: []
			}
		},
		
		computed: {
			getDep() {
				return this.query.dep;
			},
			getDes() {
				return this.query.des;
			},
		},
		
		methods: {
			getHourFromMin(x) {
				return Math.floor(x / 60);
			},
			getMinFromMin(x) {
				return x % 60;
			},
			getTimeFromMin(x) {
				let h = this.getHourFromMin(x);
				let m = this.getMinFromMin(x);
				if (h < 10) h = '0' + h;
				if (m < 10) m = '0' + m;
				return h + ":" + m;
			},
			spendTimeFormalize(x) {
				if (x < 60) {
					return x + "分";
				}
				let h = this.getHourFromMin(x);
				let m = this.getMinFromMin(x);
				if (x % 60 === 0) {
					return h + "时整";
				}
				return h + "时" + m + "分";
			},
			openScheduleList(train, event) {
				if (!event._constructed) {
					return ;
				}
				train.isShow = !train.isShow;
				let arrowDOM = document.getElementsByClassName("arrowbutton");
				//console.log(arrowDOM);
				if (arrowDOM) {
					if (arrowDOM[train.key]) arrowDOM[train.key].style.transform = train.isShow ? "rotate(180deg)" : "";
				}
			},
			stationType(train, key) {
				if (key < train.fromIndex) {
					return "excludeStation";
				}
				if (key > train.toIndex) {
					return "excludeStation";
				}
				if (key === train.fromIndex || key === train.toIndex) {
					return "importantStation";
				}
				return "middleStation";
			},
			computeStationTypeForTrack(station, train) {
				let result = {
					trackPoint: false,
					trackLong: false,
					blue: false,
					grey: false,
					hole: false,
					bluegrey: false
				};
				if (station.key === train.stations.length - 1) {
					result.trackPoint = true;
				} else result.trackLong = true;
				let key = station.key;
				if (key < train.fromIndex || key > train.toIndex) {
					result.grey = true;
				} else if (key === train.fromIndex) {
					result.blue = true;
				} else if (key === train.toIndex) {
					if (result.trackLong) result.bluegrey = true; else result.blue = true;
				} else {
					result.hole = true;
				}
				return result;
			},
			DynamicAdjustAppHeight() {
				let lwDOM = document.getElementById("listwrapper");
				let twDOM = document.getElementById("trainwrapper");
				let bodyDOM = document.body;
				if (lwDOM) {
					lwDOM.style.height = (bodyDOM.offsetHeight - 50) + "px";
				}
				if (lwDOM && twDOM) {
					if (twDOM.offsetHeight < bodyDOM.offsetHeight - 50) {
						twDOM.style.height = (bodyDOM.offsetHeight - 50 + 5) + "px";
					}
				}
				if (twDOM) {
					let tmp = twDOM.style.height;
					twDOM.style.height = "";
					if (twDOM.offsetHeight < parseInt(tmp)) {
						twDOM.style.height = tmp;
					}
				}
			},
			exchangeDepDes() {
				/*let sgn = confirm("确定交换发到站吗?");
				if (sgn) {
					this.buyticketExchange(JSON.parse(this.$route.params.query), JSON.parse(this.$route.params.trains));
					setTimeout(this.reloadRoute, 300);
				}*/
				this.showConfirmbox("温馨提示", "确定交换发到站吗?", () => {
					this.buyticketExchange(JSON.parse(this.$route.params.query), JSON.parse(this.$route.params.trains));
					setTimeout(this.reloadRoute, 300);
				});
			},
			backToSearch() {
				this.$router.push({
					path: "/search",
					name: "search",
					params: {
						queryS: JSON.stringify(this.query)
					}
				});
			},
			_initScroll() {
				this.scroll = new BScroll(this.$refs.listwrapper, {
					probeType: 3,
					click: true
				});
				this.scroll.on("touchEnd", (pos) => {
					if (pos.y > 50) {
						setTimeout(() => {
							this.reloadRoute();
							this.showAlertbox("温馨提示", "已刷新!");
							}, 100);
					}
				});
			},
		},
		
		created() {
			this.query = JSON.parse(this.$route.params.query);
			this.trains = JSON.parse(this.$route.params.trains);
			let from = this.query.dep, to = this.query.des, count = 0;
			Object.keys(this.trains).forEach(e => {
				let no_from = -1, no_to = -1;
				for (let i = 0; i < this.trains[e].stations.length; ++i) {
					let station = this.trains[e].stations[i];
					if (station.name === from) {
						no_from = i;
					}
					if (station.name === to) {
						no_to = i;
					}
				}
				if (no_from !== -1 && no_to !== -1) {
					let direct;
					if (no_from < no_to) direct = 0; else direct = 1;
					this.validTrains.push({
						key: count++,
						direct: direct,
						train: this.trains[e],
						depType: "icon-beginning",
						desType: "icon-terminal",
						isShow: false
					});
				}
			});
			//算每个的到点和出发点
			this.validTrains.forEach(train => {
				let countTime = 0;
				if (train.direct === 0) {
					for (let i = 0; i < train.train.stations.length; ++i) {
						let station = train.train.stations[i];
						if (i > 0) countTime += station.delTime;
						station.arriveTime = countTime;
						countTime += station.stayTime;
						station.departTime = countTime;
					}
				} else { // 反过来
					let len = train.train.stations.length - 1;
					for (let i = len; i >= 0; --i) {
						let station = train.train.stations[i];
						if (i < len - 1) countTime += station.delTime;
						station.arriveTime = countTime;
						countTime += station.stayTime;
						station.departTime = countTime;
					}
				}
				//console.log(train);
			});
			// 算时长
			for (let i = 0; i < this.validTrains.length; ++i) {
				let train = this.validTrains[i].train;
				let from = -1;
				let to = -1;
				for (let j = 0; j < train.stations.length; ++j) {
					let station = train.stations[j];
					if (station.name === this.query.dep) {
						from = j;
					}
					if (station.name === this.query.des) {
						to = j;
					}
				}
				
				//station[j].key
				if (this.validTrains[i].direct == 0) {
					for (let j = 0; j < train.stations.length; ++j) {
						train.stations[j].key = j;
						if (train.stations[j].name === this.query.dep) train.fromIndex = train.stations[j].key;
						if (train.stations[j].name === this.query.des) train.toIndex = train.stations[j].key;
					}
				} else {
					for (let j = 0; j < train.stations.length; ++j) {
						train.stations[j].key = train.stations.length - j - 1;
						if (train.stations[j].name === this.query.dep) train.fromIndex = train.stations[j].key;
						if (train.stations[j].name === this.query.des) train.toIndex = train.stations[j].key;
					}
				}
				
				//console.log(from + " " + to);
				let count = 0;
				if (from < to) {
					for (let j = from + 1; j <= to; ++j) {
						count += train.stations[j].delTime + train.stations[j].stayTime;
					}
					count -= train.stations[to].stayTime;
				} else {
					for (let j = from; j > to; --j) {
						count += train.stations[j].delTime + train.stations[j].stayTime;
					}
					count -= train.stations[from].stayTime;
				}
				this.validTrains[i].timeLength = count;
				this.validTrains[i].depStation = train.stations[from];
				/*if (
					this.validTrains[i].depStation.name
					===
					(this.validTrains[i].direct === 0 ? this.validTrains[i].train.from : this.validTrains[i].train.to)
					) this.validTrains[i].depStation.arriveTime = 0;*/
				//console.log(this.validTrains[i].timeLength);
				//始发终到
				if (this.validTrains[i].direct === 0) {
					if (this.validTrains[i].train.from !== this.query.dep) {
						this.validTrains[i].depType = "icon-passing";
					}
					if (this.validTrains[i].train.to !== this.query.des) {
						this.validTrains[i].desType = "icon-passing";
					}
				} else {
					if (this.validTrains[i].train.to !== this.query.dep) {
						this.validTrains[i].depType = "icon-passing";
					}
					if (this.validTrains[i].train.from !== this.query.des) {
						this.validTrains[i].desType = "icon-passing";
					}
				}
				train.stations.sort((a, b) => {
					return a.key - b.key;
				});
			}
			//按到达时间排序
			this.validTrains.sort((a, b) => {
				return a.depStation.arriveTime + a.train.time - (b.depStation.arriveTime + b.train.time);
			});
			for (let i = 0; i < this.validTrains.length; ++i) this.validTrains[i].key = i;
			//console.log(this.validTrains);
			this.$nextTick(() => {
				this.DynamicAdjustAppHeight();
				setTimeout(() => {this._initScroll()}, 20);
			});
			if (this.validTrains.length === 0) {
				setTimeout(() => { this.showAlertbox("温馨提示", "没有查询到相关列车!") }, 310);
			}
		},
		
		updated() {
			this.DynamicAdjustAppHeight();
			setTimeout(() => {
				if (this.scroll) this.scroll.refresh();
			}, 20);
		}
		
	}
</script>

<style>
.buyticket-route {
	position: absolute;
	left: 0;
	right: 0;	
}
.list-wrapper {
	margin-top: 5px;
	overflow: hidden;
}
.list-wrapper .trainsList {
	margin: 0px 10px 0px 10px;
}
.list-wrapper .train {
	background-color: #ffffff;	
	border-radius: 5px;
	margin-bottom: 5px;
	/*box-shadow: darkgrey 0.5px 0.5px 0.5px 0.5px;*/
}
.list-wrapper .tick-box {
	padding: 10px 20px 10px 20px;
	display: flex;
}
.list-wrapper .from-box {
	flex: 1;
}
.list-wrapper .to-box {
	flex: 1;
	text-align: right;
}
.list-wrapper .middle-box {
	flex: 1;
	text-align: center;
}
.list-wrapper .time {
	font-size: 22px;
}
.list-wrapper .pre-station {
	padding-top: 3px;
	font-size: 13px;
}
.list-wrapper .traincode {
	padding-top: 3px;
	font-size: 12px;
}
.list-wrapper .pre-spendtime {
	margin-top: 5px;
	padding-top: 5px;
	font-size: 12px;
	border-top: 1px solid rgba(7, 17, 27, 0.1)
}
.list-wrapper .ticket-box {
	padding: 0px 20px 10px 20px;
	display: flex;
	border-top: 1px solid rgba(7, 17, 27, 0.1)
}
.list-wrapper .ticket {
	padding-top: 10px;
	flex: 1;
	font-size: 13px;
}
.list-wrapper .ticket span {
	color: #11986b;
}
.icon-beginning {
	display: inline-block;
	width: 15px;
	height: 15px;
	vertical-align: top;
	background:url(../assets/beginning.png);
	background-size: 100% 100%;
	background-repeat:no-repeat;
}
.icon-terminal {
	display: inline-block;
	width: 15px;
	height: 15px;
	vertical-align: top;
	background:url(../assets/terminal.png);
	background-size: 100% 100%;
	background-repeat:no-repeat;
}
.icon-passing {
	display: inline-block;
	width: 15px;
	height: 15px;
	vertical-align: top;
	background:url(../assets/passing.png);
	background-size: 100% 100%;
	background-repeat:no-repeat;
}
.arrowbutton {
	display: inline-block;
	width: 17px;
	height: 10.25px;
	vertical-align: bottom;
	background:url(../assets/arrow.png);
	background-size: 100% 100%;
	background-repeat:no-repeat;
	transition: all 0.2s;
}
.schedule-box {
	overflow: hidden;
}
.schedule-list {
	width: 100%;
}
.schedule-list th {
	background-color: #f4f9ff;
	padding: 10px 0 10px 0;
	font-size: 13px;
}
.schedule-list .stationName {
	padding-left: 20px;
}
.schedule-list .stayTime {
	padding-right: 20px;
	position: relative;
	text-align: right;
	width: 40px;
}
.schedule-list .middleTime {
	padding-right: 20px;
	position: relative;
	text-align: right;
	width: 40px;
}
.schedule-list .item {
	padding-top: 8px;
	padding-bottom: 8px;
	font-size: 13px;
}
.schedule-list .middleStation {
	color: black;
}
.schedule-list .excludeStation {
	color: #969696;
}
.schedule-list .importantStation {
	color: #3a98fa;
}
.trackPoint {
	display: inline-block;
	width: 19.63px;
	height: 10px;
	vertical-align: top;
}
.trackPoint.blue {
	background:url(../assets/blue.png);
	background-size: 100% 100%;
	background-repeat:no-repeat;
}
.trackPoint.grey {
	background:url(../assets/grey.png);
	background-size: 100% 100%;
	background-repeat:no-repeat;
}
.trackLong {
	display: inline-block;
	width: 19.63px;
	height: 29px;
	vertical-align: middle;
}
.trackLong.blue {
	background:url(../assets/blue_long.png);
	background-size: 100% 100%;
	background-repeat:no-repeat;
}
.trackLong.grey {
	background:url(../assets/grey_long.png);
	background-size: 100% 100%;
	background-repeat:no-repeat;
}
.trackLong.bluegrey {
	background:url(../assets/bluegrey_long.png);
	background-size: 100% 100%;
	background-repeat:no-repeat;
}
.trackLong.hole {
	background:url(../assets/hole_long.png);
	background-size: 100% 100%;
	background-repeat:no-repeat;
}
.schedule-list-box {
	display: flex;
	margin-left: 15px;
}
.schedule-list-box .track {
	flex: 1;
	padding-top: 10px;
}
.buyticket-header {
	/*position: fixed;*/
	background-color: #3a98fa;
	width: 100%;
	text-align: center;
	vertical-align: middle;
	padding: 10px 0 10px 0;
}
.buyticket-header .header-depdes {
	color: white;
	font-size: 20px;
	margin: 0 80px 0 80px;
}
.buyticket-header .header-back {
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
</style>