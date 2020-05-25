const express = require('express')
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


module.exports = {

guardian_api : async function(url) {

		//console.log(body);
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
		//console.log(articles);
		return articles;
},

nytimes_api : async function(url) {
  		//console.log(body);
  		body = await make_request(url) 

  		var articles = Array()
  		var results = body.results;
  		for(i = 0; i < results.length; i++)
  		{
  			title = results[i].title;
  			section = results[i].section;
  			date = results[i].published_date;
  			description = results[i].abstract;
  			url = results[i].url
  			id = null
  			
  			image = null;
  			try {
	  			multimedia = results[i].multimedia;
	  			for(j = 0; j < multimedia.length; j++)
	  			{
	  				if(multimedia[j].width >= 2000)
	  				{
	  					image = multimedia[j].url;
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
  				var len = articles.push({'title' : title, 'image' : image, 'section' : section, 'date' : date, 'description' : description, 'id':id, 'url' : url});
  				if(len >= 10)
  					break;	
  			}
  		}
  		//console.log(articles);
		return articles;
}

}
