import { SignJWT, jwtVerify } from 'jose'

const secretKey = process.env.JWT_SECRET || 'fallback-secret-key-change-in-prod'
const key = new TextEncoder().encode(secretKey)

export async function signToken(payload: any) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('2h')
        .sign(key)
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, key, {
            algorithms: ['HS256'],
        })
        return payload
    } catch (error) {
        return null
    }
}
