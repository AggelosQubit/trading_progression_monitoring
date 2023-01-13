const fs = require('fs');
const dir = './days';

var progression=[]
var tradesEachDays=[]
var fileNames=fs.readdirSync(dir)
var DaysToMonitor=fileNames.length

function createTradesOfTheDay(nameOfDayFile){
	var trades=[]
	console.log("IN createTradesOfTheDay")
	//console.log(nameOfDayFile)
	var data = fs.readFileSync("./"+dir+"/"+nameOfDayFile,{encoding:'utf8', flag:'r'})
	data=data.split("\n")
	data.shift()
	for(var i=0;i<data.length;i++){
		data[i]=data[i].split(',')
		trades[i]=Number(data[i][3])
	}
	//console.log(trades)
	
	tradesEachDays.push({"trades" : trades , "stratingCapital": data[data.length-1][1] , "endingCapital": data[0][1] })
}

function createObjectProgressDays(){
	console.log("IN createObjectProgressDays");

	for(var i=0;i<tradesEachDays.length;i++){
		var numberOfTradesWon=0;
		for(var j=0;j<tradesEachDays[i].trades.length;j++){
			if(tradesEachDays[i].trades[j]>0)numberOfTradesWon++
		}
		numberOfTradesLoss=tradesEachDays[i].trades.length-numberOfTradesWon
		ProgressDay = {
			"stratingCapital" : tradesEachDays[i].stratingCapital,
			"numberOfTradesWon" : numberOfTradesWon,
			"numberOfTradesLoss": numberOfTradesLoss ,
			"WinRatio": (numberOfTradesWon *100)/tradesEachDays[i].trades.length,
			"endingCapital":tradesEachDays[i].endingCapital
		}
		progression.push(ProgressDay)
	}
}

for(var i=0;i<DaysToMonitor;i++){
	createTradesOfTheDay(fileNames[i])
}

createObjectProgressDays()


console.log(progression)