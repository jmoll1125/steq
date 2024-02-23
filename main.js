//March 26, 2023, and February 22, 2024
//Used to be steqintl3b6-4 (what a terrible name); now we've got multiple locations!
var locN = 0;
function add() {
	document.getElementById('save').style.display = 'block';
	var newdiv = document.createElement("div")
	newdiv.innerHTML = `
	<span class="ib"><label for="name">Place name: </label><input type="text" id="name`+locN+`" class="mockbutton"/></span>
	<span class="ib"><label for="lat">Latitude: </label><input type="number" id="lat`+locN+`" name="lat" min="-90" max="90" class="mockbutton"/></span>
	<span class="ib"><label for="lon">Longitude: </label><input type="number" id="lon`+locN+`" name="lon" min="-180" max="180" class="mockbutton"/></span>
	<span class="ib"><label for="tz">Time zone (winter): </label><input type="number" id="tz`+locN+`" name="tz" min="-12" max="14" class="mockbutton"/></span>
	<span class="ib"><label for="dst">DST rule: </label>
	<select id="dst`+locN+`" size="1" class="mockbutton">
	<option value="us">us</option>
	<option value="eu">eu</option>
	<option value="no">no</option>
	</select></span>
	<button id="del`+locN+`" class="mockbutton" onclick="del(`+locN+`);">Delete</button>
<p id="invalid`+locN+`" class="error" style="display:none"></p>`
	newdiv.id = "input-data"+locN;
	document.getElementById("locs").appendChild(newdiv);
locN++;
};
function hideEdits() {
	document.getElementById('loclist').innerHTML = ""
	for (N=0; N<locN; N++) {
		document.getElementById('input-data'+N).style.display = 'none';
		if (document.getElementById('name'+N).value === "") {
			document.getElementById('name'+N).value = document.getElementById('lat'+N).value + ", " + document.getElementById('lon'+N).value;
		};	
		document.getElementById('loclist').innerHTML += "<option value="+N+">"+document.getElementById('name'+N).value+"</option>"	

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
	for (N=0; N<locN; N++) {
		document.getElementById('input-data'+N).style.display = 'block';
		document.getElementById('invalid'+N).style.display = 'none';

	};
	document.getElementById('save').style.display = 'block';
	document.getElementById('add').style.display = 'block';
	document.getElementById('edit').style.display = 'none';
	document.getElementById('loclist').style.display = 'none';
	document.getElementById('loclistx').style.display = 'none';
	document.getElementById('check').style.display = 'none';
};
function del(N) {
	document.getElementById("input-data"+N).remove();
	locN--;
	if(locN === 0) {
	document.getElementById('save').style.display = 'none';
	};
};
function validate() {
	var allErrors = "";
	for (N=0; N<locN; N++) {
var name = document.getElementById('name'+N).value;
var lat = parseFloat(document.getElementById('lat'+N).value);
var lon = parseFloat(document.getElementById('lon'+N).value);
var tz = parseFloat(document.getElementById('tz'+N).value);
var dst = document.getElementById('dst'+N).value;
var errors = "";
if (isNaN(lat) || lat < -90 || lat > 90 ) {
errors+= "Latitude must be between -90 and 90.<br>";
};
if (isNaN(lon) || lon < -180 || lon > 180) {
errors+= "Longitude must be between -180 and 180.<br>";
};
if (isNaN(tz) || tz < -12 || tz > 14) {
errors+= "Time zone must be between -12 and 14. (Use decimals for half hours.)<br>";
};
allErrors += errors;
if (errors === "") {
	continue;
} else {
document.getElementById('invalid'+N).style.display = 'block';
document.getElementById("invalid"+N).innerHTML = errors;
document.getElementById('check').style.display = 'none';
document.getElementById('submit').style.display = 'none';
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
var filetype;
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
var maxdays;
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
var sunrisemin;
var sunsetmin;
var daylightmin;
var zstring;
daylightduration = [];
for (i=0; i<sunrises.length; i++) {
zstring = "";
sunrisemin = parseInt(sunrises[i].substring(0,2))*60 + parseInt(sunrises[i].substring(2,4));
sunsetmin = parseInt(sunsets[i].substring(0,2))*60 + parseInt(sunsets[i].substring(2,4));
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
daylightduration.push(daylightmin);
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
				strtemp = parseInt(strtemp)
				} else {
				if (strtemp !== sunsets[i]) {
				strtemp = "L" + strtemp.substring(1)
				console.log(strtemp)
				}; 
				};
			sunrises[i] = strtemp
			};
//if it's not **** or ---- it becomes an int, but if it is, AND it doesn't correspond to sunset, then it gets L'd.
for (i=0; i < sunsets.length; i++) {
			strtemp = sunsets[i]
			if (strtemp !== "****" && strtemp !== "----") {
				strtemp = parseInt(strtemp)
				} else {
				if (strtemp !== sunrises[i]) {
				strtemp = "L" + strtemp.substring(1)
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
var outDay;
var outMonth;
var onDate;
if (sunriseoccurs.length == 0) {
sunriseoutputstr = "no other date!"
} else {
for (i=0; i < sunriseoccurs.length; i++) {
outMonth = 0;
outDay = 0;
onDate = sunriseoccurs[i]+1;
for (j=0; onDate > parseInt(maxdays[outMonth]); j++) {
onDate = onDate - parseInt(maxdays[j]);
outMonth = outMonth + 1;
};
outMonth = months[outMonth];
outDay = onDate
sunriseoutputstr = sunriseoutputstr + outMonth + " " + outDay + ", ";
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
}
var sunsetcommas = sunsetoccurs.length - 1;
sunsetoutputstr = "";
if (sunsetoccurs.length == 0) {
sunsetoutputstr = "no other date!"
} else {
for (i=0; i < sunsetoccurs.length; i++) {
outMonth = 0;
outDay = 0;
onDate = sunsetoccurs[i] + 1;
for (j=0; onDate > parseInt(maxdays[outMonth]); j++) {
onDate = onDate - parseInt(maxdays[j]);
outMonth = outMonth + 1;
};
outDay = onDate
outMonth = months[outMonth];
sunsetoutputstr = sunsetoutputstr + outMonth + " " + outDay + ", ";
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
}
var daylightcommas = daylightoccurs.length - 1;
daylightoutputstr = "";
if (daylightoccurs.length == 0) {
daylightoutputstr = "No other date"
daylightcommas = 0;
} else {
for (i=0; i < daylightoccurs.length; i++) {
outMonth = 0;
outDay = 0;
onDate = daylightoccurs[i] + 1;
for (j=0; onDate > parseInt(maxdays[outMonth]); j++) {
onDate = onDate - parseInt(maxdays[j]);
outMonth = outMonth + 1;
};
outDay = onDate
outMonth = months[outMonth];
daylightoutputstr = daylightoutputstr + outMonth + " " + outDay + ", ";
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
var ampm = " AM";
if (sunrise > 1159) {
sunrise = sunrise - 1200;
ampm = " PM";
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
//sunset
ampm = " AM";
if (sunset > 1159) {
sunset = sunset - 1200;
ampm = " PM";
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
var pluralstr = [" hour ", " hours ", " minute", " minutes"]
if (daylight.charAt(3) == "0") {
daylight = daylight.slice(0, 2) + pluralstr[plurals[0]] + daylight.slice(4, 5) + pluralstr[plurals[1]]; //no more leading zero
} else {
daylight = daylight.slice(0, 2) + pluralstr[plurals[0]] + daylight.slice(3, 5) + pluralstr[plurals[1]]; //so our plurals are always right.
};
if (daylight.charAt(0) == 0) {
daylight = daylight.slice(1, daylight.length)
};
document.getElementById("results").innerHTML = "In "+name+ ", on "+months[origmonth]+" "+day+", the sun rises at "+sunrise+" and sets at "+sunset+".<br><br>"+months[origmonth]+" "+day+" has "+daylight+" of daylight.<br><br>The sun also rises at "+sunrise+" on "+sunrisepretty+"<br><br>The sun also sets at "+sunset+" on "+sunsetpretty+"<br><br>"+daylightpretty+" the same duration of daylight.";
} else {
if (sunrise === "----") {
sunrise = "below";
daylight = "0 hours 0 minutes";
} else {
sunrise = "above"
daylight = "24 hours 0 minutes";
};
if (sunrisepretty === "no other date!") {
document.getElementById("results").innerHTML = "In "+name+ ", on "+months[origmonth]+" "+day+", the sun is " + sunrise + " the horizon throughout the entire day.<br><br>Therefore, "+months[origmonth]+" "+day+" has "+ daylight + " of daylight.<br><br>No other days are like this!"
} else {
document.getElementById("results").innerHTML = "In "+name+ ", on "+months[origmonth]+" "+day+", the sun is " + sunrise + " the horizon throughout the entire day.<br><br>Therefore, "+months[origmonth]+" "+day+" has "+ daylight + " of daylight.<br><br>The other days like this are "+sunrisepretty;
};
};
};
};
};