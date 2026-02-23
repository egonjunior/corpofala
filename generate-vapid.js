const crypto = require('crypto');

function encodeBase64Url(buffer) {
    return buffer.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

// Em ambiente real usa-se a biblioteca web-push.
// Para fins de dev e praticidade sem instalar pacotes globais:
const { generateKeyPairSync } = crypto;

const { publicKey, privateKey } = generateKeyPairSync('ec', {
    namedCurve: 'prime256v1',
    publicKeyEncoding: { format: 'der', type: 'spki' },
    privateKeyEncoding: { format: 'der', type: 'pkcs8' }
});

// A biblioteca web-push espera um formato específico, 
// a chave pública deve ter o prefixo 0x04 (uncompressed point format) 
// que podemos extrair a partir do DER ASN.1 da chave ECDSA (prime256v1).
// Uma abordagem muito mais simples e robusta é instalar o web-push temporariamente.
