const googleTrends = require('google-trends-api');

const express = require('express');
const router = express.Router();
const request = require('request');

router.get('/:keyword', async (req, res, next) =>
{
	const keyword_trends = req.params.keyword;
	googleTrends.interestOverTime({keyword: keyword_trends, startTime: new Date('2019-06-01')})
	.then(function(results) {
		json_results = JSON.parse(results)
		console.log('These results are awesome', json_results);
  		trend_values = Array()
  		var timeline = json_results.default.timelineData
  		for(i = 0; i < timeline.length; i++)
  		{
  			trend_values.push(timeline[i].value[0])
  		}
  		res.status(200).json({'trends':trend_values, 'message':"Google Trends generated"});
	})
	.catch(function(err) {
  		console.error('Oh no there was an error', err);
  		res.status(500).json({'message':"There was an error"});
	});
});

module.exports = router