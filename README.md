# RememberMe AI

**Your Personal Memory Assistant**

> Remember less. Live more.

RememberMe AI is a calm, conversational reminder assistant. You type or speak plain sentences such as "Remind me tomorrow at 10 AM to wash clothes," and it creates, lists, completes, moves, and cancels your reminders.

Built for the **Amazon Developer Hackathon 2026, Alexa+ track**, as a **simulated Alexa+-style web experience**.

## Important notes

- **This is not an official Amazon or Alexa integration.** RememberMe AI simulates a conversational experience inside a web page. It does not use any Amazon or Alexa API, skill, device, or account, and it is not affiliated with or endorsed by Amazon.
- **This is not an AI model.** Messages are handled by a rule-based parser that understands a fixed set of phrasings. It does not generate free-form answers. When it does not understand a message, it says so and suggests what it can do.
- **This is not a medical or safety device.** Do not rely on it for medication, emergencies, or any situation where a missed reminder could cause harm.

## The problem

Busy people, students, and older adults often forget small everyday tasks. Many reminder apps need forms, menus, and several taps to set a single reminder. A conversational option lets people say what they need in the words they would naturally use.

## Target users

- Students balancing classes, assignments, and deadlines
- Busy people who lose track of errands
- Older adults who want a simple, readable list
- Anyone who occasionally forgets everyday tasks

## Solution overview

You type or speak a request. The assistant works out what you meant, asks a short question when a detail is missing or unclear, and then makes the change. Your reminders appear in a list with live statistics, filters, and buttons. Reminders are stored only in your own browser.

## Main features

- **Create reminders from everyday phrases**, including "in 30 minutes," "in 2 hours," "tomorrow at 10 AM," "next Monday at noon," and "25 October at 6 PM."
- **List reminders** as all, today, upcoming, pending, or completed, and ask for a short summary.
- **Manage reminders** by marking them done, reopening them, editing them, moving them to a new time, or deleting them. You can do this from chat or from the buttons on each card.
- **Confirm before deleting.** Deleting from chat asks you to reply yes or no. Deleting from a card asks you to confirm in a browser dialog.
- **Ask before guessing.** If a time is missing, if AM or PM is unclear, if a title is missing, or if several reminders match, the assistant asks one short question.
- **Handle past times safely.** If you ask for a time that has already passed, the assistant explains this and offers the same time on the next day.
- **Show live statistics** for active, due today, and completed reminders. These are calculated from your data every time.
- **Show due-time alerts** as a banner and a chat message.
- **Offer optional browser notifications**, turned on only when you click a button. They appear only while the page is open.
- **Accept voice input** through your browser's speech recognition, where supported. Recognized speech goes into the text box so you can check it before sending.
- **Offer optional spoken replies.** They are off by default and never read out alerts.
- **Support accessibility needs** with keyboard navigation, labelled controls, screen reader announcements, reduced-motion support, and large touch targets.
- **Keep your reminders after a refresh.** Damaged saved data is backed up, and the app starts safely with the reminders it can read.

## Things you can say

- Remind me tomorrow at 10 AM to wash clothes.
- Remind me in 30 minutes to take a break.
- Remind me to call Mom at 6 PM.
- Remind me next Monday at noon to renew my library book.
- Remind me tonight at 9 to stretch.
- What do I need to do today?
- Show my upcoming reminders.
- Show my pending reminders.
- Mark washing clothes as done.
- Move my grocery reminder to tomorrow at 5 PM.
- Cancel my reminder to call Mom.
- What have I completed?
- Summary

Start commands such as "mark," "complete," "cancel," "delete," "move," and "reschedule" with the action word. "Remind me" can appear anywhere in the sentence.

## Technical architecture

RememberMe AI is a static website made of plain HTML, CSS, and vanilla JavaScript. It has no build step, no framework, no backend, and no external dependencies. Anyone can run it with a local web server or host it on any static host.

### Files

