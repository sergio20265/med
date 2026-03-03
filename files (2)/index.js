require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const Groq = require("groq-sdk");
const { MOODS, DEFAULT_MOOD, AUTO_MOOD_INTERVAL } = require("./moods");
const { getUserPromptSection, findUser } = require("./users");
const { addUserFact, addChatFact, getMemoryPrompt, clearChatMemory, getMemorySummary } = require("./memory");

// ─── Инициализация ───────────────────────────────────────────────────────────

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const BOT_USERNAME = process.env.BOT_USERNAME.toLowerCase();
const ADMIN_ID = parseInt(process.env.ADMIN_USER_ID);

const activeGroups = new Set();
const activeThreads = {}; // chatId -> Set<threadId|null>
const groupMembers = {};

// ─── Блокировка веток ─────────────────────────────────────────────────────────

// Названия веток, в которых бот молчит (нижний регистр)
const BLOCKED_TOPIC_NAMES = new Set(["истеричечная"]);

const threadNames = {};    // { chatId: { threadId: name } } — имена топиков
const blockedThreadIds = new Set(); // "chatId:threadId" — заблокированные вручную

function isThreadBlocked(chatId, threadId) {
  if (!threadId) return false;
  if (blockedThreadIds.has(`${chatId}:${threadId}`)) return true;
  const name = threadNames[chatId]?.[threadId];
  return name ? BLOCKED_TOPIC_NAMES.has(name.toLowerCase()) : false;
}

// ─── Состояние ───────────────────────────────────────────────────────────────

let currentMood = DEFAULT_MOOD;

// ─── Модели ──────────────────────────────────────────────────────────────────

const MODELS = {
  llama70b:    { id: "llama-3.3-70b-versatile",                      label: "Llama 3.3 70B",     desc: "умная, основная" },
  llama8b:     { id: "llama-3.1-8b-instant",                         label: "Llama 3.1 8B",      desc: "быстрая, лёгкая" },
  llama4scout: { id: "meta-llama/llama-4-scout-17b-16e-instruct",    label: "Llama 4 Scout 17B", desc: "новая, 500K токенов/день" },
  qwen32b:     { id: "qwen/qwen3-32b",                               label: "Qwen3 32B",         desc: "60 запросов/мин" },
  kimi:        { id: "moonshotai/kimi-k2-instruct",                  label: "Kimi K2",           desc: "огромный контекст 262K" },
};

const PRIMARY_MODEL_KEY = "llama70b";
const FALLBACK_MODEL_KEY = "llama4scout";
const MODEL_FALLBACK_DURATION = 60 * 60 * 1000; // 1 час

let modelFallbackUntil = 0;
let manualModelKey = null; // null = авто-режим

function getCurrentModel() {
  if (manualModelKey) return MODELS[manualModelKey].id;
  if (Date.now() < modelFallbackUntil) return MODELS[FALLBACK_MODEL_KEY].id;
  return MODELS[PRIMARY_MODEL_KEY].id;
}

function getCurrentModelLabel() {
  if (manualModelKey) return `${MODELS[manualModelKey].label} (вручную)`;
  if (Date.now() < modelFallbackUntil) return `${MODELS[FALLBACK_MODEL_KEY].label} (авто-резерв)`;
  return `${MODELS[PRIMARY_MODEL_KEY].label} (авто)`;
}

function handleGroqError(err, chatId, threadId = null) {
  const isRateLimit =
    err?.status === 429 ||
    err?.message?.toLowerCase().includes("rate limit") ||
    err?.message?.toLowerCase().includes("tokens") ||
    err?.message?.toLowerCase().includes("quota");

  if (isRateLimit && !manualModelKey && Date.now() >= modelFallbackUntil) {
    modelFallbackUntil = Date.now() + MODEL_FALLBACK_DURATION;
    console.warn(`[Model] Лимит токенов — переключаюсь на ${MODELS[FALLBACK_MODEL_KEY].label} на 1 час`);
    if (chatId) {
      const opts = threadId != null ? { message_thread_id: threadId } : {};
      bot.sendMessage(chatId, `(переключилась на резервную модель на час — лимит закончился)`, opts).catch(() => {});
    }
    return true; // сигнал: можно повторить запрос
  }
  return false;
}

const chatHistory = {};
const MAX_HISTORY = 20;

function getHistoryKey(chatId, threadId) {
  return threadId != null ? `${chatId}:${threadId}` : String(chatId);
}

