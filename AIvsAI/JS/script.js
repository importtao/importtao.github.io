var chess = document.getElementById('chess');
//var canvas = document.getElementById('');
var context = chess.getContext('2d');
context.strokestyle = "#BFBFBF";
var me = true;
var gameover = false;

var chessbord = [];//棋盘二维数组 黑棋=1 白棋=2
for (var i = 0; i< 15; i++) {
	chessbord[i] = [];
	for (var j = 0; j< 15; j++) {
		chessbord[i][j] = 0;
	}
}
//赢法数组
var win = [];
for (var i = 0; i< 15; i++) {
	win[i] = [];
	for (var j = 0; j< 15; j++) {
		win[i][j] = [];
	}
}
var count = 0;//赢法索引
for (var i = 0; i< 15; i++) {//横线赢法
	for (var j = 0; j< 11; j++) {
		for (var k = 0; k< 5; k++) {
			win[i][j+k][count] = true;//console.log(i,j+k, count);
		}
		count++;
	}
}
for (var i = 0; i< 15; i++) {//竖线赢法
	for (var j = 0; j< 11; j++) {
		for (var k = 0; k< 5; k++) {
			win[j+k][i][count] = true;true;//console.log(j+k,i, count);
		}
		count++;
	}
}
for (var i = 0; i< 11; i++) {//斜线赢法
	for (var j = 0; j< 11; j++) {
		for (var k = 0; k< 5; k++) {
			win[i+k][j+k][count] = true;true;//console.log(i+k,j+k, count);
		}
		count++;
	}
}
for (var i = 0; i< 11; i++) {//反斜线赢法
	for (var j = 14; j>3; j--) {
		for (var k = 0; k< 5; k++) {
			win[i+k][j-k][count] = true;//console.log(i+k, j-k,count);
		}
		count++;
	}
}
//console.log(count);

//赢法统计数组
var mywin = [];//玩家
var computerwin = [];//AI
for (var i = 0; i< count; i++) {//初始化赢法统计数组
	mywin[i] = 0;
	computerwin[i] = 0;
}

var drawchessbox = function(){//棋盘
	for (var i = 0; i <15; i++) {
	context.moveTo(15+i*30, 15);
	context.lineTo(15+i*30, 450-15);
	context.stroke();
	context.moveTo(15, 15+i*30);
	context.lineTo(450-15, 15+i*30);
	context.stroke();
	}
}
//黑棋：me=true
var onestep = function(k, l, me){
	//var onestep = function(){
	context.beginPath();
	context.arc(15+k*30, 15+l*30, 13, 0, 2* Math.PI);//圆心坐标（x,y） 半径 起始弧度
	context.closePath();
	var gradient = context.createRadialGradient(15+k*30+2, 15+l*30-2, 15, 15+k*30+2, 15+l*30-2, 5);//渐变的两个圆
	if(me){
		gradient.addColorStop(0, "#0A0A0A");//定义渐变颜色
		gradient.addColorStop(1, "#636766");
		chessbord[k][l] = 1;
	}else {
		gradient.addColorStop(0, "#D1D1D1");//定义渐变颜色
		gradient.addColorStop(1, "#F9F9F9");
		chessbord[k][l] = 2;
	}
	context.fillStyle = gradient;
	context.fill();
	
}

//logo
var logo = new Image();
logo.src="image/bg.png";
logo.onload= function(){
	context.drawImage(logo, 0 , 0, 450, 450);
	drawchessbox();
	//computerAI1();
	var a = Math.random()*10+4;//返回[0,1）
	var b = Math.random()*10+4;
	onestep(Math.floor(a), Math.floor(b), true);
	computerAI1();
	//onestep(5, 6, false);
	//onestep(6, 5, true);
	//onestep(6, 6, false);
	
}
function windowtocanvas(x, y){//转化坐标
	var bbox = chess.getBoundingClientRect();
	return{x: x-bbox.left, y: y-bbox.top}
}
/*chess.onclick = function(e){
	/*e.preventDefault();
	var point = windowtocanvas(e.clientX, e.clientY);
	//console.log(point.x);
	var kx = (point.x-15)/30;
	var ky = (point.y-15)/30;
	console.log(kx,ky);
	me = !me;
	//(kx, ky, me)
	if(gameover){
		return;
	}
	if(!me){
		return;
	}
	var x = e.offsetX;
	var y = e.offsetY;
	var i = Math.floor(x/30);
	var j = Math.floor(y/30);
	if(chessbord[i][j]==0){
		onestep(i, j, me);
		
		for (var k =0; k< count ;k++) {
			if(win[i][j][k]){
				mywin[k]++;
				computerwin[k] = 6;
				if (mywin[k]==5) {
					window.alert("你赢了！");
					gameover = true;
				}
			}
		}

	}
	if(!gameover){
		me = !me;
		computerAI();
	}
}*/