| File | Purpose |
|---|---|
| `index.html` | Page structure, labelled controls, the chat panel, the edit dialog, and the footer |
| `style.css` | Colours, spacing, layout, voice orb animations, responsive rules, and reduced-motion support |
| `script.js` | Intent parser, reminder tools, date handling, storage, rendering, voice, alerts, and start-up |
| `package.json` | Project details and the `npm start` script. It has no dependencies. |
| `README.md` | This document |
| `LICENSE` | MIT licence |
| `.gitignore` | Files Git should ignore, such as `node_modules/`, `.vercel/`, and system files |

### How a message flows

```
You type or speak
    → parseUserIntent()    works out what you meant (reads only, changes nothing)
    → executeIntent()      runs the matching tool, or asks a follow-up question
    → reminder tools       check the inputs, change the data, and save to this browser
    → renderAll()          redraws the statistics, the list, and the due banner
    → chat reply           shows the message the tool returned
```

The parser decides what you meant. The tools do the work. The interface only displays the results. Each layer can be tested and changed separately.

### Sections of `script.js`

| Section | What it contains |
|---|---|
| 1. Constants | Storage keys, word lists, and the patterns used to recognise phrases |
| 2. Application state | The reminders, any open question, and storage status |
| 3. Date, time, and text helpers | Local day handling, formatting, and safe text cleanup |
| 4. Storage with recovery | Loads and saves reminders, and repairs or backs up damaged data |
| 5. Result helpers | Builds the success and failure messages that tools return |
| 6. Reminder tools | Create, complete, reopen, delete, reschedule, list, and summarise |
| 7. Date and time parsing | Turns phrases such as "tomorrow at 10 AM" into exact times |
| 8. Title cleanup | Removes time words so only the task remains |
| 9. Intent parser | Chooses the command, or matches a reply to an open question |
| 10. UI settings and state | Interface state such as the filter, voice status, and alert history |
| 11. Small helpers | Greetings, element lookup, and speech text cleanup |
| 12. Status, chat, and toasts | Orb state, the status line, chat messages, and short notices |
| 13. Dispatcher | Connects the parser to the tools and produces each reply |
| 14. Rendering | Builds the statistics, filters, list cards, and due banner from data |
| 15. List clicks and edit dialog | One click handler for all cards, plus the edit form |
| 16. Due-time alerts | Banner, chat alerts, and browser notifications |
| 17. Spoken replies | Optional text-to-speech for chat replies |
| 18. Voice input | Microphone control and speech recognition |
| 19. Event wiring and start-up | Connects every control and starts the app |

### Reminder data

Reminders are stored in `localStorage` under the key `rememberme-ai.reminders.v1`. Each reminder looks like this:

```json
{
  "id": "3f0c9e2a-6b1d-4d7e-9a55-2c8f1b7e4d10",
  "title": "Wash clothes",
  "dueAt": "2026-10-22T04:30:00.000Z",
  "status": "pending",
  "createdAt": "2026-10-21T14:05:12.000Z",
  "completedAt": null,
  "alertedAt": null
}
```

Times are stored in UTC, using the ISO format, so they stay accurate. They are shown in your device's local time zone. The stored file is `{ "version": 1, "reminders": [ ... ] }`.

## How intent parsing works

The parser uses rules, not statistics. It works in this order:

1. **Clean the text.** Extra spaces are removed and the message is limited to 300 characters.
2. **Check for an open question.** If the assistant asked you something, such as "Do you mean 5 AM or 5 PM?", your reply is treated as an answer to that question. If your reply is clearly a new command, such as "Show my reminders," the question is dropped and the command runs instead.
3. **Check for a new command.** The parser checks for help, delete, complete, move, create, summary, and list phrases, in that order. Action words must be at the start of the message. "Remind me" and similar phrases can appear anywhere.
4. **Extract the details.** Dates and times are removed from the sentence one at a time. What remains becomes the reminder title after cleanup.
5. **Validate the result.** Titles must not be empty and must be under 120 characters. Times must be in the future. Impossible dates, such as 31 February, are rejected.
6. **Ask when unsure.** If something is missing or unclear, the parser returns a question instead of making a guess.

