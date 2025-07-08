// script.js

// Sample signals data
let signals = [
    { id: 1, pair: 'BTC/USDT', type: 'long',  entry: 43250, tp: 45800, sl: 41500, exchange: 'binance', marginMode: 'Isolated', leverage: 'x10', comment: 'Strong RSI divergence + volume breakout on 4H', source: 'CryptoKing_VIP', time: '14:32' },
    { id: 2, pair: 'ETH/USDT', type: 'short', entry: 2680,  tp: 2520, sl: 2750, exchange: 'okx',    marginMode: 'Cross',    leverage: 'x15', comment: 'Bearish flag pattern confirmed, high volume selling', source: 'TradeMaster_Pro', time: '14:15' },
    { id: 3, pair: 'SOL/USDT', type: 'long',  entry: 98.5,  tp: 106.2, sl: 93.8,  exchange: 'binance', marginMode: 'Isolated', leverage: 'x20', comment: 'Support level hold + bullish momentum building', source: 'AltcoinAlpha', time: '13:58' },
    { id: 4, pair: 'ADA/USDT', type: 'long',  entry: 0.485, tp: 0.532, sl: 0.456, exchange: 'bitget', marginMode: 'Cross',    leverage: 'x5',  comment: 'Cup & handle pattern completion expected', source: 'DeFi_Signals', time: '13:42' },
    { id: 5, pair: 'MATIC/USDT', type: 'short',entry: 0.92,  tp: 0.85,  sl: 0.97,  exchange: 'okx',    marginMode: 'Isolated', leverage: 'x12', comment: 'Double top formation + bearish divergence', source: 'TechnicalGuru', time: '13:25' },
    { id: 6, pair: 'LINK/USDT', type: 'long',  entry: 14.8,  tp: 16.5,  sl: 13.9,  exchange: 'binance', marginMode: 'Cross',    leverage: 'x8',  comment: 'Bullish pennant breakout with volume confirmation', source: 'ChainlinkPro', time: '13:08' }
];

let currentFilter = 'all';

function renderSignals() {
    const grid = document.getElementById('signalsGrid');
    const filteredSignals = signals.filter(signal => {
        if (currentFilter === 'all') return true;
        if (currentFilter === 'long' || currentFilter === 'short') {
            return signal.type === currentFilter;
        }
        if (['btc','eth','sol'].includes(currentFilter)) {
            return signal.pair.toLowerCase().startsWith(currentFilter);
        }
        if (['binance','okx','bitget'].includes(currentFilter)) {
            return signal.exchange === currentFilter;
        }
        return true;
    });

    grid.innerHTML = filteredSignals.map(signal => `
        <div class="signal-card" data-signal-id="${signal.id}">
            <div class="signal-header">
                <div class="signal-pair">⚡ ${signal.pair}
                    <span class="signal-time">🕒 ${signal.time}</span>
                </div>
                <div class="signal-type ${signal.type}">
                    ${signal.type === 'long' ? '🟢' : '🔴'} ${signal.type.toUpperCase()}
                </div>
            </div>
            <div class="signal-data">
                <div class="signal-row"><span>🎯 Entry:</span><span>${signal.entry}</span></div>
                <div class="signal-row"><span>🟢 TP:</span><span>${signal.tp}</span></div>
                <div class="signal-row"><span>🔴 SL:</span><span>${signal.sl}</span></div>
                <div class="signal-row"><span>🏢 Exchange:</span><span>${signal.exchange.toUpperCase()}</span></div>
                <div class="signal-row"><span>💼 Margin Mode:</span><span>${signal.marginMode}</span></div>
                <div class="signal-row"><span>📊 Leverage:</span><span>${signal.leverage}</span></div>
            </div>
            <div class="signal-comment">🧠 ${signal.comment}
                <span class="source-tag">src: ${signal.source}</span>
            </div>
            <div class="signal-actions">
                <button class="trade-btn" onclick="openTrade('${signal.exchange}', '${signal.pair}', '${signal.type}')">
                    🔗 TRADE ON ${signal.exchange.toUpperCase()}
                </button>
            </div>
        </div>
    `).join('');

    // Update active signals count
    document.getElementById('activeSignals').textContent = filteredSignals.length;
}

function openTrade(exchange, pair, type) {
    const utm = `?utm_source=ai_signals&utm_medium=signal&utm_campaign=${exchange}&utm_content=${pair}_${type}`;
    const exchangeUrls = {
        binance: `https://binance.com/trade/${pair.replace('/', '_')}${utm}`,
        okx:     `https://okx.com/trade-spot/${pair.toLowerCase().replace('/', '-')}${utm}`,
        bitget:  `https://bitget.com/spot/${pair.replace('/', '')}${utm}`
    };
    alert(`Opening ${exchange.toUpperCase()} for ${pair} ${type.toUpperCase()}\nURL: ${exchangeUrls[exchange]}`);
    console.log(`Trade clicked: ${exchange} | ${pair} | ${type} | UTM: ${utm}`);
}

