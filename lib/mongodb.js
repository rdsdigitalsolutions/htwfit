import { MongoClient, ObjectId } from 'mongodb'

const client = new MongoClient(process.env.MONGODB_URL);

export async function getCollection( { name } ) {
  await client.connect();
  const db = client.db(process.env.MONGODB_NAME);
  return db.collection(name);
}

export async function closeConnection() {
    return await client.close();
}

export async function getObjectId(stringId) {
    return new ObjectId(stringId);
}

export async function migrateUser( collection ) {
    const users = [
        { name: 'Test Doe', email: 'test@testing.com', password: 'rSnsw8mD5YEb', image: 'test_profile_picture.jpeg', created: (new Date()).toISOString(), update: null, deleted: null },
        { name: 'Jhoe Doe', email: 'jhoedoe@gmail.com', password: 'rSnsw8mD5YEb', image: 'test_profile_picture.jpeg', created: (new Date()).toISOString(), update: null, deleted: null },
        { name: 'Marie Doe', email: 'mariedoe@gmail.com', password: 'rSnsw8mD5YEb', image: 'test_profile_picture.jpeg', created: (new Date()).toISOString(), update: null, deleted: null },
    ];
    return await collection.insertMany(users);
}
