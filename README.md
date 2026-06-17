TypePro
TypePro is a typing education and practice website built with HTML, CSS, and vanilla JavaScript. It guides users from learning proper typing fundamentals to practicing fixed texts and testing their typing speed and accuracy.


Pages

Home (index.html)
Landing page with a slide-out menu and three entry points: Learn Typing, Practice Typing, and Test your Typing Skills. Shows a brief "Welcome!" toast on load and includes a sticky header that activates on scroll.

Learn Typing (learn_typing.html)
An 11-slide interactive lesson covering typing fundamentals: posture, finger placement, hand-eye coordination, the space bar, home row, top row, bottom row, numbers and symbols, modifier keys, other keys, and a final summary. Each slide with a practice exercise includes a text input where the user types a given sequence and gets instant feedback ("Perfect!" or "Not quite! Try again.") on pressing Enter. Navigation is via previous/next arrows or a row of dots, each corresponding to a lesson.

Practice Typing (practice_typing.html)
A fixed-length passage, fetched randomly from a JSONBin text bank, that the user types from start to finish at their own pace. Tracks correct, incorrect, and corrected (backspaced-and-fixed) letters, then reports words-per-minute, accuracy, duration, and character count.

Test your Typing Skills (test_typing.html)
A 1-minute timed test using a continuous stream of random words pulled from a JSONBin word bank. More words load automatically as the user approaches the end of the visible text, so the test never runs dry. Reports words typed, accuracy, and a tailored performance message.


Shared Features

Dark Theme — Toggleable from a floating button on every page. The preference is saved to localStorage (darkTheme key) so it persists across page loads and across pages.
Mobile/Tablet Detection — Every page checks the user agent and shows a modal asking phone/tablet users to switch to a laptop or desktop for a proper typing experience.
Caps Lock Warning — Both the practice and test pages warn the user when Caps Lock is on, using keydown to show the warning immediately and keyup with event.getModifierState("CapsLock") to clear it once Caps Lock is switched off (or, on the test page, once the next valid character is typed). The warning is suppressed before typing starts and after the test/practice ends.
Remote Content via JSONBin — Practice texts and test words are fetched from JSONBin rather than being hardcoded, so content can be updated without changing the code. The test page caches the fetched word list in localStorage (cachedWords) after the first successful request to avoid repeated API calls and rate limiting.


Project Structure

typepro/
├── index.html              # Home page
├── home.css
├── home.js
├── learn_typing.html        # Interactive typing lessons
├── learn_typing.css
├── learn_typing.js
├── practice_typing.html     # Fixed-text practice mode
├── practice_typing.css
├── practice_typing.js
├── test_typing.html         # 1-minute timed typing test
├── test_typing.css
├── test_typing.js
└── images/
    └── logo.png

How It Works

Practice Typing (practice_typing.js)
Fetches a random passage from a JSONBin practice-text bank.
Renders each character as a <span> so it can be individually styled as correct, incorrect, corrected, or "up next."
Tracks lettersCorrect, lettersIncorrect, and lettersCorrected as the user types, supporting backspace corrections.
On reaching the end of the passage, calculates WPM, accuracy, and duration, and displays the results modal.


Typing Test (test_typing.js)
Fetches (or reads from cache) a word bank and builds an initial 200-word string.
Renders each character as a <span>, same approach as the practice page.
Starts a 60-second countdown on the first keystroke.
Continuously appends more random words as the user nears the end of the currently loaded text.
When the timer expires, displays words typed, accuracy, and a performance message.


Learn Typing (learn_typing.js)
Manages slide navigation (changeLesson, changeLessonTo, showLesson) and validates each lesson's practice input against the expected text shown in the corresponding <code> block, giving immediate feedback.


Dark Theme (all pages)
Each page's toggleDarkTheme() function toggles the dark-theme class on <body>, swaps the icon between dark_mode/light_mode, updates the colors used to highlight typed letters, and saves the preference to localStorage so it's restored automatically on the next page load.


Notes
This project is built for desktop/laptop use; mobile and tablet users are shown a warning and asked to switch devices.
API keys are currently embedded directly in client-side JavaScript. For a production deployment, consider proxying JSONBin requests through a backend so the master key isn't exposed publicly.
The Learn Typing practice inputs disable paste and drag-and-drop (onpaste, ondrop) to make sure users actually type the practice sequences rather than pasting them in.
