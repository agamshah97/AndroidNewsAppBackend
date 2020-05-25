const express = require('express')
const router = express.Router();

const request = require('request');
const api = require("./apis")

router.get('/:news_source', async (req, res, next) =>
	{
		//res.send("This was sent");
		const id = req.params.news_source;
		if(id == 0)
		{
			//console.log("Guardian");
			var url = 'https://content.guardianapis.com/technology?api-key=9cdbcf25-f119-4e8d-b3e8-447508df16aa&show-blocks=all';
			articles = await api.guardian_api(url)
			//console.log(articles);
			res.status(200).json({'articles':articles, 'message':"Articles from Guardian for Technology Section"});
		}
		else
		{
			//console.log("NYTimes");
			var url = 'https://api.nytimes.com/svc/topstories/v2/technology.json?api-key=zVf69uUBMkfJIKOilqRO7gIHFFyEBKxG'
			articles = await api.nytimes_api(url)
			//console.log(articles);
			res.status(200).json({'articles':articles, 'message':"Articles from NYTimes for Technology Section"});
		}
		
		
	})

module.exports = router