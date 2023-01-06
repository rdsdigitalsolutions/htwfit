import { MongoClient, ObjectId } from 'mongodb'
import { v4 as uuidv4 } from 'uuid';

const client = new MongoClient(process.env.MONGODB_URL);

export async function getCollection({ name }) {
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

export async function migrateUser(collection) {
    const data = [
        { id: uuidv4(), name: 'Test Doe', email: 'test@testing.com', password: 'rSnsw8mD5YEb', image: 'test_profile_picture.jpeg', created: (new Date()).toISOString(), update: null, deleted: null },
        { id: uuidv4(), name: 'Jhoe Doe', email: 'jhoedoe@gmail.com', password: 'rSnsw8mD5YEb', image: 'test_profile_picture.jpeg', created: (new Date()).toISOString(), update: null, deleted: null },
        { id: uuidv4(), name: 'Marie Doe', email: 'mariedoe@gmail.com', password: 'rSnsw8mD5YEb', image: 'test_profile_picture.jpeg', created: (new Date()).toISOString(), update: null, deleted: null },
    ];
    return await collection.insertMany(data);
}

export function cleanDocument(doc) {
    const {_id, ...clenDoc} = doc;
    return clenDoc;
}

export async function migratePlan(collection, userId) {
    const data = [
        {
            id: uuidv4(),
            publicUID: null,
            userId,
            personalId: '',
            locale: ['en-US'],
            lengthInWeeks: 6,
            goal: 'Burn fat and build muscle mass',
            observations: 'Make sure you eat well (do not skip meals) and exercise all required days to maximize results.',
            createdAt: (new Date()).toISOString(),
            updatedAt: null,
            terminatedAt: null,
            deletedAt: null,
            mensurements: [
                { 
                    date: (new Date()).toISOString(),
                    weight: 75.4,
                    chest: 75.4,
                    leftArm: 75.4,
                    rightArm: 75.4,
                    waist: 75.4,
                    hips: 75.4,
                    leftThigh: 75.4,
                    rightThigh: 75.4,
                    leftCalf: 75.4,
                    rightCalf: 75.4,
                },
                { 
                    date: (new Date()).toISOString(),
                    weight: 75.8,
                    chest: 74.4,
                    leftArm: 75.4,
                    rightArm: 75.4,
                    waist: 75.4,
                    hips: 75.4,
                    leftThigh: 78.4,
                    rightThigh: 75.4,
                    leftCalf: 75.4,
                    rightCalf: 62,
                }
            ],
            exercises: [
                {
                    id: uuidv4(),
                    title: 'TREINO A (PEITO/OMBRO)',
                    days: [1, 3],
                    observations: 'Som observation here.',
                    color: '#9909d1',
                    done: [ { date: (new Date()).toISOString(), duration: 60 } ],
                    training: [
                        {
                            id: uuidv4(),
                            title: 'SUPINO INCLINADO HALTERES',
                            observations: 'Cuidado com os ombros',
                            repetitions: [12, 10, 8, 8],
                            weight: [22, 24, 28, 30],
                            restPause: 60,
                            picture: '',
                            video: '',
                            done: []
                        },
                        {
                            id: uuidv4(),
                            title: 'SUPINO RETO MAQUINA',
                            observations: 'cuidado com os ombros',
                            repetitions: [10, 8, 8],
                            weight: [15, 20, 22.5],
                            restPause: 60,
                            picture: '',
                            video: '',
                            done: []
                        },
                        {
                            id: uuidv4(),
                            title: 'CRUCIFIXO MAQUINA',
                            observations: 'cuidado com os ombros',
                            repetitions: [8, 8, 8],
                            weight: [45, 50, 67],
                            restPause: 60,
                            picture: '',
                            video: '',
                            done: []
                        }
                    ],
                },
                {
                    id: uuidv4(),
                    title: 'TREINO B (COXAS/GLUTEOS)',
                    days: [2, 4],
                    weeklyGoal: 2,
                    observations: 'Some other obs here.',
                    color: '#156dc5',
                    done: [{ date: (new Date()).toISOString(), duration: 75 }],
                    training: [
                        {
                            id: uuidv4(),
                            title: 'AGACHAMENTO LIVRE',
                            observations: 'cuidado com os joelhos',
                            repetitions: [12, 10, 8, 8],
                            restPause: 5,
                            picture: '',
                            video: '',
                            weight: [],
                            done: []
                        },
                        {
                            id: uuidv4(),
                            title: 'CADEIRA EXTENSORA',
                            observations: 'Levante a ponta do pe em sua direcao.',
                            repetitions: [10, 10, 10],
                            weight: [10, 10, 10],
                            restPause: 5,
                            picture: '',
                            video: '',
                            done: []
                        },
                        {
                            id: uuidv4(),
                            title: 'MESA FLEXORA',
                            observations: 'Estique a ponta dos pes.',
                            repetitions: [10, 10, 8],
                            weight: [10, 10, 8],
                            restPause: 5,
                            picture: '',
                            video: '',
                            done: []
                        }
                    ],
                },
                {
                    id: uuidv4(),
                    title: 'TREINO C (Outra Coisa)',
                    days: [3, 5],
                    weeklyGoal: 2,
                    observations: 'Some other obs here.',
                    color: '#e9f70b',
                    done: [{ date: (new Date()).toISOString(), duration: 45 }],
                    training: [
                        {
                            id: uuidv4(),
                            title: 'AGACHAMENTO LIVRE',
                            observations: 'cuidado com os joelhos',
                            repetitions: [8, 8, 8],
                            restPause: 1,
                            picture: '',
                            video: '',
                            weight: [15, 20],
                            done: []
                        },
                        {
                            id: uuidv4(),
                            title: 'CADEIRA EXTENSORA',
                            observations: 'cuidado com os ombros',
                            repetitions: [10, 10, 10],
                            restPause: 1,
                            picture: '',
                            video: '',
                            weight: [40, 55],
                            done: []
                        },
                        {
                            id: uuidv4(),
                            title: 'CADEIRA ADULTORA',
                            observations: 'cuidado com os ombros',
                            repetitions: [10, 10, 10],
                            restPause: 1,
                            picture: '',
                            video: '',
                            weight: [40, 55],
                            done: []
                        },
                        {
                            id: uuidv4(),
                            title: 'MESA FLEXORA',
                            observations: 'cuidado com os ombros',
                            repetitions: [10, 10, 10],
                            restPause: 1,
                            picture: '',
                            video: '',
                            weight: [40, 55],
                            done: []
                        }
                    ],
                }
            ],
            foodPLan: {
                id: uuidv4(),
                goal: 'burn spare fat.',
                meals: [
                    {
                        id: uuidv4(),
                        title: '1ª Refeição',
                        ingredients: '3 Torradas com cream cheese e dois ovos mexidos',
                        time: '9:00',
                        suggestion: 'Fazer as torradas com os ovos ao mesmo tempo.',
                        done: []
                    },
                    {
                        id: uuidv4(),
                        title: '2ª Refeição - Pré Treino',
                        ingredients: '25 g whey  +20 g  colher pasta de amendoim ',
                        time: '9:00',
                        suggestion: 'Fazer as torradas com os ovos ao mesmo tempo.',
                        done: []
                    }
                ]
            }
        }
    ];
    return await collection.insertMany(data);
}
