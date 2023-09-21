const fs = require('fs');
const dir = './days';

var progression=[];
var tradesEachDays=[];
var fileNames=fs.readdirSync(dir);
var DaysToMonitor=fileNames.length;
var totalNomberOftradeWonOnPeriod=0;
var totalNomberOftradeLossOnPeriod=0;

function createTradesOfTheDay(nameOfDayFile){
	let trades		=[];
	let profitLoss	=0;
	let pureProfit	=0;
	let pureLoss	=0;
	let useless		=0;
	let data = fs.readFileSync("./"+dir+"/"+nameOfDayFile,{encoding:'utf8', flag:'r'});
	data=data.split("\n");
	data.shift();
	for(let i=0;i<data.length;i++){
		data[i]=data[i].split(',');
		trades[i]=Number(data[i][3]);
		profitLoss+=trades[i];
		useless=(trades[i]>0)? pureProfit+=trades[i] :  pureLoss+=trades[i];
	}

	tradesEachDays.push(
		{
			"trades" 			: trades , 
			"startingCapital"	: Number(data[data.length-1][1].replace(/(\s+)/,"")) , 
			"endingCapital"		: Number(data[0][2].replace(/(\s+)/,"")), 
			"Day" 				: data[0][0].substring(0,10) , 
			"profitLoss" 		: Number(profitLoss+"".replace(/(\s+)/,"")),
			"pureProfit"		: Number(pureProfit+"".replace(/(\s+)/,"")),
			"pureLoss"			: Number(pureLoss+"".replace(/(\s+)/,""))
		}
	)
}
function DetermineTierTrader(){
/*	From GAIN POTENTIAL*/
	let TraderCurrentTierForPeriod="";
	let totalRatePerfOnPeriod = totalNomberOftradeWonOnPeriod  * 100 / (totalNomberOftradeWonOnPeriod + totalNomberOftradeLossOnPeriod);

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
	//Expectancy = (Win rate x Average win) - (Loss rate x Average loss)
	for(let i=0;i<tradesEachDays.length;i++){
		let numberOfTradesWon=0;
		for(let j=0;j<tradesEachDays[i].trades.length;j++){
			if(tradesEachDays[i].trades[j]>0)numberOfTradesWon++;
		}
		numberOfTradesLoss=tradesEachDays[i].trades.length-numberOfTradesWon;
		let WinRatio=(numberOfTradesWon *100)/tradesEachDays[i].trades.length;
		let Expectancy =(  (WinRatio/100) * ( tradesEachDays[i].pureProfit / (numberOfTradesWon==0)?1:numberOfTradesWon ) ) - ( ((100 - WinRatio)/100) * Math.abs(tradesEachDays[i].pureLoss/ (numberOfTradesLoss==0)?1:numberOfTradesLoss)  );
		ProgressDay = {
			"Day"				:	new Date(tradesEachDays[i].Day).toLocaleDateString() ,
			"startingCapital" 	: 	tradesEachDays[i].startingCapital,
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
		progression.push(ProgressDay);
	}
}

for(let i=0;i<DaysToMonitor;i++){
	createTradesOfTheDay(fileNames[i]);
}

createObjectProgressDays()
var AnalyzedPeriodArray=[];
var CapitalProgression = progression[progression.length-1].endingCapital - progression[0].startingCapital;
var GainExpectancy = CapitalProgression/progression.length;
DetermineTierTrader();


console.table(progression);

/*---------------------*/
AnalyzedPeriodArray[0]= ["Capital Progression" 									, CapitalProgression.toFixed(2)+"€"];
AnalyzedPeriodArray[1]= ["Overall Performance on the analyzed period :" 		, (  CapitalProgression * 100 / progression[0].startingCapital  ).toFixed(2)+"%"];
AnalyzedPeriodArray[2]= ["Gain Expectancy : " 									, GainExpectancy.toFixed(2)+"€ per day "];
AnalyzedPeriodArray[3]= ["Gain Expectancy percentage from Starting Capital : " 	, ((GainExpectancy*100)/progression[0].startingCapital).toFixed(2)+"%"];
/*---------------------*/
console.table(AnalyzedPeriodArray);