const mongoose = require("mongoose")
const config = require("config")

const db = config.get("mongoURL")

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
        console.log("mongoDb connected ....")
    } catch (e) {
        console.error(e.message)
        //exit process with failure
        process.exit(1)
    }
}

module.exports = connectDB