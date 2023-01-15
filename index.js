const fs = require('fs');
const dir = './days';

var progression=[]
var tradesEachDays=[]
var fileNames=fs.readdirSync(dir)
var DaysToMonitor=fileNames.length

function createTradesOfTheDay(nameOfDayFile){
	var trades		=[];
	var profitLoss	=0;
	var pureProfit	=0;
	var pureLoss	=0;
	var useless		=0;
	//console.log("IN createTradesOfTheDay")
	//console.log(nameOfDayFile)
	var data = fs.readFileSync("./"+dir+"/"+nameOfDayFile,{encoding:'utf8', flag:'r'})
	data=data.split("\n")
	data.shift()
	for(var i=0;i<data.length;i++){
		data[i]=data[i].split(',')
		trades[i]=Number(data[i][3])
		profitLoss+=trades[i]
		useless=(trades[i]>0)? pureProfit+=trades[i] :  pureLoss+=trades[i];
		
	}
	//console.log(trades)
	tradesEachDays.push(
		{
			"trades" 			: trades , 
			"stratingCapital"	: Number(data[data.length-1][1]) , 
			"endingCapital"		: Number(data[0][1]), 
			"Day" 				: data[0][0].substring(0,10) , 
			"profitLoss" 		: profitLoss,
			"pureProfit"		: pureProfit,
			"pureLoss"			: pureLoss
		}
	)
}

function createObjectProgressDays(){
	console.log("IN createObjectProgressDays");
	//Expectancy = (Win rate x Average win) - (Loss rate x Average loss)
	for(var i=0;i<tradesEachDays.length;i++){
		var numberOfTradesWon=0;
		for(var j=0;j<tradesEachDays[i].trades.length;j++){
			if(tradesEachDays[i].trades[j]>0)numberOfTradesWon++
		}
		numberOfTradesLoss=tradesEachDays[i].trades.length-numberOfTradesWon
		var WinRatio=(numberOfTradesWon *100)/tradesEachDays[i].trades.length
		ProgressDay = {
			"Day"				:	new Date(tradesEachDays[i].Day).toLocaleDateString() ,
			"stratingCapital" 	: 	tradesEachDays[i].stratingCapital,
			"numberOfTradesWon" : 	numberOfTradesWon,
			"numberOfTradesLoss": 	numberOfTradesLoss ,
			"WinRatio"			: 	WinRatio,
			"endingCapital"		:	tradesEachDays[i].endingCapital,
			"profitLoss"		: 	tradesEachDays[i].profitLoss,
			"pureProfit"		:	tradesEachDays[i].pureProfit,
			"pureLoss"			:	tradesEachDays[i].pureLoss,
			"Expectancy"		:	(  (WinRatio/100) * ( tradesEachDays[i].pureProfit / numberOfTradesWon ) ) - ( ((100 - WinRatio)/100) * Math.abs(tradesEachDays[i].pureLoss/numberOfTradesLoss)  )
		}
		progression.push(ProgressDay)
	}
}

for(var i=0;i<DaysToMonitor;i++){
	createTradesOfTheDay(fileNames[i])
}

createObjectProgressDays()


console.log(progression)