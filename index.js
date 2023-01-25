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

	tradesEachDays.push(
		{
			"trades" 			: trades , 
			"stratingCapital"	: Number(data[data.length-1][1].replace(/(\s+)/,"")) , 
			"endingCapital"		: Number(data[0][2].replace(/(\s+)/,"")), 
			"Day" 				: data[0][0].substring(0,10) , 
			"profitLoss" 		: Number(profitLoss+"".replace(/(\s+)/,"")),
			"pureProfit"		: Number(pureProfit+"".replace(/(\s+)/,"")),
			"pureLoss"			: Number(pureLoss+"".replace(/(\s+)/,""))
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
		var Expectancy =(  (WinRatio/100) * ( tradesEachDays[i].pureProfit / (numberOfTradesWon==0)?1:numberOfTradesWon ) ) - ( ((100 - WinRatio)/100) * Math.abs(tradesEachDays[i].pureLoss/ (numberOfTradesLoss==0)?1:numberOfTradesLoss)  )
		ProgressDay = {
			"Day"				:	new Date(tradesEachDays[i].Day).toLocaleDateString() ,
			"stratingCapital" 	: 	tradesEachDays[i].stratingCapital,
			"endingCapital"		:	tradesEachDays[i].endingCapital,
			"profitLoss"		: 	Number(tradesEachDays[i].profitLoss.toFixed(3)),
			"pureProfit"		:	Number(tradesEachDays[i].pureProfit.toFixed(3)),
			"pureLoss"			:	Number(tradesEachDays[i].pureLoss.toFixed(3)),
			"Expectancy"		:	Number(Expectancy.toFixed(3)),
			"numberOfTradesWon" : 	numberOfTradesWon,
			"numberOfTradesLoss": 	numberOfTradesLoss ,
			"WinRatio"			: 	Number(WinRatio.toFixed(3))

			
		}
		progression.push(ProgressDay)
	}
}

for(var i=0;i<DaysToMonitor;i++){
	createTradesOfTheDay(fileNames[i])
}

createObjectProgressDays()

var CapitalProgression = progression[progression.length-1].endingCapital - progression[0].stratingCapital
console.table(progression)
console.table("Capital Progression : " + CapitalProgression  )
var linearizeGainExpectancy = CapitalProgression/progression.length

console.table("linearize Gain Expectancy : " + linearizeGainExpectancy.toFixed(2)+"$ per day "  )
console.table("linearize Gain Expectancy percentage from Starting Capital : " + ((linearizeGainExpectancy*100)/progression[0].stratingCapital).toFixed(2)+"%"  )