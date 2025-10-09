const TELEGRAM_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

export async function sendTelegramMessage(message) {
  if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error("BOT TOKEN atau CHAT ID belum diatur di .env");
    return;
  }

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Gagal kirim ke Telegram:", errText);
    } else {
      console.log("Pesan Telegram terkirim!");
    }
  } catch (err) {
    console.error("Error kirim Telegram:", err);
  }
}
