(function (React, ReactDOM, ReactRouter, Reflux, $) {
// 定义全局变量
var BANNER_NUM = 3;
var ITEM_NUM = 33;
// 存储数据
var DATABASE = [];
var DATATEXT = [];
var processDOM = $('#app .loader-text span');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;
var hashHistory = ReactRouter.hashHistory;

// 第一步 定义分类页面消息
var TypeAction = Reflux.createActions(['changeType']);
// 第二步 定义分类页面store
var TypeStore = Reflux.createStore({
	// 监听消息
	listenables: [TypeAction],
	// 定义消息监听函数
	onChangeType: function (msg) {
		var result = [];
		DATABASE.forEach(function (obj, index) {
			if (obj.type === msg) {
				result.push(obj)
			}
		})
		// 更新组件
		this.trigger(result)
	}
})

// 1 创建消息
var SearchAction = Reflux.createActions(['changeSearch']);
// 2 创建store
var SearchStore = Reflux.createStore({
	// 监听消息
	listenables: [SearchAction],
	// 注册消息
	onChangeSearch: function (query) {
		var result = [];
		DATABASE.forEach(function (obj, index) {
			for (var i in obj) {
				// obj[i]表示属性值
				if (obj[i].indexOf(query) >= 0) {
					result.push(obj)
					return;
				}
			}
		})
		// 更新组件
		this.trigger(result)
	}
})

// 渲染首页列表的方法可能被复用，因此我们可以使用混合
var RenderMethod = {
	// 创建列表方法
	createList: function () {
		return this.state.data.map(function (obj, index) {
			// 定义背景
			var style = {
				backgroundImage: 'url(img/item/item' + index + '.jpg)'
			}
			return (
				<li key={index} style={style}>
					<a href={obj.site} target="_blank">
						<div className="content">
							<h2>{obj.name}</h2>
						</div>
						<div className="layer">
							<p>{'景点地址：' + obj.pos}</p>
							<p>{'开放时间：' + obj.time}</p>
							<p>{'评价：' + obj.description}</p>
						</div>
					</a>
				</li>
			)
		}.bind(this))
	}
}

// 定义组件
var Home = React.createClass({
	// 初始化状态数据
	getInitialState: function () {
		return {
			data: DATABASE
		}
	},
	// 使用混合
	mixins: [RenderMethod],
	render: function () {
		return (
			<section className="page">
				<div className="container">
					<ul>{this.createList()}</ul>
				</div>
			</section>
		)
	}
})
// 分类列表组件
var Type = React.createClass({
	// 第三步 绑定状态数据
	mixins: [Reflux.connect(TypeStore, 'data'), RenderMethod],
	// 初始化状态
	getInitialState: function () {
		return {
			data: []
		}
	},
	render: function () {
		return (
			<section className="page">
				<div className="container">
					<ul>{this.createList()}</ul>
				</div>
			</section>
		)
	}
})
// 搜索组件
var Search = React.createClass({
	// 绑定消息
	mixins: [Reflux.connect(SearchStore, 'data'), RenderMethod],
	// 初始化状态
	getInitialState: function () {
		return {
			data: []
		}
	},
	render: function () {
		return (
			<section className="page">
				<div className="container">
					<ul>{this.createList()}</ul>
				</div>
			</section>
		)
	}
})
// 定义header组件
var Header = React.createClass({
	getInitialState:function (){
		return {
			data:DATATEXT
		}
	},
	// 第二种条转发方式
	goHome: function () {
		hashHistory.replace('/')
	},
	// 定义搜索事件
	goToSearch: function (e) {
		// 判断按键
		if (e.keyCode === 13) {
			// 如果是回车键，跳转
			hashHistory.replace('/search/' + e.target.value)
			// 清空内容
			e.target.value = '';
		}
	},
	render: function () {
		return (
			<div className="app-header">
				<header>
					<div className="container">
					  <div className="container2">
					   <span className="pull-right search">
					    <span className="glyphicon glyphicon-search" aria-hidden="true"></span>
						<input type="text" className="pull-right" onKeyDown={this.goToSearch}/>
					   </span>
						<span className="view">VIEW</span>
						<img src="img/logo.png" alt="" className="pull-left" onClick={this.goHome}/>
					</div>
				   </div>
				   <ul className="nav nav-pills nav-justified">
							<li>
								<a href="#/type/movie">首页</a>
							</li>
							<li>
								<a href="#/type/games">自助游</a>
							</li>
							<li>
								<a href="#/type/news">景区</a>
							</li>
							<li>
								<a href="#/type/sports">酒店</a>
							</li>
							<li>
								<a href="#/type/buy">攻略</a>
							</li>
							<li>
								<a href="#/type/friends">门票</a>
							</li>
						</ul>
				</header>
				<div className="banner">
                     <div id="carousel-example-generic" className="carousel slide" data-ride="carousel">
					  <ol className="carousel-indicators">
					    <li data-target="#carousel-example-generic" data-slide-to="0" className="active"></li>
					    <li data-target="#carousel-example-generic" data-slide-to="1"></li>
					    <li data-target="#carousel-example-generic" data-slide-to="2"></li>
					  </ol>
					  <div className="carousel-inner" role="listbox">
					    <div className="item active">
					      <img src="../img/banner/banner0.jpg" alt="..."/>
					      <div className="carousel-caption">
					       <h2>
                            {this.state.data[0].text}
                           </h2>
                          </div>
					    </div>
					    <div className="item">
					      <img src="../img/banner/banner1.jpg" alt="..."/>
					      <div className="carousel-caption">
					      <h2>
                            {this.state.data[1].text}
                          </h2>
                          </div>
					    </div>
					     <div className="item">
					      <img src="../img/banner/banner2.jpg" alt="..."/>
					      <div className="carousel-caption">
					      <h2>
                            {this.state.data[2].text}
                          </h2>
                          </div>
					    </div>
					  </div>
					  <a className="left carousel-control" href="#carousel-example-generic" role="button" data-slide="prev">
					    <span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
					    <span className="sr-only">Previous</span>
					  </a>
					  <a className="right carousel-control" href="#carousel-example-generic" role="button" data-slide="next">
					    <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
					    <span className="sr-only">Next</span>
					  </a>
					</div>
				</div>
			</div>
		)
	}
})
// 定义应用程序组件
var App = React.createClass({
	// 定义触发消息的方法
	sendAction: function () {
		// 根据pathname做判断
		var pathname = this.props.location.pathname;
		// console.log(pathname)
		// 如果是type页面
		if (pathname.indexOf('/type/') === 0) {
			// 第四步触发消息
			TypeAction.changeType(this.props.params.id)
		} else {
			// 发送search消息
			SearchAction.changeSearch(this.props.params.id)

		}
	},
	// 创建期发送
	componentDidMount: function() {
		this.sendAction();
	},
	// 存在期发送
	componentDidUpdate: function() {
		this.sendAction();
	},
	render: function () {
		// this.sendAction();
		return (
			<div>
				<Header></Header>
				{this.props.children}
			</div>
		)
	}
})
// 第二步 定义路由
// 定义路由规则
var routes = (
	<Router>
		<Route path="/" component={App}>
			{/*定义子路由组件*/}
			<IndexRoute component={Home}></IndexRoute>
			<Route path="type/:id" component={Type}></Route>
			<Route path="search/:id" component={Search}></Route>
		</Route>
		{/*<ReactRouter.Redirect path="*" to="/" />*/}
	</Router>
)

var ImageLoaer = function (params, step, success, fail) {
	// 缓存图片数量
	this.bannerNum = params.bannerNum || 0;
	this.itemNum = params.itemNum || 0;
	this.step = step || function () {};
	this.success = success || function () {};
	this.fail = fail || function () {};
	// 初始化应用
	this.init();
}
// 定义原型方法
ImageLoaer.prototype = {
	// 初始化方法Init
	init: function () {
		// 计算总数
		this.total = this.bannerNum + this.itemNum;
		this.bannerTotal = this.bannerNum;
		this.itemTotle = this.itemNum;
		this.carousel=this.carousel();
		// 加载这些图片
		this.loader();
	},
	carousel:function (){
      $('.carousel').carousel()
	},
	// 加载图片方法
	loader: function () {
		// 加载banner图片, 图片id可以是0·
		while(this.bannerNum--) {
			this.loaderImage(this.bannerNum, true)
		}
		// 加载item图片
		while(this.itemNum--) {
			this.loaderImage(this.itemNum)
		}
		// 当值是-1的时候开始加，所以当值是-1的时候还要加回来
		this.bannerNum++;
		this.itemNum++;
	},
	// 根据id，生成banner图片的原始地址
	getBannerUrl: function (num) {
		return 'img/banner/banner' + num + '.jpg';
	},
	getItemUrl: function (num) {
		return 'img/item/item' + num + '.jpg';
	},
	loaderImage: function (num, isBanner) {
		// 拼凑地址
		if (isBanner) {
			var url = this.getBannerUrl(num);
		} else {
			var url = this.getItemUrl(num);
		}
		var img = new Image();
		img.onload = function () {
			this.updateNum(isBanner);
			this.step(this.bannerNum + this.itemNum, this.total);
			this.done();
		}.bind(this)
		// 监听加载失败
		img.onerror = function () {
			this.updateNum(isBanner);
			this.fail(this.bannerNum + this.itemNum, this.total)
			this.done();
		}.bind(this)
		// 加载图片
		img.src = url;
	},
	done: function () {
		if (this.bannerNum + this.itemNum === this.total) {
			this.success(this.total);
		}
	},
	updateNum: function (isBanner) {
		if (isBanner) {
			this.bannerNum++;
		} else {
			this.itemNum++;
		}
	}
}
$.get("data/text.json",function (res){
      if (res && res.errno === 0) {
		DATATEXT = res.data;
	}
})
// 异步请求加载数据
$.get('data/sites.json', function (res) {
	if (res && res.errno === 0) {
		DATABASE = res.data;
		// 加载图片
		new ImageLoaer({
			bannerNum: BANNER_NUM,
			itemNum: ITEM_NUM
		}, function (num, total) {
			processDOM.html((num / total * 100).toFixed(2))
		}, function () {
			processDOM.html('100.00');
				ReactDOM.render(routes, document.getElementById('app'))
		
		})
	}
})

})(window.React, window.ReactDOM, window.ReactRouter, window.Reflux, window.jQuery)