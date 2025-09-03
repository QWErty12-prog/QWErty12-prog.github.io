// Telegram Form Handler
(function() {
    'use strict';

    // Конфигурация Telegram бота
    const TELEGRAM_CONFIG = {
        BOT_TOKEN: '8219059078:AAEJVimRB5_W5VNE0mLgCX9sjsosQVS_Enk',
        CHAT_ID: '823112689'
    }

    class TelegramFormHandler {
        constructor() {
            this.form = document.querySelector('.contact-form form');
            this.isConfigured = this.checkConfiguration();
            this.init();
        }

        // Проверка конфигурации
        checkConfiguration() {
            if (!TELEGRAM_CONFIG.BOT_TOKEN || !TELEGRAM_CONFIG.CHAT_ID) {
                console.error('❌ TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID должны быть установлены!');
                return false;
            }
            console.log('✅ Configuration check: Direct Telegram API mode');
            return true;
        }

        init() {
            console.log('🚀 Initializing TelegramFormHandler...');

            if (!this.form) {
                console.warn('❌ Contact form not found!');
                console.log('Looking for:', '.contact-form form');
                console.log('Found elements:', document.querySelectorAll('.contact-form'));
                return;
            }

            console.log('✅ Form found, adding event listeners...');

            // Add submit event listener
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
            console.log('✅ Submit event listener added');

            // Add contact method change listeners
            this.setupContactMethodHandlers();
            console.log('✅ Contact method handlers added');

            // Initialize contact field based on default selection
            this.updateContactField();
            console.log('✅ Contact field initialized');

            // Использование прямого доступа к Telegram API
            console.log('✅ Using direct Telegram API mode');
            console.log('⚠️  Tokens are visible in client-side code');

            console.log('🎉 TelegramFormHandler initialized successfully');
        }

        setupContactMethodHandlers() {
            const radioButtons = this.form.querySelectorAll('input[name="contactMethod"]');
            radioButtons.forEach(radio => {
                radio.addEventListener('change', () => {
                    this.updateContactField();
                });
            });
        }

        updateContactField() {
            const selectedMethod = this.form.querySelector('input[name="contactMethod"]:checked').value;
            const contactField = this.form.querySelector('#contact');

            if (selectedMethod === 'telegram') {
                contactField.placeholder = window.getTranslation('form-telegram');
                contactField.type = 'text';
                contactField.setAttribute('data-lang-key', 'form-telegram');
                // Update current placeholder text
                contactField.placeholder = window.getTranslation('form-telegram');
            } else if (selectedMethod === 'email') {
                contactField.placeholder = window.getTranslation('form-email');
                contactField.type = 'email';
                contactField.setAttribute('data-lang-key', 'form-email');
                // Update current placeholder text
                contactField.placeholder = window.getTranslation('form-email');
            }

            console.log(`📱 Contact method changed to: ${selectedMethod}`);
        }

        async handleSubmit(e) {
            e.preventDefault();
            console.log('📝 Form submitted, starting validation...');

            // Проверка конфигурации
            if (!this.isConfigured) {
                console.log('❌ Configuration not valid');
                this.showMessage('Telegram бот не настроен. Проверьте токены в коде.', 'error');
                return;
            }
            console.log('✅ Configuration valid, proceeding...');

            const submitBtn = this.form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            const formData = this.getFormData();

            console.log('📋 Form data:', formData);

            // Проверка обязательных полей
            if (!this.validateForm(formData)) {
                console.log('❌ Form validation failed');
                return;
            }

            console.log('✅ Form validation passed, sending to Telegram...');

            // Отключаем кнопку
            submitBtn.disabled = true;
            submitBtn.textContent = window.getTranslation('form-sending');

            try {
                const success = await this.sendToTelegram(formData);

                if (success) {
                    console.log('✅ Message sent successfully');
                    this.showMessage(window.getTranslation('form-success'), 'success');
                    this.form.reset();
                } else {
                    console.log('❌ Message sending failed');
                    this.showMessage(window.getTranslation('form-error'), 'error');
                }
            } catch (error) {
                console.error('❌ Send error:', error);
                this.showMessage(window.getTranslation('form-error'), 'error');
            } finally {
                // Восстанавливаем кнопку
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        }

        getFormData() {
            const inputs = this.form.querySelectorAll('input, textarea');
            const data = {};

            inputs.forEach(input => {
                if (input.type === 'checkbox' || input.type === 'radio') {
                    if (input.checked) {
                        data[input.name || input.id] = input.value;
                    }
                } else {
                    data[input.name || input.id] = input.value;
                }
            });

            // Add contact method information
            const contactMethod = this.form.querySelector('input[name="contactMethod"]:checked');
            if (contactMethod) {
                data.contactMethod = contactMethod.value;
            }

            return data;
        }

        validateForm(data) {
            const requiredFields = ['name', 'contact', 'message'];
            let isValid = true;

            // Validate basic required fields
            requiredFields.forEach(field => {
                const input = this.form.querySelector(`[name="${field}"], #${field}`);
                if (!data[field] || data[field].trim() === '') {
                    this.showFieldError(input, window.getTranslation('form-required'));
                    isValid = false;
                } else {
                    this.clearFieldError(input);
                }
            });

            // Additional email validation if email method is selected
            if (data.contactMethod === 'email' && data.contact) {
                if (!this.isValidEmail(data.contact)) {
                    const contactInput = this.form.querySelector('#contact');
                    this.showFieldError(contactInput, window.getTranslation('form-invalid-email'));
                    isValid = false;
                }
            }

            return isValid;
        }

        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        showFieldError(input, message) {
            if (!input) return;

            this.clearFieldError(input);

            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.textContent = message;
            errorDiv.style.cssText = `
                color: #e63946;
                font-size: 12px;
                margin-top: 5px;
                animation: fadeIn 0.3s ease;
            `;

            input.style.borderColor = '#e63946';
            input.parentNode.appendChild(errorDiv);
        }

        clearFieldError(input) {
            if (!input) return;

            input.style.borderColor = '';
            const error = input.parentNode.querySelector('.field-error');
            if (error) {
                error.remove();
            }
        }

        async sendToTelegram(data) {
            console.log('🚀 Starting to send message to Telegram...');

            const message = this.formatMessage(data);
            const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_CONFIG.BOT_TOKEN}/sendMessage`;

            console.log('📨 Sending to Telegram API:', telegramUrl);
            console.log('📨 Request data:', {
                message: message.substring(0, 100) + '...',
                parse_mode: 'HTML'
            });

            try {
                console.log('⏳ Sending request to Telegram...');
                const response = await fetch(telegramUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chat_id: TELEGRAM_CONFIG.CHAT_ID,
                        text: message,
                        parse_mode: 'HTML'
                    })
                });

                console.log('📥 Response status:', response.status);
                console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

                const result = await response.json();
                console.log('📥 Response data:', result);

                if (result.ok) {
                    console.log('✅ Message sent to Telegram successfully');
                    return true;
                } else {
                    console.error('❌ Telegram API error:', result);

                    let errorMessage = window.getTranslation('form-error');
                    if (result.description) {
                        errorMessage = `Ошибка Telegram API: ${result.description}`;
                    }

                    this.showMessage(errorMessage, 'error');
                    return false;
                }
            } catch (error) {
                console.error('❌ Network error:', error);
                console.error('❌ Error message:', error.message);
                console.error('❌ Error stack:', error.stack);
                return false;
            }
        }

        formatMessage(data) {
            const timestamp = new Date().toLocaleString('ru-RU', {
                timeZone: 'Europe/Moscow',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });

            // Format contact information based on selected method
            let contactInfo = '';
            const contactMethod = data.contactMethod;
            const contactValue = data.contact;

            if (contactMethod === 'telegram') {
                contactInfo = `📱 <b>Способ связи:</b> Telegram\n📱 <b>Контакт:</b> ${this.escapeHtml(contactValue || 'Не указан')}`;
            } else if (contactMethod === 'email') {
                contactInfo = `📧 <b>Способ связи:</b> Email\n📧 <b>Контакт:</b> ${this.escapeHtml(contactValue || 'Не указан')}`;
            }

            return `
🔔 <b>Новое сообщение с сайта!</b>

📅 <b>Дата и время:</b> ${timestamp}
👤 <b>Имя:</b> ${this.escapeHtml(data.name || 'Не указано')}
${contactInfo}
${data.subject ? `📝 <b>Тема:</b> ${this.escapeHtml(data.subject)}\n` : ''}💬 <b>Сообщение:</b>
${this.escapeHtml(data.message || 'Нет сообщения')}

━━━━━━━━━━━━━━━━━━━━━━
<i>Отправлено через форму обратной связи</i>
            `.trim();
        }

        escapeHtml(text) {
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };
            return text.replace(/[&<>"']/g, m => map[m]);
        }

        showMessage(text, type = 'info') {
            // Удаляем предыдущее сообщение
            const existingMessage = document.querySelector('.form-message');
            if (existingMessage) {
                existingMessage.remove();
            }

            // Создаем новое сообщение
            const messageDiv = document.createElement('div');
            messageDiv.className = `form-message ${type}`;
            messageDiv.textContent = text;
            messageDiv.style.cssText = `
                padding: 15px;
                margin: 15px 0;
                border-radius: 8px;
                font-weight: 500;
                text-align: center;
                animation: slideIn 0.3s ease;
                border: 1px solid;
            `;

            // Стили в зависимости от типа
            switch (type) {
                case 'success':
                    messageDiv.style.cssText += `
                        background: rgba(46, 204, 113, 0.1);
                        border-color: #2ecc71;
                        color: #27ae60;
                    `;
                    break;
                case 'error':
                    messageDiv.style.cssText += `
                        background: rgba(231, 76, 60, 0.1);
                        border-color: #e74c3c;
                        color: #c0392b;
                    `;
                    break;
                default:
                    messageDiv.style.cssText += `
                        background: rgba(52, 152, 219, 0.1);
                        border-color: #3498db;
                        color: #2980b9;
                    `;
            }

            // Вставляем перед формой
            this.form.parentNode.insertBefore(messageDiv, this.form);

            // Автоматически скрываем через 5 секунд
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.style.animation = 'slideOut 0.3s ease';
                    setTimeout(() => messageDiv.remove(), 300);
                }
            }, 5000);
        }
    }

    // Инициализация при загрузке страницы
    document.addEventListener('DOMContentLoaded', function() {
        new TelegramFormHandler();
    });

})();
