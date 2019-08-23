// var today_date = new Date();
// var today = {
// 	y: today_date.getFullYear(),
// 	m: today_date.getMonth() + 1,
// 	d: today_date.getDate()
// };

var today = {
	y: 2019,
	m: 9,
	d: 3
};

init();

function init() {
	setToday();
	loadVideoList();
	countDown();
}

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

	document.querySelector(".today").innerHTML =
		month + " " + day + ", " + year;
	document.querySelector(".tomorrow").innerHTML =
		month + " " + (day + 1) + ", " + year;
}

function loadVideoList() {
	console.log("loadVideoList();");

	var url = "../data/" + today.y + "_" + today.m + "_" + today.d + ".json";

	fetch(url)
		.then(response => {
			// console.log(response);
			return response.json();
		})
		.then(video_list => {
			buildPage(video_list.video);
		})
		.catch(err => {
			// Do something for an error here
			console.log("Error Reading data " + err);
		});
}

function buildPage(video_list) {
	console.log("buildPage();");

	for (const video of video_list) {
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

	if (hoursleft == 1) {
		var hoursleft = hoursleft + " hour, ";
	} else {
		var hoursleft = hoursleft + " hours, ";
	}

	if (minutesleft == 1) {
		var minutesleft = minutesleft + " minute, ";
	} else {
		var minutesleft = minutesleft + " minutes, ";
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
