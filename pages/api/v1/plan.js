import { getSession } from "next-auth/react";
import { findOne, update } from '../../../repository/plan'

export default async function handler(req, res) {
    const session = await getSession({ req });

    if (!session) {
        res.status(401).json({ error: "You must be signed in to view the protected content on this page." });
        return;
    }

    switch (req.method.toUpperCase()) {
        case 'GET':
            await handleGet(req, res, session);
            break;
        case 'PUT':
            await handlePut(req, res, session);
            break;

        default:
            res.status(400).json({ error: 'Invalid request Method!' });
            break;
    }
}

const handleGet = async (req, res, session) => {
    const results = await findOne({ userId: session.user.id, planId: req.query.planid });
    res.status(200).json(results || {});
}

const handlePut = async (req, res, session) => {
    const results = await update({ userId: session.user.id, plan: req.body });
    res.status(200).json(results || {});
}