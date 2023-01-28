const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);

////////////////////////////////////////////////////////////////////////////////////////////////////////

app.route("/articles")

.get(function(req, res) {
    Article.find(function(err, foundArticles) {
        if(!err) {
            res.send(foundArticles);
        } else {
            res.send("Error 404! -> "+err);
        }
    });
})

.post(function(req, res) {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save(function(err) {
        if(!err) {
            res.send("Succesfully added the article");
        } else {
            res.send("Error 404! -> "+err);
        }
    });
})

.delete(function(req, res) {
    Article.deleteMany(function(err) {
        if(!err) {
            res.send("Succesfully deleted all articles");
        } else {
            res.send("Error 404! -> "+err);
        }
    });
});

//////////////////////////////////////////////////////////////////////////////////////////////

app.route("/articles/:articleTitle")

.get(function(req, res) {
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle) {
        if(!err && foundArticle) {
            res.send(foundArticle);
        } else if(!err && !foundArticle) {
            res.send("No articles matching that title were found.");
        } else if(err) {
            res.send("Error 404! -> "+err);
        }
    });
})

.put(function(req, res) {
    Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        function(err) {
            if(!err) {
                res.send("Succesfully updated the article");
            } else {
                res.send("Error 404! -> "+err)
            }
        }
    );
})

.patch(function(req, res) {
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err) {
            if(!err) {
                res.send("Succesfully updated the article");
            } else {
                res.send("Error 404! -> "+err)
            }
        }
    );
})

.delete(function(req, res) {
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err) {
            if(!err) {
                res.send("Succesfully deleted the article");
            } else {
                res.send("Error 404! -> "+err)
            }
        }
    );
});

////////////////////////////////////////////////////////////////////////////////////////////////////////

app.listen(3000, function() {
    console.log("Succesfully running on port 3000");
})