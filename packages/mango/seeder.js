class Seeder {
    /// fill the database with placeholder data
    /// @param seeds - the list of data
    static async seed(seeds) {
        console.log("Seeding the database...");
        for (const seed of seeds)
        {
            try
            {
                if (seed.model != null)
                {
                    console.log(`Seeding ${seed.model.collection.collectionName}...`);
                    // clear the current collection
                    await seed.model.collection.deleteMany({});
                    // insert the seeds
                    await seed.model.insertMany(seed.data).then(
                        success => {
                            console.log(`Success: ${success}`);
                        },
                        failure => {
                            console.error(`Error: ${failure}`);
                        }
                    );
                }
                else 
                {
                    console.error("Invalid database model");
                }
            }
            catch (err)
            {
                console.error(`Operation failed: ${err}.`);
            }
        }
    }
}

module.exports = Seeder;