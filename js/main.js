$(function(){

	//游戏关卡数据
	var gameArr=[
		{
			time:15000,//每一关的游戏时间 ms
			number:8,//每一关的点击次数
			box:2//初始方块数
		},
		{
			time:15000,//每一关的游戏时间 ms
			number:16,//每一关的点击次数
			box:2//初始方块数
		},
		{
			time:10000,//每一关的游戏时间 ms
			number:10,//每一关的点击次数
			box:4//初始方块数
		},
		{
			time:10000,//每一关的游戏时间 ms
			number:10,//每一关的点击次数
			box:6//初始方块数
		},
		{
			time:8000,//每一关的游戏时间 ms
			number:15,//每一关的点击次数
			box:8//初始方块数
		}
	]

	//开始按钮浪起来
	$("#startBtn").on('animationEnd webkitAnimationEnd',function(){
		$(this).removeClass('bounceInUp').addClass('pulse infinite');
	});

	var isMoving=false;
	var game=null;
	//游戏开始,浪起来
	$("#startBtn").on('tap',function(){
		game=new Game();
		game.init();

		if(!isMoving){
			isMoving=true;
			$(".p-main").css("left","100%");
			$(".p-start").animate({
				"left":"-100%"
			},300,"ease-out",function(){
				$(".p-start").removeClass('show');
			});
			$(".p-main").animate({
				"left":"0"
			},300,'ease-out',function(){
				$(".p-main").addClass('show');
				isMoving=false;

				game.start();

			});
		}
	});
	// 重新开始
	$("#restart").tap(function(){

		$(".p-over").animate({
			"top":"-100%"
		},200,'ease',function(){

			$(".p-over").removeClass('show');
			game.init({
				card:1,//初始关卡
				time:20000,//每一关的游戏时间 ms
				number:5,//每一关的点击次数
				box:2//初始方块数
			});
			game.start();

		});
	});
	//下一关
	$("#next").on('tap',function(){

		$(".p-over").animate({
			"top":"-100%"
		},200,'ease',function(){

		$(".p-over").removeClass('show');
		var ca=game.settings.card+1;
		var t=ca;
		if(t>=gameArr.length-1){
			//游戏被打爆了
			t=gameArr.length-1;
		}
		console.log( gameArr[t] );
		game.init({
			card:ca,//初始关卡
			time:gameArr[t].time,//每一关的游戏时间 ms
			number:gameArr[t].number,//每一关的点击次数
			box:gameArr[t].box//初始方块数
		});

		game.start();

		});

	});

	//分享按钮
	$("#share").tap(function(){
		$("#shareOverlay").fadeIn(400);
	});
	$("#shareOverlay").tap(function(){
		$(this).fadeOut(400);
	});

});

//游戏初始化
function Game(){
	this.settings={
		card:1,//初始关卡
		time:20000,//每一关的游戏时间 ms
		number:5,//每一关的点击次数
		box:2//初始方块数
	}
	this.gTimer=null;
	this.counter=0;
	this.number=0;
	this.colorArr=[
		{
			color:"green",
			hex:"#0c0",
			ch:"绿色"
		},
		{
			color:"blue",
			hex:"#00c",
			ch:"蓝色"
		},
		{
			color:"red",
			hex:"#c00",
			ch:"红色"
		},
		{
			color:"yellow",
			hex:"#cc0",
			ch:"黄色"
		},
		{
			color:"grey",
			hex:"#ccc",
			ch:"灰色"
		},
		{
			color:"brown",
			hex:"rgb(83, 54, 54)",
			ch:"棕色"
		},
		{
			color:"black",
			hex:"#000",
			ch:"黑色"
		},
		{
			color:"black",
			hex:"#000",
			ch:"黑色"
		}
	]
}
Game.prototype.init=function(options){
	var that=this;

	for(var i in options){
		that.settings[i]=options[i];
	}
	that.number=that.settings.number;	//初始化动态加减的数据
	that.counter=that.settings.time;

	$("#card").text( that.settings.card );
	var sec=parseInt( that.settings.time/1000 );
	var ms=parseInt( that.settings.time%1000/100 );
	$("#time").text("倒计时:"+sec+'.'+ms+'秒');
	$("#number").text(that.settings.number);

	that.createBox();
}
Game.prototype.start=function(){
	var that=this;
	that.counter=that.settings.time;
	clearInterval(that.gTimer);
	that.gTimer=setInterval(function(){
		if(that.counter<=0){
			clearInterval(that.gTimer);
			that.over('timeout');
		}
		else{
			that.counter-=100;
			var sec=parseInt( that.counter / 1000 );
			var ms=parseInt( that.counter % 1000/ 100 );
			$("#time").text("倒计时:"+sec+'.'+ms+'秒');
		}
		
	},1e2);
}
Game.prototype.createBox=function(){
	var that=this;
	var str='';
	var len=that.settings.box;
	var arr=rand(len,len); //生成随机数组
	for( var i=0;i<arr.length;i++ ){
		str+='<div class="tap-btn" data-color="'+that.colorArr[ arr[i] ].color+'" style="background-color:'+that.colorArr[ arr[i] ].hex+'"></div>'
	}

	//随机分配目标颜色
	var randTarget=Math.floor( Math.random()*arr.length );
	var randTextColor=Math.floor( Math.random()*arr.length );

	$("#judger").data('color',that.colorArr[ arr[randTarget] ].color)
	.css('color',that.colorArr[randTextColor].hex)
	.text( that.colorArr[ arr[randTarget] ].ch );

	$("#btnBox").html( str );

	//动态绑定事件
	$("#btnBox").delegate('.tap-btn','tap',main);

	function main(){
			if($(this).data('color')==$("#judger").data('color')){
				// console.log('true');
				that.number--;
				if( that.number<=0 ){
					$("#number").text( 0 );
					that.over('win');//游戏结束,下一关
				}
				else{
					$("#number").text( that.number );
					//因为事件是动态绑定的，所以每次createBox都会叠加事件,这里需要解绑
					$("#btnBox").undelegate('.tap-btn','tap');
					//去掉了后面的main,解决了一个重大bug
					that.createBox();
				}
			}
			else{
				// console.log('false');
				that.over('died');//游戏结束,over
			}
		}

}

Game.prototype.over=function(status){

	var that=this;
	console.log(status);
	clearInterval(that.gTimer);
	$(".p-over").css({
		'top':'-100%',
		'z-index':99
	}).addClass('show');
	$(".p-over").animate({
		"top":"0"
	},200,'ease');

	if( status=='died' ){
		$("#gameStatus").text('shi掉啦!莫慌,抱紧我,看清楚颜色了再下手哦!');

		$("#next").hide();
		$("#restart").show();

	}
	else if(status=='win'){
		$("#gameStatus").text('帅气!恭喜过关!');

		$("#next").show();
		$("#restart").hide();

	}
	else if( status=='timeout' ){
		$("#gameStatus").text('时间到啦,点得太慢,不够嗨!');

		$("#next").hide();
		$("#restart").show();

	}

	var dis=that.settings.time-that.counter;
	var sec=parseInt( dis / 1000 );
	var ms=parseInt( dis % 1000/ 100 );
	$("#totalTime").text( sec+'.'+ms );
	$("#totalCnt").text(that.settings.number-that.number);

	window.localStorage

}

/*
从total个数中随机生成不重复的num个数
*/
function rand(total,num){
	var arr=[];
	var newArr=[];
	for(var i=0;i<total;i++){
		arr.push(i);
	}
	for(var i=0;i<num;i++){
		newArr.push( arr.splice( Math.floor( Math.random()*arr.length ), 1 ) );
	}
	return newArr;
}