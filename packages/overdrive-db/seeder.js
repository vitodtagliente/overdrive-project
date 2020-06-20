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
                    console.log(`Seeding ${seed.model.name}...`);
                    // clear the current collection
                    await seed.model.deleteAll();
                    // insert the seeds
                    const result = await seed.model.insertMany(seed.data);
                    if (result) 
                    {
                        console.log(`Success ${result}`);
                    }
                    else 
                    {
                        console.error(`Error`);
                    }
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