const express = require('express')
const router = express.Router();
const request = require('request');

function make_request(url)
{
	return new Promise((resolve, reject) => {
        request(url, {json:true}, (error, response, body) => {
            if (error) reject(error);
            if (response.statusCode != 200) {
                reject('Invalid status code <' + response.statusCode + '>');
            }
            resolve(body);
        });
    });
}

router.get('/:news_source', async (req, res, next) =>
{

	const paper = req.params.news_source;
	if(paper === "0")
	{
		//var url = 'https://content.guardianapis.com/search?q=' + query + '&api-key=9cdbcf25-f119-4e8d-b3e8-447508df16aa&show-blocks=all';
			var url = 'https://content.guardianapis.com/search?order-by=newest&show-fields=starRating,headline,thumbnail,short-url&api-key=9cdbcf25-f119-4e8d-b3e8-447508df16aa'
			body = await make_request(url)
			var articles = Array()
			var results = body.response.results;
			for(i = 0; i < results.length; i++)
			{
				title = results[i].webTitle;
				section = results[i].sectionName;
				date = results[i].webPublicationDate;
				id = results[i].id
				url = results[i].webUrl
				
				image = results[i].fields.thumbnail;

				if(!image)
				{
					image = "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png"
				}

				if(title && section && date && id && image && url)
				{
					var len = articles.push({'title' : title, 'image' : image, 'section' : section, 'date' : date, 'url' : url, 'id' : id});
					if(len >= 10)
						break;	
				}
			}
			res.status(200).json({'articles':articles, 'message': 'Home articles sent from Guardian News'})
	}		
})

module.exports = router