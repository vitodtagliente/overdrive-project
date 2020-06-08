const Logger = require('overdrive-logger');
const Status = require('overdrive-status');

class CRUD {
    /// Register basic CRUD operation for a data provider
    /// @param router - The express router
    /// @param provider - The data provider
    /// @param route - The base route
    static register(router, provider, route) {
        if (router == null || provider == null || route == null)
        {
            Logger.error(`Invalid arguments. Unable to register the provider ${provider.name}`);
            return;
        }

        /// Retrieve all the models
        /// @return - The model list
        router.get(route, async (req, res) => {
            const data = await provider.all();
            res.respond(Status.Code.OK, data);
        });

        /// Retrieve the models by a given id list
        /// @param ids - The list of ids in format "id1,id2,...,idn"
        /// @return - The list of models, if them exist
        router.get(`${route}/:ids`, async (req, res) => {
            const data = await provider.findByIds(req.params.ids);
            res.respond(Status.Code.OK, data);
        });

        /// Create a new entry
        /// @return - The new model, if succeed
        router.post(route, async (req, res) => {
            const result = await provider.create(req.body);
            res.respond(result.status, result.data);
        });

        /// Remove a model
        /// @param ids - The list of ids in format "id1,id2,...,idn"
        /// @return - True if succeed
        router.delete(`${route}/:ids`, async (req, res) => {
            const result = await provider.removeMany(req.params.ids);
            res.respond(result.status, result.data);
        });
    }
};

module.exports = CRUD;