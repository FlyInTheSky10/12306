# 项目简介

一个部分仿 12306 前端的项目。

## 开发工具

- Vue3.0：主框架
- Vue-cli：构建 Vue 项目
- Vue-route：实现单页面应用 (路由功能)
- Vuex：实现全局的数据共享
- Better-Scroll：实现更好的滚动框
- mock.js：实现模拟后端数据发送

## 支持功能

- 查询页点击 `出发站` 和 `到达站` ，可支持按城市拼音首字母分类选择
- 查询页 `查询` 按钮，跳转查询到的列车选票页
- 选票页每个 `列车` 下用时后的 `小三角` 点击后展开详细经停信息
- 点击 `头部` 的 `发到站` 可交换车站
- 页面 `头部` 左侧 `箭头` 可返回上一页，且保存操作
- 购票页面下拉列表可刷新

# 项目结构

## 文件结构

```
\12306
	\src
		\assets: 资源文件 (图片)
		\components: 组件文件
		\mock: mock 相关
		\router: vue-router 配置
		\static: 一些公用 css
		\store: vuex 相关
		\utils: 第三方库
		App.vue: 总应用
		main.js: 程序入口
	vue.config.js: cli 相关
	babel.config.js: cli 相关
	package.json: cli 相关
	deploy.sh: push 到 github
```

## 组件结构

```
App.vue: 总组件
	alertbox.vue: 警告对话框组件
	confirmbox.vue: 确认对话框组件
	(route)search
	(route)buyticket
	(route)stations
	(route)blank
search.vue: 查询页组件 (整个列车数据在此组件 created() 中获取，此页面仅在切换到 stations.vue 组件后缓存)
buyticket.vue: 选票页组件 (此页面不缓存)
stations.vue：选站页组件 (此页面不缓存)
blank.vue: 空组件，用于解决 <keep-alive :include="keepAlivelist"> keepAliveList 为 "" 时失效的情况
```

# 使用

```
npm install
npm run serve
```

构建

```
npm run build
```

