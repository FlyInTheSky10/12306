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
					<div class="button-cancel" @click="{ isShow = false; }">取消</div>
					<div class="button-confirm-c" @click="process">确定</div>
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
		data() {
			return {
				func: undefined
			}
		},
		created() {
			console.log("confirmbox");
		},
		methods: {
			showBox(title, content, f) {
				this.title = title;
				this.content = content;
				this.isShow = true;
				this.func = f;
			},
			process() {
				if (this.isShow) {
					this.isShow = false;
					this.func();
				}
			}
		}
	}
</script>
<style>
@import "../static/boxbase.css";
.message-box .button-cancel {
	display: inline-block;
	padding-top: 9px;
	margin-right: 10px;
	background-color: #FFF;
	border-color: #307ac7;
	border-radius: 5px;
	border-width: 1px;
	border-style: solid;
	color: #307ac7;
	width: 100px;
	height: 25px;
}
.message-box .button-confirm-c {
	display: inline-block;
	padding-top: 9px;
	background-color: #307ac7;
	border-color: #307ac7;
	border-radius: 5px;
	border-width: 1px;
	border-style: solid;
	color: #FFF;
	width: 100px;
	height: 25px;
}
</style>