<template>
	<transition name="boxbase">
		<div class="boxbase" v-if="isShow">
			<div class="message-wrapper">
				<div class="message-box" align="center">
					<h1>
						<slot name="title" :title="title"></slot>
					</h1>
					<p>
						<slot name="content" :content="content"></slot>
					</p>
					<div class="button-confirm" @click="closeBox">确定</div>
				</div>
			</div>
			<div class="box-background"></div>
		</div>
	</transition>
</template>
<script>
	
	import { boxbase } from "./mixins/boxbase.js";
	
	export default {
		mixins: [boxbase],
		created() {
			console.log("alertbox");
		},
		methods: {
			showBox(title, content) {
				this.title = title;
				this.content = content;
				this.isShow = true;
			}
		}
	}
</script>
<style>
@import "../static/boxbase.css";
.message-box .button-confirm {
	padding-top: 9px;
	background-color: #307ac7;
	border-color: #307ac7;
	border-radius: 5px;
	border-width: 1px;
	border-style: solid;
	color: #FFF;
	width: 200px;
	height: 25px;
}
</style>