### Time expressions the parser understands

- **Relative times:** "in 30 minutes," "in 2 hours," "in half an hour," "in 3 days"
- **Days:** "today," "tonight," "tomorrow," a weekday such as "Friday," "next Friday," "25 October," or "October 25" (with an optional year)
- **Clock times:** "10 AM," "5:30 pm," "noon," "midnight," and 24-hour times such as "17:00"
- **Ambiguous times:** "at 5" with no AM or PM. The assistant asks which one you mean. "Tonight at 9" is read as 9 PM.
- **Past times:** The assistant explains that the time has passed and offers the next day.
- **Missing times:** "Tomorrow" with no time triggers a question asking for a time.

### Reminder matching

When you refer to an existing reminder by name, such as "cancel my reminder to call Mom," the parser searches your reminders:

- An exact title match wins.
- Otherwise, every meaningful word in your phrase must match the start of a word in a title. For example, "grocery" matches "groceries."
- If exactly one reminder matches, the tool acts on it.
- If several match, the assistant lists them and asks you to use more words.
- If none match, the assistant says so and suggests a different phrase.

## How the reminder tools work

Each tool checks its inputs, changes the data only if the checks pass, saves the result, and returns a message. The message describes what actually happened. If saving to this browser fails, the message says so.

- **Create:** Adds a pending reminder with a future time.
- **Complete:** Marks a pending reminder as completed and records when.
- **Reopen:** Returns a completed reminder to pending.
- **Edit:** Changes the title, date, and time together through the edit dialog. Only pending reminders can be edited.
- **Reschedule:** Moves a pending reminder to a new future time.
- **Delete:** Removes a reminder. Chat deletes ask for confirmation first.
- **List and summary:** Read the data and format it for display.

An overdue reminder is still pending but past its time. It appears in the Today list and is marked "Overdue." Completed reminders are never counted as overdue.

## Alerts and notifications

- The app checks due times every 10 seconds while the page is open. A reminder may therefore appear up to about 10 seconds after its time.
- When a reminder comes due, the app shows a banner and a chat message. These always appear.
- A browser notification appears only if you have turned on alerts and the reminder came due after you opened the page.
- Reminders that were already overdue when you opened the page appear as "Still pending from earlier" in chat. They do not produce a browser notification.
- Each reminder alerts once. Changing its time allows it to alert again.
- The app asks for notification permission only when you click "Turn on alerts." It never asks when the page loads.
- If you block notifications, the app keeps working and shows reminders on the page.

**Limits:** Alerts work only while the page is open. If you close the tab or browser, nothing fires. If the computer sleeps, the page may pause, and reminders appear when the page runs again. Many mobile browsers allow notifications only through a service worker, which this version does not include. On those browsers, reminders still appear on the page.

## Voice input and spoken replies

- **Voice input** uses the browser's Web Speech API. It is available in Chrome and Edge and is most reliable there. Support varies between browsers and versions. If your browser does not support it, the microphone button is disabled and a message explains why.
- **Permission:** The microphone starts only after you click the microphone button. The button shows when listening is active, and the orb shows a listening animation. The app never records in the background.
- **Review before sending:** Recognized speech appears in the text box. Nothing is sent until you press Send.
- **Secure context:** Browsers generally allow speech recognition only on HTTPS or on `localhost`. Vercel provides HTTPS, so the public site works. Opening `index.html` by double-clicking it may behave differently, so use `npm start`.
- **Accuracy:** Background noise, accents, and microphone quality affect recognition.
- **Spoken replies** are off by default. Turn them on with the "Spoken replies" button. They read replies to the messages you send. They never read alerts aloud. The voices available depend on your device.

