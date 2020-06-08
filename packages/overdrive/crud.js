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
        return {};
    }

    /// Register basic CRUD operation for a data provider
    /// @param router - The express router
    /// @param schema - The data schema
    /// @param route - The base route
    static register(router, schema, route) {
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

        /// Create a new entry
        /// @return - The new model, if succeed
        router.post(route, async (req, res) => {
            const result = await schema.create(req.body);
            res.respond(result.status, result.data);
        });

        /// Remove a model
        /// @param ids - The list of ids in format "id1,id2,...,idn"
        /// @return - True if succeed
        router.delete(`${route}/:ids`, async (req, res) => {
            const result = await schema.removeMany(req.params.ids);
            res.respond(result.status, result.data);
        });
    }
};

module.exports = CRUD;