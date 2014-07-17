/* ==== General Utils ==== */
var Util = function() {
	var getQueryProps = function(url) {
		var urlParts = url.split('?');
		if (urlParts.length!=2) {
			return null;
		}
		var queries = urlParts[1].split(';');
		return _.object(_.map(queries, function(q) {return q.split('=')}));
	}

	var getQueryProp = function(url, prop) {
		var p = getQueryProps(url);
		return _.has(p, prop) ? p[prop] : null;
	}

	var currencyToNumber = function(curr) {
		return Number(curr.replace('$', ''));
	}

	var formatTime = function(ms) {
		var seconds = parseInt(ms / 1000);
		var hh = Math.floor(seconds / 3600);
		var mm = Math.floor((seconds - (hh * 3600)) / 60);
		var ss = seconds - (hh * 3600) - (mm * 60);

		if (hh < 10) {hh = '0' + hh}
		if (mm < 10) {mm = '0' + mm}
		if (ss < 10) {ss = '0' + ss}

		return hh + ':' + mm + ':' + ss;
	};

	var formatCurrency = function(curr) {
		return '$' + curr.toFixed(2);
	};

	return {
		'getQueryProps': getQueryProps,
		'getQueryProp': getQueryProp,
		'currencyToNumber': currencyToNumber,
		'formatTime': formatTime,
		'formatCurrency': formatCurrency
	};
}();


/* ==== AWS S3 Data API ==== */
var TurkWager = function() {
	AWS.config.update({accessKeyId: 'AKIAI2D5CZ7SHTCRZ4QA', secretAccessKey: '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'});
	AWS.config.region = 'us-east-1';

	var s3 = new AWS.S3(AWS.config);

	var getGroupInfo = function(grpId, callbck) {
		var params = {Key:grpId, Bucket:'TurkWager'};
		s3.getObject(params, function(err, data) {
			callbck(_.isNull(err) ? JSON.parse(data.Body) : null);
		});
	}



	var setGroupInfo = function(grpId, data) {
		var ret = true;
		var params = {Key: grpId, Body: JSON.stringify(data), Bucket:'TurkWager'};
	    s3.putObject(params, function (err, data) {
	      ret = err ? false : true;
	    });
		return ret;
	}

	/* Exports */
	var retrieveTime = function(grpId, callbck) {
		var data = getGroupInfo(grpId, function(data){
			callbck(_.isNull(data) ? null : data.sum / data.count);
		});
	}

	var submitTime = function(grpId, time) {
		getGroupInfo(grpId, function(data){
			data = _.isNull(data) ? {count: 0, sum: 0} : data;
			data.count += 1;
			data.sum += time;
			setGroupInfo(grpId, data);
		});
	}

	return {
		'retrieveTime': retrieveTime,
		'submitTime': submitTime
	};
}();