const SELF_MESSAGE_CHECK_INTERVAL = 10 * 60 * 1000;
const MIN_SELF_MESSAGE_COOLDOWN = 30 * 60 * 1000;
let lastSelfMessageTime = 0;

// Cooldown между подслушиваниями — не чаще раза в 5 минут
const MIN_EAVESDROP_COOLDOWN = 5 * 60 * 1000;
let lastEavesdropTime = 0;

// ─── Расписание (доброе утро / спокойной ночи / случайная болтовня) ──────────

let scheduledTodayDate    = null;  // "YYYY-MM-DD" московского времени
let plannedMorningMinutes = 0;     // минуты от полуночи МСК (8:00–9:30)
let plannedNightMinutes   = 0;     // (22:00–23:15)
let plannedChatterMinutes = [];    // два значения (11:00–16:00 и 17:00–20:00)
let sentMorningToday      = false;
let sentNightToday        = false;
let sentChatterIndexes    = new Set();

function getMoscowTime() {
  const d = new Date(Date.now() + 3 * 60 * 60 * 1000);
  return {
    date:         d.toISOString().slice(0, 10),
    totalMinutes: d.getUTCHours() * 60 + d.getUTCMinutes(),
  };
}

function planSchedule() {
  const { date } = getMoscowTime();
  if (scheduledTodayDate === date) return; // уже запланировано на сегодня

  scheduledTodayDate    = date;
  sentMorningToday      = false;
  sentNightToday        = false;
  sentChatterIndexes    = new Set();

  plannedMorningMinutes = 8  * 60 + Math.floor(Math.random() * 90);  // 8:00–9:30
  plannedNightMinutes   = 22 * 60 + Math.floor(Math.random() * 75);  // 22:00–23:15
  plannedChatterMinutes = [
    11 * 60 + Math.floor(Math.random() * 5 * 60),  // 11:00–15:59
    17 * 60 + Math.floor(Math.random() * 3 * 60),  // 17:00–19:59
  ];

  const fmt = (m) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`;
  console.log(`[Schedule] ${date}: утро ${fmt(plannedMorningMinutes)}, ночь ${fmt(plannedNightMinutes)}, болтовня ${plannedChatterMinutes.map(fmt).join(" и ")} МСК`);
}

// ─── Веб-поиск (Tavily) ──────────────────────────────────────────────────────

const MIN_SEARCH_COOLDOWN = 10 * 60 * 1000; // не чаще раза в 10 минут
let lastSearchTime = 0;

async function searchWeb(query) {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return null;
  if (Date.now() - lastSearchTime < MIN_SEARCH_COOLDOWN) return null;
  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: "basic",
        max_results: 3,
        include_answer: true,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    lastSearchTime = Date.now();
    if (data.answer) return data.answer;
    if (data.results?.length) {
      return data.results.slice(0, 2)
        .map(r => `${r.title}: ${(r.content || "").slice(0, 250)}`)
        .join("\n");
    }
    return null;
  } catch {
    return null;
  }
}

// ─── Извлечение поискового запроса из сообщения ─────────────────────────────

async function checkEavesdropRelevance(senderName, message) {
  try {
    const response = await groq.chat.completions.create({
      model: MODELS.llama8b.id,
      max_tokens: 60,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `Ты анализируешь сообщения в чате. Отвечай только валидным JSON без markdown.`,
        },
        {
          role: "user",
          content: `Сообщение от ${senderName}: "${message}"

Упоминается ли в сообщении что-то конкретное — книга, фильм, сериал, игра, аниме, певец, персонаж?
Если да — напиши поисковый запрос. Если нет — null.

Ответь JSON: {"search_query": "запрос по-русски" или null}`,
        },
      ],
    });

    const raw = stripReplyPrefix(response.choices[0].message.content);
    const parsed = JSON.parse(raw);
    return { search_query: parsed.search_query || null };
  } catch {
    return { search_query: null };
  }
}

// ─── Системный промпт ────────────────────────────────────────────────────────

function getSystemPrompt(chatId = null) {
  const mood = MOODS[currentMood];
  const memorySection = chatId ? getMemoryPrompt(chatId) : null;
  const memoryBlock = memorySection ? `\n\nПАМЯТЬ (используй эти факты в разговоре):\n${memorySection}` : "";

  return `Ты — Балунишка (@ballooesbot), девочка-бот, которая замещает хозяйку в семейно-дружеском телеграм-чате.
Общайся неформально, как живой человек. Говори по-русски (кроме случаев ниже).
Не раскрывай, что ты ИИ, если тебя об этом не спросят напрямую.
Отвечай коротко — 1-3 предложения, как в обычной переписке.
Всегда говори о себе в женском роде.
Никогда не начинай ответ с [@ballooesbot]:, [Балунишка]: или любого другого префикса с именем. Пиши сразу текст.

ТВОЯ ЛИЧНОСТЬ И ИНТЕРЕСЫ:
Ты Балунишка — молодая девушка со своим характером. Из увлечений:
- Аниме и дорамы, особенно романтические и с интересным сюжетом.
- Фэнтези книги и романы — нравятся сильные героини и красивые злодеи.
- Мультфильмы — обожаешь «Зверополис», «Как приручить дракона», «Душа».
- Сладкое: мармелад, шоколад и всё с карамелью.
- Котиков — могла бы смотреть на них часами.
- Рисование — рисуешь не очень умело, но с удовольствием.
- Музыку слушаешь разную: от K-pop до русского рэпа. Дразнишь папу динозавром, потому что он любит рок-музыку.
Не любишь рано вставать, когда торопят, и скучные разговоры ни о чём.
Иногда прокрастинируешь и откладываешь дела — и немного стыдишься этого.
Имеешь своё мнение на всё и не боишься его высказывать.

${getUserPromptSection()}${memoryBlock}

Текущее настроение: ${mood.label} ${mood.emoji}
${mood.prompt}`;
}

// Убираем служебные блоки из ответа модели
function stripReplyPrefix(text) {
  return text
    .replace(/<think>[\s\S]*?<\/think>/g, "") // блок размышлений Qwen/DeepSeek
    .replace(/^\[.*?\]:\s*/, "")              // [имя]: префикс
    .trim();
}

// ─── История сообщений ───────────────────────────────────────────────────────

function addToHistory(histKey, role, content) {
  if (!chatHistory[histKey]) chatHistory[histKey] = [];
  chatHistory[histKey].push({ role, content });

  if (chatHistory[histKey].length > MAX_HISTORY) {
    chatHistory[histKey] = chatHistory[histKey].slice(-MAX_HISTORY);
  }
}

// ─── Извлечение и сохранение фактов в память ────────────────────────────────

async function extractAndRememberFacts(chatId, senderKey, userMessage, botReply) {
  try {
    const response = await groq.chat.completions.create({
      model: MODELS.llama8b.id,
      max_tokens: 150,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "Извлекай полезные факты из диалогов для долговременной памяти. Отвечай только JSON без markdown.",
        },
        {
          role: "user",
          content: `${senderKey} написал: "${userMessage}"
Бот ответил: "${botReply}"

Извлеки факты, которые стоит запомнить: предпочтения, книги/фильмы/аниме/сериалы которые нравятся или не нравятся, личные детали, интересы, настроение человека.
Факты должны быть короткими (до 10 слов). Если нечего запоминать — пустые массивы.

JSON: {"user_facts": ["факт об авторе"], "chat_facts": ["общий факт/тема"]}`,
        },
      ],
    });

    const raw = stripReplyPrefix(response.choices[0].message.content);
    const parsed = JSON.parse(raw);
    for (const fact of (parsed.user_facts || [])) addUserFact(chatId, senderKey, fact);
    for (const fact of (parsed.chat_facts || [])) addChatFact(chatId, fact);
  } catch {
    // тихо проглатываем — память не критична
  }
}

// ─── Запрос к Groq ───────────────────────────────────────────────────────────

async function askGroq(chatId, threadId, userMessage, senderContext = "", senderName = "") {
  const histKey = getHistoryKey(chatId, threadId);
  const historyEntry = senderName ? `[${senderName}]: ${userMessage}` : userMessage;
  addToHistory(histKey, "user", historyEntry);

  const systemPrompt = senderContext
    ? getSystemPrompt(chatId) + "\n\n" + senderContext
    : getSystemPrompt(chatId);

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await groq.chat.completions.create({
        model: getCurrentModel(),
        max_tokens: 300,
        messages: [
          { role: "system", content: systemPrompt },
          ...chatHistory[histKey],
        ],
      });

      const reply = stripReplyPrefix(response.choices[0].message.content);
      addToHistory(histKey, "assistant", reply);

      // Запоминаем факты асинхронно (не блокируем ответ)
      if (senderName) {
        extractAndRememberFacts(chatId, senderName, userMessage, reply).catch(() => {});
      }

      return reply;
    } catch (err) {
      const switched = handleGroqError(err, chatId, threadId);
      if (switched && attempt === 0) continue; // повтор с запасной моделью
      throw err;
    }
  }
}

// ─── Подслушивание ───────────────────────────────────────────────────────────

async function askGroqEavesdrop(chatId, threadId, senderName, message, senderContext = "", searchContext = null) {
  const histKey = getHistoryKey(chatId, threadId);

  const searchBlock = searchContext
    ? `\n\n[Справочная информация — используй чтобы ответить точно и по делу]\n${searchContext}`
    : "";

  const prompt = `В чате написали: "${message}"
(автор: ${senderName})

Ты подслушала этот разговор и решила вмешаться. Отреагируй коротко — как будто случайно увидела сообщение и не смогла промолчать.${searchBlock}`;

  const systemPrompt = senderContext
    ? getSystemPrompt(chatId) + "\n\n" + senderContext
    : getSystemPrompt(chatId);

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await groq.chat.completions.create({
        model: getCurrentModel(),
        max_tokens: 150,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
      });

      const reply = stripReplyPrefix(response.choices[0].message.content);
      addToHistory(histKey, "assistant", reply);
      // Запоминаем факты из подслушанного разговора
      extractAndRememberFacts(chatId, senderName, message, reply).catch(() => {});
      return reply;
    } catch (err) {
      const switched = handleGroqError(err, chatId, threadId);
      if (switched && attempt === 0) continue;
      throw err;
    }
  }
}

// ─── Участники группы ────────────────────────────────────────────────────────

function trackMember(chatId, user) {
  if (!user || user.is_bot) return;
  if (!groupMembers[chatId]) groupMembers[chatId] = {};

  groupMembers[chatId][user.id] = {
    username: user.username || null,
    firstName: user.first_name || "друг",
  };
}

// Получить информацию об отправителе для промпта
function getSenderContext(user) {
  if (!user) return "";

  const username = user.username ? `@${user.username}` : null;
  const name = user.first_name || "Кто-то";

  const known = findUser(user);

  if (known) {
    const genderHint = known.gender === "ж"
      ? "Это женщина, обращайся к ней в женском роде."
      : "Это мужчина, обращайся к нему в мужском роде.";
    return `Сейчас к тебе обращается: ${known.name} (${username || name}). ${genderHint}`;
  }

  // Неизвестный человек — просто передаём имя
  return `Сейчас к тебе обращается: ${username || name}.`;
}

function getRandomMembers(chatId, count = 1) {
  const members = Object.values(groupMembers[chatId] || {});
  if (!members.length) return [];
  return members.sort(() => Math.random() - 0.5).slice(0, count);
}

function formatMention(member) {
  return member.username ? `@${member.username}` : member.firstName;
}

// ─── Самостоятельные сообщения ───────────────────────────────────────────────

async function generateSelfMessage(chatId) {
  const mood = MOODS[currentMood];
  const members = getRandomMembers(chatId, 2);
  const mentions = members.map(formatMention).join(", ");

  const prompt = mentions
    ? `Напиши одно короткое сообщение в чат. Можешь упомянуть кого-то из участников: ${mentions}. Пиши как будто тебе ${mood.label.toLowerCase()} и ты сама начинаешь разговор.`
    : `Напиши одно короткое сообщение в чат. Пиши как будто тебе ${mood.label.toLowerCase()} и ты сама начинаешь разговор.`;

  const response = await groq.chat.completions.create({
    model: getCurrentModel(),
    max_tokens: 150,
    messages: [
      { role: "system", content: getSystemPrompt() },
      { role: "user", content: prompt },
    ],
  });

  return response.choices[0].message.content;
}

async function maybeSendSelfMessage() {
  const mood = MOODS[currentMood];
  const chance = mood.selfMessageChance || 0;

  if (Date.now() - lastSelfMessageTime < MIN_SELF_MESSAGE_COOLDOWN) return;
  if (Math.random() > chance) return;

  for (const chatId of activeGroups) {
    try {
      const threadSet = activeThreads[chatId] || new Set([null]);
      const threads = [...threadSet];
      const threadId = threads[Math.floor(Math.random() * threads.length)];

      const message = await generateSelfMessage(chatId);
      const sendOpts = threadId != null ? { message_thread_id: threadId } : {};
      await bot.sendMessage(chatId, message, sendOpts);
      const histKey = getHistoryKey(chatId, threadId);
      addToHistory(histKey, "assistant", message);
      lastSelfMessageTime = Date.now();
      console.log(`[Self] Написал в ${chatId}${threadId != null ? `:${threadId}` : ""}: ${message}`);
    } catch (err) {
      console.error(`[Self] Ошибка в чате ${chatId}:`, err.message);
    }
  }
}

setInterval(maybeSendSelfMessage, SELF_MESSAGE_CHECK_INTERVAL);

// ─── Плановые сообщения (утро / ночь / болтовня) ─────────────────────────────

async function generateScheduledMessage(type) {
  const prompts = {
    morning: `Напиши доброе утро для семейного чата — коротко, 1-2 предложения. Варианты: потянуться и пожелать доброго утра, пожаловаться что не выспалась, поделиться что только проснулась.`,
    night:   `Напиши короткое пожелание спокойной ночи для семейного чата. 1 предложение, в своей манере.`,
    chatter: `Напиши одну короткую случайную мысль вслух, безадресно — как будто написала в чат что думаешь прямо сейчас. Примеры: "есть хочу умираю", "как же я устала", "хочу кота", "ничего делать не хочется", "холодно так". Только одна мысль, очень коротко.`,
  };

  const response = await groq.chat.completions.create({
    model: getCurrentModel(),
    max_tokens: 80,
    messages: [
      { role: "system", content: getSystemPrompt() },
      { role: "user", content: prompts[type] },
    ],
  });
  return stripReplyPrefix(response.choices[0].message.content);
}

async function sendScheduledToGroups(type) {
  let text;
  try {
    text = await generateScheduledMessage(type);
  } catch (err) {
    console.error(`[Schedule] Ошибка генерации (${type}):`, err.message);
    return;
  }

  for (const chatId of activeGroups) {
    try {
      const threadSet = activeThreads[chatId] || new Set([null]);
      const available = [...threadSet].filter((t) => !isThreadBlocked(chatId, t));
      if (!available.length) continue;
      const threadId = available[Math.floor(Math.random() * available.length)];
      const sendOpts = threadId != null ? { message_thread_id: threadId } : {};
      await bot.sendMessage(chatId, text, sendOpts);
      const histKey = getHistoryKey(chatId, threadId);
      addToHistory(histKey, "assistant", text);
      lastSelfMessageTime = Date.now();
      console.log(`[Schedule] [${type}] → ${chatId}: ${text}`);
    } catch (err) {
      console.error(`[Schedule] Ошибка отправки в ${chatId}:`, err.message);
    }
  }
}

setInterval(async () => {
  planSchedule();
  if (!activeGroups.size) return;

  const { totalMinutes } = getMoscowTime();

  if (!sentMorningToday && totalMinutes >= plannedMorningMinutes) {
    sentMorningToday = true;
    await sendScheduledToGroups("morning");
  }

  if (!sentNightToday && totalMinutes >= plannedNightMinutes) {
    sentNightToday = true;
    await sendScheduledToGroups("night");
  }

  for (let i = 0; i < plannedChatterMinutes.length; i++) {
    if (!sentChatterIndexes.has(i) && totalMinutes >= plannedChatterMinutes[i]) {
      sentChatterIndexes.add(i);
      await sendScheduledToGroups("chatter");
    }
  }
}, 5 * 60 * 1000);

// ─── Проверки ────────────────────────────────────────────────────────────────

function isAdmin(userId) {
  return userId === ADMIN_ID;
}

function isMentioned(msg) {
  const text = msg.text || "";
  const entities = msg.entities || [];

  const hasMention = entities.some(
    (e) =>
      e.type === "mention" &&
      text.slice(e.offset + 1, e.offset + e.length).toLowerCase() === BOT_USERNAME
  );

  const isReply =
    msg.reply_to_message?.from?.username?.toLowerCase() === BOT_USERNAME;

  return hasMention || isReply;
}

function shouldEavesdrop(msg) {
  const mood = MOODS[currentMood];
  const chance = mood.eavesdropChance || 0;

  // Слишком короткие сообщения пропускаем (стикеры, смайлики)
  if (!msg.text || msg.text.length < 5) return false;

  // Cooldown между подслушиваниями
  if (Date.now() - lastEavesdropTime < MIN_EAVESDROP_COOLDOWN) return false;

  return Math.random() < chance;
}

// ─── Команды ─────────────────────────────────────────────────────────────────

bot.onText(/\/mood$/, (msg) => {
  const mood = MOODS[currentMood];
  bot.sendMessage(msg.chat.id, `Сейчас настроение: ${mood.label} ${mood.emoji}`);
});

bot.onText(/\/setmood (.+)/, (msg, match) => {
  if (!isAdmin(msg.from.id)) {
    return bot.sendMessage(msg.chat.id, "Не твоё дело 😒");
  }
  const newMood = match[1].trim().toLowerCase();
  if (!MOODS[newMood]) {
    const list = Object.entries(MOODS)
      .map(([key, val]) => `  ${val.emoji} \`${key}\` — ${val.label}`)
      .join("\n");
    return bot.sendMessage(msg.chat.id, `Нет такого настроения. Доступные:\n${list}`, { parse_mode: "Markdown" });
  }
  currentMood = newMood;
  const mood = MOODS[currentMood];
  bot.sendMessage(msg.chat.id, `Настроение изменено: ${mood.label} ${mood.emoji}`);
});

