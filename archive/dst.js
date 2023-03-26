function getdst (dstrule, year) {
if (["us", "eu"].indexOf(dstrule) == -1) {
	dstrule = "no"
};
if (dstrule === "us") {
var d = new Date("3/1/"+year);
var mar1 = d.getDay();
var dstday = 1;
	for (; mar1 != 0; dstday++) {
	mar1++;
		if (mar1 > 6) {
		mar1 = 0;
		};
	};
var begindst = 66 + dstday;
var enddst = begindst + 238;
};
//
if (dstrule === "eu") {
	var d = new Date("3/25/"+year);
	var mar1 = d.getDay();
	var dstday = 1;
		for (; mar1 != 0; dstday++) {
		mar1++;
		if (mar1 > 6) {
			mar1 = 0;
			};
		};
	var begindst = 83 + dstday;
	var d = new Date("10/25/"+year);
	var mar1 = d.getDay();
	var dstday = 1;
		for (; mar1 != 0; dstday++) {
		mar1++;
			if (mar1 > 6) {
			mar1 = 0;
			};
		};
var enddst = 297 + dstday; //was 298
};
if (dstrule === "no") {
	var begindst = 370;
	var enddst = 371;
};
//this is a bodge and really shouldn't happen, but it's the best I can think of so it will stay for now
return [begindst,enddst];
};
//pulled straight from steqintl3b4.html