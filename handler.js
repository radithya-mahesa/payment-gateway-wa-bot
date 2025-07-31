import axios from 'axios'
import "dotenv/config"
import { PREFIX } from './config.js'

export const messagesHandler = async (messages, sock) => {
    const msg = messages.messages?.[0] || messages[0]
    if (!msg?.message || msg.key.fromMe) return

    const sender = msg.key.remoteJid

    // fungsi untuk mencegah bot berinteraksi di grup 
    if (sender.endsWith('@g.us')) return

    const text =
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        ''

    //   console.log(`📩 ${sender} >> ${text}`) --> debug

    // fungsi untuk validasi prefix
    if (!text.startsWith(PREFIX)) return

    // menambahkan prefik secara dinamis dari ./config.js
    const commandBody = text.slice(PREFIX.length).trim()
    const [command, ...args] = commandBody.split(/\s+/)

    //tempat daftar command untuk berinteraksi
    switch (command.toLowerCase()) {
        case 'topup':
            if (args.length < 2) {
                await sock.sendMessage(sender, {
                    text: `❌ Format salah.
Gunakan: !topup <nominal_id> <account_id>
> @topupduku.id`
                })
                return
            }

            const [nominal_id, account_id] = args
            //record nomor wa customer
            const whatsapp_number = sender
            .replace('@s.whatsapp.net', '')
            .replace('@c.us', '') //

            try {
                // hit API Payment Gateway nya
                const res = await axios.post(
                    process.env.PAYMENT_GATEWAY,
                    {
                        // payload API
                        nominal_id: Number(nominal_id),
                        account_id,
                        whatsapp_number
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json'
                        }
                    }
                )

                const resData = res.data

                // fungsi untuk validasi ID Akun
                if (!resData.success) {
                    await sock.sendMessage(sender, {
                        text: `❌ Gagal melakukan transaksi:\n*ID Duku tidak ditemukan!*`
                    })
                    return
                }

                const data = res.data?.data
                const base64Data = data.qr_image_url.replace(/^data:image\/\w+;base64,/, '')
                const buffer = Buffer.from(base64Data, 'base64')

                await sock.sendMessage(sender, {
                    image: buffer,
                    caption: `✅ Transaksi dibuat!

🧾 Produk: ${data.product_name}
💰 Nominal: ${data.coin_amount}
💸 Total bayar: Rp${data.total_amount.toLocaleString()}
⏳ Expired: ${data.expired_at}
📎 Invoice: ${data.merchant_ref}

*Silakan scan QR di atas untuk pembayaran.*

> ©Topupduku.id`
                })
            } catch (err) {
                console.error('❌ API error:', err.message)
                await sock.sendMessage(sender, {
                    text: `❌ Maaf, gagal membuat transaksi. Silakan coba lagi atau hubungi kami jika ada kendala.
> https://topupduku.id/kontak`
                })
            }
            break

        default:
            await sock.sendMessage(sender, {
                text: `❌ Perintah tidak dikenal: ${command}\n\nKetik *!topup <nominal_id> <account_id>* untuk melakukan topup.`
            })
            break
    }
}