**Privacy of voice input:** When you use the microphone, your browser's speech service processes the audio. In Chrome and Edge, this generally means the audio is sent over the internet to the browser maker's speech servers. RememberMe AI does not store or send your reminders, but voice audio is handled by the browser.

## Privacy

- **Where data lives:** Reminders are kept in `localStorage` in the browser you are using, on that device. There is no account, no sync, and no server copy.
- **No transmission by the app:** The app does not send reminder data anywhere. It has no analytics and no third-party scripts. It loads no external fonts or images.
- **Not encrypted:** Browser local storage is not encrypted. Anyone who can use your unlocked computer and browser profile could read it.
- **Data is device-specific:** Another browser or device will not see your reminders. Clearing site data, using a private window, or uninstalling the browser removes them.
- **Logs:** When an unexpected error occurs, the console records only the error type, not your reminder text.
- **Hosting:** Vercel hosts the files. Like any web host, it may keep standard request logs. Your reminder content is not part of those requests.
- **Advice:** Do not enter sensitive information such as health details, passwords, bank or card numbers, or identification numbers.

## Accessibility

- Semantic HTML with landmarks (`header`, `main`, `footer`), headings, and a skip link.
- Every control has a visible or accessible label. The microphone button announces whether it is on or off.
- Reminder status is shown with words ("Done," "Overdue," "Scheduled") as well as colour.
- Chat replies and status messages are announced through live regions.
- Visible focus outlines appear on every interactive element.
- Buttons are at least 44 pixels tall, which suits touch screens.
- Motion is reduced when the system asks for it.
- The edit form uses the browser's native dialog element. Focus returns to the button that opened it when the dialog closes.

## Responsive design

The layout adapts at two breakpoints. Above 900 pixels wide, the assistant and reminder list appear side by side. Between 480 and 900 pixels, they stack. Below 480 pixels, padding and the orb shrink so the input and microphone stay usable. Long text wraps, so the page does not scroll sideways.

## Installation and local run (Windows)

**You need:** Node.js with npm (version 24.21.0 was used during development; a current LTS release should also work) and Chrome or Edge. Git is needed only for deployment.

1. Open the `remember me` folder in VS Code with **File > Open Folder**.
2. Open a terminal with **Terminal > New Terminal**.
3. Type the following and press Enter:

```
   npm start
```

   The first run downloads the small `serve` tool from npm, so you need an internet connection. When the terminal says the server is running, the app is available at port 3000.

4. Open **http://localhost:3000** in Chrome or Edge.
5. To stop the server, press **Ctrl+C** in the terminal.

## Troubleshooting

- **"running scripts is disabled on this system"** appears in PowerShell: Windows is blocking `npm.ps1`. Either use **Command Prompt** instead, or run this once in PowerShell and then try again:

```
  Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

- **The page does not open:** Check that the terminal still shows the server running. Use `http://localhost:3000`, not a file path.
- **Syntax check:** To confirm that `script.js` has no syntax errors, run `node --check script.js` in the project folder. It prints nothing when the file is valid.
- **Console errors:** Press **F12** and open the Console tab. There should be no red errors after the page loads.

## Testing

**Testing status:** This version has been checked by reading the code and tracing the main paths. The checks below have not yet been run in a browser. Run them before submitting, and record your results.