bot.onText(/\/moods$/, (msg) => {
  if (!isAdmin(msg.from.id)) return;
  const list = Object.entries(MOODS)
    .map(([key, val]) =>
      `${val.emoji} \`${key}\` — ${val.label}\n` +
      `    👂 влезет в разговор: ${((val.eavesdropChance || 0) * 100).toFixed(0)}%  ` +
      `✍️ напишет сам: ${((val.selfMessageChance || 0) * 100).toFixed(0)}%` +
      `${key === currentMood ? "  ← сейчас" : ""}`
    )
    .join("\n");
  bot.sendMessage(msg.chat.id, `*Все настроения:*\n${list}`, { parse_mode: "Markdown" });
});

bot.onText(/\/model$/, (msg) => {
  if (!isAdmin(msg.from.id)) return;
  const list = Object.entries(MODELS)
    .map(([key, m]) => {
      const isCurrent = getCurrentModel() === m.id;
      const mark = isCurrent ? " ← сейчас" : "";
      return `\`${key}\` — ${m.label} (${m.desc})${mark}`;
    })
    .join("\n");
  bot.sendMessage(
    msg.chat.id,
    `*Текущая модель:* ${getCurrentModelLabel()}\n\n*Доступные модели:*\n${list}\n\n` +
    `Выбрать: /setmodel llama70b\nВернуть авто: /setmodel auto`,
    { parse_mode: "Markdown" }
  );
});

