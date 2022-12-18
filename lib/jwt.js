import * as jwt from "jsonwebtoken"

export async function encode({ secret, token }) {
    return jwt.sign({ ...token, userId: token.id }, secret, {
        algorithm: "HS256",
        expiresIn: 30 * 24 * 60 * 60, // 30 days
    })
}

export async function decode({ secret, token }) {
    return jwt.verify(token, secret, { algorithms: ["HS256"] })
}
