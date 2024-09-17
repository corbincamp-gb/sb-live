/* Google Analytics tracking code */

var devSiteTrackingID = 'UA-135370483-1';			//44.202.152.51 or 18.212.6.225 (webcoolbox)
var liveDirectoryTrackingID = '';		//
var liveSiteTrackingID = 'UA-135370483-2';			//dodskillbridge.usalearning.gov
var liveAzureSiteTrackingID = 'UA-135370483-3';		//skillbridge.osd.mil
var liveGA4TrackingID = 'G-QKYLGR9V34';
var devGA4TrackingID = 'G-Q5138PP881';


var hostname = document.location.hostname;
//console.log("hostname: " + hostname);

if (hostname !== "") {// only execute GA code if server isn't localhost, prevents calls from cool2go local instances
	//new GA code that works with site search
	var _gaq = _gaq || [];
	var tempTrackingID = '';
	var tempGA4ID = '';
	
	if(hostname == 'dodskillbridge.usalearning.gov')	// Live site tracking
	{
		//console.log("tracking id should be set to live site tracking");
		tempTrackingID = liveSiteTrackingID;
	}
	else if(hostname == 'skillbridge.osd.mil')
	{
		tempTrackingID = liveAzureSiteTrackingID;
		tempGA4ID = liveGA4TrackingID;
	}
	else if(hostname == '')	// Live directory tracking (webcoolbox)
	{
		//console.log("tracking id should be set to live (webcoolbox) tracking");
		tempTrackingID = liveDirectoryTrackingID;
	}
	else if(hostname == '44.202.152.51')	// Dev site tracking (webcoolbox)
	{
		//console.log("tracking id should be set to dev (webcoolbox) tracking");
		tempTrackingID = devSiteTrackingID;
		tempGA4ID = devGA4TrackingID;
	}
	
	_gaq.push(['_setAccount', tempTrackingID]);
	_gaq.push(['_trackPageview']);
	
	// Universal
	(function() {
		var ga = document.createElement('script');
		ga.type = 'text/javascript';
		ga.async = true;
		ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('script')[0];
		s.parentNode.insertBefore(ga, s);
	})();

	// GA4
	(function() {
		var ga = document.createElement('script');
		ga.type = 'text/javascript';
		ga.async = true;
		ga.src = 'https://www.googletagmanager.com/gtag/js?id=' + tempGA4ID;
		var s = document.getElementsByTagName('script')[0];
		s.parentNode.insertBefore(ga, s);
	})();
	
	window.dataLayer = window.dataLayer || [];
	function gtag(){dataLayer.push(arguments);}
	gtag('js', new Date());

	gtag('config', tempGA4ID);	
}