var computerAI1 = function(){
	var myScore = [];
	var computerScore = [];
	var max = 0;
	var u = 0,v = 0;
	for (var i = 0; i < 15; i++) {
		myScore[i] = [];
		computerScore[i] = [];
		for (var j = 0; j< 15; j++) {
			myScore[i][j] = 0;
			computerScore[i][j] = 0;
		}
	}
	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 15; j++) {
			if(chessbord[i][j]==0){
				for (var k = 0; k < count; k++) {
					if(win[i][j][k]){
						if(mywin[k]==1){
							myScore[i][j] +=200;
						}else if(mywin[k]==2){
							myScore[i][j] +=400;
						}else if(mywin[k]==3){
							myScore[i][j] +=2000;
						}else if(mywin[k]==4){
							myScore[i][j] +=10000;
						}
						if(computerwin[k]==1){
							computerScore[i][j] +=220;
						}else if(computerwin[k]==2){
							computerScore[i][j] +=420;
						}else if(computerwin[k]==3){
							computerScore[i][j] +=2100;
						}else if(computerwin[k]==4){
							computerScore[i][j] +=20000;
						}
					}
				}
				if(myScore[i][j] > max){
					max = myScore[i][j];
					u = i;
					v = j;
				}else if(myScore[i][j]==max){
					if(myScore[i][j] > myScore[u][v]){
						u = i;
						v = j;
					}
				}
				if(computerScore[i][j] > max){
					max = computerScore[i][j];
					u = i;
					v = j;
				}else if(computerScore[i][j]==max){
					if(computerScore[i][j] > computerScore[u][v]){
						u = i;
						v = j;
					}
				}
			}
		}
	}
	onestep(u, v, false);
	chessbord[u][v] = 2;
	for (var k =0; k< count ;k++) {
			if(win[u][v][k]){
				mywin[k] = 6;
				computerwin[k]++;
				if (computerwin[k]==5) {
					window.alert("白棋赢了");
					gameover = true;
				}
			}
	}
	if(!gameover){
		me = !me;
		computerAI2();
	}
}
var computerAI2 = function(){
	var myScore = [];
	var computerScore = [];
	var max = 0;
	var u = 0,v = 0;
	for (var i = 0; i < 15; i++) {
		myScore[i] = [];
		computerScore[i] = [];
		for (var j = 0; j< 15; j++) {
			myScore[i][j] = 0;
			computerScore[i][j] = 0;
		}
	}
	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 15; j++) {
			if(chessbord[i][j]==0){
				for (var k = 0; k < count; k++) {
					if(win[i][j][k]){
						if(mywin[k]==1){
							myScore[i][j] +=220;
						}else if(mywin[k]==2){
							myScore[i][j] +=420;
						}else if(mywin[k]==3){
							myScore[i][j] +=2100;
						}else if(mywin[k]==4){
							myScore[i][j] +=20000;
						}
						if(computerwin[k]==1){
							computerScore[i][j] +=200;
						}else if(computerwin[k]==2){
							computerScore[i][j] +=400;
						}else if(computerwin[k]==3){
							computerScore[i][j] +=2000;
						}else if(computerwin[k]==4){
							computerScore[i][j] +=10000;
						}
						
					}
				}
				if(computerScore[i][j] > max){
					max = computerScore[i][j];
					u = i;
					v = j;
				}else if(computerScore[i][j]==max){
					if(computerScore[i][j] > computerScore[u][v]){
						u = i;
						v = j;
					}
				}
				if(myScore[i][j] > max){
					max = myScore[i][j];
					u = i;
					v = j;
				}else if(myScore[i][j]==max){
					if(myScore[i][j] > myScore[u][v]){
						u = i;
						v = j;
					}
				}
			}
		}
	}
	onestep(u, v, true);
	chessbord[u][v] = 1;
	for (var k =0; k< count ;k++) {
			if(win[u][v][k]){
				mywin[k] ++;
				computerwin[k]=6;
				if (mywin[k]==5) {
					window.alert("黑棋赢了");
					gameover = true;
				}
			}
	}
	if(!gameover){
		me = !me;
		computerAI1();
	}
}