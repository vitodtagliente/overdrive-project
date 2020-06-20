const Status = require('overdrive-status');

class Search {
    #condition = {};
    #params = {};
    constructor(condition, params) {
        this.#condition = condition || {};
        this.#params = params || {};
    }

    get condition() {
        return this.#condition;
    }

    get params() {
        return this.#params;
    }

    static parse(req, schema) {
        return new Search(
            this.parseCondition(req, schema),
            this.parseParams(req)
        );
    }

    static parseCondition(req, schema) {
        let condition = {};
        const filter = req.query.filter;
        if (filter != null)
        {
            const toRegexPattern = (str) => {
                let regex = Array();
                regex.push('^.*');
                for (var i = 0; i < str.length; i++)
                {
                    const char = str.charAt(i);
                    regex.push(`[${char.toLowerCase()}|${char.toUpperCase()}]`);

                }
                regex.push('.*$');
                return regex.join('');
            };

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
                    const pieces = token.split('any=like=').map(piece => piece.trim());
                    if (pieces.length == 2)
                    {
                        const searches = pieces[1].split('any=like=').map(p => p.trim());
                        let or = [];
                        for (const search of searches)
                        {
                            const pattern = toRegexPattern(search);
                            const isTrue = search.toLowerCase() == "true";
                            const isFalse = search.toLowerCase() == "false";
                            const isNumber = !isNaN(search);
                            for (const field of Object.keys(schema.definition))
                            {
                                const type = schema.definition[field].type;
                                if (type == String)
                                {
                                    let expression = {};
                                    expression[field] = { $regex: pattern };
                                    or.push(expression);
                                }
                                else if (type == Number)
                                {
                                    if (isNumber)
                                    {
                                        let expression = {};
                                        expression[field] = { $eq: Number(search) };
                                        or.push(expression);
                                    }
                                }
                                else if (type == Boolean)
                                {
                                    if (isTrue || isFalse)
                                    {
                                        let expression = {};
                                        expression[field] = { $eq: (isTrue) ? true : false };
                                        or.push(expression);
                                    }
                                }
                            }
                        }
                        condition['$or'] = or;
                    }
                }
                else if (token.includes('=like='))
                {
                    const pieces = token.split('=contains=').map(piece => piece.trim());
                    if (pieces.length == 2)
                    {
                        const pattern = toRegexPattern(pieces[1]);
                        condition[pieces[0]] = { $regex: pattern };
                    }
                }
            }
        }
        return condition;
    }

    static parseParams(req) {
        let params = {};
        const limit = parseInt(req.query.limit, 10);
        if (limit != null && limit > 0)
        {
            params.limit = limit;
            params.skip = parseInt(req.query.skip, 10) || 0;
        }
        return params;
    }
}

class CRUD {
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
            const search = Search.parse(req, schema);
            const data = await schema.find(search.condition, search.params);
            const count = await schema.count(search.condition);
            res.respond(Status.Code.OK, {
                data,
                recordsTotal: count,
                recordsFiltered: data.length
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