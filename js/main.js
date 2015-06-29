$(function(){

	//开始按钮浪起来
	$("#startBtn").on('animationEnd webkitAnimationEnd',function(){
		$(this).removeClass('bounceInUp').addClass('pulse infinite');
	});

	var isMoving=false;
	//游戏开始,浪起来
	$("#startBtn").on('tap',function(){

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
			});
		}

		// var game=new Game();
		// game.init();

	});
	var game=new Game();
	game.init();

});

//游戏初始化
function Game(){
	this.settings={
		card:1,//初始关卡
		time:10000,//每一关的游戏时间 ms
		number:20,//每一关的点击次数
		box:2//初始方块数
	}
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
		}
	]
}
Game.prototype.init=function(options){
	var that=this;
	for(var i in options){
		that.settings[i]=options[i];
	}
	$("#card").text( that.settings.card );
	var sec=parseInt( that.settings.time/1000 );
	var ms=parseInt( that.settings.time%1000/100 );
	$("#time").text("倒计时:"+sec+'.'+ms+'秒');

	that.createBox();
}
Game.prototype.createBox=function(){
	var that=this;
	var str='';
	var len=that.settings.box;
	var arr=rand(len,len); //生成随机数组
	for( var i=0;i<arr.length;i++ ){
		str+='<div class="tap-btn" data-color="'+that.colorArr[ arr[i] ].color+'" style="background-color:'+that.colorArr[ arr[i] ].hex+'"></div>'
	}
	$("#judger").data('color',that.colorArr[ arr[0] ].color)
	.css('color',that.colorArr[ arr[1] ].hex)
	.text( that.colorArr[ arr[0] ].ch );
	$("#btnBox").html( str );
	$("#btnBox").delegate('.tap-btn','tap',function(){
		console.log($(this).index());
	});
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