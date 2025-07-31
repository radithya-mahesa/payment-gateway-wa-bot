import baileys from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import { pino } from 'pino'
import readline from 'readline'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { messagesHandler } from './handler.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    DisconnectReason,
} = baileys

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const askQuestion = (query) =>
    new Promise(resolve => rl.question(query, resolve))

const startSock = async () => {
    const { state, saveCreds } = await useMultiFileAuthState(join(__dirname, 'auth_info')) // otomatis akan membuat letak pemyimpanan folder session nomor bot
    const { version } = await fetchLatestBaileysVersion()

    const sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: false, //masuk ke mode pair code
        syncFullHistory: false,
        logger: pino({ level: 'silent' }) //hide log websocketnya di console 
    })

    sock.ev.on('creds.update', saveCreds)


    sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update

    if (connection === 'close') {
        const shouldReconnect = (lastDisconnect.error = Boom)?.output?.statusCode !== DisconnectReason.loggedOut
        console.log('❌ Connection closed. Reconnect:', shouldReconnect)
        if (shouldReconnect) startSock()
    } else if (connection === 'open') {
        console.log('✅ Bot connected!')
    }
})

    // integrasi handler pesan
    sock.ev.on('messages.upsert', async ({ messages }) => {
        if (!messages || messages.length === 0) return
        await messagesHandler(messages, sock)
    })

    // trigger pairing code jika belum login
    if (!sock.authState.creds?.registered) {
    const phoneNumber = await askQuestion('📱 Masukkan nomor HP (tanpa +. contoh 628xxxxxx): ')
    
    // Request pairing code
    const code = await sock.requestPairingCode(phoneNumber)

    console.log(`🔑 Pairing code: ${code}`)
    console.log(`👉 Buka WhatsApp > Linked Devices > "Link a device" > "Link with phone number instead"\nℹ️ Atau bisa juga buka lewat pesan notifikasi yang diberikan WhatsApp`)
}
}

startSock()
