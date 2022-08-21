const path = require('path')

const handlebarOptions = {
    ViewEngine: {
        extName: ".handlebars",
        partialsDir: path.resolve("./helper"),
        defaultLayout: false
    },
    viewPath: path.resolve("./helper"),
    extName: ".handlebars",
}

module.exports = handlebarOptions