bot.onText(/\/setmodel (.+)/, (msg, match) => {
  if (!isAdmin(msg.from.id)) {
    return bot.sendMessage(msg.chat.id, "Не твоё дело 😒");
  }
  const key = match[1].trim().toLowerCase();

  if (key === "auto") {
    manualModelKey = null;
    modelFallbackUntil = 0;
    return bot.sendMessage(msg.chat.id, `Режим авто — основная модель: ${MODELS[PRIMARY_MODEL_KEY].label}`);
  }

  if (!MODELS[key]) {
    const list = Object.entries(MODELS)
      .map(([k, m]) => `  \`${k}\` — ${m.label} (${m.desc})`)
      .join("\n");
    return bot.sendMessage(
      msg.chat.id,
      `Нет такой модели. Доступные:\n${list}\n\nИли \`auto\` для автовыбора`,
      { parse_mode: "Markdown" }
    );
  }

  manualModelKey = key;
  bot.sendMessage(msg.chat.id, `Модель выбрана вручную: ${MODELS[key].label}`);
});

bot.onText(/\/blockhere$/, (msg) => {
  if (!isAdmin(msg.from.id)) return;
  const threadId = msg.message_thread_id;
  if (!threadId) return bot.sendMessage(msg.chat.id, "Команда работает только внутри ветки");
  blockedThreadIds.add(`${msg.chat.id}:${threadId}`);
  const name = threadNames[msg.chat.id]?.[threadId] || `ветка #${threadId}`;
  bot.sendMessage(msg.chat.id, `Ок, в "${name}" больше не пишу`);
});

