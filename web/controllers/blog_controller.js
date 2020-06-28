const Controller = require('overdrive').Controller;
const fs = require('fs');
const Logger = require('overdrive').Logger;
const path = require('path');
const showdown = require('showdown');

class BlogController extends Controller {
    static async home(req, res) {
        res.send("Blog");
    }

    static async get(req, res) {

        const converter = new showdown.Converter();
        const filename = path.join(__dirname, `../assets/articles/prova.md`);
        Logger.log(filename);
        const text = fs.readFileSync(filename, 'utf8');
        const html = converter.makeHtml(text);

        res.render('overdrive/article', {
            article: html
        });
    }
    /// Register the controller routes
    /// @param router - The router
    register(router) {
        router.get('/blog', BlogController.home);
        router.get('/blog/:id', BlogController.get);
    }
}

module.exports = BlogController;