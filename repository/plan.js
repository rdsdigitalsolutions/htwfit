import { getCollection, closeConnection, migratePlan, cleanDocument } from '../lib/mongodb'

export async function findOne({ userId, planId }) {
    let result;

    try {
        const collection = await getCollection({name:'plans'});

        // Migrate default plans for tests
        if (process.env.NODE_ENV !== 'prod') {
            console.log('NODE_ENV:', process.env.NODE_ENV);
            const testMigration = await collection.findOne({ userId });
            if(!testMigration) await migratePlan(collection, userId);
        }

        result = cleanDocument( await collection.findOne({ userId, ...(planId && {planId}) }) || {});
        
        await closeConnection();
    } catch (e) {
        console.log(e);
    }

    return result;
}

export async function findAll({ userId }) {
    let results;

    try {
        const collection = await getCollection({name:'plans'});

        // Migrate default plans for tests
        if (process.env.NODE_ENV !== 'prod') {
            console.log('NODE_ENV:', process.env.NODE_ENV);
            const testMigration = await collection.findOne({ userId });
            if(!testMigration) await migratePlan(collection, userId);
        }

        results = await (await collection.find({ userId }).toArray() || []).map( cleanDocument );
    } catch (e) {
        console.log(e);
    }

    await closeConnection();
    return results;
}

export async function update({ userId, plan }) {
    let result;

    try {
        const collection = await getCollection({name:'plans'});
        result = await collection.updateOne( { userId, id: plan.id }, {'$set': { ...plan, userId } }, { upsert: false } );
    } catch (e) {
        console.log(e);
    }

    await closeConnection();
    return result;
}