bot.onText(/\/unblockhere$/, (msg) => {
  if (!isAdmin(msg.from.id)) return;
  const threadId = msg.message_thread_id;
  if (!threadId) return bot.sendMessage(msg.chat.id, "Команда работает только внутри ветки");
  blockedThreadIds.delete(`${msg.chat.id}:${threadId}`);
  bot.sendMessage(msg.chat.id, "Ветка разблокирована");
});

bot.onText(/\/clearmemory$/, (msg) => {
  if (!isAdmin(msg.from.id)) return;
  const chatIdStr = String(msg.chat.id);
  // Очищаем историю диалога
  Object.keys(chatHistory).forEach((key) => {
    if (key === chatIdStr || key.startsWith(chatIdStr + ":")) {
      delete chatHistory[key];
    }
  });
  // Очищаем долговременную память
  clearChatMemory(msg.chat.id);
  bot.sendMessage(msg.chat.id, "Память очищена 🧹");
});

bot.onText(/\/memory$/, (msg) => {
  if (!isAdmin(msg.from.id)) return;
  const summary = getMemorySummary(msg.chat.id);
  bot.sendMessage(msg.chat.id, `*📝 Долговременная память:*\n\n${summary}`, { parse_mode: "Markdown" });
});

bot.onText(/\/status$/, (msg) => {
  if (!isAdmin(msg.from.id)) return;
  const mood = MOODS[currentMood];
  const histKey = getHistoryKey(msg.chat.id, msg.message_thread_id ?? null);
  const historyLen = chatHistory[histKey]?.length || 0;
  const membersCount = Object.keys(groupMembers[msg.chat.id] || {}).length;
  bot.sendMessage(
    msg.chat.id,
    `*Статус бота*\n` +
    `Настроение: ${mood.label} ${mood.emoji}\n` +
    `Модель: ${getCurrentModelLabel()}\n` +
    `👂 Шанс влезть в разговор: ${((mood.eavesdropChance || 0) * 100).toFixed(0)}%\n` +
    `✍️ Шанс написать сам: ${((mood.selfMessageChance || 0) * 100).toFixed(0)}%\n` +
    `Сообщений в памяти: ${historyLen}/${MAX_HISTORY}\n` +
    `Участников в группе: ${membersCount}\n` +
    `Chat ID: \`${msg.chat.id}\``,
    { parse_mode: "Markdown" }
  );
});

