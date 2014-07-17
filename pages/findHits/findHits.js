/* ==== Template Generators ==== */

var PageTemplates = function() {

	function rowTemplate(title, text) {
		return $('<tr><td align="left" valign="top" nowrap="" class="capsule_field_title"><a>'+title+':&nbsp;&nbsp;</a></td><td align="left" valign="top" nowrap="" class="capsule_field_text">'+text+'</td></tr>');
	}

	function columnTemplate(rows) {
		var tbl = $('<table cellpadding="5" cellspacing="0" border="0"></table>');
		_(rows).each(function(text, title) {
			tbl.append(rowTemplate(title, text));
		});
		return tbl.wrap('<td valign="top"><div>');
	}

	return {
		'Column': columnTemplate
	};
}();


/* ==== DOM Extraction Methods ==== */

// All of this feels wrong... I don't think there's another way though.

function getHitGroups() {
	return $('.capsuletarget');
}

function getDisplayRow(hitGroup) {
	return $(hitGroup).prev().children().children();
}

function getGroupId(hitGroup) {
	//TODO Can also get the id from preceeding (why?) link.
	var links = $(hitGroup).parent().parent().prev().find('.capsulelink:last-child');
	var anchor = $(links).find('a:last-child');
	var href = $(anchor).attr('href');
	return _.isUndefined(href) ? null : Util.getQueryProp(href, 'groupId');
}

function getGroupReward(hitGroup) {
	var currencyToNumber = function(curr) {
		return Number(curr.replace('$', ''));
	}
	var rewardCol = getDisplayRow(hitGroup).children()[2];
	var rewardRow = $(rewardCol).children().children().children()[0];
	var rewardElt = $(rewardRow).children()[1];
	return currencyToNumber($(rewardElt).text());
}

function setColumnInfo(displayRow, groupAverage, groupReward) {
	var rowInfo = {};
	if (!_.isNull(groupAverage)) {
		rowInfo = {
			'Average Completion Time': Util.formatTime(groupAverage),
			'Estimated Hourly Wage': Util.formatCurrency((groupReward / (groupAverage / (1000*60)))*60)
		};
	} else {
		rowInfo = {
			'Average Completion Time': 'N/A',
			'Estimated Hourly Wage': 'N/A'
		};
	}
	displayRow
		.append(PageTemplates.Column(rowInfo))
		.children().width('25%');
}


/* ==== Main === */

//Populate our new column for all the hitgroups
getHitGroups().each(function() {
	var grpId = getGroupId(this);
	if (!_.isNull(grpId)) {
		var groupReward = getGroupReward(this);
		var displayRow = getDisplayRow(this);
		TurkWager.retrieveTime(grpId, function(groupAverage) {
			setColumnInfo(displayRow, groupAverage, groupReward);
		});
	}	
});