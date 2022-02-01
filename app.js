//project constants
API_KEY = '4f3b8211b4669a3b88b1200c207e4952';

// init project
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const https = require('https');

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs')

// listen for requests :)
app.listen(process.env.PORT || 3000);


let language = 'en';
// requests
app.get('/', function (req, res) {
    const url_top = 'https://gnews.io/api/v4/top-headlines?lang=en&token=' + API_KEY;
    let chunks = [];

    https.get(url_top, (response)=>{

        let news = [];
        let schema = '';
        response
        .on('data', (data)=>{
            chunks.push(data);
        })
        .on('end', ()=>{
            let data = Buffer.concat(chunks);
            schema = JSON.parse(data);
            

            for(let i=0;i<schema.totalArticles;i++) {

                if(schema.articles[i]) {

                    const temp = {
                        title: schema.articles[i].title,
                        contents: schema.articles[i].contents,
                        desc: schema.articles[i].description,
                        url: schema.articles[i].url,
                        image: schema.articles[i].image,
                        source: schema.articles[i].source.name
                    }

                    news.push(temp);
                }
            }

            const result = "Top Headlines";
            res.render('home.ejs', {'data': news, 'result': result});

        })

    })

})

app.post('/search', (req, res)=>{

    let chunks = [];
    let news = [];
    let schema = '';
    let query = req.body.search;
    let url = 'https://gnews.io/api/v4/search?q='+ query +'&token=' + API_KEY + '&lang=' + language;
    https.get(url, (response)=>{
        response
        .on('data', (data)=>{
            chunks.push(data);
        })
        .on('end', ()=>{
            let data = Buffer.concat(chunks);
            schema = JSON.parse(data);

            for(let i=0;i<schema.totalArticles;i++) {

                if(schema.articles[i]) {

                    const temp = {
                        title: schema.articles[i].title,
                        contents: schema.articles[i].contents,
                        desc: schema.articles[i].description,
                        url: schema.articles[i].url,
                        image: schema.articles[i].image,
                        source: schema.articles[i].source.name
                    }

                    news.push(temp);
                }
            }
            res.render('home.ejs', {'data': news, 'result': query});
        })
    })
})

app.get('/query/:q', (req, res)=>{
    
    let chunks = [];
    let news = [];
    let schema = '';
    query = req.params.q;
    url = 'https://gnews.io/api/v4/search?q='+ query +'&token=' + API_KEY;
    https.get(url, (response)=>{
        response
        .on('data', (data)=>{
            chunks.push(data);
        })
        .on('end', ()=>{
            let data = Buffer.concat(chunks);
            schema = JSON.parse(data);

            for(let i=0;i<schema.totalArticles;i++) {

                if(schema.articles[i]) {

                    const temp = {
                        title: schema.articles[i].title,
                        contents: schema.articles[i].contents,
                        desc: schema.articles[i].description,
                        url: schema.articles[i].url,
                        image: schema.articles[i].image,
                        source: schema.articles[i].source.name
                    }

                    news.push(temp);
                }
            }

            res.render('home.ejs', {'data': news, 'result': query});
        })
    })

})