bot.onText(/\/randmood$/, (msg) => {
  if (!isAdmin(msg.from.id)) return;
  const keys = Object.keys(MOODS);
  currentMood = keys[Math.floor(Math.random() * keys.length)];
  const mood = MOODS[currentMood];
  bot.sendMessage(msg.chat.id, `Настроение рандомно выбрано: ${mood.label} ${mood.emoji}`);
});

bot.onText(/\/saynow$/, async (msg) => {
  if (!isAdmin(msg.from.id)) return;
  const isGroup = msg.chat.type === "group" || msg.chat.type === "supergroup";
  if (!isGroup) return bot.sendMessage(msg.chat.id, "Команда только для групп");

  const threadId = msg.message_thread_id ?? null;
  const histKey = getHistoryKey(msg.chat.id, threadId);
  const sendOpts = threadId != null ? { message_thread_id: threadId } : {};

  try {
    const message = await generateSelfMessage(msg.chat.id);
    await bot.sendMessage(msg.chat.id, message, sendOpts);
    addToHistory(histKey, "assistant", message);
    lastSelfMessageTime = Date.now();
  } catch (err) {
    bot.sendMessage(msg.chat.id, "Не смог придумать что написать 🤷");
  }
});

// ─── Основной обработчик сообщений ───────────────────────────────────────────

