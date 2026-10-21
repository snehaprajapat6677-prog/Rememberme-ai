

/* ==========================================================================
   1. CONSTANTS
   ========================================================================== */

const STORAGE_KEY = "rememberme-ai.reminders.v1";
const BACKUP_KEY = "rememberme-ai.reminders.backup";
const STORAGE_TEST_KEY = "rememberme-ai.storage-test";
const MAX_TITLE_LENGTH = 120;
const MAX_CHAT_INPUT_LENGTH = 300;

const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

const SAVE_WARNING =
  "This browser isn't saving reminders right now, so this change will be lost when you reload the page.";

const NOT_FOUND_MESSAGE = "I couldn't find that reminder. It may have been deleted already.";

const MONTH_NUMBERS = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, sept: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11
};

const WEEKDAY_NUMBERS = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6
};

const NUMBER_WORDS = {
  a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6,
  seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12,
  fifteen: 15, twenty: 20, thirty: 30, forty: 40, sixty: 60
};

const MONTH_WORDS =
  "january|february|march|april|june|july|august|september|october|november|december|may|jan|feb|mar|apr|jun|jul|aug|sept|sep|oct|nov|dec";

/* Time and date expressions. Each regex is used once per phrase and the
   matched text is removed, so whatever is left over becomes the title. */
