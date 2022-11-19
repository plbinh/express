require('dotenv').config()
const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(
            process.env.DB_URI,
            // `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@learn-it.kqb6frx.mongodb.net/?retryWrites=true&w=majority`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        )
        console.log('Connected MongoDB')
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}

module.exports = connectDB