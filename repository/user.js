import { getCollection, closeConnection, migrateUser } from '../lib/mongodb'

export async function findOne({ id, email }) {
    let result;

    try {
        const collection = await getCollection({name:'users'});
        
        // Migrate default users for tests
        if (process.env.NODE_ENV !== 'prod') {
            const testMigration = await collection.findOne({ update: null });
            if(!testMigration) await migrateUser(collection);
        }

        result = await collection.findOne( id ? { id } : {email});
        await closeConnection();
    } catch (e) {
        console.log(e);
    }

    return result;
}