- [ ] **A.** The page loads with no red errors in the console.
- [ ] **B.** Typed input is accepted, and the reply appears in the chat.
- [ ] **C.** "Remind me in 30 minutes to take a break" creates a reminder that appears in the list.
- [ ] **D.** The reminder is still there after refreshing the page.
- [ ] **E.** "Remind me at 5 to call Mom" asks AM or PM. "Remind me yesterday at 5 PM" explains that the time has passed.
- [ ] **F.** The Today filter shows only reminders due today and overdue reminders.
- [ ] **G.** Marking a reminder done updates its status, the badge, and the statistics.
- [ ] **H.** Deleting a reminder works from both the chat (after yes) and the card button (after confirming).
- [ ] **I.** Moving a reminder with "Move ... to tomorrow at 5 PM" changes its time.
- [ ] **J.** Voice input works in Chrome or Edge after you press the microphone button and allow access.
- [ ] **K.** In a browser without speech recognition, the microphone button is disabled and explains why.
- [ ] **L.** Spoken replies can be turned on and off.
- [ ] **M.** The notification permission prompt appears only after you click "Turn on alerts."
- [ ] **N.** The layout works at desktop, tablet, and phone widths, with no sideways scrolling.
- [ ] **O.** Every control can be reached and operated with the Tab and Enter keys.
- [ ] **P.** Corrupted saved data does not stop the app. Check that a backup is created.
- [ ] **Q.** Every button responds, and no feature reports a missing function.

## Deployment to Vercel

Vercel hosts the site as static files. No serverless functions are needed.

1. **Create a GitHub repository.** Go to github.com, choose **New repository**, and name it `remember-me`. A public repository is the simplest choice for a hackathon submission.
2. **Commit and push the code.** In the VS Code terminal, inside the project folder, run the following. The first two commands are needed only once on this computer.

```
   git config --global user.name "Your Name"
   git config --global user.email "you@example.com"
   git init
   git add .
   git commit -m "Initial RememberMe AI submission"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/remember-me.git
   git push -u origin main
```

   Replace snehaprajapat6677-prog with your GitHub username. When you push, Git may open a window asking you to sign in to GitHub. GitHub no longer accepts account passwords for Git, so use the sign-in window or a personal access token.

3. **Import into Vercel.** Sign in at vercel.com and choose **Add New > Project**. Select **Import** next to your `remember-me` repository.
4. **Set the build options.** For **Framework Preset**, choose **Other**. Leave **Build Command** empty. Leave **Output Directory** as its default, which serves the project root.
5. **Deploy.** Select **Deploy** and wait for the process to finish.
6. **Test the public URL.** Open the address Vercel gives you, which uses HTTPS. Repeat a few checks from the list above. Voice input will work on this HTTPS address.
7. **Future updates.** After changing the code, run `git add .`, `git commit -m "Describe the change"`, and `git push`. Vercel redeploys automatically.

The `.vercel/` folder is listed in `.gitignore`, so Vercel's local settings are not uploaded to GitHub.

## Current limitations

- **Not an AI model.** The parser understands a fixed set of English phrasings. Unusual wording gets a "didn't understand" reply.
- **One browser at a time.** Reminders stay in the browser on one device. There is no sync and no backup. Clearing site data or using a private window removes them.
- **Alerts need an open page.** Nothing fires when the tab or browser is closed. Many phones will not show page-level notifications.
- **No recurring reminders.** Each reminder happens once.
- **Local time zone only.** Reminders use the time zone of the device. They do not adjust if you travel to another time zone.
- **Voice depends on the browser.** Recognition accuracy varies, and some browsers do not support it. Chrome and Edge send audio to speech services over the internet.
- **Not encrypted.** Browser storage is not encrypted.
- **Limited testing.** This version has not been run in every browser or on every device.

## Roadmap

- Background reminders using a service worker and push notifications, which would need a server-side scheduler.
- Accounts with encrypted sync across devices.
- Recurring reminders, such as every weekday at 8 AM.
- Automated unit tests for the parser, which is already kept separate from the interface for this purpose.
- A genuine language model connected through a clearly labelled adapter, with the rule-based parser kept as a fallback.
- An official Alexa integration, but only if Amazon's documented routes and permissions allow it.
- Support for more languages.
- Import and export of reminders as a file.
- Testing with screen reader users and older adults.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).

Copyright (c) 2026 Sneha Prajapat

## Hackathon statement

RememberMe AI was built for the Amazon Developer Hackathon 2026, Alexa+ track. It simulates a conversational Alexa+-style experience in a web page. It is not an official Amazon or Alexa product, and it does not use any Amazon or Alexa service.
