const Logger = require('overdrive-logger');
const Status = require('overdrive-status');

class CRUD {

    static buildSearch(req) {
        let search = {};
        const limit = parseInt(req.query.limit, 10);
        if (limit != null && limit > 0)
        {
            search.limit = limit;
            search.skip = parseInt(req.query.skip, 10) || 0;
        }
        return search;
    }

    static buildCondition(req) {
        let condition = {};
        const filter = req.query.filter;
        if (filter != null)
        {
            const tokens = filter.split(' ').map(token => token.trim());
            for (const token of tokens)
            {
                if (token.includes('=='))
                {
                    const pieces = token.split('==').map(piece => piece.trim());
                    if (pieces.length == 2)
                    {
                        condition[pieces[0]] = pieces[1];
                    }
                }
                else if (token.includes('=contains='))
                {
                    const pieces = token.split('=contains=').map(piece => piece.trim());
                    if (pieces.length == 2)
                    {
                        condition[pieces[0]] = { $regex: `^.*${pieces[1]}.*$` };
                    }
                }
            }
        }
        return condition;
    }

    /// Register basic CRUD operation for a data provider
    /// @param router - The express router
    /// @param schema - The data schema
    /// @param route - The base route
    static register(router, schema, route) {
        this.find(router, schema, route);
        this.findByIds(router, schema, route);
        this.insert(router, schema, route);
        this.deleteByIds(router, schema, route);
    }

    /// Retrieve all the models
    /// @return - The model list
    static find(router, schema, route) {
        router.get(route, async (req, res) => {
            const condition = this.buildCondition(req);
            const data = await schema.find(condition, this.buildSearch(req));
            const count = await schema.count(condition);
            res.respond(Status.Code.OK, {
                data,
                count
            });
        });
    }

    /// Retrieve the models by a given id list
    /// @param ids - The list of ids in format "id1,id2,...,idn"
    /// @return - The list of models, if them exist
    static findByIds(router, schema, route) {
        router.get(`${route}/:ids`, async (req, res) => {
            const data = await schema.findByIds(req.params.ids);
            res.respond(Status.Code.OK, data);
        });
    }

    /// Create a new entry
    /// @return - The new model, if succeed
    static insert(router, schema, route, validate = (data) => { return data; }) {
        router.post(route, async (req, res) => {
            const data = validate(req.body);
            if (data)
            {
                const model = await schema.insert(data);
                res.respond(model ? Status.Code.Created : Status.Code.BadRequest, model);
            }
            else 
            {
                res.respond(Status.Code.BadRequest);
            }
        });
    }

    /// Remove a model
    /// @param ids - The list of ids in format "id1,id2,...,idn"
    /// @return - True if succeed
    static deleteByIds(router, schema, route) {
        router.delete(`${route}/:ids`, async (req, res) => {
            const result = await schema.deleteByIds(req.params.ids);
            res.respond(result.status, result.data);
        });
    }

};

module.exports = CRUD;