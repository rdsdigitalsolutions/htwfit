import { MongoClient, ObjectId } from 'mongodb'
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

const client = new MongoClient(process.env.MONGODB_URL);

const demoUserPlan = (userId) => [
    {
        id: uuidv4(),
        publicUID: null,
        userId,
        personalId: '',
        locale: ['pt-BR'],
        lengthInWeeks: 6,
        goal: 'Queimar gordura localizada sem perder massa magra',
        observations: 'Beba ao menos 3L de agua ao dia (todos os dias) e siga esse plano ao maximo que puder',
        createdAt: moment().format(),
        updatedAt: null,
        terminatedAt: null,
        deletedAt: null,
        mensurements: [],
        exercises: [
            {
                id: uuidv4(),
                title: 'TREINO A (PEITO/OMBRO)',
                days: [1, 3],
                observations: 'Na execuçāo fique atento a velocidade para melhores resultados',
                color: '#2c4c3b',
                done: [],
                training: [
                    {
                        id: uuidv4(),
                        title: 'SUPINO INCLINADO HALTERES',
                        observations: 'Lembre-se de elevar os alteres rapido e segurar a decida',
                        repetitions: [12, 12, 12],
                        weight: [12],
                        restPause: 60,
                        picture: '',
                        video: '',
                        done: []
                    },
                    {
                        id: uuidv4(),
                        title: 'SUPINO RETO MAQUINA',
                        observations: 'Lembre-se de elevar os alteres rapido e segurar a decida',
                        repetitions: [12, 10, 10],
                        weight: [10],
                        restPause: 60,
                        picture: '',
                        video: '',
                        done: []
                    },
                    {
                        id: uuidv4(),
                        title: 'CRUCIFIXO MAQUINA',
                        observations: 'Aperte bem o peito ao realizar o exercicio',
                        repetitions: [12, 12, 12],
                        weight: [20],
                        restPause: 60,
                        picture: '',
                        video: '',
                        done: []
                    },
                    {
                        id: uuidv4(),
                        title: 'ELEVACÃO FRONTAL COM HALTERES',
                        observations: 'Foque no movimento correto sem correr de mais para executar.',
                        repetitions: [12, 12, 12],
                        weight: [5],
                        restPause: 45,
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
                observations: 'Na execuçāo fique atento a velocidade para melhores resultados',
                color: '#5132A9',
                done: [{ date: moment().format(), duration: 75 }],
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
                title: 'TREINO C (COSTAS/TRAPÉZIO)',
                days: [3, 5],
                observations: 'Na execuçāo fique atento a velocidade para melhores resultados',
                color: '#2c4c3b',
                done: [{ date: moment().subtract(1, 'd').format(), duration: 45 }],
                training: [
                    {
                        id: uuidv4(),
                        title: 'PUXADA ARTICULADA MAQUINA',
                        observations: 'Penda bem os joelhos e estique as costas',
                        repetitions: [12, 12, 12],
                        restPause: 2,
                        picture: '',
                        video: '',
                        weight: [10],
                        done: []
                    },
                    {
                        id: uuidv4(),
                        title: 'POLIA ALTA CORDA',
                        observations: 'Extenda completamente os braços para melhorar o movimento',
                        repetitions: [10, 10, 10],
                        restPause: 2,
                        picture: '',
                        video: '',
                        weight: [10],
                        done: []
                    },
                ],
            }
        ],
        foodPlan: {
            goal: 'Melhorar alimentaçāo e perder peso',
            meals: [
                {
                    id: uuidv4(),
                    title: '1ª Refeição - Cafe da manha',
                    ingredients: '3 Torradas com cream cheese e dois ovos mexidos',
                    time: '6.15',
                    suggestion: 'Torradas zero açucar e cream cheese zero lactose',
                    done: [moment().format()]
                },
                {
                    id: uuidv4(),
                    title: '2ª Refeição - Pré Treino',
                    ingredients: '25g whey protein + 20g (colher de sopa) de pasta de amendoim',
                    time: '8.45',
                    suggestion: 'Bater a pasta de amendoim com o whey e agua gelada para facilitar a digestāo',
                    done: [moment().subtract(1, 'd').format()]
                }
                ,
                {
                    id: uuidv4(),
                    title: '3ª Refeição - Jantar',
                    ingredients: '100g de arroz + 80g de proteina (patinho, frango, etc) + suco natural',
                    time: '23.45',
                    suggestion: 'Prefira carnes magras e sucos sem muito açucar',
                    done: [moment().subtract(3, 'd').format(), moment().subtract(2, 'd').format(), moment().subtract(1, 'd').format()]
                }
            ]
        }
    }
];

const rafaelUserPlan = (userId) => []

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
        { id: uuidv4(), name: 'Demonstration', email: 'test@test.com', password: '$2b$10$vkbEXo5GfdhxsnhnGaB1peq22PLyODIeEaNlJ9K46lWRhtCY.Pq6m', image: 'test_profile_picture.jpeg', created: moment().format(), update: null, deleted: null },
        { id: uuidv4(), name: 'Rafael Souza', email: 'rafael@test.com', password: '$2b$10$PLRJZ3okg/t8UxC9BlOW2Oru0b3UsTEqFCY3QyFtizySn1kL6KOD2', image: 'test_profile_picture.jpeg', created: moment().format(), update: null, deleted: null },
        { id: uuidv4(), name: 'Paula Trefilgio', email: 'paula@test.com', password: '$2b$10$VRbdKjPuJX6qQ/l5LXYSlexm3eqyVeHsZAqNvjVbR932ZgDOrtRFu', image: 'test_profile_picture.jpeg', created: moment().format(), update: null, deleted: null },
        { id: uuidv4(), name: 'Pessoa 1', email: 'pessoa1@test.com', password: '$2b$10$ZLng2su1599i/LLaxnna6uTvDtjdpDNcEc9seZUZ0d8vz62I0/qAS', image: 'test_profile_picture.jpeg', created: moment().format(), update: null, deleted: null },
        { id: uuidv4(), name: 'Pessoa 2', email: 'pessoa2@test.com', password: '$2b$10$YHho3MW2pEXWBvu/S7Ya9OpfFMNnCJ5/UtB.YF2sMLfO/M6tcKfXe', image: 'test_profile_picture.jpeg', created: moment().format(), update: null, deleted: null },
        { id: uuidv4(), name: 'Pessoa 3', email: 'pessoa3@test.com', password: '$2b$10$0H8EWt48mO1KvUyX//pxfeaO6ymYxHc9v3onnzHNPmmbuMof2YAZ2', image: 'test_profile_picture.jpeg', created: moment().format(), update: null, deleted: null },
        { id: uuidv4(), name: 'Pessoa 4', email: 'pessoa4@test.com', password: '$2b$10$CIvPq/ilaEHy1no/YVzREeB5FsKlmTsZx1jOBq5asoedt2KtbcA1q', image: 'test_profile_picture.jpeg', created: moment().format(), update: null, deleted: null },
    ];
    return await collection.insertMany(data);
}

export function cleanDocument(doc) {
    const {_id, ...clenDoc} = doc;
    return clenDoc;
}

export async function migratePlan(collection, userId) {
    const currentUser = await (await getCollection({name: 'users'})).findOne({ id: userId });

    switch (currentUser.email) {
        case 'rafael@test.com':
            return await collection.insertMany(rafaelUserPlan(userId));
        default:
            return await collection.insertMany(demoUserPlan(userId));
    }
}
