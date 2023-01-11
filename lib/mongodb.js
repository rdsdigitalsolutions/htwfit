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
        startedAt: moment().format(),
        updatedAt: null,
        terminatedAt: null,
        deletedAt: null,
        mensurements: [],
        ongoingSession: null,
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
                        observations: 'Prenda bem os joelhos e estique as costas',
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

const rafaelUserPlan = (userId) => [
    {
        id: uuidv4(),
        publicUID: null,
        userId,
        personalId: '',
        locale: ['pt-BR'],
        lengthInWeeks: 3,
        goal: 'Diminuir % de gordura / HIPERTROFIA',
        observations: 'Beba ao menos 3L de agua ao dia (todos os dias) e siga esse plano ao maximo que puder',
        createdAt: moment().format(),
        startedAt: moment().format(),
        updatedAt: null,
        terminatedAt: null,
        deletedAt: null,
        mensurements: [],
        ongoingSession: null,
        exercises: [
            {
                id: uuidv4(),
                title: 'PEITO/OMBRO FRONTAL',
                days: [1],
                observations: 'Na execuçāo fique atento a velocidade para melhores resultados',
                color: '#2c4c3b',
                done: [],
                training: [
                    {
                        id: uuidv4(),
                        title: 'SUPINO INCLINADO HALTERES',
                        observations: 'Lembre-se de elevar os alteres rapido e segurar a decida',
                        repetitions: [8,8,8],
                        weight: [30],
                        restPause: 60,
                        picture: '',
                        video: '',
                        done: []
                    },
                    {
                        id: uuidv4(),
                        title: 'SUPINO RETO MAQUINA',
                        observations: 'Lembre-se de elevar os alteres rapido e segurar a decida',
                        repetitions: [8,8,8],
                        weight: [57.5],
                        restPause: 60,
                        picture: '',
                        video: '',
                        done: []
                    },
                    {
                        id: uuidv4(),
                        title: 'CRUCIFIXO MAQUINA',
                        observations: 'Aperte bem o peito ao realizar o exercicio',
                        repetitions: [8,8,8],
                        weight: [80],
                        restPause: 60,
                        picture: '',
                        video: '',
                        done: []
                    },
                    {
                        id: uuidv4(),
                        title: 'ELEVACÃO FRONTAL SUPINADA HALTERES INCLINADO',
                        observations: 'Ao baixar os pesos nao descanse of braços dando mais cadencia ao movimento',
                        repetitions: [8,8,8],
                        weight: [6,8],
                        restPause: 60,
                        picture: '',
                        video: '',
                        done: []
                    },
                    {
                        id: uuidv4(),
                        title: 'ELEVACAO FRONTAL PRONADA HALTERES',
                        observations: 'Baixe bem devagar os pesos resistindo a força',
                        repetitions: [8,8,8],
                        weight: [6,8],
                        restPause: 60,
                        picture: '',
                        video: '',
                        done: []
                    },
                    {
                        id: uuidv4(),
                        title: '20 min Esterira',
                        observations: '',
                        repetitions: [1],
                        weight: [],
                        restPause: 1,
                        picture: '',
                        video: '',
                        done: []
                    }
                ],
            },
            {
                id: uuidv4(),
                title: 'PEITO/OMBRO LATERAL',
                days: [4],
                observations: 'Na execuçāo fique atento a velocidade para melhores resultados',
                color: '#2c4c3b',
                done: [],
                training: [
                    {
                        id: uuidv4(),
                        title: 'SUPINO INCLINADO HALTERES',
                        observations: 'Lembre-se de elevar os alteres rapido e segurar a decida',
                        repetitions: [8,8,8],
                        weight: [30],
                        restPause: 60,
                        picture: '',
                        video: '',
                        done: []
                    },
                    {
                        id: uuidv4(),
                        title: 'SUPINO RETO MAQUINA',
                        observations: 'Lembre-se de elevar os alteres rapido e segurar a decida',
                        repetitions: [8,8,8],
                        weight: [57.5],
                        restPause: 60,
                        picture: '',
                        video: '',
                        done: []
                    },
                    {
                        id: uuidv4(),
                        title: 'CRUCIFIXO MAQUINA',
                        observations: 'Aperte bem o peito ao realizar o exercicio',
                        repetitions: [8,8,8],
                        weight: [80],
                        restPause: 60,
                        picture: '',
                        video: '',
                        done: []
                    },
                    {
                        id: uuidv4(),
                        title: 'ELEVACÃO LATERAL MAQUINA',
                        observations: 'Nāo subir o trapezio durante o movimento',
                        repetitions: [10,10,8,8],
                        weight: [],
                        restPause: 60,
                        picture: '',
                        video: '',
                        done: []
                    },
                    {
                        id: uuidv4(),
                        title: 'REMADA ALTA PEGADA AFASTADA PULLEY',
                        observations: 'Baixe bem devagar resistindo a força',
                        repetitions: [12,10,8,8],
                        weight: [],
                        restPause: 60,
                        picture: '',
                        video: '',
                        done: []
                    },
                    {
                        id: uuidv4(),
                        title: '20 min Esterira',
                        observations: '',
                        repetitions: [1],
                        weight: [],
                        restPause: 1,
                        picture: '',
                        video: '',
                        done: []
                    }
                ],
            },
            {
                id: uuidv4(),
                title: 'COXAS/GLUTEOS',
                days: [2],
                observations: 'Na execuçāo fique atento a velocidade para melhores resultados',
                color: '#5132A9',
                done: [],
                training: [
                    {
                        id: uuidv4(),
                        title: 'AGACHAMENTO LIVRE',
                        observations: 'Cuidado com os joelhos e mantenha-os afastados',
                        repetitions: [8, 8, 8],
                        restPause: 60,
                        picture: '',
                        video: '',
                        weight: [20],
                        done: []
                    },
                    {
                        id: uuidv4(),
                        title: 'CADEIRA EXTENSORA',
                        observations: 'Levante a ponta do pe em sua direcao',
                        repetitions: [10, 10, 10],
                        weight: [10],
                        restPause: 60,
                        picture: '',
                        video: '',
                        done: []
                    },
                    {
                        id: uuidv4(),
                        title: 'MESA FLEXORA',
                        observations: 'Estique a ponta dos pes durante a execuçāo',
                        repetitions: [10, 10, 8],
                        weight: [42.5],
                        restPause: 60,
                        picture: '',
                        video: '',
                        done: []
                    },
                    {
                        id: uuidv4(),
                        title: 'AFUNDO NA BARRA GUIADA',
                        observations: '',
                        repetitions: [10, 8, 8],
                        weight: [10],
                        restPause: 60,
                        picture: '',
                        video: '',
                        done: []
                    },
                    {
                        id: uuidv4(),
                        title: 'HACK PES UNIDOS',
                        observations: '',
                        repetitions: [10, 10,10],
                        weight: [40],
                        restPause: 60,
                        picture: '',
                        video: '',
                        done: []
                    },
                    {
                        id: uuidv4(),
                        title: 'Panturrilhas Gêmeos em pé',
                        observations: '',
                        repetitions: [12,12,12,12],
                        weight: [],
                        restPause: 60,
                        picture: '',
                        video: '',
                        done: []
                    },
                    {
                        id: uuidv4(),
                        title: 'Abdominal cross over',
                        observations: '',
                        repetitions: [15,15,15,15,15,15],
                        weight: [38],
                        restPause: 60,
                        picture: '',
                        video: '',
                        done: []
                    }
                ],
            },
            {
                id: uuidv4(),
                title: 'COSTAS/TRAPÉZIO',
                days: [3,0],
                observations: 'Na execuçāo fique atento a velocidade para melhores resultados',
                color: '#2c4c3b',
                done: [],
                training: [
                    {
                        id: uuidv4(),
                        title: 'PUXADA ARTICULADA MAQUINA',
                        observations: 'Prenda bem os pes e estique as costas',
                        repetitions: [8,8,8],
                        restPause: 60,
                        picture: '',
                        video: '',
                        weight: [70],
                        done: []
                    },
                    {
                        id: uuidv4(),
                        title: 'REMADA CAVALINHO',
                        observations: 'Mantenha o peito alto e olhe para baixo evitando forçar as costas',
                        repetitions: [8,8,8],
                        restPause: 60,
                        picture: '',
                        video: '',
                        weight: [60],
                        done: []
                    },
                    {
                        id: uuidv4(),
                        title: 'SERROTE',
                        observations: 'Olhe para baixo evitando forçar as costas',
                        repetitions: [8,8,8],
                        restPause: 60,
                        picture: '',
                        video: '',
                        weight: [22,28,30],
                        done: []
                    },
                    {
                        id: uuidv4(),
                        title: 'REMADA PRONADA ABERTA',
                        observations: 'Olhe para frente evitando forçar as costas',
                        repetitions: [10,10,10],
                        restPause: 60,
                        picture: '',
                        video: '',
                        weight: [63],
                        done: []
                    },
                    {
                        id: uuidv4(),
                        title: 'POLIA ALTA CORDA',
                        observations: 'Mantenha o cotovelo alto durante a execuçāo',
                        repetitions: [10,10,8],
                        restPause: 60,
                        picture: '',
                        video: '',
                        weight: [31],
                        done: []
                    },
                    {
                        id: uuidv4(),
                        title: 'ENCOLHIMENTO HALTERES',
                        observations: 'Olhe para frente evitando forçar as costas',
                        repetitions: [12, 12, 12],
                        restPause: 60,
                        picture: '',
                        video: '',
                        weight: [32],
                        done: []
                    },
                    {
                        id: uuidv4(),
                        title: '20 min Esterira',
                        observations: '',
                        repetitions: [1],
                        weight: [],
                        restPause: 1,
                        picture: '',
                        video: '',
                        done: []
                    }
                ],
            },
            {
                id: uuidv4(),
                title: 'bíceps/tríceps',
                days: [5],
                observations: 'Na execuçāo fique atento a velocidade para melhores resultados',
                color: '#560d0d',
                done: [],
                training: [
                    {
                        id: uuidv4(),
                        title: 'Rosca máquina',
                        observations: '',
                        repetitions: [8,8,8],
                        weight: [60],
                        restPause: 60,
                        picture: '',
                        video: '',
                        done: []
                    },
                    {
                        id: uuidv4(),
                        title: 'Rosca concentrada',
                        observations: '',
                        repetitions: [8,8,8],
                        weight: [14],
                        restPause: 60,
                        picture: '',
                        video: '',
                        done: []
                    },
                    {
                        id: uuidv4(),
                        title: 'Rosca pulley',
                        observations: '',
                        repetitions: [8,8,8],
                        weight: [24.5],
                        restPause: 60,
                        picture: '',
                        video: '',
                        done: []
                    },
                    {
                        id: uuidv4(),
                        title: 'Triceps polia corda',
                        observations: '',
                        repetitions: [8,8,8],
                        weight: [28],
                        restPause: 60,
                        picture: '',
                        video: '',
                        done: []
                    },
                    {
                        id: uuidv4(),
                        title: 'Triceps francês alternado halteres',
                        observations: '',
                        repetitions: [8,8,8],
                        weight: [12],
                        restPause: 60,
                        picture: '',
                        video: '',
                        done: []
                    },
                    {
                        id: uuidv4(),
                        title: 'Triceps coice',
                        observations: '',
                        repetitions: [8,8,8],
                        weight: [10],
                        restPause: 60,
                        picture: '',
                        video: '',
                        done: []
                    },
                    {
                        id: uuidv4(),
                        title: 'Abdominal cross over',
                        observations: '',
                        repetitions: [15,15,15,15,15,15],
                        weight: [38],
                        restPause: 60,
                        picture: '',
                        video: '',
                        done: []
                    },
                    {
                        id: uuidv4(),
                        title: '20 min Esterira',
                        observations: '',
                        repetitions: [1],
                        weight: [],
                        restPause: 1,
                        picture: '',
                        video: '',
                        done: []
                    }
                ],
            },
        ],
        foodPlan: {
            goal: 'Melhorar alimentaçāo e perder peso e criar massa',
            meals: [
                {
                    id: uuidv4(),
                    title: '1ª Refeição - Cafe da manha',
                    ingredients: '4 torradas com cream cheese light + dois ovos mexidos + duas claras',
                    time: '6.45',
                    suggestion: 'Torradas zero açucar e cream cheese zero lactose',
                    done: []
                },
                {
                    id: uuidv4(),
                    title: '2ª Refeição - Pré Treino',
                    ingredients: '25g whey protein + 20g (colher de sopa) de pasta de amendoim',
                    time: '9',
                    suggestion: 'Bater a pasta de amendoim com o whey e agua gelada para facilitar a digestāo',
                    done: []
                },
                {
                    id: uuidv4(),
                    title: '3ª Refeição - Almoço',
                    ingredients: '180g de arroz + 100g de proteina (patinho, frango, etc) + 50g ervilha + suco de abacaxi + 5g creatina',
                    time: '12',
                    suggestion: 'Prefira carnes magras e sucos sem açucar',
                    done: []
                },
                {
                    id: uuidv4(),
                    title: '4ª Refeição - Lanche',
                    ingredients: '2 torradas + 2 ovos',
                    time: '15',
                    suggestion: 'Torradas zero açucar',
                    done: []
                },
                {
                    id: uuidv4(),
                    title: '5ª Refeição - Jantar',
                    ingredients: '180g de arroz + 100g de proteina (patinho, frango, etc)',
                    time: '18',
                    suggestion: 'Prefira carnes magras e sucos sem açucar',
                    done: []
                },
                {
                    id: uuidv4(),
                    title: '6ª Refeição - Ceia',
                    ingredients: '25g whey protein + 3 castanhas/nozes',
                    time: '20.30',
                    suggestion: '',
                    done: []
                }
            ]
        }
    }
]

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
        { id: uuidv4(), name: 'Rafael Souza', email: 'rafael@test.com', password: '$2b$10$PPb6s30Ft6QzCrE5UTpn7ONPBBoCua345hiiA7tCm0AABCOV9UShG', image: 'test_profile_picture.jpeg', created: moment().format(), update: null, deleted: null },
        { id: uuidv4(), name: 'Paula Trefilgio', email: 'paula@test.com', password: '$2b$10$VRbdKjPuJX6qQ/l5LXYSlexm3eqyVeHsZAqNvjVbR932ZgDOrtRFu', image: 'test_profile_picture.jpeg', created: moment().format(), update: null, deleted: null },
        { id: uuidv4(), name: 'Fausto Filho', email: 'fausto@test.com', password: '$2b$10$pnPr1ldHQV56FFCSJJKb1eXZL5twXFrc6ZU6eqm3Xjcyv2Cn.3iTu', image: 'test_profile_picture.jpeg', created: moment().format(), update: null, deleted: null },
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
        case 'fausto@test.com':
            return await collection.insertMany(rafaelUserPlan(userId));
        default:
            return await collection.insertMany(demoUserPlan(userId));
    }
}
