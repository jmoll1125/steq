//March 26, 2023, February 22-23, 2024, July 29-30, 2024
//Used to be steqintl3b6-4 (what a terrible name); now we've got multiple locations!
var locN = [];
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function add() {
	document.getElementById('save').style.display = 'block';
	var newdiv = document.createElement("div")
	var nonce = (Math.random() + 1).toString(36).substring(2); //https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
	newdiv.innerHTML = `
	<span class="ib"><label for="name`+nonce+`">Place name: </label><input type="text" id="name`+nonce+`" class="mockbutton"></span>
	<span class="ib"><label for="lat`+nonce+`">Latitude: </label><input type="number" id="lat`+nonce+`" name="lat" min="-90" max="90" class="mockbutton"></span>
	<span class="ib"><label for="lon`+nonce+`">Longitude: </label><input type="number" id="lon`+nonce+`" name="lon" min="-180" max="180" class="mockbutton"></span>
	<span class="ib"><label for="tz`+nonce+`">Time zone (winter): </label><input type="number" id="tz`+nonce+`" name="tz" min="-12" max="14" class="mockbutton"></span>
	<span class="ib"><label for="dst`+nonce+`">DST rule: </label>
	<select id="dst`+nonce+`" size="1" class="mockbutton">
	<option value="us">us</option>
	<option value="eu">eu</option>
	<option value="no">no</option>
	</select></span>
	<button id="del`+nonce+`" class="mockbutton" onclick="del(this.id);">Delete</button>
<p id="invalid`+nonce+`" class="error" style="display:none"></p>`
	newdiv.id = "input-data"+nonce;
	document.getElementById("locs").appendChild(newdiv);
	locN.push(nonce);
	document.getElementById('name'+locN[locN.length-1]).focus();
};
function hideEdits() {
	document.getElementById('loclist').innerHTML = ""
	for (i=0; i<locN.length; i++) {
		document.getElementById('input-data'+locN[i]).style.display = 'none';
		if (document.getElementById('name'+locN[i]).value === "") {
			document.getElementById('name'+locN[i]).value = document.getElementById('lat'+locN[i]).value + ", " + document.getElementById('lon'+locN[i]).value;
		};	
		//append child for this one
		//do anti-XSS
		document.getElementById('loclist').innerHTML += "<li class=\"loclist\"><input type=\"checkbox\" value="+locN[i]+" id=sel"+locN[i]+"></input><label id=lab"+locN[i]+" for=sel"+locN[i]+"></label></li>"	
		//this is such a washed line of code omg
		document.getElementById("lab"+locN[i]).textContent=document.getElementById('name'+locN[i]).value;
	};
	document.getElementById('loclist').style.display = 'inline';
	document.getElementById('loclistx').style.display = 'inline';
	document.getElementById('edit').style.display = 'inline';
	document.getElementById('save').style.display = 'none';
	document.getElementById('add').style.display = 'none';
	document.getElementById('results').innerHTML = '';
	document.getElementById('check').style.display = 'block';
	document.getElementById('submit').style.display = 'inline-block';
};
function showEdits() {
	for (i=0; i<locN.length; i++) {
		document.getElementById('input-data'+locN[i]).style.display = 'block';
		document.getElementById('invalid'+locN[i]).style.display = 'none';
	};
	document.getElementById('save').style.display = 'block';
	document.getElementById('add').style.display = 'block';
	document.getElementById('edit').style.display = 'none';
	document.getElementById('loclist').style.display = 'none';
	document.getElementById('loclistx').style.display = 'none';
	document.getElementById('check').style.display = 'none';
	document.getElementById('name'+locN[0]).focus();
};
function del(N) {
	N = N.substring(3);
	document.getElementById("input-data"+N).remove();
	locN.splice(locN.indexOf(N), 1)
	if(locN.length === 0) {
	document.getElementById('save').style.display = 'none';
	} else {
	document.getElementById('name'+locN[locN.length-1]).focus();
	};
};
function getDayOfYear(num) {
	outMonth = 0;
	outDay = 0;
	onDate = num+1;
	for (j=0; onDate > parseInt(maxdays[outMonth]); j++) {
		onDate = onDate - parseInt(maxdays[j]);
		outMonth = outMonth + 1;
	};
	outMonth = months[outMonth];
	outDay = onDate
	return outMonth + "\u00A0" + outDay;
};
function makeDaylight(sunrise, sunset) {
	zstring = "";
	sunrisemin = parseInt(sunrise.substring(0,2))*60 + parseInt(sunrise.substring(2,4));
	sunsetmin = parseInt(sunset.substring(0,2))*60 + parseInt(sunset.substring(2,4));
	if (sunsetmin < sunrisemin) {
		sunsetmin+= 1440;
	};//this fixes a bug with negative daylight... i think...
	  //yes! although now we would need to set a flag for "doesn't set until the next day"...
	  //hm. will need to tackle this later.
	daylightmin = sunsetmin - sunrisemin;
	if (daylightmin % 60 < 10) {
		zstring = "0";
	};
	daylightmin = Math.floor(daylightmin / 60) + ":" + zstring + (daylightmin % 60);
	if (daylightmin.length < 5) {
		daylightmin = "0" + daylightmin;
	};
	return(daylightmin);
};
function validate() {
	var badFields = [];
	var allErrors = "";
	for (i=0; i<locN.length; i++) {
var name = document.getElementById('name'+locN[i]).value;
var lat = parseFloat(document.getElementById('lat'+locN[i]).value);
var lon = parseFloat(document.getElementById('lon'+locN[i]).value);
var tz = parseFloat(document.getElementById('tz'+locN[i]).value);
var dst = document.getElementById('dst'+locN[i]).value;
var errors = "";
if (isNaN(lat) || lat < -90 || lat > 90 ) {
errors+= "Latitude must be between -90 and 90.<br>";
badFields.push('lat'+locN[i]);
};
if (isNaN(lon) || lon < -180 || lon > 180) {
errors+= "Longitude must be between -180 and 180.<br>";
badFields.push('lon'+locN[i]);
};
if (isNaN(tz) || tz < -12 || tz > 14) {
errors+= "Time zone must be between -12 and 14. (Use decimals for half hours.)<br>";
badFields.push('tz'+locN[i]);
};
if (locN.length == 1) {
	errors+= "You must add at least two locations to use compare mode."
	badFields.push("add");
};
allErrors += errors;
if (errors === "") {
	document.getElementById('invalid'+locN[i]).style.display = 'none';
	continue;
} else {
document.getElementById('invalid'+locN[i]).style.display = 'block';
document.getElementById("invalid"+locN[i]).innerHTML = errors;
document.getElementById('check').style.display = 'none';
document.getElementById('submit').style.display = 'none';
document.getElementById(badFields[0]).focus();
//we will do saving to local storage later. also we should not xss the name but i don't know how to do that https://stackoverflow.com/questions/17378199/uncaught-referenceerror-function-is-not-defined-with-onclick
};
};
if (allErrors == "") {
	hideEdits();
};
};
var sunrises;
var sunsets;
var daylightduration;
//var loaded; //evil...
var maxdays;
//Former loading script.
document.getElementById("year").value = (new Date().getFullYear()).toString();
//this is where the stuff was defined
//okay it still doesn't support ly's, which we will need to pull out the data correctly. -done
//oh and i did forget but... **** and ----! -done, if they're in pairs
//but overall, today has been 100% worth it. I really do like this, how it's going...
//make a back button until i get local storage to work. - update: it wouldn't work. is hidden until you submit for the first time? Try a new location
//we will still need to check for sunsets before sunrises, though it is possible that may remove the need to shuffle data around.
//also it gets the plurals for the daylight right
//IE accepts "" for year. We need to fix year detection but I'm just too tired
var checkdate;
function getDifference(a, b) {
	let zstring = ""
	let ha = parseInt(a.slice(0, 2));
	let ma = parseInt(a.slice(a.length-2, a.length));
	let hb = parseInt(b.slice(0, 2));
	let mb = parseInt(b.slice(a.length-2, a.length));
	ma = ma + ha*60;
	mb = mb + hb*60;
	let mdiff = mb-ma
	let sign = ""
	if (mdiff < 0) {
		mdiff = mdiff * -1;
		sign = "-";
	};
	if (mdiff % 60 < 10) {
		zstring = "0";
	};
	mdiff = Math.floor(mdiff / 60) + ":" + zstring + (mdiff % 60);
	if (mdiff.length < 5) {
		mdiff = "0" + mdiff;
	};
	return(sign+mdiff);
};
function makeDurationPretty(dur) {
	let sign = "";
	if (dur[0] === "-") {
		dur = removeFirstChar(dur);
		sign = "-";
	};
	var plurals = "";
	if (dur.charAt(0) == "0" && dur.charAt(1) == "1") {
		plurals+= "0"
	} else {
		plurals+= "1"
	}
	if (dur.charAt(3) == "0" && dur.charAt(4) == "1") {
		plurals+= "2"
	} else {
		plurals+= "3"
	}
	var pluralstr = ["\u00A0hour ", "\u00A0hours ", "\u00A0minute", "\u00A0minutes"]
	if (dur.charAt(3) == "0") {
		dur = dur.slice(0, 2) + pluralstr[plurals[0]] + dur.slice(4, 5) + pluralstr[plurals[1]]; //no more leading zero
	} else {
		dur = dur.slice(0, 2) + pluralstr[plurals[0]] + dur.slice(3, 5) + pluralstr[plurals[1]]; //so our plurals are always right.
	};
	if (dur.charAt(0) == 0) { //leading zero
		dur = dur.slice(1, dur.length)
	};
		if (dur.charAt(0) == 0) { //zero hours
		dur = dur.slice(8, dur.length)
	};
	return sign+dur;
};
function doAMPM(sunrise, mode) {
	let actions = ["rise", "set"];
	var ampm = "\u00A0AM";
	sunrise = parseInt(sunrise);
	if (sunrise > 1159) {
		sunrise = sunrise - 1200;
		ampm = "\u00A0PM";
	};
	if (sunrise < 100) {
		sunrise = sunrise + 1200;
	};
	sunrise = sunrise.toString();
	if (sunrise.length == 3) {
		sunrise = sunrise.slice(0, 1) + ":" + sunrise.slice(1, 4);
	} else {
		sunrise = sunrise.slice(0, 2) + ":" + sunrise.slice(2, 4);
	};
	sunrise = sunrise + ampm
	if (sunrise[0] === "0") { //no more leading zero
		sunrise = sunrise.slice(1);
	};
	if (sunrise[0] == "N") {
			sunrise = "does not "+actions[mode];
	} else {
			sunrise = actions[mode]+"s at "+sunrise;
	};
	return(sunrise);
};
function intoDates(sunriseoccurs) {
	var sunrisecommas = sunriseoccurs.length - 1;
	var sunriseoutputstr = "";
	var outDay;
	var outMonth;
	var onDate;
	if (sunriseoccurs.length == 0) {
		sunriseoutputstr = "no other date!"
	} else {
		for (i=0; i < sunriseoccurs.length; i++) {
		sunriseoutputstr += getDayOfYear(sunriseoccurs[i]) + ", ";
		};
	};
	//Making this string pretty
	if (sunriseoutputstr != "no other date!") {
		sunriseoutputstr = sunriseoutputstr.slice(0, -2) + '.';
	};
	sunrisepretty = sunriseoutputstr.split("");
	var lastcomma = sunrisepretty.lastIndexOf(",")
	if (lastcomma != -1) {
		if (sunrisecommas == 1) {
			sunrisepretty[lastcomma] = " and"
		} else {
		sunrisepretty[lastcomma] = ", and"
		};
	};
	sunrisepretty = sunrisepretty.join("");
	return(sunrisepretty);
}; 
function goodDate() {
document.getElementById("results").value = "";
var year = document.getElementById('year').value;		
	if ((isNaN(parseFloat(year)) || isNaN(year - 0))|| year < 0 || year > 9999 || year % 1 !== 0) {
		document.getElementById("results").innerHTML = "<p class=\"error\">Invalid year!</p>";
	};
	if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
		maxdays = ["31", "29", "31", "30", "31", "30", "31", "31", "30", "31", "30", "31"];
		ly = 1;
	} else {
		maxdays = ["31", "28", "31", "30", "31", "30", "31", "31", "30", "31", "30", "31"];
		ly = 0;
	};
	var month = document.getElementById('month').value;
	var day = document.getElementById('date').value;
	var origmonth = month;
	 checkdate = 0;
	for (i=0; month != 0; i++) {
		checkdate = checkdate + parseInt(maxdays[i]);
		month = month - 1
	};
	checkdate = checkdate + parseInt(day);
	checkdate = checkdate - 1;
	if (parseInt(day) > parseInt(maxdays[month]) || isNaN(year)|| year < 0 || year > 9999) {
		document.getElementById("results").innerHTML = "<p class=\"error\">Invalid date!</p>";
	};
	if (document.getElementById("results").value === "") {
		getChecked();
	};
	};
