// Quiz Data exported from Claude quiz file
export interface QuizOption {
  text: string;
  correct: boolean;
}

export interface QuizQuestion {
  category: string;
  question: string;
  options: readonly string[] | string[];
  answer: number;
  note?: string;
  reactionCorrect?: string;
  reactionWrong?: string;
  label?: string;
}

export interface QuizCategory {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
}

export interface QuizResultTier {
  min: number;
  emoji: string;
  title: string;
  message: string;
}

export interface SecretMessage {
  passcode: string;
  passcodeHint: string;
  envelopeLabel: string;
  greeting: string;
  paragraphs: readonly string[] | string[];
  closing: string;
  signature: string;
  ps: string;
}

export interface QuizSettings {
  title: string;
  tagline: string;
  yourName: string;
  herName: string;
  herNickname: string;
  welcomePhoto: string;
  photoCaption: string;
  shuffleOptions: boolean;
  shuffleQuestionsInCategory: boolean;
  showEditHints: boolean;
  correctReactions: readonly string[] | string[];
  wrongReactions: readonly string[] | string[];
}

export const QUIZ_DATA = {

  /* ---------------------------------------------------------------
     SETTINGS
     --------------------------------------------------------------- */
  settings: {
    title: "How Well Do You Know Us?",
    tagline: "Two people, one story",
    yourName: "Arya",
    herName: "Madhuri",
    herNickname: "Jimjam",

    // Optional photo on the welcome polaroid. Put a photo in a "photos"
    // folder next to index.html and write its path here, e.g. "photos/us.jpg"
    welcomePhoto: "",
    photoCaption: "Arya ♡ Jimjam",

    shuffleOptions: true,              // shuffle answer cards every game
    shuffleQuestionsInCategory: false, // shuffle question order inside each chapter
    showEditHints: true,               // ← set to false before sending it to her!

    // Random reactions (used when a question has no reactionCorrect / reactionWrong)
    correctReactions: [
      "Correct! You really know me 🥹",
      "YES! That's my girl 💜",
      "Nailed it, {herNickname}! ✨",
      "Okay genius, slow down 😌",
      "Big brain AND cute? Unfair 💗",
      "Correct! +1 heart for you 💕"
    ],
    wrongReactions: [
      "Ooh, so close 🥺",
      "Nope! But I still love you 😤💜",
      "Wrong… we're discussing this later 😂",
      "Hmm, not quite, {herNickname} 🙈",
      "Plot twist! That's not it 😅"
    ]
  },

  /* ---------------------------------------------------------------
     CHAPTERS (categories) — shown in this order
     --------------------------------------------------------------- */
  categories: [
    { id: "story",  name: "Our Story",        emoji: "📖", color: "#efe5ff",
      description: "From one Discord server to this. Let's see how much you remember." },
    { id: "him",    name: "All About {yourName}", emoji: "🏎️", color: "#ffe4ef",
      description: "How well do you know your boy? No pressure. (Okay, a little pressure.)" },
    { id: "her",    name: "Through My Eyes",  emoji: "🌷", color: "#fff1d6",
      description: "These are about you — but can you guess how I see you?" },
    { id: "jokes",  name: "Inside Jokes",     emoji: "🤭", color: "#e6f6ef",
      description: "Only two people on this planet would get these." },
    { id: "prefs",  name: "Guilty or Not",    emoji: "😇", color: "#e9f0ff",
      description: "Be honest. I already know the answers." },
    { id: "us",     name: "Just Us",          emoji: "💞", color: "#ffe4ef",
      description: "The final chapter. The important stuff." }
  ],

  /* ---------------------------------------------------------------
     QUESTIONS
     category:        must match an id above
     question:        the question text
     options:         2–4 answer choices
     answer:          index of the correct option (0 = first)
     note:            (optional) little message shown after answering
     reactionCorrect: (optional) custom message if she gets it right
     reactionWrong:   (optional) custom message if she gets it wrong
     edit: true       = you still need to check / fill this one in
     --------------------------------------------------------------- */
  questions: [

    /* ---------- 📖 OUR STORY ---------- */
    {
      category: "story",
      question: "Which Discord server did we first meet on?",
      options: ["Rizz", "Haveli", "Digital Love", "Snickers"],
      answer: 0,
      note: "Best server I ever joined. 💜"
    },
    {
      category: "story",
      question: "How did we actually start talking?",
      options: ["Nobody texted first, we were in the same VC 🎧", "{yourName} slid into your DMs", "You slid into {yourName}'s DMs 😏", "A mod introduced us"],
      answer: 0,
      note: "No pickup line. Just one voice channel. 🎧"
    },
    {
      category: "story",
      question: "On our first proper call, what were you doing?",
      options: ["Applying lip balm 💄", "Eating dinner", "Half asleep already", "Doing your homework"],
      answer: 0,
      note: "Yes, I still remember. 🥹"
    },
    {
      category: "story",
      question: "Which game is OUR game?",
      options: ["Brawl Stars", "Roblox", "BGMI", "CPM2"],
      answer: 0,
      note: "Player 1 & Player 2, forever 🎮💜"
    },
    {
      category: "story",
      question: "Which song is 'our song'?",
      options: ["I Love You by Ash King", "Tum Hi Ho by Arijit Singh", "Raabta by Arijit Singh", "Brown Rang by Yo Yo Honey Singh 😎"],
      answer: 0,
      reactionCorrect: "Correct! Play it right now 🎶"
    },
    {
      category: "story",
      question: "How long was our longest call ever?",
      options: ["Around 30 hours 🤯", "Around 12 hours", "Around 8 hours", "2 hours, then you fell asleep"],
      answer: 0,
      note: "30 hours and I still didn't want to hang up."
    },

    /* ---------- 🏎️ ALL ABOUT HIM ---------- */
    {
      category: "him",
      question: "What's {yourName}'s favourite dish in the whole world?",
      options: ["Mummy's bhindi with dahi", "Butter chicken", "Chole bhature", "Maggi at 2 AM"],
      answer: 0,
      note: "Nothing beats Mummy's bhindi with dahi. Nothing. 🥹"
    },
    {
      category: "him",
      question: "Who is {yourName}'s favourite artist?",
      options: ["Yo Yo Honey Singh", "Arijit Singh", "Diljit Dosanjh", "AP Dhillon"],
      answer: 0,
      reactionCorrect: "Correct! Volume up 🔊🔥"
    },
    {
      category: "him",
      question: "Complete {yourName}'s motto: \"Jatt aagya ______\"",
      options: ["Toronto wala", "Panipat wala", "Canada wala", "London wala"],
      answer: 0,
      reactionCorrect: "Jatt aagya Toronto wala 😎"
    },
    {
      category: "him",
      question: "What's the name of {yourName}'s black Labrador?",
      options: ["Badal", "Bruno", "Sheru", "Tommy"],
      answer: 0,
      note: "Badal says hi 🐾🖤"
    },
    {
      category: "him",
      question: "Chai or coffee: what's {yourName}'s pick?",
      options: ["Coffee ☕", "Chai", "Both, depends on the mood", "Neither, just water"],
      answer: 0
    },
    {
      category: "him",
      question: "After a bad day, what does {yourName} do?",
      options: ["Talks to you, because your voice fixes everything 🥹", "Puts music on and ignores everyone", "Sleeps it off", "Watches F1 highlights"],
      answer: 0,
      note: "Your voice makes my day better. It heals. 💜"
    },

    /* ---------- 🌷 THROUGH MY EYES (about her) ---------- */
    {
      category: "her",
      question: "What's the first thing {yourName} noticed about you on the server?",
      options: ["Your vibe", "Your voice", "Your pfp", "Your username"],
      answer: 1,
      note: "One VC and I was gone."
    },
    {
      category: "her",
      question: "Which thing about you does {yourName} find the cutest?",
      options: ["Your laugh", "Your angry texts", "Your 'hmm' replies", "Your rage quits"],
      answer: 0,
      note: "I'd do anything to hear it again. And again."
    },
    {
      category: "her",
      question: "When you're upset, what fixes your mood fastest?",
      options: ["Brawl Stars + {yourName} complimenting you 😌", "Being left alone for an hour", "Food 🍫", "{yourName} saying sorry ten times"],
      answer: 0,
      reactionCorrect: "Works every time 😌💜"
    },
    {
      category: "her",
      question: "In games, you are the…",
      options: ["All-rounder who can do everything 💪", "Healer who keeps everyone alive", "Chaotic one who rushes in first", "One who blames the lag"],
      answer: 0
    },

    /* ---------- 🤭 INSIDE JOKES ---------- */
    {
      category: "jokes",
      question: "Which line do we say WAY too much?",
      options: ["Acha bete, acha bachu", "Theek hai, theek hai", "Haan haan, pata hai", "Chal jhoothi"],
      answer: 0
    },
    {
      category: "jokes",
      question: "Finish the line: \"Acha bete, ______\"",
      options: ["attitude bata rahe", "bahut bol rahe ho", "kal dekh lenge", "mummy ko bataun?"],
      answer: 0,
      reactionCorrect: "Acha bete, attitude bata rahe 😏"
    },
    {
      category: "jokes",
      question: "Our silliest fight ever was about…",
      options: ["{yourName} 'targeting' you in Brawl Stars 🎯", "Who hung up first", "A late reply", "Whose turn it was to pick the game"],
      answer: 0,
      note: "For the record: I was NOT targeting you. 😇"
    },
    {
      category: "jokes",
      question: "What's your name saved as in {yourName}'s phone?",
      options: ["{herNickname}", "{herName}", "Wifey 💍", "Brawl Stars teammate"],
      answer: 0
    },

    /* ---------- 😇 GUILTY OR NOT ---------- */
    {
      category: "prefs",
      question: "Who falls asleep first on call?",
      options: ["{herNickname} 😴", "{yourName}", "Both at the exact same second"],
      answer: 0,
      reactionCorrect: "Guilty as charged 😴",
      reactionWrong: "Nice try. It's you, sleepyhead 😴"
    },
    {
      category: "prefs",
      question: "Who takes longer to reply?",
      options: ["{herNickname} 🙄", "{yourName}", "Nobody, we're both instant"],
      answer: 0,
      reactionCorrect: "At least you admit it 😂",
      reactionWrong: "Excuse me? Check your own reply times 😂"
    },
    {
      category: "prefs",
      question: "Who's the bigger drama queen?",
      options: ["{herNickname} 👑", "{yourName}", "It's a tie"],
      answer: 0,
      reactionCorrect: "Crown stays on, queen 👑",
      reactionWrong: "The drama of denying it proves my point 👑"
    },

    /* ---------- 💞 JUST US ---------- */
    {
      category: "us",
      question: "Who said \"I love you\" first?",
      options: ["{yourName}", "{herNickname}", "We said it at the same time"],
      answer: 0,
      note: "And I'd say it first every single time."
    },
    {
      category: "us",
      question: "What made {yourName} fall for you?",
      options: ["Our chemistry", "We started Brawl Stars together", "Your Discord profile picture", "You asked nicely"],
      answer: 0
    },
    {
      category: "us",
      question: "What's {yourName}'s favourite memory of us so far?",
      options: ["Our first video call", "Our 30 hour call", "The day we met in that VC", "Our first Brawl Stars win"],
      answer: 0,
      note: "Seeing you for the first time. Nothing beats it."
    },
    {
      category: "us",
      question: "{yourName}'s dream date night?",
      options: ["Falling asleep next to you, no one around, just us two", "Enjoying together in a group call", "Movie night on screen share 🍿", "Playing games together the whole night 🎮"],
      answer: 0,
      note: "One day. 💜"
    },
    {
      category: "us",
      question: "The day we finally meet, what's the first thing {yourName} will do?",
      options: ["Admire you, then hug you tightly", "Tease you", "Faint", "Say 'acha bete' and walk away"],
      answer: 0,
      note: "Very tightly. For a very long time."
    },
    {
      category: "us",
      question: "What's {yourName}'s favourite thing about you?",
      options: ["Your heart", "Your voice", "Your laugh", "Your gaming skills"],
      answer: 0,
      note: "(The other three are very close though.)"
    },
    {
      category: "us",
      question: "Last question… how much does {yourName} love you?",
      options: ["A lot", "Too much", "More than Mummy's bhindi with dahi 🥹", "All of the above, times infinity"],
      answer: 3,
      reactionCorrect: "Obviously. 💜",
      reactionWrong: "Close, but the real answer is: all of the above, times infinity 💜",
      note: "(This one was never really a question.)"
    }
  ],

  /* ---------------------------------------------------------------
     RESULTS — picked by percentage (highest "min" she reaches wins)
     Tokens you can use here: {score} {total} {percent} + the names
     --------------------------------------------------------------- */
  results: [
    { min: 100, emoji: "💍", title: "Soulmate Certified",
      message: "{score} out of {total}. Every. Single. One. You don't just know me, {herNickname} — you know US." },
    { min: 80, emoji: "✨", title: "Basically Telepathic",
      message: "{score}/{total}! You know me scarily well. Honestly, a little suspicious. I love it." },
    { min: 60, emoji: "💞", title: "Partner in Crime",
      message: "{score}/{total} — solid! You know the important stuff, and the rest we'll fix on our next call." },
    { min: 40, emoji: "🤨", title: "Cute but Suspicious",
      message: "{score}/{total}… we clearly need more late-night talks. Lucky for you, I'm free forever." },
    { min: 0, emoji: "🥺", title: "We Need More Calls",
      message: "{score}/{total}. That just means we have more memories to make. Bad news: you're stuck with me while we make them." }
  ],

  /* ---------------------------------------------------------------
     SECRET LETTER — unlocks after the quiz
     passcode: leave "" for no lock, or set a secret word only she knows
     --------------------------------------------------------------- */
  secretMessage: {
    passcode: "",
    passcodeHint: "",
    envelopeLabel: "For {herNickname}, only 💌",
    greeting: "My {herNickname},",
    paragraphs: [
      "If you're reading this, you just finished a whole quiz about us — and whatever your score was, you already won the real game a long time ago.",
      "We didn't start with a text. We started in one voice channel on Rizz, and the first thing I noticed was your voice. It still makes my day better. On my worst days, it's the thing that heals me.",
      "I love your laugh. I love that on our first proper call you were just sitting there applying lip balm, and I still remember it. I love our first video call more than any other memory I have. But most of all, I love your heart.",
      "One day the distance will be zero. I'm going to stand there and just admire you for a second, and then hug you so tightly.",
      "Two people, one story. And I can't wait to write every next chapter with you."
    ],
    closing: "Forever yours,",
    signature: "{yourName} 🖤💜",
    ps: "P.S. Acha bete, attitude bata rahe? 😏 (And no, I was NOT targeting you in Brawl Stars.)"
  }
} as const;
