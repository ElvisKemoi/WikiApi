// db.js

async function connectDB(dbUrl, app, mongoose) {
	try {
		await mongoose.connect(dbUrl);
		console.log("Successfully connected to database");
		const port = 3000;
		app.listen(port, () => {
			console.log(`Server is live on port ${port}`);
		});
	} catch (error) {
		if (error.name === "MongoError") {
			console.error("Error connecting to database:", error.message);
			process.exit(1); // Exit the process if unable to connect to the database
		} else {
			console.error("Unexpected error:", error);
			process.exit(1); // Exit the process for other unexpected errors
		}
	}
}

module.exports = connectDB;