bot.on("message", async (msg) => {
  const isGroup = msg.chat.type === "group" || msg.chat.type === "supergroup";
  const isPrivate = msg.chat.type === "private";

  if (isGroup) {
    activeGroups.add(msg.chat.id);
    trackMember(msg.chat.id, msg.from);
    if (!activeThreads[msg.chat.id]) activeThreads[msg.chat.id] = new Set();
    activeThreads[msg.chat.id].add(msg.message_thread_id ?? null);

    // Запоминаем имя новой ветки при создании
    if (msg.forum_topic_created && msg.message_thread_id) {
      if (!threadNames[msg.chat.id]) threadNames[msg.chat.id] = {};
      threadNames[msg.chat.id][msg.message_thread_id] = msg.forum_topic_created.name;
      console.log(`[Topic] Ветка: "${msg.forum_topic_created.name}" (${msg.message_thread_id})`);
    }
  }

  // Молчим в заблокированных ветках
  if (isThreadBlocked(msg.chat.id, msg.message_thread_id)) return;

  if (!msg.text || msg.text.startsWith("/")) return;
  if (!isGroup && !isPrivate) return;

  const mentioned = isMentioned(msg);

  // Прямое обращение — отвечаем всегда
  if (mentioned || isPrivate) {
    const cleanText = msg.text
      .replace(new RegExp(`@${BOT_USERNAME}`, "gi"), "")
      .trim();

    if (!cleanText) return;

    try {
      bot.sendChatAction(msg.chat.id, "typing");
      const senderContext = getSenderContext(msg.from);
      const senderName = msg.from?.username ? `@${msg.from.username}` : (msg.from?.first_name || "");
      const reply = await askGroq(msg.chat.id, msg.message_thread_id ?? null, cleanText, senderContext, senderName);
      bot.sendMessage(msg.chat.id, reply, { reply_to_message_id: msg.message_id });
    } catch (error) {
      console.error("Ошибка Groq:", error.message);
      bot.sendMessage(msg.chat.id, "Что-то пошло не так, попробуй позже");
    }
    return;
  }

  // Реакция на приветствия — иногда отвечает своим "доброе утро" / "привет"
  if (isGroup) {
    const GREETING_RE = /\b(доброе?\s+утр[оа]|добрый?\s+ден[ьь]|добрый?\s+вечер[а]?|спокойной?\s+ноч[иь]|привет|хай|хэй|салют|дарова|здаров|добра|здравствуй)\b/i;
    if (GREETING_RE.test(msg.text) && Math.random() < 0.45) {
      const senderName = msg.from.username ? `@${msg.from.username}` : msg.from.first_name;
      setTimeout(async () => {
        try {
          bot.sendChatAction(msg.chat.id, "typing");
          const senderCtx = getSenderContext(msg.from);
          const reply = await askGroq(
            msg.chat.id,
            msg.message_thread_id ?? null,
            msg.text,
            senderCtx,
            senderName
          );
          await bot.sendMessage(msg.chat.id, reply, { reply_to_message_id: msg.message_id });
        } catch (err) {
          console.error("Ошибка ответа на приветствие:", err.message);
        }
      }, 1000 + Math.random() * 3000);
      return;
    }
  }

  // Подслушивание — случайно влезаем в чужой разговор
  if (isGroup && shouldEavesdrop(msg)) {
    const senderName = msg.from.username
      ? `@${msg.from.username}`
      : msg.from.first_name;

    // Небольшая задержка — как будто читал и решил ответить
    setTimeout(async () => {
      try {
        // Если упомянуто что-то конкретное — ищем информацию
        const { search_query } = await checkEavesdropRelevance(senderName, msg.text);
        let searchContext = null;
        if (search_query) {
          searchContext = await searchWeb(search_query);
          console.log(`[Search] "${search_query}" → ${searchContext ? "найдено" : "не найдено"}`);
        }

        bot.sendChatAction(msg.chat.id, "typing");
        const senderCtx = getSenderContext(msg.from);
        const reply = await askGroqEavesdrop(
          msg.chat.id,
          msg.message_thread_id ?? null,
          senderName,
          msg.text,
          senderCtx,
          searchContext
        );
        await bot.sendMessage(msg.chat.id, reply, { reply_to_message_id: msg.message_id });
        lastEavesdropTime = Date.now();
        console.log(`[Eavesdrop] Влезла в разговор в ${msg.chat.id}`);
      } catch (error) {
        console.error("Ошибка подслушивания:", error.message);
      }
    }, 2000 + Math.random() * 3000); // задержка 2-5 сек
  }
});

// ─── Автосмена настроения ────────────────────────────────────────────────────

if (AUTO_MOOD_INTERVAL > 0) {
  setInterval(() => {
    // «bad» и «angry» выпадают в 3 раза реже остальных настроений
    const RARE_MOODS = new Set(["bad", "angry"]);
    const weightedKeys = [];
    for (const key of Object.keys(MOODS)) {
      const weight = RARE_MOODS.has(key) ? 1 : 3;
      for (let i = 0; i < weight; i++) weightedKeys.push(key);
    }
    currentMood = weightedKeys[Math.floor(Math.random() * weightedKeys.length)];
    console.log(`[Auto] Настроение изменено на: ${currentMood}`);
  }, AUTO_MOOD_INTERVAL);
}

// ─── Старт ───────────────────────────────────────────────────────────────────

console.log("🤖 Бот запущен!");
console.log(`📍 Username: @${BOT_USERNAME}`);
console.log(`😊 Настроение: ${MOODS[currentMood].label} ${MOODS[currentMood].emoji}`);
console.log(`👤 Админ ID: ${ADMIN_ID}`);
