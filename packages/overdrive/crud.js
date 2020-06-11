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
                else if (token.includes('any=like='))
                {
                    const pieces = token.split('=contains=').map(piece => piece.trim());
                    if (pieces.length == 2)
                    {
                        
                    }
                }
                else if (token.includes('=like='))
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
        this.create(router, schema, route);
        this.read(router, schema, route);
        this.update(router, schema, route);
        this.delete(router, schema, route);
    }

    /// Register Create operation
    /// @param router - The express router
    /// @param schema - The data schema
    /// @param route - The base route
    static create(router, schema, route, validate = (data) => { return data; }) {
        /// Create a new entry
        /// @return - The new model, if succeed
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

    /// Register Read operation
    /// @param router - The express router
    /// @param schema - The data schema
    /// @param route - The base route
    static read(router, schema, route) {
        /// Retrieve all the models
        /// @return - The model list
        router.get(route, async (req, res) => {
            const condition = this.buildCondition(req);
            const data = await schema.find(condition, this.buildSearch(req));
            const count = await schema.count(condition);
            res.respond(Status.Code.OK, {
                data,
                count
            });
        });

        /// Retrieve the models by a given id list
        /// @param ids - The list of ids in format "id1,id2,...,idn"
        /// @return - The list of models, if them exist
        router.get(`${route}/:ids`, async (req, res) => {
            const data = await schema.findByIds(req.params.ids);
            res.respond(Status.Code.OK, data);
        });
    }

    /// Register Update operation
    /// @param router - The express router
    /// @param schema - The data schema
    /// @param route - The base route
    static update(router, schema, route, validate = (data) => { return data; }) {
        /// Update a model
        /// @param id - The model to update
        /// @return - True if succeed
        router.patch(`${route}/:id`, async (req, res) => {
            const data = validate(req.body);
            if (data)
            {
                const success = await schema.update(req.params.id, data);
                res.respond(success ? Status.Code.OK : Status.Code.BadRequest);
            }
            else 
            {
                res.respond(Status.Code.BadRequest);
            }
        });
    }

    /// Register Delete operation
    /// @param router - The express router
    /// @param schema - The data schema
    /// @param route - The base route
    static delete(router, schema, route) {
        /// Remove a model
        /// @param ids - The list of ids in format "id1,id2,...,idn"
        /// @return - True if succeed
        router.delete(`${route}/:ids`, async (req, res) => {
            const success = await schema.deleteByIds(req.params.ids);
            res.respond(success ? Status.Code.OK : Status.Code.BadRequest);
        });
    }
};

module.exports = CRUD;