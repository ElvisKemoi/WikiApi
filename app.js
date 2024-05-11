const connectDB = require("./server");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const dbUrl = "mongodb://localhost:27017/wikiDB";
const bodyParser = require("body-parser");
const ejs = require("ejs");

connectDB(dbUrl, app, mongoose);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("View engine", "ejs");
const articleSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
});

const Article = mongoose.model("Article", articleSchema);

const article = new Article({
	title: "Testing 1",
	content: "This is testing 1",
});

// TODO GET
// GETTING ALL THE ARTICLES IN THE DATABASE

app
	.route("/articles")
	.get(async (req, res) => {
		try {
			const articles = await Article.find();
			res.status(200).send(articles);
		} catch (error) {
			console.error("Error: " + error);
		}
	})
	.post(async (req, res) => {
		try {
			const { title, content } = req.body;
			const newArticle = new Article({
				title: title,
				content: content,
			});
			await newArticle.save();
			res.status(200).send("Article saved to the database");
		} catch (error) {
			res.status(500).send("Error: " + error);
			console.error("Error: " + error);
		}
	})
	.delete(async (req, res) => {
		try {
			const deleted = await Article.deleteMany({});
			// await Article.deleteMany({});

			res.status(200).send("All the articles were deleted.");
		} catch (error) {
			res.status(500).send("Error: " + error);
		}
	});

//  REQUESTING A SPECIFIC ARTICLE   //

app
	.route("/articles/:articleTitle")
	.get(async (req, res) => {
		try {
			const foundArticle = await Article.findOne({
				title: req.params.articleTitle,
			});
			if (foundArticle) {
				res.status(200).send(foundArticle);
			} else {
				res.status(500).send("Error: Article not found in the database.");
			}
		} catch (error) {
			res.status(500).send("Error: " + error);
			console.error("Error: " + error);
		}
	})
	.put(async (req, res) => {
		try {
			const articleUpdated = await Article.updateOne(
				{
					title: req.params.articleTitle,
				},
				{
					title: req.body.title,
					content: req.body.content,
				}
			);
			if (articleUpdated.matchedCount > 0) {
				if (articleUpdated.modifiedCount > 0) {
					res.status(200).send("Updated successfully.");
				} else {
					res.status(500).send("Error: Article was not modified.");
				}
			} else {
				res.status(500).send("Error: Article not Found");
			}
		} catch (error) {
			console.error("Error: " + error);
		}
	})
	.patch(async (req, res) => {
		try {
			const { title, content } = req.body;
			const articleUpdated = await Article.updateOne(
				{
					title: req.params.articleTitle,
				},
				{
					$set: {
						title: title,
						content: content,
					},
				}
			);
			if (
				articleUpdated.modifiedCount === 1 &&
				articleUpdated.matchedCount === 1
			) {
				res.status(200).send("Articles updated successfully.");
			} else {
				res.status(500).send("Article was not updated");
			}
		} catch (error) {
			console.error("Error: " + error);
			res.status(500).send("Error: " + error);
		}
	})
	.delete(async (req, res) => {
		try {
			const title = req.params.articleTitle;
			const articleDeleted = await Article.deleteOne({
				title: title,
			});
			if (articleDeleted.deletedCount === 1) {
				res.status(200).send("Successfully deleted the article.");
			} else {
				res.status(500).send("Article was not deleted.");
			}
		} catch (error) {
			res.status(500).send("Error: " + error);
		}
	});