var locschecked = [];
function getChecked() {
	let checked = document.querySelectorAll('input[type="checkbox"]:checked');
	locschecked = Array.from(checked).map(x => x.value);
	//https://www.joshuacolvin.net/selected-checkbox-values/
	if (locschecked.length < 2) {
		document.getElementById("results").innerHTML = "<p class=\"error\">You must select at least two locations.</p>";
	}
		for (let i=0; i<locschecked.length; i++) {
			prepare(locschecked[i]);
		};
		output();
		for (let i=0; i<locschecked.length; i++) {
			console.log(getVitals(locschecked[i]))
			for (let j=0; j<locschecked.length; j++) {
			console.log(i, j)
			if(i===j) {
				continue;
			};
			console.log(search(locschecked[i],locschecked[j],0))
			console.log(search(locschecked[i],locschecked[j],1))
			console.log(search(locschecked[i],locschecked[j],2))
			};
			//still broken, but we'll have to refactor the whole thing, because we're going to be comparing... so idek if processing multiple times will be the move. 
			//what it will end up being is generating a steq file for each location and then finding the sunrise and sunset time for each. THEN we'll have to go back and do the comparison. so i'll have to rewrite it from the ground up...
			//maintaining two seperate codebases is going to be a nightmare lol i'm not sure this is such a good idea
			//i think i spent an hour rewriting this when the issue was a missing { but i think the codebase is better off for it!
	};
};
/* function getFileandTimes(N) {
	let loaded = generate(lat, lon, tz, dst, year);
	let sunrise = loaded //
	let sunset = loaded //
	let daylight = makeDaylight(sunrise, sunset);
	return [sunrise, sunset, daylight, loaded]
}; */
var ly;
locs_dict = {}
/* locs_dict[locN[i]] = 
for (i=0; i<locN.length; i++) {
	eval("var loaded"+"locN[i]"); //probably do this better
	//trying to create Loaded variables for each location so they don't have to be regenerated (and because having them do so was throwing errors) but i just can't figure it out :(
	//so idek if the control flow is working but i think it will once i figure this out
}; //create global vars i think */
function prepare(N) {
	var name = document.getElementById('name'+N).value;
	var lat = parseFloat(document.getElementById('lat'+N).value);
	var lon = parseFloat(document.getElementById('lon'+N).value);
	var tz = parseFloat(document.getElementById('tz'+N).value);
	var dst = document.getElementById('dst'+N).value;
	var year = document.getElementById('year').value;
	let loaded = generate(lat, lon, tz, dst, year);
	//loaded.split(" ");
	locs_dict[N] = loaded;
};
function removeFirstChar(str) {
	return str.slice(str.length*-1+1);
};
function getVitals(N) {
let loaded = locs_dict[N];
loaded = loaded.split(" ");
	if (ly === 0) {
		sunrises = loaded.slice(0, 365);
		sunsets = loaded.slice(365, 730);
	} else {
		sunrises = loaded.slice(0, 366);
		sunsets = loaded.slice(366, 732);
	};
	//make daylight
	var sunrisemin;
	var sunsetmin;
	var daylightmin;
	var zstring;
	daylightduration = [];
	for (i=0; i<sunrises.length; i++) {
		daylightduration.push(makeDaylight(sunrises[i], sunsets[i]));
	};
	//
	//ly stuff was here
	//convert to numbers
	//this is gonna mess up when we do STEQ-POL!! and dst! we need to account for midnights and rollovers
	for (i=0; i < sunrises.length; i++) {
		strtemp = sunrises[i]
		if (strtemp !== "****" && strtemp !== "----") {
			//strtemp = parseInt(strtemp)
		} else {
			if (strtemp !== sunsets[i]) {
				strtemp = "L" + strtemp.substring(1)
				daylightduration[i] = makeDaylight("0000", sunsets[i])
				//I think this should work... assuming there is no L for both sunrise and sunset on the same day which should not happen
				console.log(strtemp)
			}; 
		};
		sunrises[i] = strtemp
	};
//if it's not **** or ---- it becomes an int, but if it is, AND it doesn't correspond to sunset, then it gets L'd.
	for (i=0; i < sunsets.length; i++) {
		strtemp = sunsets[i]
		if (strtemp !== "****" && strtemp !== "----") {
			//strtemp = parseInt(strtemp)
		} else {
			if (strtemp !== sunrises[i]) {
				strtemp = "L" + strtemp.substring(1)
				daylightduration[i] = makeDaylight(sunrises[i],"0000")
			};
		};
		sunsets[i] = strtemp
	};
	var sunrise = sunrises[checkdate];
	var sunset = sunsets[checkdate];
	var daylight = daylightduration[checkdate];
	name = document.getElementById('name'+N).value;
	return [sunrise, sunset, daylight, sunrises, sunsets, daylightduration, checkdate, name]
};
//END OF PROCESS/BEGINNING OF COMPARE
// "home" = what we are comparing TO, traveler = the foreign sunrise, sunset, etc.
function search(home, traveler, mode) {
	sunrise = getVitals(traveler)[0];
	sunset = getVitals(traveler)[1];
	daylight = getVitals(traveler)[2];
	let sunrises = getVitals(home)[3];
	let sunsets = getVitals(home)[4];
	let daylightduration = getVitals(home)[5];
	checkdate = getVitals(traveler)[6];
	//
	//SUNRISE OUTPUT
	//
	if (mode === 0) {
		var sunriseoccurs = [];
		for (i=0; i <= sunrises.length; i++) {
			if (sunrise == sunrises[i]) {
				sunriseoccurs.push(i);
			};
		};
		if (home==traveler) {
			datetwice = sunriseoccurs.indexOf(checkdate);
			if (datetwice != -1) {
				sunriseoccurs.splice(datetwice, 1);
			};
		};
		return(sunriseoccurs);
	};
	//keeping this for later if (!(sunrise === sunset && (sunrise === "----" || sunrise === "****"))) { //make sure to reintroduce this for output!!
	if(mode === 1) {
		var sunsetoccurs = [];
		for (i=0; i <= sunsets.length; i++) {
			if (sunset == sunsets[i]) {
				sunsetoccurs.push(i);
			};
		};
		if (home==traveler) {
			datetwice = sunsetoccurs.indexOf(checkdate);
			if (datetwice != -1) {
				sunsetoccurs.splice(datetwice, 1);
		};
		};
	return(sunsetoccurs);
	};
// DAYLIGHT
	if(mode === 2) {
		var daylightoccurs = [];
		for (i=0; i <= daylightduration.length; i++) {
			if (daylight == daylightduration[i]) {
				daylightoccurs.push(i);
			};
		};
		if (home == traveler) {
		datetwice = daylightoccurs.indexOf(checkdate);
		if (datetwice != -1) {
			daylightoccurs.splice(datetwice, 1);
		};
		};
		return(daylightoccurs);
	};
	//
	//
};
// to do: finish output // make sure it throws errors when invalid date, year etc. 
function convertDaylight(daylightoccurs) {
	var daylightcommas = daylightoccurs.length - 1;
		daylightoutputstr = "";
		if (daylightoccurs.length == 0) {
			daylightoutputstr = "No other date"
			daylightcommas = 0;
		} else {
			for (i=0; i < daylightoccurs.length; i++) {
				daylightoutputstr += getDayOfYear(daylightoccurs[i])+", ";
			};
		};
		//
		//
		//
		if (daylightoutputstr != "No other date") {
			daylightoutputstr = daylightoutputstr.slice(0, -2) + '';
		};
		//Making our strings pretty
		//
		daylightpretty = daylightoutputstr.split("");
		lastcomma = daylightpretty.lastIndexOf(",")
		if (lastcomma != -1) {
			if (daylightcommas == 1) {
				daylightpretty[lastcomma] = " and"
			} else {
				daylightpretty[lastcomma] = ", and"
			};
		};
		daylightpretty = daylightpretty.join("");
		//locales for am/pm? we need to account for 0000, and rollovers.
		//daylight
	/* } else {
		if (sunrise === "----") {
			sunrise = "below";
			daylight = "0\u00A0hours 0\u00A0minutes";
		} else {
			sunrise = "above"
			daylight = "24\u00A0hours 0\u00A0minutes";
		};
	if (sunrisepretty === "no other date!") {
		sunrisepretty = "No other days are like this!"
	} else {
		if (sunriseoccurs.length == 1) {
			sunrisepretty = "The other day like this is "+sunrisepretty;
		} else {
			sunrisepretty = "The other days like this are "+sunrisepretty;
		};
	}; 
	}; */
	return daylightpretty;
	}; 