// Теперь эти две функции доступны глобально:
function openModal() {
    document.getElementById('infoModal').style.display = 'block';
}
window.openModal = openModal;

function closeModal() {
    document.getElementById('infoModal').style.display = 'none';
}
window.closeModal = closeModal;

// Закрытие по клику вне модалки
window.addEventListener('click', event => {
    const modal = document.getElementById('infoModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

function addSignal() {
    const pair       = document.getElementById('pairInput').value;
    const type       = document.getElementById('typeInput').value;
    const entry      = parseFloat(document.getElementById('entryInput').value);
    const tp         = parseFloat(document.getElementById('tpInput').value);
    const sl         = parseFloat(document.getElementById('slInput').value);
    const exchange   = document.getElementById('exchangeInput').value;
    const marginMode = document.getElementById('marginInput').value;
    const leverage   = document.getElementById('leverageInput').value;
    const comment    = document.getElementById('commentInput').value;
    const source     = document.getElementById('sourceInput').value;

    if (!pair || !entry || !tp || !sl || !comment || !source || !leverage) {
        alert('Please fill all fields');
        return;
    }

    const newSignal = {
        id: signals.length + 1,
        pair: pair.toUpperCase(),
        type, entry, tp, sl,
        exchange, marginMode,
        leverage: leverage.startsWith('x') ? leverage : 'x' + leverage,
        comment, source,
        time: new Date().toLocaleTimeString('en-US', {hour12: false, hour:'2-digit', minute:'2-digit'})
    };

    signals.unshift(newSignal);
    renderSignals();
    document.getElementById('totalSignals').textContent = signals.length;

    // Очистка формы
    ['pairInput','entryInput','tpInput','slInput','leverageInput','commentInput','sourceInput']
        .forEach(id => document.getElementById(id).value = '');

    alert('Signal added successfully!');
}

// Фильтрация
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderSignals();
    });
});

// Авто-обновление имитация
setInterval(() => {
    const activeCount = document.getElementById('activeSignals');
    activeCount.textContent = parseInt(activeCount.textContent)
        + Math.floor(Math.random() * 3) - 1;
    const usersOnline = document.getElementById('onlineUsers');
    usersOnline.textContent = (
        parseInt(usersOnline.textContent.replace(',', ''))
        + Math.floor(Math.random() * 20) - 10
    ).toLocaleString();
}, 5000);

// Инициализация
renderSignals();

// Лог AI-агента (необязательно)
setTimeout(() => {
    console.log('🤖 AI Agent: New signals detected');
    console.log('📊 Processing through GPT-4 filter...');
    console.log('✅ 2 new high-quality signals added');
}, 3000);

/* для модалки */
function openModal() {
  // вместо display = 'block' — используем 'flex'
  document.getElementById('infoModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('infoModal').style.display = 'none';
}

// Bonus Modal Logic
const bonusModal      = document.getElementById('bonusModal');
const bonusTitleEl    = document.getElementById('bonus-modal-title');
const exchangeNameEls = document.querySelectorAll('#modal-exchange-name, #modal-exchange-name-2');
const bonusAmountEl   = document.getElementById('modal-bonus-amount');
const bonusClaimLink  = document.getElementById('bonus-modal-claim');

// Открытие модалки по клику на любую кнопку-бонус
document.querySelectorAll('.get-bonus-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    const ex  = btn.dataset.exchange;
    const amt = btn.dataset.bonus;
    const url = btn.dataset.referral;

    bonusTitleEl.innerText = `🎁 Get up to $${amt} for free — start in 3 easy steps`;
    exchangeNameEls.forEach(el => el.innerText = ex);
    bonusAmountEl.innerText  = amt;
    bonusClaimLink.href      = url;

    bonusModal.classList.add('show');
  });
});

// Закрытие модалки
function closeBonusModal() {
  bonusModal.classList.remove('show');
}
// Клик по фону тоже закрывает
bonusModal.addEventListener('click', e => {
  if (e.target === bonusModal) closeBonusModal();
});

const layers = document.querySelector('.layers');
layers.addEventListener('mouseenter', () => layers.setAttribute('data-hovered', 'true'));
layers.addEventListener('mouseleave', () => layers.removeAttribute('data-hovered'));

const btn = document.querySelector('.explode-btn');
btn.addEventListener('click', () => {
  layers.toggleAttribute('data-exploded');
});

// для контекстного меню
const menu = document.querySelector('.context-menu');
document.querySelector('.menu-toggle').addEventListener('click', () => {
  menu.classList.toggle('open');
});

