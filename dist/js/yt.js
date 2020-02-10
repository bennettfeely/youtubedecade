var previous_day = document.querySelector("button.previous-day");
var next_day = document.querySelector("button.next-day");

// var bounds = [
// 	moment("8-23-2009", "MM-DD-YYYY"),
// 	moment()
// 		.subtract(10, "y")
// 		.format("YYYY-M-D")
// ];

var bounds = [
	moment("08-23-2009", "MM-DD-YYYY"),
	moment("02-05-2010", "MM-DD-YYYY"),
];

// Start things up
init();

// Debugger
function debug(date) {
	loadVideoList(moment(date));
}

function init() {
	var targeted_date = moment("05-02-2020", "MM-DD-YYYY");

	// Get data
	loadVideoList(targeted_date.subtract(10, "y"));

	// Previous day button
	previous_day.addEventListener("click", function() {
		if (targeted_date.isAfter(bounds[0])) {
			loadVideoList(targeted_date.subtract(1, "day"));
		}
	});

	// Next day button
	var next_day = document.querySelector("button.next-day");
	next_day.addEventListener("click", function() {
		if (targeted_date.isBefore(bounds[1])) {
			loadVideoList(targeted_date.add(1, "day"));
		}
	});

	// Start the countdown until tomorrow
	setInterval(countDown, 1000);
}

function loadVideoList(targeted_date) {
	Update date in header to loaded date
	document.querySelector(".today").innerHTML = targeted_date.format(
		"MMMM D, YYYY"
	);

	if (targeted_date.isAfter(bounds[0])) {
		previous_day.classList.remove("is-disabled");

		previous_day.disabled = true;
		setTimeout(function() {
			previous_day.disabled = false;
		}, 500);
	} else {
		previous_day.classList.add("is-disabled");
		previous_day.disabled = true;
	}

	if (targeted_date.isBefore(bounds[1])) {
		next_day.classList.remove("is-disabled");

		next_day.disabled = true;
		setTimeout(function() {
			next_day.disabled = false;
		}, 500);
	} else {
		next_day.classList.add("is-disabled");
		next_day.disabled = true;
	}

	// Format of data lists
	var year = targeted_date.year();
	var month = (targeted_date.month() + 1);
		if (month < 10) {
			month = "0" + month;
		}
	var date = (targeted_date.date() + 1);
		if (date < 10) {
			date = "0" + date;
		}

	var url = "../data/" + year + "_" + month + "_" + date + ".json";

	// Fetch json
	fetch(url)
		.then(response => {
			return response.json();
		})
		.then(video_list => {
			// Fill page with videos

			buildPage(video_list);
		})
		.catch(err => {
			console.log(err);

			// Show the error message
			document.querySelector(".error").style.display = "block";

			// Hide the ad
			document.querySelector(".critical-wrapper").style.display = "none";
			document.querySelector(".countdown-wrapper").style.display = "none";
		});
}

// Fill page with videos
function buildPage(video_list) {
	// Load Ad
	var ad = document.createElement("script");
	ad.setAttribute("id", "_carbonads_js");
	ad.setAttribute(
		"src",
		"//cdn.carbonads.com/carbon.js?serve=CKYIL27N&placement=bennettfeelycom"
	);
	document.querySelector(".critical-content").innerHTML = "";
	document.querySelector(".critical-content").appendChild(ad);

	// Run through videos in array
	for (const video of video_list.video) {
		// Skip over the featured list item if it is there
		if (video.selector !== "featured") {
			var base = "." + video.selector + " ";

			// Video link
			document.querySelector(base + ".video-link").href =
				"https://www.youtube.com/watch?v=" + video.videoId;

			// Video title
			document.querySelector(
				base + ".video-title"
			).innerHTML = decodeURIComponent(video.title);

			// Thumbnail image
			document.querySelector(
				base + ".video-thumbnail"
			).style.backgroundImage =
				"url(https://i.ytimg.com/vi/" +
				video.thumbnailId +
				"/hqdefault.jpg)";

			// Video views
			document.querySelector(base + ".video-views").innerHTML =
				video.views + " views";

			// Video channel link
			document.querySelector(base + ".video-channelLink").href =
				"https://www.youtube.com/channel/" + video.channelId;

			// Video channel
			document.querySelector(
				base + ".video-channelTitle"
			).innerHTML = decodeURIComponent(video.channelTitle);
		}
	}
}

function countDown() {
	var now = new Date();
	var hoursleft = 23 - now.getHours();
	var minutesleft = 59 - now.getMinutes();
	var secondsleft = 59 - now.getSeconds();

	if (hoursleft == 0) {
		var hoursleft = "";
	} else {
		if (hoursleft == 1) {
			var hoursleft = hoursleft + " hour, ";
		} else {
			var hoursleft = hoursleft + " hours, ";
		}
	}

	if (minutesleft == 0 && hoursleft == 0) {
		var minutesleft = "";
	} else {
		if (minutesleft == 1) {
			var minutesleft = minutesleft + " minute, ";
		} else {
			var minutesleft = minutesleft + " minutes, ";
		}
	}

	if (secondsleft == 1) {
		var secondsleft = secondsleft + " second";
	} else {
		var secondsleft = secondsleft + " seconds";
	}

	//display
	document.querySelector(".countdown").innerHTML =
		hoursleft + minutesleft + secondsleft;
}
