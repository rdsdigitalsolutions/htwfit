import { getSession } from "next-auth/react";
import { findOne, update } from '../../../repository/user'

export default async function handler(req, res) {
    const session = await getSession({ req });

    if (!session) {
        res.status(401).json({ error: "You must be signed in to view the protected content on this page." });
        return;
    }

    switch (req.method) {
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
    const results = await findOne({ id: session.user.id });
    res.status(200).json(results || {});
}

const handlePut = async (req, res, session) => {
    if ((req.body.newPassword || req.body.confirmPassword) && req.body.newPassword !== req.body.confirmPassword) {
        res.status(401).json({ error: t('errors_paswrod_mismatch') });
        return;
    }

    if ((req.body.newPassword || req.body.confirmPassword) && !req.body.currentPassword) {
        res.status(401).json({ error: t('errors_missing_current_password') });
        return;
    }

    const results = await update({ id: session.user.id, changes: req.body });
    res.status(200).json(results || {});
}