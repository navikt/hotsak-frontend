import { exportJWK, generateKeyPair, GenerateKeyPairResult, JWK, SignJWT } from 'jose'

const alg = 'RS256'

let keyPair: GenerateKeyPairResult

export let privateJwk: JWK
export let publicJwk: JWK

export async function generateToken(
  navIdent: string = 'X123456',
  issuer: string = 'test',
  audience: string = 'test'
): Promise<string> {
  if (!keyPair) {
    keyPair = await generateKeyPair(alg)
    privateJwk = await exportJWK(keyPair.privateKey)
    publicJwk = await exportJWK(keyPair.publicKey)
    process.env.AZURE_APP_JWK = JSON.stringify(privateJwk)
  }
  return await new SignJWT({ NAVident: navIdent })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer(issuer)
    .setAudience(audience)
    .setExpirationTime('10m')
    .sign(keyPair.privateKey)
}
