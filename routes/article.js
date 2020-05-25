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

router.get('/', async (req, res, next) =>
	{
		const id = req.query.id
		const paper = req.query.paper

		if(paper === "0")
		{
			var url = 'https://content.guardianapis.com/' + id + '?api-key=9cdbcf25-f119-4e8d-b3e8-447508df16aa&show-blocks=all';
			body = await make_request(url)
			title = body.response.content.webTitle
			date = body.response.content.webPublicationDate
			description = body.response.content.blocks.body[0].bodyTextSummary
			url = body.response.content.webUrl
			section = body.response.content.sectionId
			url_id = id

			image = null
			try {
			assets = body.response.content.blocks.main.elements[0].assets;
			if(assets.length >= 1)
				image = assets[assets.length - 1].file;
			}catch(err)
			{
				//console.log("Empty Image");
			}

			if(!image)
			{
				image = "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png"
			}

			article = {'title':title, 'date':date, 'description':description, 'image':image, 'url':url, 'id':url_id, 'section':section}

			res.status(200).json({'article':article, 'message': 'Article sent from Guardian News'})
		}
		else
		{
			var url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=web_url:("'+ id + '")&api-key=zVf69uUBMkfJIKOilqRO7gIHFFyEBKxG';
			body = await make_request(url)
			title = body.response.docs[0].headline.main
			date = body.response.docs[0].pub_date
			description = body.response.docs[0].abstract
			url = body.response.docs[0].web_url
			section = body.response.docs[0].news_desk
			url_id = null
			
			image = null
			try {
	  			multimedia = body.response.docs[0].multimedia;
	  			for(j = 0; j < multimedia.length; j++)
	  			{
	  				if(multimedia[j].width >= 2000)
	  				{
	  					image = "https://www.nytimes.com/" + multimedia[j].url;
	  					break;
	  				}
	  			}
	  		}catch(err)
	  		{
	  			//console.log("Empty Image");
	  		}

	  		if(!image)
	  		{
	  			image = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg"
	  		}

	  		article = {'title':title, 'date':date, 'description':description, 'image':image, 'url':url, 'id':url_id, 'section':section}

			res.status(200).json({'article':article, 'message': 'Article sent from NYTimes '})
		} 		
	})

module.exports = router