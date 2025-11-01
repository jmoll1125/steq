//March 26, 2023, February 22-23, 2024, November 1, 2025
let locstorage = localStorage.getItem("locstorage");
let locN = []
window.onload = function() {
locstorage = JSON.parse(locstorage);
if(typeof(locstorage) !== "object" || locstorage === null) {
	locstorage = {};
} else {
	locN = Object.keys(locstorage);
	if (locN.length == 0) {
	} else {
		for (let j=0; j < locN.length; j++) {
			add(locN[j]);
		};
		for (let k=0; k < locN.length; k++) {
			load(locN[k]);
		};
		validate();
	};
};
};
function load(loc) {
	console.log(loc);
	console.log(document.getElementById("name"+loc));
	console.log(locstorage[loc]["name"])
	document.getElementById("name"+loc).value = locstorage[loc]["name"];
	document.getElementById("lat"+loc).value = locstorage[loc]["lat"];
	document.getElementById("lon"+loc).value = locstorage[loc]["lon"];
	document.getElementById("tz"+loc).value = locstorage[loc]["tz"];
	document.getElementById("dst"+loc).value = locstorage[loc]["dst"]; 
};
function save() {
localStorage.setItem('locstorage', JSON.stringify(locstorage));
};
function clear() {
	locstorage = null
	save();
};
//let locstorage = {};
function makeLabel(labelee, label) {
let newelem = document.createElement("label");
newelem.setAttribute("for", labelee);
newelem.textContent = label;
return newelem;
};
function makeElement(format, nonce) {
	let newelem = document.createElement(format["elem"]);
	newelem.setAttribute("class", "mockbutton");
	newelem.setAttribute("id", format["idpref"]+nonce);
	if (format["elem"] = "input") {
		newelem.setAttribute("type", format["type"]);
		newelem.setAttribute("name", format["idpref"]); //unneeded?
		if (format["type"] == "number") {
			newelem.setAttribute("min", format["min"]);
			newelem.setAttribute("max", format["max"]);
		};
	} else { //select
	};
	return newelem;
};
function add(nonce) {
	document.getElementById('save').style.display = 'block';
	var newdiv = document.createElement("div")
	if (nonce === undefined) {
		nonce = (Math.random() + 1).toString(36).substring(2); //https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
		locstorage[nonce] = {}; //creates object with nonce name inside locstorage, object of locations
		locN.push(nonce);
	};
	newdiv.id = "input-data"+nonce;
	document.getElementById("locs").appendChild(newdiv);
	//save();
	//
	let name = {"elem" : "input", "type" : "text", "idpref" : "name", "label":"Place name: "};
	let lat = {"elem" : "input", "type" : "number", "idpref" : "lat", "label":"Latitude: ", "min" : "-90", "max" : "90"};
	let lon = {"elem" : "input", "type" : "number", "idpref" : "lon", "label":"Longitude: ", "min" : "-180", "max" : "180"};
	let tz = {"elem" : "input", "type" : "number", "idpref" : "tz", "label":"Time zone (winter): ", "min" : "-12", "max" : "14"};
	let dst = {"label" : "DST rule: ", "elem" : "select", "idpref" : "dst", "options" : ["us","eu","no"]}; //option size = 1 unnecessary?
	document.getElementById(newdiv.id).appendChild(makeLabel(name["idpref"]+nonce, name["label"]));
	document.getElementById(newdiv.id).appendChild(makeElement(name, nonce));
	document.getElementById(newdiv.id).appendChild(makeLabel(lat["idpref"]+nonce, lat["label"]));
	document.getElementById(newdiv.id).appendChild(makeElement(lat, nonce));
	document.getElementById(newdiv.id).appendChild(makeLabel(lon["idpref"]+nonce, lon["label"]));
	document.getElementById(newdiv.id).appendChild(makeElement(lon, nonce));
	document.getElementById(newdiv.id).appendChild(makeLabel(tz["idpref"]+nonce, tz["label"]));
	document.getElementById(newdiv.id).appendChild(makeElement(tz, nonce));
	document.getElementById(newdiv.id).appendChild(makeLabel(dst["idpref"]+nonce, dst["label"]));
	document.getElementById(newdiv.id).appendChild(makeElement(dst, nonce));
	let options = dst["options"]
	for (i = 0; i < options.length; i++) {	
		let newoption = document.createElement("option")
		newoption.textContent = options[i]
		newoption.value = options[i]
		document.getElementById("dst"+nonce).appendChild(newoption);
	};
	let newbutton = document.createElement("button");
	newbutton.setAttribute("id", "del"+nonce);
	newbutton.setAttribute("onclick", "del(this.id)");
	newbutton.textContent = "Delete";
	newbutton.setAttribute("class", "mockbutton");
	document.getElementById(newdiv.id).appendChild(newbutton);
	let newerrors = document.createElement("p");
	newerrors.setAttribute("style", "display:none");
	newerrors.setAttribute("id", "invalid"+nonce);
	newerrors.setAttribute("class", "error");
	document.getElementById(newdiv.id).appendChild(newerrors);
	document.getElementById('name'+nonce).focus(); // length of locN = Object.keys(locN).length
};
function hideEdits() {
	document.getElementById('loclist').innerHTML = ""
	for (i=0; i<locN.length; i++) {
		document.getElementById('input-data'+locN[i]).style.display = 'none';
		if (document.getElementById('name'+locN[i]).value === "") {
			document.getElementById('name'+locN[i]).value = document.getElementById('lat'+locN[i]).value + ", " + document.getElementById('lon'+locN[i]).value;
		};	
		//do anti-XSS (?)
		let newoption = document.createElement("option");
		newoption.value = locN[i]
		newoption.id = "sel"+locN[i];
		newoption.textContent = document.getElementById('name'+locN[i]).value
		document.getElementById("loclist").appendChild(newoption);
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
	delete locstorage[N]
	locN.splice(locN.indexOf(N), 1)
	if(locN.length === 0) {
	document.getElementById('save').style.display = 'none';
	} else {
	document.getElementById('name'+locN[locN.length-1]).focus();
	};
	save();
};
function getDayOfYear(num) {
	var outMonth = 0;
	var outDay = 0;
	var onDate = num+1;
	for (j=0; onDate > parseInt(maxdays[outMonth]); j++) {
		onDate = onDate - parseInt(maxdays[j]);
		outMonth = outMonth + 1;
	};
	outMonth = months[outMonth];
	outDay = onDate
	return outMonth + "\u00A0" + outDay;
};
function makeDaylight(sunrise, sunset) {
	var zstring = "";
	var sunrisemin = parseInt(sunrise.substring(0,2))*60 + parseInt(sunrise.substring(2,4));
	var sunsetmin = parseInt(sunset.substring(0,2))*60 + parseInt(sunset.substring(2,4));
	if (sunsetmin < sunrisemin) {
		sunsetmin+= 1440;
	};//this fixes a bug with negative daylight... i think...
	  //yes! although now we would need to set a flag for "doesn't set until the next day"...
	  //hm. will need to tackle this later.
	var daylightmin = sunsetmin - sunrisemin;
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
allErrors += errors;
if (errors === "") {
	document.getElementById('invalid'+locN[i]).style.display = 'none';
	locstorage[locN[i]]["name"] = name;
	locstorage[locN[i]]["lat"] = lat;
	locstorage[locN[i]]["lon"] = lon;
	locstorage[locN[i]]["tz"] = tz;
	locstorage[locN[i]]["dst"] = dst;
	save();
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
var loaded;
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
function process(N) {
	var name = document.getElementById('name'+N).value;
	var lat = parseFloat(document.getElementById('lat'+N).value);
	var lon = parseFloat(document.getElementById('lon'+N).value);
	var tz = parseFloat(document.getElementById('tz'+N).value);
	var dst = document.getElementById('dst'+N).value;
	var year = document.getElementById('year').value;
	if ((isNaN(parseFloat(year)) || isNaN(year - 0))|| year < 0 || year > 9999 || year % 1 !== 0) {
		document.getElementById("results").innerHTML = "<p class=\"error\">Invalid year!</p>";
	} else {
		loaded = generate(lat, lon, tz, dst, year);
		loaded = loaded.split(" ")
		var ly;
		if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
			maxdays = ["31", "29", "31", "30", "31", "30", "31", "31", "30", "31", "30", "31"];
			ly = 1;
		} else {
			maxdays = ["31", "28", "31", "30", "31", "30", "31", "31", "30", "31", "30", "31"];
			ly = 0;
		};
		if (ly === 0) {
			sunrises = loaded.slice(0, 365);
			sunsets = loaded.slice(365, 730);
		} else {
			sunrises = loaded.slice(0, 366);
			sunsets = loaded.slice(366, 732);
		};
		//make daylight
		daylightduration = [];
		for (i=0; i<sunrises.length; i++) {
			daylightduration.push(makeDaylight(sunrises[i], sunsets[i]));
		};
		//
		var month = document.getElementById('month').value;
		var day = document.getElementById('date').value;
		var origmonth = month;
		//ly stuff was here
		if (parseInt(day) > parseInt(maxdays[month]) || isNaN(year)|| year < 0 || year > 9999) {
			document.getElementById("results").innerHTML = "<p class=\"error\">Invalid date!</p>";
		} else {
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
			//dst
			var checkdate = 0;
			for (i=0; month != 0; i++) {
				checkdate = checkdate + parseInt(maxdays[i]);
				month = month - 1
			};
			checkdate = checkdate + parseInt(day);
			checkdate = checkdate - 1;
			var sunrise = sunrises[checkdate];
			var sunset = sunsets[checkdate];
			var daylight = daylightduration[checkdate];
			months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
			//
			//SUNRISE OUTPUT
			//
			var sunriseoccurs = [];
			for (i=0; i <= sunrises.length; i++) {
				if (sunrise == sunrises[i]) {
					sunriseoccurs.push(i);
				};
			};
			var datetwice = sunriseoccurs.indexOf(checkdate);
			if (datetwice != -1) {
				sunriseoccurs.splice(datetwice, 1);
			};
			var sunrisecommas = sunriseoccurs.length - 1;
			var sunriseoutputstr = "";
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
			//
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
			//I moved all the sunrise code up here, so it does it first. It then skips all sunset and daylight processing IF the sun is below or above the horizon the whole day.
			//More work is required for other things.
			if (!(sunrise === sunset && (sunrise === "----" || sunrise === "****"))) {
				//
				//SUNSET OUTPUT
				//
				var sunsetoccurs = [];
				for (i=0; i <= sunsets.length; i++) {
					if (sunset == sunsets[i]) {
						sunsetoccurs.push(i);
					};
				};
				datetwice = sunsetoccurs.indexOf(checkdate);
				if (datetwice != -1) {
					sunsetoccurs.splice(datetwice, 1);
				};
				var sunsetcommas = sunsetoccurs.length - 1;
				sunsetoutputstr = "";
				if (sunsetoccurs.length == 0) {
					sunsetoutputstr = "no other date!"
				} else {
					for (i=0; i < sunsetoccurs.length; i++) {
						sunsetoutputstr += getDayOfYear(sunsetoccurs[i])+", ";
					};
				};
				//
				//DAYLIGHT OUTPUT
				//
				var daylightoccurs = [];
				for (i=0; i <= daylightduration.length; i++) {
					if (daylight == daylightduration[i]) {
						daylightoccurs.push(i);
					};
				};
				datetwice = daylightoccurs.indexOf(checkdate);
				if (datetwice != -1) {
					daylightoccurs.splice(datetwice, 1);
				};
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
				if (sunsetoutputstr != "no other date!") {
					sunsetoutputstr = sunsetoutputstr.slice(0, -2) + '.';
				};
				if (daylightoutputstr != "No other date") {
					daylightoutputstr = daylightoutputstr.slice(0, -2) + '';
				};
				//Making our strings pretty
				//
				sunsetpretty = sunsetoutputstr.split("");
				lastcomma = sunsetpretty.lastIndexOf(",")
				if (lastcomma != -1) {
					if (sunsetcommas == 1) {
						sunsetpretty[lastcomma] = " and"
					} else {
						sunsetpretty[lastcomma] = ", and"
					};
				};
				sunsetpretty = sunsetpretty.join("");
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
				if (daylightcommas == 0) {
					daylightpretty = daylightpretty + " has"
				} else {
					daylightpretty = daylightpretty + " have"
				};
				//locales for am/pm? we need to account for 0000, and rollovers.
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
				console.log(sunrise)
				if (sunrise[0] === "0") { //no more leading zero
					sunrise = sunrise.slice(1);
				};
				//sunset
				ampm = "\u00A0AM";
				sunset = parseInt(sunset);
				if (sunset > 1159) {
					sunset = sunset - 1200;
					ampm = "\u00A0PM";
				};
				if (sunset < 100) {
					sunset = sunset + 1200;
				};
				sunset = sunset.toString();
				if (sunset.length == 3) {
					sunset = sunset.slice(0, 1) + ":" + sunset.slice(1, 4);
				} else {
					sunset = sunset.slice(0, 2) + ":" + sunset.slice(2, 4);
				};
				sunset = sunset + ampm
				if (sunset[0] === "0") { //no more leading zero
					sunset = sunset.slice(1);
				};
				//daylight
				var plurals = "";
				if (daylight.charAt(0) == "0" && daylight.charAt(1) == "1") {
					plurals+= "0"
				} else {
					plurals+= "1"
				}
				if (daylight.charAt(3) == "0" && daylight.charAt(4) == "1") {
					plurals+= "2"
				} else {
					plurals+= "3"
				}
				var pluralstr = ["\u00A0hour ", "\u00A0hours ", "\u00A0minute", "\u00A0minutes"]
				if (daylight.charAt(3) == "0") {
					daylight = daylight.slice(0, 2) + pluralstr[plurals[0]] + daylight.slice(4, 5) + pluralstr[plurals[1]]; //no more leading zero
				} else {
					daylight = daylight.slice(0, 2) + pluralstr[plurals[0]] + daylight.slice(3, 5) + pluralstr[plurals[1]]; //so our plurals are always right.
				};
				if (daylight.charAt(0) == 0) {
					daylight = daylight.slice(1, daylight.length)
				};
				console.log(sunset);
				if (sunrise[0] == "N") {
					sunrise = "does not rise";
				} else {
					sunrise = "rises at "+sunrise;
				};
				if (sunset[0] == "N") {
					sunset = "does not set";
				} else {
					sunset = "sets at "+sunset;
				};
				document.getElementById("results").textContent = "In "+name+ ", on "+months[origmonth]+"\u00A0"+day+", the sun "+sunrise+" and "+sunset+".\r\r\n\r\n"+months[origmonth]+"\u00A0"+day+" has "+daylight+" of daylight.\r\n\r\nThe sun also "+sunrise+" on "+sunrisepretty+"\r\n\r\nThe sun also "+sunset+" on "+sunsetpretty+"\r\n\r\n"+daylightpretty+" the same duration of daylight.";
			} else {
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
			document.getElementById("results").textContent = "In "+name+ ", on "+months[origmonth]+"\u00A0"+day+", the sun is " + sunrise + " the horizon throughout the entire day.\r\n\r\nTherefore, "+months[origmonth]+"\u00A0"+day+" has "+ daylight + " of daylight.\r\n\r\n"+sunrisepretty+"\r\n\r\n"+polarstr;
			};
		};
	};
};
