import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

    if (!botToken || botToken === 'your_telegram_bot_token_here') {
      return NextResponse.json({ ok: false, error: 'Telegram not configured' }, { status: 503 });
    }
    if (!chatId || chatId === 'your_admin_chat_id_here') {
      return NextResponse.json({ ok: false, error: 'Telegram chat ID not configured' }, { status: 503 });
    }

    const body = await request.json();
    const { action, payment } = body;

    if (action !== 'new_payment' || !payment) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const message = [
      '💳 *New Payment Request*',
      '',
      `*Name:* ${payment.full_name || 'N/A'}`,
      `*Email:* ${payment.email || 'N/A'}`,
      `*Method:* ${payment.method || 'N/A'}`,
      `*Transaction ID:* \`${payment.transaction_id || 'N/A'}\``,
      `*User ID:* ${payment.user_id || 'guest'}`,
      payment.receipt_url ? `*Receipt:* ${payment.receipt_url}` : '*Receipt:* Not uploaded',
      `*Status:* ${payment.status || 'pending'}`
    ].join('\n');

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown'
      })
    });

    const data = await response.json();
    if (!response.ok || !data.ok) {
      console.error('Telegram API error:', data);
      return NextResponse.json({ ok: false, error: 'Failed to send notification' }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram route error:', error.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
