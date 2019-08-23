// Get the current date
var today_date = new Date();
var today = {
	y: today_date.getFullYear(),
	m: today_date.getMonth() + 1,
	d: today_date.getDate() + 1
};

// // Debug date
// var today = {
// 	y: 2019,
// 	m: 9,
// 	d: 3
// };

// Start things up
init();

function init() {
	console.log("init();");

	setToday();
	loadVideoList();
}

// Convert js date into month, d, yyyy
function setToday() {
	var months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	];
	var month = months[today.m - 1];
	var day = today.d;
	var year = today.y - 10;

	// Update header with the date minus 10 years ago
	document.querySelector(".today").innerHTML =
		month + " " + day + ", " + year;

	// Update header with tomrrow's date minus 10 years
	document.querySelector(".tomorrow").innerHTML =
		month + " " + (day + 1) + ", " + year;
}

function loadVideoList() {
	console.log("loadVideoList();");

	// Format of data lists
	var url = "../data/" + today.y + "_" + today.m + "_" + today.d + ".json";

	// Fetch json
	fetch(url)
		.then(response => {
			return response.json();
		})
		.then(video_list => {
			// Fill page with videos
			buildPage(video_list.video);

			// Start the countdown until tomorrow
			countDown();
		})
		.catch(err => {
			console.log("Error Reading data " + err);

			// Show the error message
			document.querySelector(".error").style.display = "block";

			// Hide the ad
			document.querySelector(".critical-wrapper").style.display = "none";
			document.querySelector(".countdown-wrapper").style.display = "none";
		});
}

// Fill page with videos
function buildPage(video_list) {
	console.log("buildPage();");

	// Run through videos in array
	for (const video of video_list) {
		// Skip over the featured list item if it is there
		if (video.selector !== "featured") {
			var base = "." + video.selector + " ";

			// Video link
			document.querySelector(base + ".video-link").href =
				"https://www.youtube.com/watch?v=" + video.videoId;

			// Video title
			document.querySelector(base + ".video-title").innerHTML =
				video.title;

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
			document.querySelector(base + ".video-channelTitle").innerHTML =
				video.channelTitle;
		}
	}
}

function countDown() {
	console.log("countDown();");

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

	setInterval(countDown, 1000);
}