const HALF_HOUR_RE = /\bin\s+half\s+an\s+hour\b/i;
const DURATION_RE = /\bin\s+(\d{1,3}|a|an|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|fifteen|twenty|thirty|forty|sixty)\s+(minutes?|mins?|hours?|hrs?|days?)\b/i;
const MONTH_DAY_RE = new RegExp(
  "\\b(?:on\\s+)?(?:(\\d{1,2})(?:st|nd|rd|th)?\\s+(?:of\\s+)?(" + MONTH_WORDS + ")\\.?|(" + MONTH_WORDS + ")\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?)(?:,?\\s+(\\d{4}))?\\b",
  "i"
);
const WEEKDAY_RE = /\b(?:on\s+)?(next\s+)?(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/i;
const TOMORROW_RE = /\b(?:on\s+)?tomorrow\b/i;
const TODAY_RE = /\b(?:on\s+)?(today|tonight)\b/i;
const NOON_RE = /\b(?:(?:at|by|around)\s+)?(noon|midnight)\b/i;
const AMPM_RE = /\b(?:(?:at|by|around)\s+)?(\d{1,2})(?::([0-5]\d))?\s*([ap])\.?m\.?(?![a-z])/i;
const COLON_TIME_RE = /\b(?:(?:at|by|around)\s+)?(\d{1,2}):([0-5]\d)\b/i;
const BARE_AT_RE = /\b(?:at|by|around)\s+(\d{1,2})\b(?!\s*(?:minutes?|mins?|hours?|hrs?|days?|times?|people|persons?|items?|%))/i;

/* Command phrases. Verbs that start a command are anchored to the start of
   the message. "Remind me" can appear anywhere. */
const CREATE_RE = /\b(?:remind me|set (?:a |an )?reminder|add (?:a )?reminder|create (?:a )?reminder|i need to remember|remember to|remember that|don'?t forget|don'?t let me forget)\b/i;
const DELETE_RE = /^(?:cancel|delete|remove|drop|don'?t remind me(?:\s+(?:about|to|of))?)\b\s*(.*)$/i;
const COMPLETE_RE = /^(?:mark|complete|finish|tick off|check off)\b\s*(.*?)(?:\s+as\s+(?:done|complete|completed|finished))?$/i;
const I_FINISHED_RE = /^i(?:'ve|\s+have|\s+just)?\s+(?:finished|completed|done with)\s+(.+)$/i;
const RESCHEDULE_RE = /^(?:move|reschedule|postpone|push|change|shift)\b\s*(.*)$/i;
const SUMMARY_RE = /\b(?:summary|summarize|summarise|overview|how am i doing|how many (?:reminders|tasks))\b/i;
const HELP_RE = /^(?:help|commands|show help)$|\bwhat (?:can|do) you (?:do|help with)\b|\bwhat can i (?:say|ask)\b|\bhow do i use\b/i;
const COMPLETED_LIST_RE = /\b(?:completed|complete|done|finished)\b|\bwhat have i (?:already )?(?:done|finished)\b/i;
const TODAY_LIST_RE = /\b(?:today|tonight)\b/i;
const UPCOMING_LIST_RE = /\b(?:upcoming|coming up|what'?s next|next up|next|later|future|soon)\b/i;
const PENDING_LIST_RE = /\b(?:pending|not done|unfinished|still to do|remaining|left to do|what do i need to do|what do i have to do)\b/i;
const LIST_ALL_RE = /\b(?:reminders?|tasks?|my list|to-?do|list|everything)\b/i;

/* Replies to a pending question. These are matched against lowercase text
   with trailing punctuation removed. */
const CANCEL_RE = /^(?:never ?mind|forget it|cancel that|cancel|stop|no thanks)$/i;
const LOOKS_LIKE_COMMAND_RE = /^(?:help|show|list|summary|summarize|overview|mark|complete|finish|delete|remove|cancel|move|reschedule|remind|what|how many)\b/i;
const YES_RE = /^(?:yes|yeah|yep|yup|sure|ok|okay|please|go ahead|do it|sounds good|y)\b/i;
const NO_RE = /^(?:no|nope|nah|n)\b/i;
const AM_PM_ONLY_RE = /^(?:a|p)\.?\s?m\.?$/i;

const TARGET_STOP_WORDS = new Set([
  "my", "the", "a", "an", "this", "that", "reminder", "reminders",
  "task", "tasks", "to", "about", "for", "on", "at", "of", "and"
]);

const VIEW_HEADINGS = {
  all: "Here's everything on your list:",
  today: "For today:",
  upcoming: "Coming up:",
  completed: "You've completed:",
  pending: "Still pending:"
};

const EMPTY_VIEW_MESSAGES = {
  all: "You don't have any reminders yet. Try: Remind me tomorrow at 10 AM to wash clothes.",
  today: "Nothing is due today. Enjoy the space.",
  upcoming: "You have no upcoming reminders.",
  completed: "You haven't completed any reminders yet.",
  pending: "You have no pending reminders."
};

const HELP_TEXT = [
  "I follow clear phrases rather than open conversation. I'm not an AI model. You can try:",
  "• Remind me tomorrow at 10 AM to wash clothes.",
  "• Remind me in 30 minutes to take a break.",
  "• What do I need to do today?",
  "• Show my upcoming reminders.",
  "• Mark washing clothes as done.",
  "• Move my grocery reminder to tomorrow at 5 PM.",
  "• Cancel my reminder to call Mom.",
  "• What have I completed?"
].join("\n");

const UNKNOWN_TEXT =
  'I didn\'t understand that yet. I can create, list, move, complete, and cancel reminders. Type "help" to see examples.';

/* ==========================================================================
   2. APPLICATION STATE
   Part 3 reads and writes this object. Only the tools in section 6 change
   the reminders array.
   ========================================================================== */

const appState = {
  reminders: [],
  pending: null,            // a question waiting for the user's answer, or null
  storageAvailable: true,   // false when localStorage cannot save
  storageRecovered: false   // true when malformed saved data had to be set aside
};

/* ==========================================================================
   3. DATE, TIME, AND TEXT HELPERS
   ========================================================================== */

function normalizeSpaces(value) {
  return String(value === undefined || value === null ? "" : value)
    .replace(/\s+/g, " ")
    .trim();
}

function pad2(number) {
  return String(number).padStart(2, "0");
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date, days) {
  // Using the constructor keeps the local calendar date correct across daylight-saving changes.
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/* A "day key" such as "2026-10-22" identifies a local calendar day. Storing
   the key instead of a timestamp avoids timezone shifts when a question is
   waiting for an answer. */
function dayKeyFromDate(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function dateFromDayKey(key) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function isSameLocalDay(a, b) {
  return dayKeyFromDate(a) === dayKeyFromDate(b);
}

function toValidIsoString(value) {
  if (typeof value !== "string") return null;
  const time = Date.parse(value);
  return Number.isNaN(time) ? null : new Date(time).toISOString();
}

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `rm-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function pluralize(count, word) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

const timeFormatter = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" });
const weekdayFormatter = new Intl.DateTimeFormat(undefined, { weekday: "long" });
const shortDateFormatter = new Intl.DateTimeFormat(undefined, { weekday: "short", day: "numeric", month: "short" });
const longDateFormatter = new Intl.DateTimeFormat(undefined, { weekday: "short", day: "numeric", month: "short", year: "numeric" });

function formatTime(date) {
  return timeFormatter.format(date);
}

/* Returns "Today", "Tomorrow", "Yesterday", a weekday name, or a short date.
   Uses the user's local calendar, so it stays correct at any hour. */
function formatDayLabel(date, now) {
  const dayDifference = Math.round((startOfDay(date) - startOfDay(now)) / DAY_MS);
  if (dayDifference === 0) return "Today";
  if (dayDifference === 1) return "Tomorrow";
  if (dayDifference === -1) return "Yesterday";
  if (dayDifference > 1 && dayDifference < 7) return weekdayFormatter.format(date);
  return date.getFullYear() === now.getFullYear()
    ? shortDateFormatter.format(date)
    : longDateFormatter.format(date);
}

/* Converts "Today" to "today" and "Monday" to "on Monday" so the label fits
   inside a sentence. */
function dayPhraseFromLabel(label) {
  if (label === "Today" || label === "Tomorrow" || label === "Yesterday") {
    return label.toLowerCase();
  }
  return `on ${label}`;
}

/* For lists and labels, e.g. "Tomorrow at 10:00 AM". */
function formatWhen(date, now) {
  return `${formatDayLabel(date, now)} at ${formatTime(date)}`;
}

/* For sentences, e.g. "tomorrow at 10:00 AM". */
function phraseFor(date, now) {
  return `${dayPhraseFromLabel(formatDayLabel(date, now))} at ${formatTime(date)}`;
}

function phraseForDayKey(key, now) {
  return dayPhraseFromLabel(formatDayLabel(dateFromDayKey(key), now));
}

function formatClockText(hour, minute) {
  return minute ? `${hour}:${pad2(minute)}` : String(hour);
}

/* ==========================================================================
   4. STORAGE WITH RECOVERY
   Reminders are kept in this browser's localStorage. Nothing is sent to a
   server. Malformed data is backed up and skipped instead of crashing the app.
   ========================================================================== */

function getLocalStorage() {
  try {
    return typeof localStorage === "undefined" ? null : localStorage;
  } catch (error) {
    // Some browsers throw when storage is blocked by privacy settings.
    return null;
  }
}

function canWriteStorage() {
  const storage = getLocalStorage();
  if (!storage) return false;
  try {
    storage.setItem(STORAGE_TEST_KEY, "ok");
    storage.removeItem(STORAGE_TEST_KEY);
    return true;
  } catch (error) {
    return false;
  }
}

function backupRawData(storage, raw) {
  try {
    storage.setItem(BACKUP_KEY, raw);
  } catch (error) {
    // If even the backup fails, the app still starts. The data is dropped.
  }
}

/* Checks one saved item and returns a clean reminder, or null if it cannot be
   used. Invalid text, dates, or statuses are rejected. Missing timestamps are
   filled in where a sensible value exists. */
function sanitizeReminder(item) {
  if (!item || typeof item !== "object") return null;

  const title = typeof item.title === "string" ? normalizeSpaces(item.title) : "";
  const dueAt = toValidIsoString(item.dueAt);
  const status = item.status === "pending" || item.status === "completed" ? item.status : null;

  if (!title || title.length > MAX_TITLE_LENGTH || !dueAt || !status) return null;

  const hasValidId = typeof item.id === "string" && item.id.trim().length > 0 && item.id.length <= 100;
  const id = hasValidId ? item.id : createId();
  const createdAt = toValidIsoString(item.createdAt) || dueAt;
  const completedAt = status === "completed" ? toValidIsoString(item.completedAt) || createdAt : null;
  const alertedAt = toValidIsoString(item.alertedAt);

  return { id, title, dueAt, status, createdAt, completedAt, alertedAt };
}

/* Reads saved reminders. If the data is unreadable, the raw text is backed up
   first and the app starts with an empty list. */
function loadRemindersFromStorage() {
  const result = { reminders: [], storageAvailable: true, recovered: false };
  const storage = getLocalStorage();

  if (!storage) {
    result.storageAvailable = false;
    return result;
  }

  let raw = null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch (error) {
    result.storageAvailable = false;
    return result;
  }

  if (raw === null) return result; // First visit: nothing saved yet.

  let parsed = null;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    parsed = null;
  }

  let items = null;
  if (Array.isArray(parsed)) {
    items = parsed;
  } else if (parsed && Array.isArray(parsed.reminders)) {
    items = parsed.reminders;
  }

  if (!items) {
    backupRawData(storage, raw);
    result.recovered = true;
    return result;
  }

  const seenIds = new Set();
  let droppedCount = 0;

  items.forEach((item) => {
    const reminder = sanitizeReminder(item);
    if (!reminder || seenIds.has(reminder.id)) {
      droppedCount += 1;
      return;
    }
    seenIds.add(reminder.id);
    result.reminders.push(reminder);
  });

  if (droppedCount > 0) {
    backupRawData(storage, raw);
    result.recovered = true;
  }

  return result;
}

function saveRemindersToStorage(reminders) {
  const storage = getLocalStorage();
  if (!storage) return false;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, reminders }));
    return true;
  } catch (error) {
    return false;
  }
}

/* Called once at start-up by Part 3. */
function loadAppData() {
  const storageWorks = canWriteStorage();
  const loaded = loadRemindersFromStorage();

  appState.reminders = loaded.reminders;
  appState.storageAvailable = storageWorks && loaded.storageAvailable;
  appState.storageRecovered = loaded.recovered;
  appState.pending = null;

  // Save the cleaned list straight away so the bad entries are not read again.
  if (loaded.recovered && storageWorks) {
    commitReminders();
  }

  return { recovered: loaded.recovered, storageAvailable: appState.storageAvailable };
}

/* Every change to reminders goes through here. It returns true only when the
   change was saved to the browser. */
function commitReminders() {
  const saved = saveRemindersToStorage(appState.reminders);
  appState.storageAvailable = saved;
  return saved;
}

/* ==========================================================================
   5. RESULT HELPERS
   Tool results: { ok, message, ...extra }. The message is already honest and
   ready to show the user. Part 3 must not claim success beyond it.
   ========================================================================== */

function toolSuccess(message, extra) {
  return Object.assign({ ok: true, message }, extra || {});
}

function toolFailure(message) {
  return { ok: false, message };
}

function withSaveNote(message, saved) {
  return saved ? message : `${message} ${SAVE_WARNING}`;
}

function validateTitle(rawTitle) {
  const title = normalizeSpaces(rawTitle);
  if (!title) {
    return { ok: false, message: "What should I remind you about?" };
  }
  if (title.length > MAX_TITLE_LENGTH) {
    return { ok: false, message: `Please keep the reminder under ${MAX_TITLE_LENGTH} characters.` };
  }
  return { ok: true, title };
}

function validateFutureDate(date, now) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return { ok: false, message: "That date or time isn't valid. Please try again." };
  }
  if (date.getTime() <= now.getTime()) {
    return { ok: false, message: "That time has already passed. Please choose a future time." };
  }
  return { ok: true, dueAt: date };
}

/* ==========================================================================
   6. REMINDER TOOLS
   Each tool checks its inputs, changes the data if the checks pass, saves,
   and returns a result. The parser and dispatcher call these functions.
   ========================================================================== */

function findReminderById(id) {
  return appState.reminders.find((reminder) => reminder.id === id) || null;
}

function createReminder(details, now) {
  const titleCheck = validateTitle(details.title);
  if (!titleCheck.ok) return toolFailure(titleCheck.message);

  const dueCheck = validateFutureDate(details.dueAt, now);
  if (!dueCheck.ok) return toolFailure(dueCheck.message);

  const reminder = {
    id: createId(),
    title: titleCheck.title,
    dueAt: dueCheck.dueAt.toISOString(),
    status: "pending",
    createdAt: now.toISOString(),
    completedAt: null,
    alertedAt: null
  };

  appState.reminders.push(reminder);
  const saved = commitReminders();
  const message = `Got it. I'll remind you ${phraseFor(dueCheck.dueAt, now)} about "${reminder.title}".`;
  return toolSuccess(withSaveNote(message, saved), { reminder, saved });
}

function completeReminder(id, now) {
  const reminder = findReminderById(id);
  if (!reminder) return toolFailure(NOT_FOUND_MESSAGE);
  if (reminder.status === "completed") {
    return toolFailure(`"${reminder.title}" is already marked as completed.`);
  }

  reminder.status = "completed";
  reminder.completedAt = now.toISOString();
  const saved = commitReminders();
  return toolSuccess(withSaveNote(`Marked "${reminder.title}" as completed.`, saved), { reminder, saved });
}

function reopenReminder(id) {
  const reminder = findReminderById(id);
  if (!reminder) return toolFailure(NOT_FOUND_MESSAGE);
  if (reminder.status === "pending") {
    return toolFailure(`"${reminder.title}" is still pending.`);
  }

  reminder.status = "pending";
  reminder.completedAt = null;
  const saved = commitReminders();
  return toolSuccess(withSaveNote(`Reopened "${reminder.title}".`, saved), { reminder, saved });
}

function deleteReminder(id) {
  const reminder = findReminderById(id);
  if (!reminder) return toolFailure(NOT_FOUND_MESSAGE);

  appState.reminders = appState.reminders.filter((item) => item.id !== id);
  const saved = commitReminders();
  return toolSuccess(withSaveNote(`Deleted "${reminder.title}".`, saved), { saved });
}

/* Applies changes to a reminder's title and/or time. The time must be in the
   future when it changes. A changed time clears alertedAt, so the new time
   can trigger its own alert. describeSuccess builds the message, so the
   save warning is added only once. */
function updateReminder(id, changes, now, describeSuccess) {
  const reminder = findReminderById(id);
  if (!reminder) return toolFailure(NOT_FOUND_MESSAGE);

  const updates = {};

  if (changes.title !== undefined) {
    const titleCheck = validateTitle(changes.title);
    if (!titleCheck.ok) return toolFailure(titleCheck.message);
    updates.title = titleCheck.title;
  }

  if (changes.dueAt !== undefined) {
    const currentTime = new Date(reminder.dueAt).getTime();
    const requestedTime = changes.dueAt instanceof Date ? changes.dueAt.getTime() : NaN;
    if (currentTime !== requestedTime) {
      const dueCheck = validateFutureDate(changes.dueAt, now);
      if (!dueCheck.ok) return toolFailure(dueCheck.message);
      updates.dueAt = dueCheck.dueAt.toISOString();
      updates.alertedAt = null;
    }
  }

  Object.assign(reminder, updates);
  const saved = commitReminders();
  const baseMessage = describeSuccess ? describeSuccess(reminder) : "Your reminder has been updated.";
  return toolSuccess(withSaveNote(baseMessage, saved), { reminder, saved });
}

function rescheduleReminder(id, dueAt, now) {
  return updateReminder(id, { dueAt }, now, (reminder) =>
    `Moved "${reminder.title}" to ${phraseFor(new Date(reminder.dueAt), now)}.`
  );
}

/* Finds reminders that match a phrase such as "grocery" or "call mom". An
   exact title match wins. Otherwise every meaningful word in the phrase must
   match the start of a word in the title. The prefix rule lets "grocery"
   match "groceries". */
function tokenize(text) {
  return normalizeSpaces(text).toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
}

function meaningfulTokens(text) {
  return tokenize(text).filter((token) => !TARGET_STOP_WORDS.has(token));
}

function findReminderMatches(query, allowedStatuses) {
  const statuses = allowedStatuses || ["pending", "completed"];
  const candidates = appState.reminders.filter((reminder) => statuses.includes(reminder.status));

  const wanted = normalizeSpaces(query).toLowerCase();
  const exactMatches = candidates.filter((reminder) => reminder.title.toLowerCase() === wanted);
  if (exactMatches.length > 0) return exactMatches;

  const tokens = meaningfulTokens(query);
  if (tokens.length === 0) return [];

  return candidates.filter((reminder) => {
    const titleWords = tokenize(reminder.title);
    return tokens.every((token) => {
      const prefix = token.slice(0, Math.max(3, token.length - 2));
      return titleWords.some((word) => word.startsWith(prefix));
    });
  });
}

/* Status helpers. "Overdue" means pending and already past its due time. */
function isPending(reminder) {
  return reminder.status === "pending";
}

function isOverdue(reminder, now) {
  return isPending(reminder) && new Date(reminder.dueAt).getTime() < now.getTime();
}

function isDueToday(reminder, now) {
  return isPending(reminder) && isSameLocalDay(new Date(reminder.dueAt), now);
}

function sortByDueDate(list) {
  return [...list].sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt));
}

function getPendingReminders() {
  return sortByDueDate(appState.reminders.filter(isPending));
}

function getCompletedReminders() {
  return appState.reminders
    .filter((reminder) => reminder.status === "completed")
    .sort((a, b) => new Date(b.completedAt || b.dueAt) - new Date(a.completedAt || a.dueAt));
}

/* "Today" includes pending reminders due today and any overdue reminders,
   because both need attention today. The "Due today" count uses this list. */
function getTodaysReminders(now) {
  return sortByDueDate(
    appState.reminders.filter((reminder) =>
      isPending(reminder) && (isDueToday(reminder, now) || isOverdue(reminder, now))
    )
  );
}

/* "Upcoming" means pending and not yet due. Reminders later today are included. */
function getUpcomingReminders(now) {
  return sortByDueDate(
    appState.reminders.filter((reminder) =>
      isPending(reminder) && new Date(reminder.dueAt).getTime() >= now.getTime()
    )
  );
}

function getRemindersByView(view, now) {
  if (view === "today") return getTodaysReminders(now);
  if (view === "upcoming") return getUpcomingReminders(now);
  if (view === "completed") return getCompletedReminders();
  if (view === "pending") return getPendingReminders();
  return [...getPendingReminders(), ...getCompletedReminders()];
}

/* Counts for the statistics cards in Part 3. These are calculated from the
   data each time, never hard-coded. */
function getReminderCounts(now) {
  return {
    active: getPendingReminders().length,
    dueToday: getTodaysReminders(now).length,
    completed: getCompletedReminders().length
  };
}

function describeReminderLine(reminder, index, now) {
  let suffix = "";
  if (reminder.status === "completed") {
    suffix = " (done)";
  } else if (isOverdue(reminder, now)) {
    suffix = " (overdue)";
  }
  return `${index + 1}. ${reminder.title}, ${formatWhen(new Date(reminder.dueAt), now)}${suffix}`;
}

function listReminders(view, now) {
  const reminders = getRemindersByView(view, now);
  if (reminders.length === 0) {
    return toolSuccess(EMPTY_VIEW_MESSAGES[view] || EMPTY_VIEW_MESSAGES.all, { reminders });
  }
  const lines = reminders.map((reminder, index) => describeReminderLine(reminder, index, now));
  return toolSuccess(`${VIEW_HEADINGS[view] || VIEW_HEADINGS.all}\n${lines.join("\n")}`, { reminders });
}

function getReminderSummary(now) {
  const pending = getPendingReminders();

  if (pending.length === 0) {
    return toolSuccess(
      appState.reminders.length === 0
        ? EMPTY_VIEW_MESSAGES.all
        : "You have no pending reminders. Nicely done."
    );
  }

  const overdue = pending.filter((reminder) => isOverdue(reminder, now));
  const dueLater = pending.filter((reminder) => isDueToday(reminder, now) && !isOverdue(reminder, now));
  const parts = [`You have ${pluralize(pending.length, "pending reminder")}.`];

  if (overdue.length > 0) {
    parts.push(`${overdue.length} ${overdue.length === 1 ? "is" : "are"} overdue.`);
  }
  if (dueLater.length > 0) {
    parts.push(`${dueLater.length} ${dueLater.length === 1 ? "is" : "are"} due later today.`);
  }

  const next = getUpcomingReminders(now)[0];
  if (next) {
    parts.push(`Next up: "${next.title}", ${phraseFor(new Date(next.dueAt), now)}.`);
  }

  return toolSuccess(parts.join(" "));
}

/* ==========================================================================
   7. DATE AND TIME PARSING
   parseWhen reads a phrase such as "tomorrow at 10 AM" and returns a status:
     ok           a clear future time (dueAt is set)
     past         the time has already passed (suggestedDueAt is set)
     ambiguous    an hour without AM or PM ("at 5"), so ask which one
     missing_time a day was given but no time
     none         no date or time was found
     invalid      the expression is impossible, such as "February 31"
   It also returns `remainder`, the text left over after removing the time
   phrase, which becomes the reminder title.
   ========================================================================== */

function makeWhen(status, fields) {
  return Object.assign(
    {
      status,
      dueAt: null,
      suggestedDueAt: null,
      dayKey: null,
      hour: null,
      minute: 0,
      remainder: "",
      message: ""
    },
    fields
  );
}

function invalidWhen(message) {
  return makeWhen("invalid", { message });
}

/* Removes the first match of a pattern and returns it, plus the text
   that remains. */
function takeMatch(text, pattern) {
  const match = text.match(pattern);
  if (!match) {
    return { match: null, rest: text };
  }
  const before = text.slice(0, match.index);
  const after = text.slice(match.index + match[0].length);
  return { match, rest: `${before} ${after}` };
}

function to24Hour(hour12, isPm) {
  if (!isPm) return hour12 === 12 ? 0 : hour12;
  return hour12 === 12 ? 12 : hour12 + 12;
}

function buildCalendarDate(year, monthIndex, day) {
  const candidate = new Date(year, monthIndex, day);
  // JavaScript rolls over invalid dates such as 31 February. Detect that here.
  if (candidate.getMonth() !== monthIndex || candidate.getDate() !== day) return null;
  return candidate;
}

/* Resolves "25 October" or "October 25". Without a year, the next future
   occurrence is used. */
function resolveCalendarDate(dayNumber, monthIndex, yearText, now) {
  const today = startOfDay(now);
  const invalidMessage = "That date doesn't exist. Please check the day and month.";

  if (yearText) {
    const candidate = buildCalendarDate(Number(yearText), monthIndex, dayNumber);
    if (!candidate) return { error: invalidMessage };
    if (candidate < today) return { error: "That date has already passed. Please choose a future date." };
    return { dayKey: dayKeyFromDate(candidate) };
  }

  for (let offset = 0; offset < 9; offset += 1) {
    const candidate = buildCalendarDate(today.getFullYear() + offset, monthIndex, dayNumber);
    if (candidate && candidate >= today) {
      return { dayKey: dayKeyFromDate(candidate) };
    }
  }
  return { error: invalidMessage };
}

/* "Monday" on a Monday means today. "Next Monday" always means a later day. */
function resolveWeekday(weekdayIndex, isNext, now) {
  const today = startOfDay(now);
  let offset = (weekdayIndex - today.getDay() + 7) % 7;
  if (isNext && offset === 0) offset = 7;
  return dayKeyFromDate(addDays(today, offset));
}

function parseWhen(input, now, options) {
  const defaultDayKey = (options && options.defaultDayKey) || null;
  let rest = normalizeSpaces(input);
  let durationMs = null;
  let explicitDayKey = null;
  let foundDay = false;
  let tonight = false;
  let time = null;
  let ambiguous = null;

  // 1. Lengths of time: "in 30 minutes", "in 2 hours", "in half an hour", "in 3 days"
  const halfHour = takeMatch(rest, HALF_HOUR_RE);
  if (halfHour.match) {
    rest = halfHour.rest;
    durationMs = 30 * MINUTE_MS;
  } else {
    const duration = takeMatch(rest, DURATION_RE);
    if (duration.match) {
      rest = duration.rest;
      const rawAmount = duration.match[1].toLowerCase();
      const amount = /^\d+$/.test(rawAmount) ? Number(rawAmount) : NUMBER_WORDS[rawAmount];
      const unit = duration.match[2].toLowerCase();

      if (!amount) {
        return invalidWhen("Please use a number above zero, such as 'in 30 minutes'.");
      }
      if (unit.startsWith("day")) {
        foundDay = true;
        explicitDayKey = dayKeyFromDate(addDays(startOfDay(now), amount));
      } else if (unit.startsWith("h")) {
        durationMs = amount * HOUR_MS;
      } else {
        durationMs = amount * MINUTE_MS;
      }
    }
  }

  // 2. Calendar days. Only the first one found is used.
  if (!foundDay) {
    const monthDay = takeMatch(rest, MONTH_DAY_RE);
    if (monthDay.match) {
      rest = monthDay.rest;
      const dayNumber = Number(monthDay.match[1] || monthDay.match[4]);
      const monthName = (monthDay.match[2] || monthDay.match[3]).toLowerCase();
      const resolved = resolveCalendarDate(dayNumber, MONTH_NUMBERS[monthName], monthDay.match[5], now);
      if (resolved.error) return invalidWhen(resolved.error);
      foundDay = true;
      explicitDayKey = resolved.dayKey;
    }
  }

  if (!foundDay) {
    const weekday = takeMatch(rest, WEEKDAY_RE);
    if (weekday.match) {
      rest = weekday.rest;
      foundDay = true;
      explicitDayKey = resolveWeekday(
        WEEKDAY_NUMBERS[weekday.match[2].toLowerCase()],
        Boolean(weekday.match[1]),
        now
      );
    }
  }

  if (!foundDay) {
    const tomorrow = takeMatch(rest, TOMORROW_RE);
    if (tomorrow.match) {
      rest = tomorrow.rest;
      foundDay = true;
      explicitDayKey = dayKeyFromDate(addDays(startOfDay(now), 1));
    }
  }

  if (!foundDay) {
    const today = takeMatch(rest, TODAY_RE);
    if (today.match) {
      rest = today.rest;
      foundDay = true;
      tonight = today.match[1].toLowerCase() === "tonight";
      explicitDayKey = dayKeyFromDate(startOfDay(now));
    }
  }

  // 3. Clock times. The first one found is used.
  const noon = takeMatch(rest, NOON_RE);
  if (noon.match) {
    rest = noon.rest;
    time = noon.match[1].toLowerCase() === "noon" ? { hour: 12, minute: 0 } : { hour: 0, minute: 0 };
  }

  if (!time) {
    const ampm = takeMatch(rest, AMPM_RE);
    if (ampm.match) {
      rest = ampm.rest;
      const hour12 = Number(ampm.match[1]);
      if (hour12 < 1 || hour12 > 12) {
        return invalidWhen("Please use an hour from 1 to 12 when you add AM or PM.");
      }
      const minute = ampm.match[2] ? Number(ampm.match[2]) : 0;
      const isPm = ampm.match[3].toLowerCase() === "p";
      time = { hour: to24Hour(hour12, isPm), minute };
    }
  }

  if (!time) {
    const colon = takeMatch(rest, COLON_TIME_RE);
    if (colon.match) {
      rest = colon.rest;
      const hour = Number(colon.match[1]);
      const minute = Number(colon.match[2]);
      if (hour > 23) {
        return invalidWhen("That time isn't valid. Use an hour from 0 to 23, or add AM or PM.");
      }
      // Hours 13 to 23 and 0 are unambiguous 24-hour times. "9:30" could mean AM or PM, so ask.
      if (hour >= 13 || hour === 0) {
        time = { hour, minute };
      } else {
        ambiguous = { hour, minute };
      }
    }
  }

  if (!time && !ambiguous) {
    const bare = takeMatch(rest, BARE_AT_RE);
    if (bare.match) {
      rest = bare.rest;
      const hour = Number(bare.match[1]);
      if (hour > 23 || hour === 0) {
        return invalidWhen("That time isn't valid. Use an hour from 1 to 23, or add AM or PM.");
      }
      if (hour >= 13) {
        time = { hour, minute: 0 };
      } else {
        ambiguous = { hour, minute: 0 };
      }
    }
  }

  // "Tonight at 9" is clearly evening, so an unmarked hour from 1 to 11 means PM.
  if (ambiguous && tonight && ambiguous.hour >= 1 && ambiguous.hour <= 11) {
    time = { hour: ambiguous.hour + 12, minute: ambiguous.minute };
    ambiguous = null;
  }

  const remainder = normalizeSpaces(rest);
  const dayKey = explicitDayKey || defaultDayKey;

  if (durationMs !== null && (time || ambiguous)) {
    return invalidWhen("Please choose either a clock time, such as 5 PM, or a length of time, such as in 2 hours. Not both.");
  }

  if (durationMs !== null) {
    return makeWhen("ok", { dueAt: new Date(now.getTime() + durationMs), remainder });
  }

  if (ambiguous) {
    return makeWhen("ambiguous", {
      dayKey,
      hour: ambiguous.hour,
      minute: ambiguous.minute,
      remainder
    });
  }

  if (!time) {
    return makeWhen(foundDay ? "missing_time" : "none", { dayKey, remainder });
  }

  const baseDayKey = dayKey || dayKeyFromDate(startOfDay(now));
  const baseDate = dateFromDayKey(baseDayKey);
  const dueAt = new Date(
    baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(),
    time.hour, time.minute, 0, 0
  );

  // If clocks skip this hour (daylight saving), the browser moves the time. Tell the user.
  if (dueAt.getHours() !== time.hour) {
    return invalidWhen("That time doesn't exist on that day because clocks change. Please choose another time.");
  }

  if (dueAt.getTime() <= now.getTime()) {
    const nextDay = new Date(
      baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + 1,
      time.hour, time.minute, 0, 0
    );
    return makeWhen("past", { dueAt, suggestedDueAt: nextDay, dayKey: baseDayKey, remainder });
  }

  return makeWhen("ok", { dueAt, dayKey: baseDayKey, remainder });
}

/* ==========================================================================
   8. TITLE CLEANUP
   ========================================================================== */

/* Removes filler words left over after a time has been taken out of the
   phrase. "to wash clothes at" becomes "Wash clothes". */
function cleanTitle(text) {
  let result = normalizeSpaces(text);
  let previous = null;

  while (result !== previous) {
    previous = result;
    result = result
      .replace(/^(?:please|to|that|about|for)\s+/i, "")
      .replace(/\s+(?:at|on|by|around|to)$/i, "")
      .replace(/^[\s,:;.\-"'“”‘’]+|[\s,:;.\-"'“”‘’?!]+$/g, "")
      .trim();
  }

  return result ? result.charAt(0).toUpperCase() + result.slice(1) : "";
}

/* Cleans the phrase the user used to name a reminder, such as "my grocery
   reminder" or "call Mom", so it can be matched against saved titles. */
function cleanTarget(text) {
  let result = normalizeSpaces(text).replace(/^["'“”‘’]+|["'“”‘’]+$/g, "");
  let previous = null;

  while (result !== previous) {
    previous = result;
    result = result
      .replace(/^(?:my|the|a|an|this|that)\s+/i, "")
      .replace(/^reminders?\s+(?:to|about|for|of)\s+/i, "")
      .replace(/^(?:to|about|for)\s+/i, "")
      .replace(/\s+(?:reminders?|tasks?)$/i, "")
      .replace(/\s+as\s+(?:done|completed?|finished)$/i, "")
      .replace(/^reminders?$/i, "")
      .trim();
  }

  return result;
}

/* Splits "my grocery reminder to tomorrow at 5 PM" at its last "to", "for",
   "until", or "till". The last one is used so the time part stays intact. */
function splitAtLastKeyword(text) {
  const pattern = /\s+(?:to|for|until|till)\s+/gi;
  let lastMatch = null;
  let match = pattern.exec(text);
  while (match !== null) {
    lastMatch = match;
    match = pattern.exec(text);
  }
  if (!lastMatch) return null;
  return {
    left: text.slice(0, lastMatch.index),
    right: text.slice(lastMatch.index + lastMatch[0].length)
  };
}

/* ==========================================================================
   9. INTENT PARSER
   parseUserIntent returns one of these shapes. The dispatcher in Part 3
   handles each one:

     { type: "empty" }
     { type: "help" }
     { type: "unknown" }
     { type: "reply", message }
     { type: "action", action: "create", title, dueAt }
     { type: "action", action: "list", view }   view: all | today | upcoming | pending | completed
     { type: "action", action: "summary" }
     { type: "action", action: "complete", target }
     { type: "action", action: "delete", target }
     { type: "action", action: "reschedule", target, dueAt }
     { type: "clarify", question, pending }     ask a question and store pending
     { type: "confirm", question, pending }     ask yes or no and store pending
     { type: "cancel_pending", message }        drop the pending question

   The parser never changes data.
   ========================================================================== */

function replyResult(message) {
  return { type: "reply", message };
}

function listAction(view) {
  return { type: "action", action: "list", view };
}

function makeAwaitWhen(context, dayKey, ambiguous) {
  return {
    kind: "await_when",
    purpose: context.purpose,
    title: context.title || "",
    target: context.target || "",
    dayKey: dayKey || null,
    clockHour: ambiguous ? ambiguous.hour : null,
    clockMinute: ambiguous ? ambiguous.minute : 0
  };
}

/* Turns a title and a date into either an action or a follow-up question. */
function buildActionPlan(context, dueAt) {
  if (context.purpose === "create") {
    if (!context.title) {
      return {
        type: "clarify",
        question: "What should I remind you about?",
        pending: { kind: "await_title", purpose: "create", title: "", target: "", dueIso: dueAt.toISOString() }
      };
    }
    const titleCheck = validateTitle(context.title);
    if (!titleCheck.ok) return replyResult(titleCheck.message);
    return { type: "action", action: "create", title: titleCheck.title, dueAt };
  }

  if (!context.target) {
    return replyResult("Which reminder should I move? Tell me a few words from it.");
  }
  return { type: "action", action: "reschedule", target: context.target, dueAt };
}

/* Decides the next step after a time has been parsed. Used for new commands
   and for replies to earlier questions. */
function planFromWhen(when, context, now) {
  const purpose = context.purpose;

  if (when.status === "invalid") {
    return replyResult(when.message);
  }

  if (when.status === "ok") {
    return buildActionPlan(context, when.dueAt);
  }

  if (when.status === "past") {
    return {
      type: "confirm",
      question: `That time has already passed. Should I set it for ${phraseFor(when.suggestedDueAt, now)} instead? Reply yes or no.`,
      pending: {
        kind: "confirm_past",
        purpose,
        title: context.title || "",
        target: context.target || "",
        dueIso: when.suggestedDueAt.toISOString()
      }
    };
  }

  if (when.status === "ambiguous") {
    const clock = formatClockText(when.hour, when.minute);
    return {
      type: "clarify",
      question: `Do you mean ${clock} AM or ${clock} PM?`,
      pending: makeAwaitWhen(context, when.dayKey, when)
    };
  }

  if (when.status === "missing_time") {
    return {
      type: "clarify",
      question: `What time ${phraseForDayKey(when.dayKey, now)} should I use? For example, 10 AM or 5:30 PM.`,
      pending: makeAwaitWhen(context, when.dayKey, null)
    };
  }

  // status "none": no usable date or time was found.
  let question;
  if (purpose === "create") {
    question = context.title
      ? `When should I remind you about "${context.title}"? For example, tomorrow at 10 AM or in 30 minutes.`
      : "What should I remind you about, and when? For example: wash clothes tomorrow at 10 AM.";
  } else {
    question = `When should I move "${context.target}" to? For example, tomorrow at 5 PM.`;
  }

  return {
    type: "clarify",
    question,
    pending: makeAwaitWhen(context, when.dayKey, null)
  };
}

/* Handles "Remind me tomorrow at 10 AM to wash clothes" and similar phrases.
   The lead-in ("remind me") has already been removed by the caller. */
function parseCreateCommand(afterTrigger, now) {
  const when = parseWhen(afterTrigger, now);
  const title = when.status === "invalid" ? "" : cleanTitle(when.remainder);
  return planFromWhen(when, { purpose: "create", title, target: "" }, now);
}

/* Handles "Move my grocery reminder to tomorrow at 5 PM". */

function parseRescheduleCommand(body, now) {
  const split = splitAtLastKeyword(body);

  let target;
  let when;

  if (split) {
    target = cleanTarget(split.left);
    when = parseWhen(split.right, now);
  } else {
    when = parseWhen(body, now);
    target = cleanTarget(when.remainder);
  }

  if (!target) {
    if (when.status === "ok" || when.status === "ambiguous" ||
        when.status === "missing_time") {
      return {
        type: "clarify",
        question: "Which reminder should I move? Tell me a few words from its title.",
        pending: {
          kind: "await_title",
          purpose: "reschedule",
          title: "",
          target: "",
          dueIso: when.status === "ok" ? when.dueAt.toISOString() : null,
          dayKey: when.dayKey || null,
          clockHour: when.status === "ambiguous" ? when.hour : null,
          clockMinute: when.status === "ambiguous" ? when.minute : 0
        }
      };
    }

    return replyResult("Which reminder should I move? Tell me a few words from it.");
  }

  return planFromWhen(when, { purpose: "reschedule", title: "", target }, now);
}


/* Interprets a message that starts a new command, not a reply to a question. */
function parseFreshCommand(text, now) {
  const command = text.replace(/[.!?]+$/, "").trim();

  if (HELP_RE.test(command)) {
    return { type: "help" };
  }

  const deleteMatch = command.match(DELETE_RE);
  if (deleteMatch) {
    const target = cleanTarget(deleteMatch[1]);
    if (!target) {
      return replyResult("Which reminder should I cancel? Tell me a few words from it, such as 'cancel call Mom'.");
    }
    return { type: "action", action: "delete", target };
  }

  const completeMatch = command.match(COMPLETE_RE) || command.match(I_FINISHED_RE);
  if (completeMatch) {
    const target = cleanTarget(completeMatch[1]);
    if (!target) {
      return replyResult("Which reminder should I mark as done? Tell me a few words from it.");
    }
    return { type: "action", action: "complete", target };
  }

  const rescheduleMatch = command.match(RESCHEDULE_RE);
  if (rescheduleMatch) {
    return parseRescheduleCommand(rescheduleMatch[1], now);
  }

  const createMatch = command.match(CREATE_RE);
  if (createMatch) {
    const afterTrigger = command.slice(createMatch.index + createMatch[0].length);
    return parseCreateCommand(afterTrigger, now);
  }

  if (SUMMARY_RE.test(command)) return { type: "action", action: "summary" };
  if (COMPLETED_LIST_RE.test(command)) return listAction("completed");
  if (TODAY_LIST_RE.test(command)) return listAction("today");
  if (UPCOMING_LIST_RE.test(command)) return listAction("upcoming");
  if (PENDING_LIST_RE.test(command)) return listAction("pending");
  if (LIST_ALL_RE.test(command)) return listAction("all");

  return { type: "unknown" };
}

/* Interprets a reply to an open question, such as "5 pm" after "Do you mean
   5 AM or 5 PM?". Returns null when the message is clearly a new command,
   so the open question is dropped and the command runs instead. */
function resolvePendingReply(text, pending, now) {
  const lower = text.toLowerCase().replace(/[.!?]+$/, "").trim();

  if (CANCEL_RE.test(lower)) {
    return { type: "cancel_pending", message: "Okay, I haven't changed anything." };
  }

  if (LOOKS_LIKE_COMMAND_RE.test(lower)) {
    return null;
  }

  if (pending.kind === "confirm_past") {
    if (YES_RE.test(lower)) {
      return buildActionPlan(pending, new Date(pending.dueIso));
    }
    if (NO_RE.test(lower)) {
      return { type: "cancel_pending", message: "Okay, I haven't changed anything." };
    }
    return { type: "confirm", question: "Please reply yes or no.", pending };
  }

  
if (pending.kind === "await_title") {
  const title = cleanTitle(text);

  if (!title) {
    return {
      type: "clarify",
      question: "Please tell me the reminder title.",
      pending
    };
  }

  if (pending.purpose === "reschedule") {
    if (pending.dueIso) {
      return buildActionPlan(
        { purpose: "reschedule", title: "", target: title },
        new Date(pending.dueIso)
      );
    }

    const when = {
      status: pending.clockHour !== null ? "ambiguous" : "missing_time",
      hour: pending.clockHour,
      minute: pending.clockMinute || 0,
      dayKey: pending.dayKey
    };

    return planFromWhen(
      when,
      { purpose: "reschedule", title: "", target: title },
      now
    );
  }

  return buildActionPlan(
    { purpose: "create", title, target: "" },
    new Date(pending.dueIso)
  );
}



  if (pending.kind === "await_when") {
    let reply = text;
    // A bare "pm" after "Do you mean 5 AM or 5 PM?" completes the earlier clock time.
    if (pending.clockHour !== null && AM_PM_ONLY_RE.test(lower)) {
      reply = `${formatClockText(pending.clockHour, pending.clockMinute)} ${lower}`;
    }

    const when = parseWhen(reply, now, { defaultDayKey: pending.dayKey });
    const title = pending.purpose === "create"
      ? (pending.title || cleanTitle(when.remainder))
      : "";

    return planFromWhen(when, { purpose: pending.purpose, title, target: pending.target }, now);
  }

  return null;
}

/* Main entry point used by Part 3. Pass the current time and the pending
   question, if any. */
function parseUserIntent(rawText, context) {
  const now = context.now;
  const text = normalizeSpaces(rawText).slice(0, MAX_CHAT_INPUT_LENGTH);

  if (!text) {
    return { type: "empty" };
  }

  if (context.pending) {
    const followUp = resolvePendingReply(text, context.pending, now);
    if (followUp) return followUp;
  }

  return parseFreshCommand(text, now);
}

/* ==========================================================================
   Part 3 of 3: the second half of script.js.
   Append this below the "END OF PART 2" comment, in the same file.
   Contents: UI state, the dispatcher, page rendering, chat, the edit dialog,
   due-time alerts, spoken replies, voice input, and start-up.
   ========================================================================== */

/* ==========================================================================
   10. UI SETTINGS AND STATE
   ========================================================================== */

const TICK_MS = 10 * 1000;            // how often the page checks due times and refreshes labels
const PROCESSING_PAUSE_MS = 250;      // short pause so the processing state is visible
const TOAST_MS = 4000;
const ERROR_FLASH_MS = 2500;
const MAX_CHAT_MESSAGES = 60;

const READY_STATUS = "Ready when you are.";
const STATUS_BY_TONE = {
  info: READY_STATUS,
  question: "I need one more detail.",
  error: "That didn't work. See the reply above."
};

// Feature detection, checked once when the page loads.
const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition || null;
const speechSynthesisSupported = "speechSynthesis" in window && typeof window.SpeechSynthesisUtterance === "function";
const notificationsSupported = "Notification" in window;

const headerDateFormatter = new Intl.DateTimeFormat(undefined, { weekday: "long", day: "numeric", month: "long" });

/* Values that change while the page runs. Reminder data stays in appState. */
const uiState = {
  filter: "all",               // all | today | upcoming | completed
  busy: false,                 // true while a chat message is being handled
  speechOutputOn: false,       // spoken replies stay off until the user turns them on
  speaking: false,
  speechToken: 0,              // changes with every utterance so old callbacks are ignored
  recognition: null,           // created the first time the microphone is pressed
  micActive: false,
  heard: "",                   // final speech text from the current listening session
  inputBeforeVoice: "",        // text already typed before the microphone was used
  voiceError: "",
  voiceDiscard: false,         // true when a message was sent while the microphone was on
  alertIds: new Set(),         // reminders that came due and have not been dismissed
  listSignature: "",           // lets the list skip rebuilding when nothing visible changed
  justChangedId: null,         // reminder to highlight after it was completed
  editingId: null,
  editReturnFocus: null,
  startedAt: 0,                // when this page was opened, in milliseconds
  orbTimer: null,
  toastTimer: null
};

/* Element references, filled once by collectElements(). */
const dom = {};

/* ==========================================================================
   11. SMALL HELPERS
   ========================================================================== */

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getBrowserLanguage() {
  return navigator.language || "en-US";
}

function getGreeting(now) {
  const hour = now.getHours();
  if (hour >= 5 && hour < 12) return "Good morning.";
  if (hour >= 12 && hour < 17) return "Good afternoon.";
  return "Good evening.";
}

/* Removes bullet symbols and line breaks so the speech engine reads smoothly. */
function toSpeakableText(text) {
  return text.replace(/•\s*/g, "").replace(/\n+/g, ". ").trim();
}

function collectElements() {
  const ids = {
    dateEl: "current-date",
    greeting: "greeting",
    speechToggle: "speech-toggle",
    alertsToggle: "alerts-toggle",
    dueBanner: "due-banner",
    dueText: "due-text",
    dueView: "due-view",
    dueDismiss: "due-dismiss",
    storageWarning: "storage-warning",
    orb: "orb",
    assistantStatus: "assistant-status",
    chatLog: "chat-log",
    chatForm: "chat-form",
    chatInput: "chat-input",
    micButton: "mic-button",
    clearChat: "clear-chat",
    examples: "examples",
    statActive: "stat-active",
    statToday: "stat-today",
    statCompleted: "stat-completed",
    listTitle: "list-title",
    reminderList: "reminder-list",
    emptyState: "empty-state",
    notifyStatus: "notify-status",
    editDialog: "edit-dialog",
    editForm: "edit-form",
    editTitle: "edit-title",
    editDate: "edit-date",
    editTime: "edit-time",
    editError: "edit-error",
    editCancel: "edit-cancel",
    toast: "toast"
  };

  let allFound = true;
  Object.keys(ids).forEach((key) => {
    dom[key] = document.getElementById(ids[key]);
    if (!dom[key]) {
      allFound = false;
      console.error(`RememberMe AI: index.html is missing an element with id "${ids[key]}".`);
    }
  });

  dom.filterGroup = document.querySelector(".filters");
  dom.filterButtons = document.querySelectorAll(".filter");
  if (!dom.filterGroup || dom.filterButtons.length === 0) {
    allFound = false;
    console.error("RememberMe AI: index.html is missing the reminder filter buttons.");
  }

  return allFound;
}

/* ==========================================================================
   12. PAGE STATUS, CHAT, AND TOASTS
   ========================================================================== */

function setOrbState(state) {
  dom.orb.dataset.state = state;
}

function setAssistantStatus(text) {
  dom.assistantStatus.textContent = text;
}

/* Sets the orb to match what is happening right now. Priority: listening,
   then speaking, then processing, then idle. */
function settleOrb() {
  if (uiState.micActive) setOrbState("listening");
  else if (uiState.speaking) setOrbState("speaking");
  else if (uiState.busy) setOrbState("processing");
  else setOrbState("idle");
}

/* Briefly shows the error state, then returns to the state that is current. */
function flashErrorOrb() {
  setOrbState("error");
  clearTimeout(uiState.orbTimer);
  uiState.orbTimer = setTimeout(settleOrb, ERROR_FLASH_MS);
}

function addChatMessage(role, text) {
  const wrapper = document.createElement("div");
  wrapper.className = `message message--${role}`;

  // Screen readers hear who is speaking. Sighted users see only the bubble.
  const who = document.createElement("span");
  who.className = "visually-hidden";
  who.textContent = role === "user" ? "You said: " : "Assistant said: ";

  const bubble = document.createElement("p");
  bubble.className = "message__text";
  bubble.textContent = text;

  wrapper.append(who, bubble);
  dom.chatLog.append(wrapper);

  while (dom.chatLog.children.length > MAX_CHAT_MESSAGES) {
    dom.chatLog.firstElementChild.remove();
  }
  dom.chatLog.scrollTop = dom.chatLog.scrollHeight;
}

function showToast(message, tone) {
  dom.toast.textContent = message;
  dom.toast.dataset.tone = tone || "info";
  dom.toast.classList.add("is-visible");
  clearTimeout(uiState.toastTimer);
  uiState.toastTimer = setTimeout(() => dom.toast.classList.remove("is-visible"), TOAST_MS);
}

function focusListHeading() {
  dom.listTitle.focus({ preventScroll: true });
}

/* ==========================================================================
   13. DISPATCHER
   Flow: user text -> parseUserIntent (Part 2) -> executeIntent -> tools
   (Part 2) -> an outcome describing what to show. Outcomes look like:
     { message, tone: "info" | "question" | "error", pending, filter? }
   The message always comes from a tool or parser result, so the assistant
   never claims more than the underlying function achieved.
   ========================================================================== */

function replyOutcome(message, tone) {
  return { message, tone: tone || "info", pending: null };
}

function questionOutcome(message, pending) {
  return { message, tone: "question", pending };
}

function toolOutcome(result) {
  return { message: result.message, tone: result.ok ? "info" : "error", pending: null };
}

/* Converts a list view name to the matching filter button. */
function filterForView(view) {
  const map = { all: "all", pending: "all", today: "today", upcoming: "upcoming", completed: "completed" };
  return map[view] || "all";
}

function describeAmbiguousMatches(target, matches, now) {
  const shown = matches.slice(0, 5).map((reminder, index) => describeReminderLine(reminder, index, now));
  const extra = matches.length > 5 ? `\n…and ${matches.length - 5} more.` : "";
  return `I found ${pluralize(matches.length, "reminder")} that could match "${target}":\n${shown.join("\n")}${extra}\nWhich one do you mean? Try a few more words from its title.`;
}

function describeMissingReminder(target, statuses) {
  if (appState.reminders.length === 0) {
    return EMPTY_VIEW_MESSAGES.all;
  }
  if (statuses.length === 1 && statuses[0] === "pending") {
    const finished = findReminderMatches(target, ["completed"]);
    if (finished.length === 1) {
      return `"${finished[0].title}" is already marked as completed.`;
    }
  }
  return `I couldn't find a reminder matching "${target}". Try a few words from its title, or ask "What do I need to do today?" to see your list.`;
}

/* Finds the single reminder a chat command refers to. If none or several
   match, returns an outcome explaining that, so nothing changes. */
function findSingleReminder(target, statuses, now, selectionContext = {}) {
  const matches = findReminderMatches(target, statuses);

  if (matches.length === 1) {
    return { reminder: matches[0] };
  }

  if (matches.length > 1) {
    const reminderIds = matches.slice(0, 5).map(reminder => reminder.id);

    return {
      outcome: questionOutcome(
        describeAmbiguousMatches(target, matches.slice(0, 5), now),
        {
          kind: "select_reminder",
          target,
          statuses,
          reminderIds,
          ...selectionContext
        }
      )
    };
  }

  return {
    outcome: replyOutcome(
      describeMissingReminder(target, statuses),
      "error"
    )
  };
}


function completeFromChat(target, now) {
  const found = findSingleReminder(
    target,
    ["pending"],
    now,
    { action: "complete" }
  );

  if (found.outcome) return found.outcome;

  const result = completeReminder(found.reminder.id, now);

  if (result.ok) uiState.justChangedId = found.reminder.id;

  return toolOutcome(result);
}


/* Deleting is destructive, so this asks first. The reply is handled by
   handleDeleteConfirmation on the next message. */

function deleteFromChat(target, now) {
  const found = findSingleReminder(
    target,
    ["pending", "completed"],
    now,
    { action: "delete" }
  );

  if (found.outcome) return found.outcome;

  const { reminder } = found;

  return {
    message: `Delete "${reminder.title}"? Reply yes to delete it, or no to keep it.`,
    tone: "question",
    pending: {
      kind: "confirm_delete",
      reminderId: reminder.id,
      title: reminder.title
    }
  };
}



function rescheduleFromChat(target, dueAt, now) {
  const found = findSingleReminder(
    target,
    ["pending"],
    now,
    {
      action: "reschedule",
      dueIso: dueAt.toISOString()
    }
  );

  if (found.outcome) return found.outcome;

  return toolOutcome(
    rescheduleReminder(found.reminder.id, dueAt, now)
  );
}


function runAction(intent, now) {
  switch (intent.action) {
    case "create":
      return toolOutcome(createReminder({ title: intent.title, dueAt: intent.dueAt }, now));
    case "list":
      return Object.assign(replyOutcome(listReminders(intent.view, now).message), {
        filter: filterForView(intent.view)
      });
    case "summary":
      return replyOutcome(getReminderSummary(now).message);
    case "complete":
      return completeFromChat(intent.target, now);
    case "delete":
      return deleteFromChat(intent.target, now);
    case "reschedule":
      return rescheduleFromChat(intent.target, intent.dueAt, now);
    default:
      return replyOutcome(UNKNOWN_TEXT);
  }
}

/* Maps each parser result shape from Part 2 to an outcome. */
function executeIntent(intent, now) {
  switch (intent.type) {
    case "help":
      return replyOutcome(HELP_TEXT);
    case "unknown":
      return replyOutcome(UNKNOWN_TEXT);
    case "reply":
    case "cancel_pending":
      return replyOutcome(intent.message);
    case "clarify":
    case "confirm":
      return questionOutcome(intent.question, intent.pending);
    case "action":
      return runAction(intent, now);
    default:
      return replyOutcome("Type a reminder or question first.");
  }
}

/* Handles a yes or no after "Delete X?". Returns null when the message is
   clearly a new command, so the question is dropped and the command runs. */
function handleDeleteConfirmation(text, pending) {
  const reply = text.toLowerCase().replace(/[.!?]+$/, "").trim();

  if (CANCEL_RE.test(reply) || NO_RE.test(reply)) {
    return replyOutcome(`Okay, I haven't deleted "${pending.title}".`);
  }
  if (YES_RE.test(reply)) {
    return toolOutcome(deleteReminder(pending.reminderId));
  }
  if (LOOKS_LIKE_COMMAND_RE.test(reply)) {
    return null;
  }
  return {
    message: `Please reply yes to delete "${pending.title}", or no to keep it.`,
    tone: "question",
    pending
  };
}
function resolveReminderSelection(text, pending, now) {
  const reply = text.trim().toLowerCase();

  const reminders = pending.reminderIds
    .map(id => appState.reminders.find(reminder => reminder.id === id))
    .filter(reminder => reminder && pending.statuses.includes(reminder.status));

  if (reminders.length === 0) {
    return replyOutcome(
      "I couldn't find those reminders anymore. Please try your command again.",
      "error"
    );
  }

  const ordinals = {
    "first": 1,
    "first one": 1,
    "1": 1,
    "option 1": 1,
    "second": 2,
    "second one": 2,
    "2": 2,
    "option 2": 2,
    "third": 3,
    "third one": 3,
    "3": 3,
    "option 3": 3,
    "fourth": 4,
    "fourth one": 4,
    "4": 4,
    "option 4": 4,
    "fifth": 5,
    "fifth one": 5,
    "5": 5,
    "option 5": 5
  };

  let selected = null;
  const optionNumber = ordinals[reply];

  if (optionNumber && optionNumber <= reminders.length) {
    selected = reminders[optionNumber - 1];
  }

  if (!selected) {
    
const timeMatch = reply.match(
  /\b(\d{1,2})(?::(\d{2}))?\s*([ap])\.?\s*m\.?\b/i
);





    if (timeMatch) {
      let hour = Number(timeMatch[1]);
      const minute = Number(timeMatch[2] || 0);
      const period = timeMatch[3].toLowerCase();

      if (hour >= 1 && hour <= 12 && minute < 60) {
        if (period === "am" && hour === 12) hour = 0;
        if (period === "pm" && hour !== 12) hour += 12;

        const matches = reminders.filter(reminder => {
          const dueAt = new Date(reminder.dueAt);

          return !Number.isNaN(dueAt.getTime()) &&
            dueAt.getHours() === hour &&
            dueAt.getMinutes() === minute;
        });

        if (matches.length === 1) {
          selected = matches[0];
        }
      }
    }
  }

  if (!selected) {
    return questionOutcome(
      "Please choose an option number, say the time (for example, 10 AM), or type a few words from the reminder title.",
      pending
    );
  }

 
if (pending.action === "complete") {
  const result = completeReminder(selected.id, now);

  if (result.ok) {
    uiState.justChangedId = selected.id;
  }

  return toolOutcome(result);
}


  if (pending.action === "delete") {
    return questionOutcome(
      `Are you sure you want to delete "${selected.title}"? Please say yes or no.`,
      {
        kind: "confirm_delete",
        reminderId: selected.id,
        title: selected.title
      }
    );
  }

  if (pending.action === "reschedule" && pending.dueIso) {
    return rescheduleReminder(
      selected.id,
      new Date(pending.dueIso),
      now
    );
  }

  return replyOutcome(
    "I identified the reminder, but I couldn't determine the requested action. Please try your command again.",
    "error"
  );
}
function runTurn(text, now) {
  if (appState.pending && appState.pending.kind === "confirm_delete") {
    const handled = handleDeleteConfirmation(text, appState.pending);
    if (handled) return handled;
  }

  if (appState.pending && appState.pending.kind === "select_reminder") {
    const handled = resolveReminderSelection(text, appState.pending, now);
    if (handled) return handled;
  }

  const intent = parseUserIntent(text, { now, pending: appState.pending });

  return executeIntent(intent, now);
}


/* Entry point for typed text, examples, and recognized speech. */
async function handleUserMessage(rawText) {
  const text = normalizeSpaces(rawText).slice(0, MAX_CHAT_INPUT_LENGTH);
  if (!text) {
    setAssistantStatus("Type a reminder or question first.");
    dom.chatInput.focus();
    return;
  }
  if (uiState.busy) return;

  uiState.busy = true;
  let outcome;
  try {
    stopSpeech();
    if (uiState.micActive) {
      uiState.voiceDiscard = true;
      stopListening();
    }

    addChatMessage("user", text);
    dom.chatInput.value = "";
    setOrbState("processing");
    setAssistantStatus("Working on it…");

    await wait(PROCESSING_PAUSE_MS);
    outcome = runTurn(text, new Date());
    appState.pending = outcome.pending || null;
    if (outcome.filter) uiState.filter = outcome.filter;
  } catch (error) {
    // Log only the error name, never the message text, to keep reminder content out of the console.
    console.error("RememberMe AI: unexpected error while handling a message.", error && error.name);
    appState.pending = null;
    outcome = replyOutcome("Something unexpected went wrong. Please try again.", "error");
  } finally {
    uiState.busy = false;
  }

  renderAll(true);
  addChatMessage("assistant", outcome.message);
  finishTurn(outcome);
}

function finishTurn(outcome) {
  setAssistantStatus(STATUS_BY_TONE[outcome.tone] || READY_STATUS);
  if (outcome.tone === "error") {
    flashErrorOrb();
  } else {
    settleOrb();
  }
  speakText(outcome.message); // Does nothing unless spoken replies are on.
}

function clearConversation() {
  stopSpeech();
  if (uiState.micActive) {
    uiState.voiceDiscard = true;
    stopListening();
  }
  appState.pending = null;
  dom.chatLog.replaceChildren();
  addChatMessage("assistant", "Conversation cleared. Your reminders are not affected.");
  settleOrb();
}

/* ==========================================================================
   14. RENDERING
   Everything on the page is built from appState and uiState. Nothing is
   hard-coded. User text always goes in with textContent.
   ========================================================================== */

function renderAll(force) {
  const now = new Date();
  updateHeader(now);
  renderStats(now);
  renderFilters();
  renderList(now, force);
  renderDueBanner(now);
  renderStorageWarning();
}

function updateHeader(now) {
  dom.dateEl.textContent = headerDateFormatter.format(now);
  dom.dateEl.dateTime = dayKeyFromDate(now);
  dom.greeting.textContent = getGreeting(now);
}

function renderStats(now) {
  const counts = getReminderCounts(now);
  dom.statActive.textContent = String(counts.active);
  dom.statToday.textContent = String(counts.dueToday);
  dom.statCompleted.textContent = String(counts.completed);
}

function renderFilters() {
  dom.filterButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.filter === uiState.filter));
  });
}

function buildListSignature(reminders, now) {
  const rows = reminders.map((reminder) => [
    reminder.id,
    reminder.status,
    reminder.title,
    reminder.dueAt,
    isOverdue(reminder, now),
    formatWhen(new Date(reminder.dueAt), now)
  ].join("|"));
  return `${uiState.filter}\n${rows.join("\n")}`;
}

/* Rebuilds the list only when something visible has changed. Rebuilding on
   every tick would move keyboard focus away from the buttons. */
function renderList(now, force) {
  const reminders = getRemindersByView(uiState.filter, now);
  const signature = buildListSignature(reminders, now);
  if (!force && signature === uiState.listSignature) return;

  uiState.listSignature = signature;
  dom.reminderList.replaceChildren(...reminders.map((reminder) => buildReminderCard(reminder, now)));
  dom.reminderList.hidden = reminders.length === 0;
  dom.emptyState.hidden = reminders.length > 0;
  dom.emptyState.textContent = reminders.length === 0
    ? (EMPTY_VIEW_MESSAGES[uiState.filter] || EMPTY_VIEW_MESSAGES.all)
    : "";
  uiState.justChangedId = null;
}

function makeCardButton(action, label, variantClass, reminderTitle) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `btn btn--small ${variantClass}`;
  button.dataset.action = action;
  button.textContent = label;
  button.setAttribute("aria-label", `${label}: ${reminderTitle}`);
  return button;
}

function buildReminderCard(reminder, now) {
  const completed = reminder.status === "completed";
  const overdue = !completed && isOverdue(reminder, now);

  const item = document.createElement("li");
  item.className = "reminder-card";
  item.dataset.id = reminder.id;
  if (completed) item.classList.add("is-completed");
  if (overdue) item.classList.add("is-overdue");
  if (reminder.id === uiState.justChangedId) item.classList.add("just-completed");

  const header = document.createElement("div");
  header.className = "reminder-card__header";

  const title = document.createElement("h3");
  title.className = "reminder-card__title";
  title.textContent = reminder.title;

  // Badges use words as well as color, so status is not shown by color alone.
  const badge = document.createElement("span");
  if (completed) {
    badge.className = "badge badge--done";
    badge.textContent = "Done";
  } else if (overdue) {
    badge.className = "badge badge--overdue";
    badge.textContent = "Overdue";
  } else {
    badge.className = "badge badge--scheduled";
    badge.textContent = "Scheduled";
  }
  header.append(title, badge);

  const meta = document.createElement("p");
  meta.className = "reminder-card__meta";
  const when = document.createElement("time");
  when.dateTime = reminder.dueAt;
  when.textContent = formatWhen(new Date(reminder.dueAt), now);
  meta.append(when);
  if (completed && reminder.completedAt) {
    meta.append(` · Completed ${formatWhen(new Date(reminder.completedAt), now)}`);
  }

  const actions = document.createElement("div");
  actions.className = "reminder-card__actions";
  if (completed) {
    actions.append(makeCardButton("reopen", "Reopen", "btn--ghost", reminder.title));
  } else {
    actions.append(
      makeCardButton("complete", "Mark done", "btn--primary", reminder.title),
      makeCardButton("edit", "Edit", "btn--ghost", reminder.title)
    );
  }
  actions.append(makeCardButton("delete", "Delete", "btn--danger", reminder.title));

  item.append(header, meta, actions);
  return item;
}

function renderDueBanner(now) {
  // Keep only reminders that are still pending and past their due time.
  const stillDue = new Set(
    appState.reminders
      .filter((reminder) => isPending(reminder) && new Date(reminder.dueAt).getTime() <= now.getTime())
      .map((reminder) => reminder.id)
  );
  uiState.alertIds.forEach((id) => {
    if (!stillDue.has(id)) uiState.alertIds.delete(id);
  });

  const due = appState.reminders.filter((reminder) => uiState.alertIds.has(reminder.id));
  dom.dueBanner.hidden = due.length === 0;
  if (due.length === 0) return;

  dom.dueText.textContent = due.length === 1
    ? `Reminder due: "${due[0].title}", ${phraseFor(new Date(due[0].dueAt), now)}.`
    : `${pluralize(due.length, "reminder")} are due. Check the list below.`;
}

function renderStorageWarning() {
  dom.storageWarning.hidden = appState.storageAvailable;
}

/* ==========================================================================
   15. REMINDER LIST CLICKS AND THE EDIT DIALOG
   One click listener on the list handles every card button, so no listener
   is added again when the list is rebuilt.
   ========================================================================== */

function handleListClick(event) {
  const button = event.target.closest("button[data-action]");
  const card = button ? button.closest(".reminder-card") : null;
  if (!button || !card) return;

  const id = card.dataset.id;
  const action = button.dataset.action;
  const now = new Date();
  let result = null;

  if (action === "edit") {
    openEditDialog(id, button);
    return;
  }

  if (action === "complete") {
    result = completeReminder(id, now);
    if (result.ok) uiState.justChangedId = id;
  } else if (action === "reopen") {
    result = reopenReminder(id);
  } else if (action === "delete") {
    const reminder = findReminderById(id);
    if (!reminder) {
      renderAll(true);
      return;
    }
    if (!window.confirm(`Delete "${reminder.title}"? This can't be undone.`)) return;
    result = deleteReminder(id);
  }

  if (!result) return;
  showToast(result.message, result.ok ? "info" : "error");
  renderAll(true);
  focusListHeading();
}

function setEditError(message) {
  dom.editError.textContent = message;
}

function openEditDialog(id, triggerButton) {
  const reminder = findReminderById(id);
  if (!reminder || !isPending(reminder)) {
    showToast("Only pending reminders can be edited.", "error");
    renderAll(true);
    return;
  }

  uiState.editingId = id;
  uiState.editReturnFocus = triggerButton || null;

  const due = new Date(reminder.dueAt);
  dom.editTitle.value = reminder.title;
  dom.editDate.value = dayKeyFromDate(due);
  dom.editTime.value = `${pad2(due.getHours())}:${pad2(due.getMinutes())}`;
  setEditError("");

  if (!dom.editDialog.open) {
    if (typeof dom.editDialog.showModal === "function") {
      dom.editDialog.showModal();
    } else {
      dom.editDialog.setAttribute("open", "");
    }
  }
  dom.editTitle.focus();
}

function closeEditDialog() {
  if (dom.editDialog.open) dom.editDialog.close();
}

function handleEditDialogClosed() {
  const returnTarget = uiState.editReturnFocus;
  uiState.editingId = null;
  uiState.editReturnFocus = null;
  if (returnTarget && returnTarget.isConnected) {
    returnTarget.focus();
  }
}

/* Builds a local Date from date and time inputs. Returns null for impossible
   dates and for times that daylight-saving changes skip. */
function buildLocalDateTime(dateText, timeText) {
  const [year, month, day] = dateText.split("-").map(Number);
  const [hour, minute] = timeText.split(":").map(Number);
  const values = [year, month, day, hour, minute];
  if (values.some((value) => Number.isNaN(value))) return null;
  if (hour > 23 || minute > 59) return null;

  const candidate = new Date(year, month - 1, day, hour, minute, 0, 0);
  const valid =
    candidate.getFullYear() === year &&
    candidate.getMonth() === month - 1 &&
    candidate.getDate() === day &&
    candidate.getHours() === hour;
  return valid ? candidate : null;
}

function handleEditSubmit(event) {
  event.preventDefault();

  const id = uiState.editingId;
  const reminder = id ? findReminderById(id) : null;
  if (!reminder) {
    setEditError("That reminder no longer exists.");
    return;
  }

  const dateValue = dom.editDate.value;
  const timeValue = dom.editTime.value;
  if (!dateValue || !timeValue) {
    setEditError("Please choose a date and a time.");
    return;
  }

  const dueAt = buildLocalDateTime(dateValue, timeValue);
  if (!dueAt) {
    setEditError("That date or time isn't valid. Please check it.");
    return;
  }

  const now = new Date();
  const result = updateReminder(id, { title: dom.editTitle.value, dueAt }, now, (updated) =>
    `Updated "${updated.title}" to ${phraseFor(new Date(updated.dueAt), now)}.`
  );
  if (!result.ok) {
    setEditError(result.message);
    return;
  }

  // Clear the return target first so focus does not land on a card that is about to be rebuilt.
  uiState.editReturnFocus = null;
  closeEditDialog();
  showToast(result.message);
  renderAll(true);
  focusListHeading();
}

/* ==========================================================================
   16. DUE-TIME ALERTS
   Two parts: an in-app banner and chat message (always), and a browser
   notification (only after the user turns alerts on, and only for reminders
   that come due while this page is open). Nothing requests permission on load.
   ========================================================================== */

function updateAlertsUi() {
  const toggle = dom.alertsToggle;

  if (!notificationsSupported) {
    toggle.textContent = "Alerts unavailable";
    toggle.setAttribute("aria-pressed", "false");
    toggle.setAttribute("aria-disabled", "true");
    dom.notifyStatus.textContent = "This browser doesn't support notifications. Reminders still appear on this page while it is open.";
    return;
  }

  toggle.removeAttribute("aria-disabled");
  const permission = Notification.permission;

  if (permission === "granted") {
    toggle.textContent = "Alerts on";
    toggle.setAttribute("aria-pressed", "true");
    dom.notifyStatus.textContent = "Browser notifications are on. They appear only while this page is open.";
  } else if (permission === "denied") {
    toggle.textContent = "Alerts blocked";
    toggle.setAttribute("aria-pressed", "false");
    dom.notifyStatus.textContent = "Notifications are blocked for this site. To turn them on, allow notifications in your browser's site settings, then reload this page. Reminders still appear here.";
  } else {
    toggle.textContent = "Turn on alerts";
    toggle.setAttribute("aria-pressed", "false");
    dom.notifyStatus.textContent = "Alerts are off. Turn them on to receive a browser notification when a reminder is due.";
  }
}

/* Runs only from the button click, which is a user action. */
function requestAlertPermission() {
  if (!notificationsSupported) {
    showToast("This browser doesn't support notifications.", "error");
    return;
  }
  if (Notification.permission === "granted") {
    showToast("Alerts are already on.");
    return;
  }
  if (Notification.permission === "denied") {
    showToast("Alerts are blocked. Allow notifications for this site in your browser settings, then reload.", "error");
    return;
  }

  // The callback form is for older browsers. Newer browsers return a promise.
  const outcome = Notification.requestPermission(() => updateAlertsUi());
  Promise.resolve(outcome)
    .then(() => updateAlertsUi())
    .catch(() => updateAlertsUi());
}

function sendBrowserNotification(reminder) {
  if (!notificationsSupported || Notification.permission !== "granted") return;

  try {
    const notice = new Notification("RememberMe AI reminder", {
      body: reminder.title,
      tag: reminder.id // the same tag replaces an older notice instead of stacking duplicates
    });
    notice.onclick = () => {
      window.focus();
      notice.close();
    };
  } catch (error) {
    // Some mobile browsers only show notifications through a service worker, which this app does not use.
    dom.notifyStatus.textContent = "This browser couldn't show a notification. The reminder still appears on this page.";
  }
}

/* Finds reminders that have just come due, marks them so they alert only
   once, and reports them. */
function checkForDueReminders(now) {
  const newlyDue = appState.reminders.filter((reminder) =>
    isPending(reminder) &&
    !reminder.alertedAt &&
    new Date(reminder.dueAt).getTime() <= now.getTime()
  );
  if (newlyDue.length === 0) return;

  const stamp = now.toISOString();
  newlyDue.forEach((reminder) => {
    reminder.alertedAt = stamp;
    uiState.alertIds.add(reminder.id);
  });

  // Saving alertedAt means the same reminder does not alert again after a reload.
  commitReminders();

  const lines = newlyDue.map((reminder) => {
    const dueDate = new Date(reminder.dueAt);
    if (dueDate.getTime() >= uiState.startedAt) {
      sendBrowserNotification(reminder);
      return `Reminder: "${reminder.title}" is due ${phraseFor(dueDate, now)}.`;
    }
    return `Still pending from earlier: "${reminder.title}", due ${phraseFor(dueDate, now)}.`;
  });

  addChatMessage("assistant", lines.join("\n"));
  const spokenAlerts = lines.map(line => {
    const match = line.match(/Reminder: "(.+?)" is due/);

    if (match) {
        return `Hey! It's time to ${match[1]}. Don't forget your reminder!`;
    }

    return line;
});
  speakText(spokenAlerts.join(" "));
  renderDueBanner(now);
}

/* ==========================================================================
   17. SPOKEN REPLIES
   Off by default. Speaks only replies to messages the user sent, and only
   after the user has turned spoken replies on. Never speaks alerts.
   ========================================================================== */

function updateSpeechToggle() {
  const toggle = dom.speechToggle;
  if (!speechSynthesisSupported) {
    toggle.textContent = "Spoken replies unavailable";
    toggle.setAttribute("aria-disabled", "true");
    toggle.setAttribute("aria-pressed", "false");
    return;
  }
  toggle.removeAttribute("aria-disabled");
  toggle.textContent = `Spoken replies: ${uiState.speechOutputOn ? "on" : "off"}`;
  toggle.setAttribute("aria-pressed", String(uiState.speechOutputOn));
}

function toggleSpeechOutput() {
  if (!speechSynthesisSupported) {
    showToast("Spoken replies aren't supported in this browser.", "error");
    return;
  }
  uiState.speechOutputOn = !uiState.speechOutputOn;
  if (!uiState.speechOutputOn) {
    stopSpeech();
    settleOrb();
  }
  updateSpeechToggle();
}

function stopSpeech() {
  uiState.speechToken += 1; // ignore callbacks from speech that is being stopped
  uiState.speaking = false;
  if (speechSynthesisSupported) {
    window.speechSynthesis.cancel();
  }
}

function speakText(message) {
  if (!uiState.speechOutputOn || !speechSynthesisSupported) return;

  const synth = window.speechSynthesis;
  synth.cancel();
  uiState.speechToken += 1;
  const token = uiState.speechToken;

  const spoken = toSpeakableText(message);
  const utterance = new SpeechSynthesisUtterance(spoken);
  utterance.lang = getBrowserLanguage();

  let fallbackTimer = null;
  const finish = () => {
    clearTimeout(fallbackTimer);
    if (token !== uiState.speechToken) return;
    uiState.speaking = false;
    setAssistantStatus(READY_STATUS);
    settleOrb();
  };

  utterance.onend = finish;
  utterance.onerror = finish;
  // Some browsers never fire onend. This timer stops the orb from getting stuck in "speaking".
  fallbackTimer = setTimeout(finish, spoken.length * 150 + 3000);

  uiState.speaking = true;
  setOrbState("speaking");
  setAssistantStatus("Speaking…");
  synth.speak(utterance);
}

/* ==========================================================================
   18. VOICE INPUT
   The microphone starts only after a click. Recognized speech goes into the
   text box so the user can check it. It is never sent automatically.
   ========================================================================== */

function setMicButtonPressed(pressed) {
  dom.micButton.setAttribute("aria-pressed", String(pressed));
  dom.micButton.setAttribute("aria-label", pressed ? "Stop voice input" : "Start voice input");
}

function updateMicSupport() {
  if (SpeechRecognitionCtor) return;
  dom.micButton.setAttribute("aria-disabled", "true");
  dom.micButton.setAttribute("aria-label", "Voice input isn't supported in this browser");
  dom.micButton.title = "Voice input isn't supported in this browser. Type your reminder instead.";
}

function describeVoiceError(code) {
  switch (code) {
    case "not-allowed":
    case "service-not-allowed":
      return "Microphone access is blocked for this site. Allow it in your browser settings, or type your reminder instead.";
    case "no-speech":
      return "I didn't hear anything. Try again, or type your reminder.";
    case "audio-capture":
      return "No microphone was found. You can type your reminder instead.";
    case "network":
      return "Voice input couldn't reach your browser's speech service. You can type your reminder instead.";
    case "aborted":
      return ""; // The user stopped listening on purpose, so this is not an error.
    default:
      return "Voice input stopped unexpectedly. You can type your reminder instead.";
  }
}

function createRecognition() {
  const recognition = new SpeechRecognitionCtor();
  recognition.lang = getBrowserLanguage();
  recognition.interimResults = true;
  recognition.continuous = false;
  recognition.maxAlternatives = 1;
  recognition.onstart = handleRecognitionStart;
  recognition.onresult = handleRecognitionResult;
  recognition.onerror = handleRecognitionError;
  recognition.onend = handleRecognitionEnd;
  return recognition;
}

function startListening() {
  if (!SpeechRecognitionCtor) {
    showToast("Voice input isn't supported in this browser. Please type your reminder.", "error");
    return;
  }
  if (uiState.micActive) {
    stopListening();
    return;
  }

  stopSpeech();
  if (!uiState.recognition) {
    uiState.recognition = createRecognition();
  }

  uiState.heard = "";
  uiState.voiceError = "";
  uiState.voiceDiscard = false;
  uiState.inputBeforeVoice = dom.chatInput.value;

  try {
    uiState.recognition.start();
  } catch (error) {
    // Browsers throw if start() is called before the previous session has ended.
    showToast("Voice input is still stopping. Please try again in a moment.", "error");
    return;
  }

  // Not listening yet. The listening state appears only once the browser confirms it has started.
  uiState.micActive = true;
  setMicButtonPressed(true);
  setOrbState("processing");
  setAssistantStatus("Starting microphone. If your browser asks, please allow access.");
}

function stopListening() {
  if (!uiState.recognition || !uiState.micActive) return;
  try {
    uiState.recognition.stop();
  } catch (error) {
    // The browser has already stopped listening, so nothing else is needed.
  }
  setAssistantStatus("Stopping microphone…");
}

function handleRecognitionStart() {
  if (!uiState.micActive) return;
  setOrbState("listening");
  setAssistantStatus("Listening. Speak now, or press the microphone again to stop.");
}

function handleRecognitionResult(event) {
  if (uiState.voiceDiscard) return;

  let finalText = "";
  let interimText = "";
  for (let index = event.resultIndex; index < event.results.length; index += 1) {
    const result = event.results[index];
    const transcript = result[0] ? result[0].transcript : "";
    if (result.isFinal) {
      finalText += transcript;
    } else {
      interimText += transcript;
    }
  }

  uiState.heard = normalizeSpaces(`${uiState.heard} ${finalText}`);
  const combined = normalizeSpaces(
    [uiState.inputBeforeVoice, uiState.heard, interimText].filter(Boolean).join(" ")
  );
  dom.chatInput.value = combined.slice(0, MAX_CHAT_INPUT_LENGTH);
}

function handleRecognitionError(event) {
  uiState.voiceError = describeVoiceError(event.error);
}

function handleRecognitionEnd() {
  uiState.micActive = false;
  setMicButtonPressed(false);

  if (uiState.voiceDiscard) {
    settleOrb();
    return;
  }

  if (uiState.voiceError) {
    setAssistantStatus(uiState.voiceError);
    flashErrorOrb();
    return;
  }

  if (uiState.heard) {
    setAssistantStatus("Here's what I heard. Check the text, then press Send.");
    dom.chatInput.focus();
  } else {
    setAssistantStatus("I didn't catch anything. Try again, or type your reminder.");
  }
  settleOrb();
}

/* ==========================================================================
   19. EVENT WIRING AND START-UP
   ========================================================================== */

function bindEvents() {
  dom.chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (uiState.busy) return; // the text stays in the box until the previous message is handled
    handleUserMessage(dom.chatInput.value);
  });

  dom.examples.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-example]");
    if (button && !uiState.busy) {
      handleUserMessage(button.dataset.example);
    }
  });

  dom.micButton.addEventListener("click", () => startListening());
  dom.speechToggle.addEventListener("click", toggleSpeechOutput);
  dom.alertsToggle.addEventListener("click", requestAlertPermission);
  dom.clearChat.addEventListener("click", clearConversation);

  dom.filterGroup.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-filter]");
    if (!button) return;
    uiState.filter = button.dataset.filter;
    renderAll(true);
  });

  dom.reminderList.addEventListener("click", handleListClick);

  dom.dueView.addEventListener("click", () => {
    uiState.filter = "today";
    renderAll(true);
    focusListHeading();
  });

  dom.dueDismiss.addEventListener("click", () => {
    uiState.alertIds.clear();
    renderDueBanner(new Date());
  });

  dom.editForm.addEventListener("submit", handleEditSubmit);
  dom.editCancel.addEventListener("click", closeEditDialog);
  dom.editDialog.addEventListener("close", handleEditDialogClosed);

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) tick();
  });

  window.addEventListener("pagehide", () => {
    stopSpeech();
    if (uiState.recognition && uiState.micActive) {
      uiState.recognition.abort();
    }
  });
}

/* Runs every TICK_MS. Checks due times and refreshes labels. The list is
   rebuilt only when its contents or labels have changed. */
function tick() {
  const now = new Date();
  checkForDueReminders(now);
  updateHeader(now);
  renderStats(now);
  renderList(now, false);
  renderDueBanner(now);
}

function init() {
  if (!collectElements()) return;

  uiState.startedAt = Date.now();
  dom.listTitle.tabIndex = -1; // lets focus move to the list heading after an action

  const loaded = loadAppData();
  bindEvents();
  updateMicSupport();
  updateSpeechToggle();
  updateAlertsUi();

  const now = new Date();
  renderAll(true);

  addChatMessage(
    "assistant",
    "I'm here to help you remember things. Try: \"Remind me in 30 minutes to take a break.\" Or type \"help\" to see what I understand."
  );
  if (loaded.recovered) {
    addChatMessage("assistant", "Some saved data couldn't be read. I kept a backup and started with the reminders I could read.");
  }

  checkForDueReminders(now);
  setOrbState("idle");
  setAssistantStatus(READY_STATUS);
  setInterval(tick, TICK_MS);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

/* ==========================================================================
   END OF script.js
   ========================================================================== */