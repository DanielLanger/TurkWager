/* ==== DOM Accessors ==== */

var getGroupId = function() {
	return $('form[action="/mturk/submit"] input[name=groupId]').val();
}

var getCurrentTime = function() {
	var text = $('#theTime').text();
	var toks = text.split(':');
	return  (toks[0] * 60 * 60 * 1000) + (toks[1] * 60 * 1000) + (toks[2] * 1000);
}

var getReward = function() {
  var reward = $('span.reward').eq(1).text()
  return reward
}

/* ==== Page Submit Handlers ==== */

$('form[action="/mturk/submit"]').submit(function(){
  
  var time = getCurrentTime()

  $.when(TurkWager.submitTime(getGroupId(), time)).done(function() {
    var reward = getReward()
    var money = Util.currencyToNumber(reward)
    var hours = (time) / (1000*60*60)
    alert("Your Current Hourly Wage: " + Util.formatCurrency(money/hours))
  })

 
})

chrome.runtime.onMessage.addListener(function(request) {
	if (request.action=='externalSubmit') {
    
    var time = getCurrentTime()
		$.when(TurkWager.submitTime(getGroupId(), time)).done(function() {
      var reward = getReward()
      var money = Util.currencyToNumber(reward)
      var hours = (time) / (1000*60*60)
      alert("Your Current Hourly Wage: " + Util.formatCurrency(money/hours))
    })
	}
});