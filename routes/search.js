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
		const query = req.query.id
		const paper = req.query.paper

		if(paper === "0")
		{
			var url = 'https://content.guardianapis.com/search?q=' + query + '&api-key=9cdbcf25-f119-4e8d-b3e8-447508df16aa&show-blocks=all';
			body = await make_request(url)
			var articles = Array()
			var results = body.response.results;
			for(i = 0; i < results.length; i++)
			{
				title = results[i].webTitle;
				section = results[i].sectionId;
				date = results[i].webPublicationDate;
				description = results[i].blocks.body[0].bodyTextSummary;
				id = results[i].id
				url = results[i].webUrl 

				image = null;
				try {
				assets = results[i].blocks.main.elements[0].assets;
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

				if(title && section && date && description && id && url)
				{
					var len = articles.push({'title' : title, 'image' : image, 'section' : section, 'date' : date, 'description' : description, 'id' : id, 'url' : url});
					if(len >= 10)
						break;	
				}
			}
			res.status(200).json({'articles':articles, 'message': 'Search articles sent from Guardian News'})
		}
		else
		{
			var url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q='+query+'&api-key=zVf69uUBMkfJIKOilqRO7gIHFFyEBKxG';
			body = await make_request(url)
			var articles = Array()
			var docs = body.response.docs
			for(i = 0; i < docs.length; i++)
			{
				title = docs[i].headline.main
				section = docs[i].news_desk
				date = docs[i].pub_date
				description = docs[i].abstract
				url = docs[i].web_url
				id = null

				image = null
				try {
		  			multimedia = docs[i].multimedia;
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

	  			if(title && section && date && description && url)
				{
					var len = articles.push({'title' : title, 'image' : image, 'section' : section, 'date' : date, 'description' : description,'id':id, 'url' : url});
					if(len >= 10)
						break;	
				}
			}
			res.status(200).json({'articles':articles, 'message': 'Search articles sent from New York Times'})
			
		} 		
	})

module.exports = router