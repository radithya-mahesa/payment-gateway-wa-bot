const sendTopupList = async (sock, jid) => {
    try {
        const res = await fetch('https://api.example.com/list-produk')
        const data = await res.json()

        let message = '📦 *Daftar Produk Topup:*\n'
        data.forEach((item, i) => {
            message += `${i + 1}. ${item.nama} (id: ${item.id})\n`
        })

        await sock.sendMessage(jid, { text: message })
    } catch (err) {
        await sock.sendMessage(jid, { text: '❌ Gagal mengambil data produk.' })
        console.error(err)
    }
}

const sendTopupPackages = async (sock, jid, productId) => {
    try {
        const res = await fetch(`https://api.example.com/paket?product=${productId}`)
        const data = await res.json()

        let message = `📦 *Paket untuk Produk ID ${productId}:*\n`
        data.forEach((paket, i) => {
            message += `Paket ${i + 1} (${paket.id})\n${paket.jumlah} = Rp${paket.harga}\n\n`
        })

        await sock.sendMessage(jid, { text: message })
    } catch (err) {
        await sock.sendMessage(jid, { text: '❌ Gagal mengambil data paket.' })
        console.error(err)
    }
}

const handleTopup = async (sock, jid, product, paket, userId) => {
    try {
        const res = await fetch('https://api.example.com/topup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product, paket, user_id: userId })
        })

        const data = await res.json()

        if (data.status === 'ok') {
            await sock.sendMessage(jid, {
                image: { url: data.qr_image_url },
                caption: '✅ Silakan scan QR di atas untuk pembayaran.\nStatus akan dikirim setelah pembayaran berhasil.'
            })
        } else {
            await sock.sendMessage(jid, { text: `❌ Gagal topup: ${data.message}` })
        }
    } catch (err) {
        await sock.sendMessage(jid, { text: '❌ Error saat memproses topup.' })
        console.error(err)
    }
}
