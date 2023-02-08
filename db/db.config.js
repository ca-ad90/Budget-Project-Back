const config = {}
config.name = "Budget"
config.url = "mongodb://127.0.0.1:27017/" + config.name
config.options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

module.exports = config
