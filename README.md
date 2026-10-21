# RememberMe AI

### Your Personal Memory Assistant

> Remember less. Live more.

RememberMe AI is a voice-enabled, conversational reminder assistant that helps users create, view, complete, reschedule, edit, and cancel reminders using natural-language commands.

Instead of navigating multiple forms and menus, users can type or speak commands such as:

* "Remind me tomorrow at 10 AM to wash clothes."
* "Show my upcoming reminders."
* "Move my grocery reminder to tomorrow at 5 PM."
* "Mark my assignment as done."

The assistant processes supported commands, asks follow-up questions when information is missing or ambiguous, and displays the results in a simple web interface.

**Built for the Amazon Developer Hackathon 2026 — Alexa+ track, as a simulated Alexa+-style web experience.**

---

## Project Information

| Detail            | Information                                                              |
| ----------------- | ------------------------------------------------------------------------ |
| Project name      | RememberMe AI                                                            |
| Developer         | Sneha Prajapat                                                           |
| Platform          | Web application                                                          |
| Frontend          | HTML, CSS, JavaScript                                                    |
| Data storage      | Browser localStorage                                                     |
| Voice features    | Browser Web Speech APIs, where supported                                 |
| Backend           | None                                                                     |
| External AI API   | None                                                                     |
| Deployment model  | Static website                                                           |
| GitHub repository | [Rememberme-ai](https://github.com/snehaprajapat6677-prog/Rememberme-ai) |
| License           | MIT                                                                      |

## Important Disclaimer

RememberMe AI is an independent project created as a simulated conversational assistant experience.

* It is **not an official Amazon or Alexa product**.
* It does not connect to an Alexa device, Alexa account, or official Alexa API.
* It does not implement an Amazon Alexa Skill or an MCP server.
* It does not use a generative AI model or external AI API.
* Its natural-language processing is based on predefined JavaScript rules and supported command patterns.
* It is not intended for medication reminders, emergencies, or other safety-critical situations.

The name RememberMe AI describes the project concept. It does not imply that the application currently uses an AI model.

---

## The Problem

People frequently forget everyday responsibilities, including assignments, errands, personal tasks, and upcoming activities.

Traditional reminder interfaces may require users to open forms, enter dates, choose times, and navigate multiple controls for a simple task.

RememberMe AI explores a more conversational approach: users express what they need in ordinary language, and the assistant attempts to turn that request into a manageable reminder.

## The Solution

RememberMe AI provides a lightweight, browser-based reminder experience with text interaction, optional voice input, spoken replies, and reminder management.

The assistant separates command interpretation from reminder operations. When a request is unclear, it can ask a follow-up question rather than immediately performing an uncertain action.

Reminders are stored locally in the user's browser, without an account or server-side database.

## Target Users

* Students managing assignments and study sessions.
* Busy individuals organizing daily tasks and errands.
* People who prefer speaking instead of typing.
* Users who want a simple, readable reminder interface.

## Key Features

### 1. Natural-Language Reminder Creation

Create reminders using supported date, time, and task phrases.

Examples:

* "Remind me in 30 minutes to take a break."
* "Remind me tomorrow at 10 AM to wash clothes."
* "Remind me to call Mom at 6 PM."
* "Remind me next Monday at noon to renew my library book."

The parser recognizes a defined set of English-language patterns. It is not an unrestricted conversational AI system.

### 2. Reminder Management

Users can:

* Create reminders.
* View all reminders.
* Filter reminders by status or date.
* Mark pending reminders as completed.
* Reopen completed reminders.
* Edit reminder details.
* Reschedule pending reminders.
* Delete reminders.
* View a summary of reminder activity.

### 3. Conversational Clarification

When a request lacks necessary information or matches multiple reminders, the assistant can ask a follow-up question.

For example, if several reminders have similar titles, the user may need to specify which reminder they mean.

This helps reduce unintended actions caused by ambiguous commands.

### 4. Confirmation Before Deletion

Chat-based deletion requires confirmation before removing a reminder.

The interface also provides a confirmation step when deleting through a reminder card.

### 5. Date and Time Handling

The parser supports a defined set of expressions, including:

* Relative times, such as "in 30 minutes."
* Relative days, such as "tomorrow."
* Weekdays and supported calendar-date formats.
* Clock times, such as "10 AM" and "5:30 PM."
* Noon and midnight.
* Ambiguous clock times that require AM/PM clarification.

When a supported time has already passed, the assistant can explain the issue and offer an alternative.

### 6. Voice Input

The application can use browser speech recognition to convert spoken commands into text.

Recognized speech appears in the input field so the user can review it before sending.

Voice recognition depends on browser support, microphone permission, network conditions, and the browser's speech service.

### 7. Optional Spoken Replies

Users can enable text-to-speech for supported chat responses.

Spoken replies are optional and disabled by default. The application does not intentionally read reminder alerts aloud.

### 8. Reminder Statistics

The interface displays statistics for reminder activity, such as pending reminders, reminders due today, and completed reminders.

### 9. Due-Time Alerts

When the page is running, the application checks reminder due times and displays an in-page alert.

Optional browser notifications can also be enabled where supported and permitted.

### 10. Local Data Persistence

Reminders are saved in browser localStorage and normally remain available after refreshing the page.

The application includes storage-recovery handling for certain damaged saved-data scenarios.

### 11. Accessibility and Responsive Layout

The interface includes accessibility-oriented features such as labelled controls, keyboard navigation, visible focus indicators, screen-reader announcements, and reduced-motion support.

The layout is designed to adapt to desktop, tablet, and mobile screen sizes.

---

## Example Commands

Try these supported command patterns:

| Action                          | Example                                        |
| ------------------------------- | ---------------------------------------------- |
| Create a reminder               | `Remind me tomorrow at 10 AM to wash clothes`  |
| Create a relative-time reminder | `Remind me in 30 minutes to take a break`      |
| List today's tasks              | `What do I need to do today?`                  |
| View upcoming reminders         | `Show my upcoming reminders`                   |
| View pending reminders          | `Show my pending reminders`                    |
| Complete a reminder             | `Mark my assignment as done`                   |
| Reschedule a reminder           | `Move my grocery reminder to tomorrow at 5 PM` |
| Cancel a reminder               | `Cancel my reminder to call Mom`               |
| View completed tasks            | `What have I completed?`                       |
| Request a summary               | `Summary`                                      |

**Note:** Supported wording is rule-based. Commands that fall outside the parser's supported patterns may not be understood.

---

## Technology Stack

| Technology           | Purpose                                                               |
| -------------------- | --------------------------------------------------------------------- |
| HTML5                | Page structure and semantic elements                                  |
| CSS3                 | Styling, responsive layout, animations, and visual states             |
| Vanilla JavaScript   | Command parsing, reminder operations, storage, and interface behavior |
| Browser localStorage | Local reminder persistence                                            |
| Web Speech API       | Optional speech recognition and spoken replies, where supported       |
| Node.js and npm      | Local development server                                              |
| Git and GitHub       | Source-code version control                                           |
| Vercel               | Static hosting, if using the deployed version                         |

The application does not currently require a backend, external database, framework, or AI API.

---

## Technical Architecture

RememberMe AI is a static web application built with HTML, CSS, and vanilla JavaScript.

Its main processing flow is:

```text
User types or speaks a command
              |
              v
     Input normalization
              |
              v
       Intent parsing
              |
              v
   Follow-up or validation
              |
              v
      Reminder operation
              |
              v
      Local data storage
              |
              v
    Interface re-rendering
              |
              v
       Assistant reply
```

The architecture separates command interpretation, reminder operations, storage, and interface rendering to make the application easier to maintain and debug.

### Project Files

| File           | Purpose                                                                     |
| -------------- | --------------------------------------------------------------------------- |
| `index.html`   | Main page structure and interface elements                                  |
| `style.css`    | Visual design, responsive layout, and animations                            |
| `script.js`    | Command parsing, reminder operations, storage, alerts, voice, and rendering |
| `package.json` | Project metadata and local development script                               |
| `README.md`    | Project documentation                                                       |
| `LICENSE`      | MIT License                                                                 |
| `.gitignore`   | Excludes selected local and generated files from Git                        |

### Command Processing

The application processes supported commands through a rule-based parser.

At a high level, it:

1. Normalizes the user's input.
2. Checks whether the assistant is waiting for a follow-up answer.
3. Identifies a supported command pattern.
4. Extracts the reminder title, date, and time.
5. Validates the parsed information.
6. Asks for clarification when necessary.
7. Calls the appropriate reminder operation.
8. Updates the stored data and interface.
9. Displays the resulting message.

The implementation uses JavaScript rules rather than a trained language model.

---

## Data Storage

Reminders are stored in the browser's localStorage under the key:

```text
rememberme-ai.reminders.v1
```

A reminder record contains fields such as:

```json
{
  "id": "example-reminder-id",
  "title": "Wash clothes",
  "dueAt": "2026-10-22T04:30:00.000Z",
  "status": "pending",
  "createdAt": "2026-10-21T14:05:12.000Z",
  "completedAt": null,
  "alertedAt": null
}
```

This is an illustrative example, not an actual reminder stored in the repository.

Dates are represented as ISO timestamps. The interface displays times using the device's local time zone.

### Storage Limitations

* Reminders are stored in the current browser profile.
* Data is not synchronized between devices.
* There is no user account or cloud database.
* Clearing browser site data may remove saved reminders.
* Browser localStorage is not encrypted.

---

## Installation and Local Development

### Prerequisites

* Node.js and npm.
* A modern browser, preferably Chrome or Edge for voice-related features.
* Git, if you want to clone the repository.

### 1. Clone the repository

Open a terminal and run:

```bash
git clone https://github.com/snehaprajapat6677-prog/Rememberme-ai.git
```

### 2. Open the project directory

```bash
cd Rememberme-ai
```

### 3. Start the development server

```bash
npm start
```

If the project uses the `serve` package as its development server, the first run may require an internet connection to download that package.

### 4. Open the application

Visit:

```text
http://localhost:3000
```

Use the port shown in your terminal if it differs.

### 5. Stop the server

Press `Ctrl+C` in the terminal.

**Alternative:** If your setup supports it, you can use a local static server of your choice. Opening the HTML file directly may produce different results for features that require a secure context.

---

## Deployment

RememberMe AI can be hosted as a static website.

For Vercel deployment:

1. Sign in to Vercel.
2. Select **Add New → Project**.
3. Import the GitHub repository `snehaprajapat6677-prog/Rememberme-ai`.
4. Select **Other** as the framework preset if prompted.
5. Leave the build command empty when no build step is required.
6. Use the project root as the output directory.
7. Deploy and wait for the deployment to finish.
8. Open the generated HTTPS URL.
9. Test the deployed version separately from the local version.

After pushing changes to the connected GitHub branch, Vercel can redeploy automatically if the repository integration is configured.

**Deployment note:** The existence of a GitHub repository does not itself confirm that a public deployment is live. Add the actual public URL here only after verifying it.

**Live demo:** Not listed in this document.

---

## Testing

The core reminder flows have been manually tested during development, according to the developer's reported results. This includes reminder management and conversational follow-up behavior.

A complete cross-browser, accessibility, and automated test suite has not been independently verified.

### Recommended Final Checks

Before presenting the project, verify:

* [ ] The application loads without JavaScript errors.
* [ ] A new reminder can be created.
* [ ] Reminders remain available after refreshing the page.
* [ ] List filters and summary statistics update correctly.
* [ ] A reminder can be completed and reopened.
* [ ] Editing and rescheduling update the intended reminder.
* [ ] Deletion requires confirmation.
* [ ] Answering "No" preserves the selected reminder.
* [ ] Ambiguous reminder matches trigger a clarification.
* [ ] AM/PM clarification selects the intended reminder.
* [ ] Voice input works in a supported browser.
* [ ] Spoken replies can be enabled and disabled.
* [ ] Notification permission is requested only after the user opts in.
* [ ] In-page alerts appear while the page is running.
* [ ] The layout works on desktop and mobile.
* [ ] Keyboard navigation reaches the main controls.
* [ ] No API keys, passwords, or other secrets are committed to the public repository.

Mark each item complete only after running the corresponding test.

---

## Privacy

RememberMe AI is designed to store reminder content locally rather than sending it to an application backend.

* There is no application account system.
* There is no cloud synchronization of reminders.
* Reminder content is stored in localStorage.
* The application does not require an external AI API.
* Browser speech services may process voice audio separately from the application.
* Browser speech recognition behavior depends on the browser and its configuration.
* The hosting provider may collect standard website request logs.

Users should avoid entering sensitive personal, financial, or medical information.

---

## Current Limitations

RememberMe AI is a prototype and has several limitations:

1. **Rule-based understanding:** It supports defined English command patterns rather than unrestricted natural-language conversation.
2. **No generative AI:** It does not currently use an external language model.
3. **No official Alexa integration:** It does not connect to Alexa devices, Alexa accounts, or official Alexa APIs.
4. **Local-only data:** Reminders do not synchronize between browsers or devices.
5. **Foreground-dependent alerts:** Reminders are checked while the page is running. Alerts are not guaranteed when the page is closed.
6. **No recurring reminders:** The current reminder model is intended for individual scheduled tasks.
7. **Browser-dependent voice support:** Speech recognition and synthesis vary by browser, operating system, and permissions.
8. **No encrypted storage:** Local reminder data is not encrypted by the application.
9. **Limited automated testing:** Broader automated and cross-browser testing remains future work.

These limitations are documented to distinguish implemented capabilities from potential future improvements.

---

## Future Improvements

Potential future improvements include:

* More flexible natural-language understanding.
* Multilingual commands and responses.
* Recurring reminders.
* More reliable background notifications.
* Import and export of reminder data.
* Automated tests for date parsing and command interpretation.
* Optional account-based synchronization.
* Additional accessibility testing with users.
* An official Alexa integration, if supported by the relevant Amazon APIs, permissions, and hackathon requirements.

These are future possibilities and are not represented as currently implemented features.

---

## Hackathon Context

RememberMe AI was developed for the **Amazon Developer Hackathon 2026**, targeting the Alexa+ track through the simulated conversational web-experience approach.

The project explores how a conversational interface can simplify everyday reminder management through text, optional voice interaction, and follow-up clarification.

It is an independent prototype, not an official Alexa product.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

Copyright (c) 2026 Sneha Prajapat

---

## Author

**Sneha Prajapat**

GitHub: [@snehaprajapat6677-prog](https://github.com/snehaprajapat6677-prog)

Project repository: [Rememberme-ai](https://github.com/snehaprajapat6677-prog/Rememberme-ai)

