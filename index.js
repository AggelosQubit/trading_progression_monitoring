const fs = require('fs');
const dir = './days';

var progression=[]
var tradesEachDays=[]
var fileNames=fs.readdirSync(dir)
var DaysToMonitor=fileNames.length
var totalNomberOftradeWonOnPeriod=0;
var totalNomberOftradeLossOnPeriod=0;

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
function DetermineTierTrader(){
/*	
	From GAIN POTENTIAL
	Bronze Win about 20% of your trades<br/>
	Silver Win about 30% of your trades<br/>
	Gold Win about 40% of your trades<br/>
	Platinum Win about 50% of your trades<br/>
	Diamond Win about 60% of your trades<br/>
	Master Win about 70% of your trades<br/>
	Grand Master Win about 80% of your trades<br/>
	Challenger Win about 90% of your trades<br/>
*/
	console.log("IN DetermineTierTrader");
	let TraderCurrentTierForPeriod="";
	var totalRatePerfOnPeriod = totalNomberOftradeWonOnPeriod  * 100 / (totalNomberOftradeWonOnPeriod + totalNomberOftradeLossOnPeriod)
	if(totalRatePerfOnPeriod<20){TraderCurrentTierForPeriod="Bronze";}
	if(totalRatePerfOnPeriod<30 && totalRatePerfOnPeriod>20){TraderCurrentTierForPeriod="Silver";}
	if(totalRatePerfOnPeriod<40 && totalRatePerfOnPeriod>30){TraderCurrentTierForPeriod="Gold";}
	if(totalRatePerfOnPeriod<50 && totalRatePerfOnPeriod>40){TraderCurrentTierForPeriod="Platinum";}
	if(totalRatePerfOnPeriod<60 && totalRatePerfOnPeriod>50){TraderCurrentTierForPeriod="Platinum";}
	if(totalRatePerfOnPeriod<70 && totalRatePerfOnPeriod>60){TraderCurrentTierForPeriod="Diamond";}
	if(totalRatePerfOnPeriod<80 && totalRatePerfOnPeriod>70){TraderCurrentTierForPeriod="Master";}
	if(totalRatePerfOnPeriod<90 && totalRatePerfOnPeriod>80){TraderCurrentTierForPeriod="Challenger";}

	console.log("For the current period Analyzed your performance as been calculated to be : "+TraderCurrentTierForPeriod);


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
		totalNomberOftradeWonOnPeriod+=numberOfTradesWon;
		totalNomberOftradeLossOnPeriod+=numberOfTradesLoss;
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
DetermineTierTrader();

console.table("linearize Gain Expectancy : " + linearizeGainExpectancy.toFixed(2)+"$ per day "  )
console.table("linearize Gain Expectancy percentage from Starting Capital : " + ((linearizeGainExpectancy*100)/progression[0].stratingCapital).toFixed(2)+"%"  )