function output() {
	document.getElementById('results').textContent = "";
	let vitals_dict = {};
	origmonth = document.getElementById('month').value;
	day = document.getElementById('date').value;
	let sunrise = [];
	let sunset = [];
	let daylight = [];
	let name = [];
	//will only work with two locations for now
	for (let i = 0; i<locschecked.length; i++) {
		sunrise.push(getVitals(locN[i])[0]);
		sunset.push(getVitals(locN[i])[1]);
		daylight.push(getVitals(locN[i])[2]);
		name.push(getVitals(locN[i])[7]);
	};
	vitals_dict["sunrise"] = sunrise;
	vitals_dict["sunset"] = sunset;
	vitals_dict["daylight"] = daylight;
	vitals_dict["name"] = name;
		//daylight pretty
		//daylight = makeDurationPretty(daylight[i]);
		//final output
			//This line will be used to display the results slightly differently for the first location, but i'll delay implementation for now. // results += "In "+name+ ", on "+months[origmonth]+"\u00A0"+day+", the sun "+sunrise+" and "+sunset+".\r\r\n\r\n"+months[origmonth]+"\u00A0"+day+" has "+daylight+" of daylight.\r\n\r\n" //\r\n\r\nThe sun also "+sunrise+" on "+sunrisepretty;+" \r\n\r\nThe sun also "+sunset+" on "+sunsetpretty+"\r\n\r\n"+daylightpretty+" the same duration of daylight.";
	//Sunrise times for each
	order = ["sunrise","sunset","daylight"];
	//This is me being a bit lazy. But I'm not willing to run the whole test multiple times so here
	//Basically z is a standin for "sunrise" (0) or "sunset" (1) so that we can run the comparison multiple times
	//I'd do it for daylight too but the format is just too different
	//!! There is zero polar support here at all!
	for (let z = 0; z<2; z++) {
		let results="";
		let newheader = document.createElement("h2")
		newheader.textContent = order[z]
		document.getElementById("results").appendChild(newheader);
		for (let i = 0; i<locschecked.length; i++) { 
			let alldiff = "";
			for(let j = 0; j<locschecked.length; j++) {
				if(i===j) {
					continue;
				};
				let diff = makeDurationPretty(getDifference(vitals_dict[order[z]][j],vitals_dict[order[z]][i]));
				if (diff[0] === "-") {
					diff = diff + " earlier than "+name[i];
					diff = removeFirstChar(diff);
				} else {
					diff = diff + " later than "+name[i];
				};
				if (diff[0] === "N") {
					diff = "";
				};
				if (diff !== "") {
					diff = " (" + diff + ")";
				};
			alldiff += diff;
			};
		results += "In "+name[i]+ ", on "+months[origmonth]+"\u00A0"+day+", the sun "+doAMPM(vitals_dict[order[z]][i],z)+alldiff+".\n\n" 
		};
		//Comparing sunrise times
		for (let i = 0; i<locschecked.length; i++) { 
			for(let j = 0; j<locschecked.length; j++) {
				sunriseoccurs = search(locschecked[i],locschecked[j],z) //zclutch!!
				sunriseoccurs = intoDates(sunriseoccurs);
				if (sunriseoccurs === "no other date!" && i !== j) {
					results += "The sun never "+doAMPM(vitals_dict[order[z]][j],z)+" in "+name[i]+".\n\n";
				} else {
					results += "The sun also "+doAMPM(vitals_dict[order[z]][j],z)+" in "+name[i]+" on "+sunriseoccurs+"\n\n";
				};
			};
		};
		results = results.trim();
		let res = document.createElement("p")
		res.textContent = results;
		document.getElementById("results").appendChild(res);	
			//+"+sunset+".\r\r\n\r\n"+months[origmonth]+"\u00A0"+day+" has "+daylight+" of daylight.\r\n\r\n" //\r\n\r\nThe sun also "+sunrise+" on "+sunrisepretty;+" \r\n\r\nThe sun also "+sunset+" on "+sunsetpretty+"\r\n\r\n"+daylightpretty+" the same duration of daylight.";
		};
	//document.getElementById("results").textContent = results;
	//
	//daylight
	//
	let results="";
	let newheader = document.createElement("h2")
	newheader.textContent = order[2]
	document.getElementById("results").appendChild(newheader);
	for (let i = 0; i<locschecked.length; i++) { 
		let alldiff = "";
		for(let j = 0; j<locschecked.length; j++) {
			if(i===j) {
				continue;
			};
			let diff = makeDurationPretty(getDifference(vitals_dict[order[2]][j],vitals_dict[order[2]][i]));
			if (diff[0] === "-") {
				diff = diff + " less than "+name[i];
				diff = removeFirstChar(diff);
			} else {
				diff = diff + " more than "+name[i];
			};
			if (diff[0] === "N") {
				diff = "";
			};
			if (diff !== "") {
				diff = " (" + diff + ")";
			};
		alldiff += diff;
		};
	results += "In "+name[i]+ ", "+months[origmonth]+"\u00A0"+day+" has "+makeDurationPretty(vitals_dict[order[2]][i],2)+" of daylight."+alldiff+".\n\n" 
	};
	//Comparing sunrise times
	for (let i = 0; i<locschecked.length; i++) { 
		for(let j = 0; j<locschecked.length; j++) {
			sunriseoccurs = search(locschecked[i],locschecked[j],2) //zclutch!!
			sunriseoccurs = convertDaylight(sunriseoccurs);
			if (sunriseoccurs === "No other date" && i !== j) {
					results += name[i]+ " never has "+makeDurationPretty(vitals_dict[order[2]][j],2)+" of daylight.\n\n" 
				} else {
					results += name[i]+" also has "+makeDurationPretty(vitals_dict[order[2]][j],2)+" of daylight on "+sunriseoccurs+".\n\n" 
				};
		};
	};
	results = results.trim();
	let res = document.createElement("p")
	res.textContent = results;
	document.getElementById("results").appendChild(res);	
};
		//	sunriseoccurs = search(
	/*
	var polarEnd = checkdate;
	var polarstr = "";
if (sunrise === "****" || sunrise === "----") {
		for (; sunrises[polarEnd] == sunrise; polarEnd++) {
			if (polarEnd == 364 + ly) {
				polarEnd = 0;
			};
		};
		if (sunrise === "****") {
			polarstr = "The next sunset is on "
		} else {
			polarstr = "The next sunrise is on "
		};
		polarstr += getDayOfYear(polarEnd);
		polarstr += "."
};
	//
	//
		//DAYLIGHT OUTPUT
		//
		
	document.getElementById("results").textContent = "In "+name+ ", on "+months[origmonth]+"\u00A0"+day+", the sun is " + sunrise + " the horizon throughout the entire day.\r\n\r\nTherefore, "+months[origmonth]+"\u00A0"+day+" has "+ daylight + " of daylight.\r\n\r\n"+sunrisepretty+"\r\n\r\n"+polarstr;
	}; */