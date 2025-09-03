// Node.js + Express безопасный прокси для Telegram
const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();

// ЗАЩИТА И БЕЗОПАСНОСТЬ
app.use(helmet()); // Защита от распространенных уязвимостей
app.use(express.json({ limit: '10kb' })); // Ограничение размера тела запроса

// ЗАЩИТА ОТ СПАМА
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 5, // Максимум 5 запросов с одного IP
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/telegram/', limiter);

// ТОКЕНЫ ИЗ ПЕРЕМЕННЫХ СРЕДЫ (НИКОГДА НЕ В КОДЕ!)
const TELEGRAM_CONFIG = {
    BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    CHAT_ID: process.env.TELEGRAM_CHAT_ID
};

// ПРОВЕРКА КОНФИГУРАЦИИ
if (!TELEGRAM_CONFIG.BOT_TOKEN || !TELEGRAM_CONFIG.CHAT_ID) {
    console.error('❌ TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID должны быть установлены в переменных среды!');
    process.exit(1);
}

// ЗАЩИТА ОТ ПРЯМОГО ДОСТУПА
const checkReferer = (req, res, next) => {
    const referer = req.headers.referer;
    const host = req.headers.host;

    if (!referer || !referer.includes(host)) {
        return res.status(403).json({
            success: false,
            error: 'Forbidden: Direct access not allowed'
        });
    }
    next();
};

// ОСНОВНОЙ ENDPOINT
app.post('/api/telegram/send-message', checkReferer, async (req, res) => {
    try {
        const { message, parse_mode = 'HTML' } = req.body;

        // ВАЛИДАЦИЯ
        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Message is required and must be a non-empty string'
            });
        }

        if (message.length > 4096) { // Ограничение Telegram
            return res.status(400).json({
                success: false,
                error: 'Message is too long (max 4096 characters)'
            });
        }

        // ОТПРАВКА В TELEGRAM
        const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_CONFIG.BOT_TOKEN}/sendMessage`;

        const response = await axios.post(telegramUrl, {
            chat_id: TELEGRAM_CONFIG.CHAT_ID,
            text: message.trim(),
            parse_mode: parse_mode
        }, {
            timeout: 10000, // 10 секунд таймаут
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.data.ok) {
            res.json({
                success: true,
                message: 'Message sent successfully'
            });
        } else {
            console.error('Telegram API Error:', response.data);
            res.status(500).json({
                success: false,
                error: 'Failed to send message to Telegram'
            });
        }

    } catch (error) {
        console.error('Error sending message:', error.message);

        if (error.response) {
            // Ошибка от Telegram API
            res.status(error.response.status).json({
                success: false,
                error: 'Telegram API error'
            });
        } else {
            // Сетевая ошибка
            res.status(500).json({
                success: false,
                error: 'Network error'
            });
        }
    }
});

// ЗАПУСК СЕРВЕРА
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Secure Telegram proxy server running on port ${PORT}`);
    console.log('🔒 Tokens are safely stored in environment variables');
});
