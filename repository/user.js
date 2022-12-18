import { getCollection, closeConnection, migrateUser, getObjectId } from '../lib/mongodb'

export async function findOne({ id, email, password }) {
    let result;

    try {
        const users = await getCollection({name:'users'});

        // Migrate default users for tests
        if (process.env.NODE_ENV !== 'prod') {
            await migrateUser(users);
        }

        result = await users.findOne( id ? { _id: getObjectId(id) } : {email, password});
        await closeConnection();
    } catch (e) {
        console.log(e);
    }

    return result;
}
