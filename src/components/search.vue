<template>
	<div class="search-route">
		<div class="header" align="center">
			<div class="header-img">
				<img alt="FlyInTheSky logo" src="../assets/logo.png"> 
			</div>
		</div>
		<div class="search-wrapper">
			<div class="search-box">
				<div class="dep-des">
					<!--<select v-model="dep">
					<option v-for="station in stations" :value="station.name" :key="station.key">
							{{ station.name }}
						</option>
					</select>
					<select v-model="des">
						<option v-for="station in stations" :value="station.name" :key="station.key">
							{{ station.name }}
						</option>
					</select>-->
					<div class="dep-des-left" @click="changeDep">{{ dep }}</div>
					<div class="exchangebutton" @click="exchangeDepDes"></div>
					<div class="dep-des-right" @click="changeDes">{{ des }}</div>
				</div>
				<div class="date" @click="changeDate">
					<!--<select v-model="date">
						<option value=0>10月25日 周一</option>
						<option value=1>10月26日 周二</option>
						<option value=2>10月27日 周三</option>
					</select>-->
					<span class="date-day">10月25日</span>
					<span class="date-week">周一</span>
				</div>
				<div class="options">
					<input type="checkbox" id="highspeed" v-model="onlyhighspeed">
					<label for="highspeed">只看高铁/动车</label>
					<input type="checkbox" id="student">
					<label for="student">学生票</label>
				</div>
				<div class="search">
					<div class="button-search" @click="search">查询车票</div>
				</div>
			</div>
		</div>
		<div class="tips" align="center">仅为学习使用 (Vue3.0 实现 12306 前端)</div>
	</div>
</template>

<script>
	
	import axios from 'axios';
	import { dynamicKeepAlive } from './mixins/dynamicKeepAlive';
	
	const OK = 0;
	
	export default {
		
		name: "search",
		
		inject: ["showAlertbox"],
		
		mixins: [dynamicKeepAlive],
		
		data() {
			return {
				onlyhighspeed: 0,
				date: 0,
				dep: "深圳北",
				des: "武汉",
				trains: [],
				stationstmp: [],
				stations: [],
			}
		},
		
		created() {
			setTimeout(() => {
				axios.get('/api/train')
					.then(response => {
					const result = response.data;
					if (result.code === OK) {
					this.trains = result.trains;
					
					//this.trains = JSON.parse(this.$route.params.trains);
					//console.log(this.trains);
					Object.keys(this.trains).forEach(e => {
						for (let i = 0; i < this.trains[e].stations.length; ++i) {
							this.stationstmp.push(this.trains[e].stations[i].name);
							//console.log(this.trains[e].stations[i].name);
						}
					})
					this.stationstmp.sort();
					let count = 0;
					for (let i = 0; i < this.stationstmp.length; ++i) {
						if (i == 0) {
							this.stations.push({
								name: this.stationstmp[i],
								key: count
							});
							++count;
						} else {
							if (this.stationstmp[i] != this.stationstmp[i - 1]) {
								this.stations.push({
									name: this.stationstmp[i],
									key: count
								});
								++count;
							}
						}
					}
					//console.log(this.stations);
				}
			})
			.catch (error => {
				console.log(error)
			})
			}, 100);
			if (this.$route.params.queryS) {
				let qry = JSON.parse(this.$route.params.queryS);
				this.dep = qry.dep;
				this.des = qry.des;
				this.date = qry.date;
				this.onlyhighspeed = qry.onlyhighspeed;
			}
			this.addKeepAliveRoute("search");
		},
		
		methods: {
			search() {
				if (this.dep === this.des) {
					//this.$refs.alertbox.showBox("温馨提示", "起点与终点相同！");
					this.showAlertbox("温馨提示", "起点与终点相同！");
					return ;
				}
				this.$router.push({
					path: "/buyticket",
					name: "buyticket",
					params: {
						query: JSON.stringify({
							dep: this.dep,
							des: this.des,
							date: this.date,
							onlyhighspeed: this.onlyhighspeed
						}),
						trains: JSON.stringify(this.trains)
					}
				});
				this.$nextTick(() => {
					this.deleteKeepAliveRoute("search");
				}, 20);
			},
			changeDep() {
				this.$router.push({
					path: "/stations",
					name: "stations",
					params: {
						stations: JSON.stringify(this.stations),
						type: 0
					}
				});
			},
			changeDes() {
				this.$router.push({
					path: "/stations",
					name: "stations",
					params: {
						stations: JSON.stringify(this.stations),
						type: 1
					}
				});
			},
			exchangeDepDes() {
				let tmp = this.dep;
				this.dep = this.des;
				this.des = tmp;
			},
			changeDate() {
				this.showAlertbox('温馨提示', '暂未开放日期选择');
			}
		},
		
		computed: {
			storeDep() {
				return this.$store.state.store_dep;
			},
			storeDes() {
				return this.$store.state.store_des;
			}
		},
		
		watch: {
			storeDep(e) {
				//console.log(e);
				this.dep = e;
			},
			storeDes(e) {
				this.des = e;
			}
		}
	}
</script>

<style>
.search-route {
	position: absolute;
	left: 0;
	right: 0;
	height: 100%;
}
.header {
	/*position: relative;
	left: 50%;*/
}
.header .header-img {
	width: 200px;
	height: 200px;
	/*transform:translate(-50%);*/
}
.search-wrapper {
	border-radius: 5px;
	margin: 40px 20px 0 20px;
	background-color: white;
	box-shadow: darkgrey 1px 1px 1px 1px;
}
.search-wrapper .search-box {
	padding: 5px 30px 10px 30px;
}
.search-wrapper .search-box .search .button-search {
	height: 25px;
	font-size: 16px;
	color: white;
	text-align: center;
	background-color: #307ac7;
	box-shadow: darkgrey 0.5px 0.5px 0.5px 0.5px;
	padding-top: 5px;
}
.search-wrapper .search-box .options {
	font-size: 15px;
	padding-top: 10px;
	padding-bottom: 10px;
}
.search-wrapper .search-box .options label {
	margin-right: 15px;
}
.search-wrapper .search-box .options input {
	margin-right: 5px;
}
.search-wrapper .search-box .date {
	padding: 10px 0 10px 0;
	border-bottom: 1px solid rgba(7, 17, 27, 0.1);
}
.search-wrapper .search-box .date .date-day {
	font-size: 20px;
}
.search-wrapper .search-box .date .date-week {
	padding-left: 10px;
	font-size: 15px;
}
.search-wrapper .search-box .date select {
	font-size: 20px;
	width: 100%;
}
.search-wrapper .search-box .dep-des {
	display: flex;
	padding-top: 10px;
	padding-bottom: 10px;
	border-bottom: 1px solid rgba(7, 17, 27, 0.1);
}
.search-wrapper .search-box .dep-des select {
	font-size: 20px;
	flex: 1;
}
.search-wrapper .search-box .dep-des .dep-des-left {
	display: inline-block;
	margin-right: 20px;
	font-size: 20px;
	font-weight: 600;
	flex: 1;
}
.search-wrapper .search-box .dep-des .dep-des-right {
	display: inline-block;
	margin-left: 20px;
	font-size: 20px;
	font-weight: 600;
	text-align: right;
	flex: 1;
}
.exchangebutton {
	width: 20px;
	height: 20px;
	vertical-align: bottom;
	background:url(../assets/exchange.png);
	background-size: 100% 100%;
	background-repeat:no-repeat;
}
.tips {
	margin-top: 10px;
}
</style>