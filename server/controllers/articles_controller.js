const Article = require('data').Models.Article;
const Controller = require('overdrive').Controller;
const CRUD = require('overdrive').CRUD;
const fs = require('fs');
const Logger = require('overdrive-logger');
const path = require('path');

class ArticlesController extends Controller {
    /// Register the controller routes
    /// @param router - The router
    register(router) {
        const route = '/api/articles';

        CRUD.create(
            router,
            Article,
            route,
            // validation
            (data) => {
                data.filename = data.name + ".md";
                return data;
            },
            // behaviour
            (model) => {
                const filename = path.join(__dirname, `../../web/assets/articles/${model.filename}`);
                Logger.error(`Creating file: ${filename}`);
                fs.writeFile(filename, '', (err) => {
                    Logger.error(`Cannot create the file: ${filename}`);
                });
            });
        CRUD.read(router, Article, route);
        CRUD.update(router, Article, route);
        CRUD.delete(router, Article, route);
    }
}

module.exports = ArticlesController;