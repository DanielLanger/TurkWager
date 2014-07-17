// Show the stats page action on mturk pages 
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if (tab.url.match("^https://www.mturk.com/mturk/"))
	{
		chrome.pageAction.show(tabId);
	}
});

chrome.webRequest.onBeforeRequest.addListener(
	function(details) {
		chrome.tabs.sendMessage(details.tabId, {action: 'externalSubmit'});
		return {cancel: false};
	},
	{urls: ['https://www.mturk.com/mturk/externalSubmit']},
	['blocking']
);