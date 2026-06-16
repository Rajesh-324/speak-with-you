// ============================================================
// SpeakWithYou — Complete 30-Day English Course Content
// ============================================================
// Beginner-friendly lessons from alphabet basics to interview prep.
// Each day has: vocabulary, grammar, practice sentences, speaking
// task, writing task, and a quiz with explanations.
// ============================================================

import type { LessonDay } from "@/types";

const handcraftedLessons: LessonDay[] = [
  // ============================================================
  // DAY 1 — English Alphabet & Greetings
  // ============================================================
  {
    day: 1,
    topic: "English Alphabet & Basic Greetings",
    description:
      "Learn the 26 English letters and basic greeting phrases to start conversations.",
    teluguHint: "ఆంగ్ల అక్షరాలు & పలకరింపులు",
    vocabulary: [
      { word: "Hello", meaning: "A common greeting", pronunciation: "heh-LOH", example: "Hello! How are you?" },
      { word: "Good morning", meaning: "Greeting used in the morning", pronunciation: "good MOR-ning", example: "Good morning, teacher!" },
      { word: "Good afternoon", meaning: "Greeting used after noon", pronunciation: "good af-ter-NOON", example: "Good afternoon, sir." },
      { word: "Good evening", meaning: "Greeting used in the evening", pronunciation: "good EEV-ning", example: "Good evening, everyone." },
      { word: "Good night", meaning: "Said before sleeping or leaving at night", pronunciation: "good NITE", example: "Good night! Sleep well." },
      { word: "Goodbye", meaning: "Said when leaving", pronunciation: "good-BYE", example: "Goodbye! See you tomorrow." },
      { word: "Thank you", meaning: "Expression of gratitude", pronunciation: "THANK yoo", example: "Thank you for your help!" },
      { word: "Please", meaning: "Used for polite requests", pronunciation: "PLEEZ", example: "Please sit down." },
      { word: "Sorry", meaning: "Used to apologize", pronunciation: "SAW-ree", example: "Sorry, I am late." },
      { word: "Welcome", meaning: "Greeting or response to thanks", pronunciation: "WEL-kum", example: "Welcome to our school!" },
    ],
    grammar: {
      title: "The English Alphabet",
      explanation:
        "English has 26 letters: A B C D E F G H I J K L M N O P Q R S T U V W X Y Z. There are 5 vowels (A, E, I, O, U) and 21 consonants. Vowels are very important — every English word has at least one vowel sound. Capital letters are used at the start of sentences and for names.",
      structure: "Vowels: A, E, I, O, U | Consonants: All other letters",
      examples: [
        "A - Apple, E - Elephant, I - Ice cream, O - Orange, U - Umbrella",
        "My name starts with a capital letter: Ravi",
        "Every sentence starts with a capital letter: Hello, I am here.",
      ],
    },
    practiceSentences: [
      { english: "Hello! My name is Ravi.", telugu: "హలో! నా పేరు రవి." },
      { english: "Good morning, teacher!", telugu: "శుభోదయం, టీచర్!" },
      { english: "Thank you very much.", telugu: "చాలా ధన్యవాదాలు." },
      { english: "Please help me.", telugu: "దయచేసి నాకు సహాయం చేయండి." },
      { english: "Goodbye! See you tomorrow.", telugu: "వీడ్కోలు! రేపు కలుద్దాం." },
    ],
    speakingTask: {
      instruction: "Practice saying each greeting out loud 3 times. Then introduce yourself: 'Hello! My name is ___. Good morning!'",
      exampleAnswer: "Hello! My name is Priya. Good morning! How are you? Thank you!",
    },
    writingTask: {
      instruction: "Write the 26 English letters (A to Z) in both capital and small letters. Then write 3 greeting sentences.",
      hint: "Start with: Aa Bb Cc Dd... Then write: Hello, my name is...",
    },
    quiz: [
      { question: "How many letters are in the English alphabet?", options: ["24", "26", "28", "30"], correctIndex: 1, explanation: "The English alphabet has 26 letters from A to Z." },
      { question: "Which of these is a vowel?", options: ["B", "C", "E", "D"], correctIndex: 2, explanation: "E is one of the 5 vowels: A, E, I, O, U." },
      { question: "What do you say in the morning?", options: ["Good night", "Good morning", "Goodbye", "Sorry"], correctIndex: 1, explanation: "We say 'Good morning' when we meet someone in the morning." },
      { question: "What does 'Thank you' mean?", options: ["I am sorry", "I am grateful", "I am angry", "I am leaving"], correctIndex: 1, explanation: "'Thank you' is used to show gratitude when someone helps you." },
      { question: "Every sentence starts with a ___.", options: ["Small letter", "Number", "Capital letter", "Symbol"], correctIndex: 2, explanation: "In English, every sentence must start with a capital letter." },
    ],
  },

  // ============================================================
  // DAY 2 — Numbers, Counting & Age
  // ============================================================
  {
    day: 2,
    topic: "Numbers, Counting & Telling Your Age",
    description:
      "Learn numbers 1–100, how to count, and tell people your age.",
    teluguHint: "సంఖ్యలు & వయస్సు చెప్పడం",
    vocabulary: [
      { word: "One", meaning: "The number 1", pronunciation: "WUN", example: "I have one book." },
      { word: "Ten", meaning: "The number 10", pronunciation: "TEN", example: "There are ten students." },
      { word: "Twenty", meaning: "The number 20", pronunciation: "TWEN-tee", example: "I am twenty years old." },
      { word: "Hundred", meaning: "The number 100", pronunciation: "HUN-dred", example: "There are one hundred pages." },
      { word: "Age", meaning: "How old someone is", pronunciation: "AYJ", example: "What is your age?" },
      { word: "Old", meaning: "Having lived many years", pronunciation: "OHLD", example: "How old are you?" },
      { word: "Young", meaning: "Not old, early in life", pronunciation: "YUNG", example: "She is a young girl." },
      { word: "Count", meaning: "To say numbers in order", pronunciation: "KOWNT", example: "Can you count to ten?" },
      { word: "Number", meaning: "A mathematical value", pronunciation: "NUM-ber", example: "What is your phone number?" },
      { word: "Year", meaning: "A period of 12 months", pronunciation: "YEER", example: "I am eighteen years old." },
    ],
    grammar: {
      title: "Numbers and Telling Your Age",
      explanation:
        "Numbers 1–10: One, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten. Teens: Eleven, Twelve, Thirteen... Nineteen. Tens: Twenty, Thirty, Forty, Fifty, Sixty, Seventy, Eighty, Ninety, Hundred. To tell your age, say: 'I am ___ years old.' Use 'How old are you?' to ask someone's age.",
      structure: "I am + [number] + years old.",
      examples: [
        "I am twenty years old.",
        "My sister is fifteen years old.",
        "He is thirty-five years old.",
      ],
    },
    practiceSentences: [
      { english: "I am eighteen years old.", telugu: "నా వయస్సు పద్దెనిమిది సంవత్సరాలు." },
      { english: "There are thirty students in my class.", telugu: "నా తరగతిలో ముప్పై విద్యార్థులు ఉన్నారు." },
      { english: "My phone number is 9876543210.", telugu: "నా ఫోన్ నంబర్ 9876543210." },
      { english: "I can count from one to hundred.", telugu: "నేను ఒకటి నుండి వంద వరకు లెక్కించగలను." },
      { english: "How old is your brother?", telugu: "మీ అన్న/తమ్ముడి వయస్సు ఎంత?" },
    ],
    speakingTask: {
      instruction: "Count from 1 to 20 out loud. Then say: 'My name is ___. I am ___ years old.'",
      exampleAnswer: "One, two, three... twenty. My name is Suresh. I am twenty-two years old.",
    },
    writingTask: {
      instruction: "Write the numbers 1 to 20 in English words. Then write 3 sentences using numbers.",
      hint: "One, Two, Three... Write: 'I have ___ friends.' 'There are ___ chairs.'",
    },
    quiz: [
      { question: "How do you write 15 in words?", options: ["Fiveteen", "Fifteen", "Fiften", "Fiftein"], correctIndex: 1, explanation: "15 is spelled 'Fifteen' — note the double 'e'." },
      { question: "How do you ask someone's age?", options: ["What is your name?", "How old are you?", "Where are you?", "What do you do?"], correctIndex: 1, explanation: "'How old are you?' is the correct way to ask someone's age." },
      { question: "What comes after twenty-nine?", options: ["Twenty-ten", "Thirty", "Thirdty", "Tweny"], correctIndex: 1, explanation: "After twenty-nine comes thirty (30)." },
      { question: "Fill in: 'I am 20 ___ old.'", options: ["months", "days", "years", "times"], correctIndex: 2, explanation: "We say 'I am 20 years old' when telling our age." },
      { question: "How do you write 100 in words?", options: ["Hundred", "Hunderd", "Hundrad", "Hundered"], correctIndex: 0, explanation: "100 is spelled 'Hundred'." },
    ],
  },

  // ============================================================
  // DAY 3 — Colors, Shapes & Describing Things
  // ============================================================
  {
    day: 3,
    topic: "Colors, Shapes & Describing Things",
    description:
      "Learn common colors and shapes, and how to describe objects around you.",
    teluguHint: "రంగులు, ఆకారాలు & వస్తువులను వర్ణించడం",
    vocabulary: [
      { word: "Red", meaning: "Color of blood or roses", pronunciation: "RED", example: "The apple is red." },
      { word: "Blue", meaning: "Color of the sky", pronunciation: "BLOO", example: "The sky is blue." },
      { word: "Green", meaning: "Color of grass and leaves", pronunciation: "GREEN", example: "The grass is green." },
      { word: "Yellow", meaning: "Color of the sun", pronunciation: "YEL-oh", example: "The sun is yellow." },
      { word: "White", meaning: "Color of milk or snow", pronunciation: "WITE", example: "Milk is white." },
      { word: "Black", meaning: "Darkest color", pronunciation: "BLAK", example: "My hair is black." },
      { word: "Circle", meaning: "A round shape", pronunciation: "SUR-kul", example: "The ball is a circle." },
      { word: "Square", meaning: "A shape with 4 equal sides", pronunciation: "SKWAIR", example: "The window is a square." },
      { word: "Big", meaning: "Large in size", pronunciation: "BIG", example: "The elephant is big." },
      { word: "Small", meaning: "Little in size", pronunciation: "SMAWL", example: "The ant is small." },
    ],
    grammar: {
      title: "Adjectives — Describing Words",
      explanation:
        "Adjectives are words that describe nouns (people, places, things). In English, the adjective comes BEFORE the noun. Examples: 'red apple' (not 'apple red'), 'big house' (not 'house big'). Common adjectives include colors (red, blue), sizes (big, small), and feelings (happy, sad).",
      structure: "Article + Adjective + Noun → The red apple / A big house",
      examples: [
        "The red car is fast.",
        "I have a small bag.",
        "She is wearing a blue dress.",
      ],
    },
    practiceSentences: [
      { english: "The sky is blue and beautiful.", telugu: "ఆకాశం నీలంగా మరియు అందంగా ఉంది." },
      { english: "I like the green trees.", telugu: "నాకు ఆకుపచ్చ చెట్లు ఇష్టం." },
      { english: "My bag is big and black.", telugu: "నా బ్యాగ్ పెద్దగా మరియు నల్లగా ఉంది." },
      { english: "The small cat is white.", telugu: "చిన్న పిల్లి తెల్లగా ఉంది." },
      { english: "This is a yellow flower.", telugu: "ఇది పసుపు రంగు పువ్వు." },
    ],
    speakingTask: {
      instruction: "Look around your room. Describe 5 things using colors and sizes. Example: 'My phone is black and small.'",
      exampleAnswer: "My phone is black and small. The wall is white and big. My pen is blue. The door is brown and tall. My water bottle is green.",
    },
    writingTask: {
      instruction: "Write 5 sentences describing things in your room using color and size words.",
      hint: "Use this pattern: The/My ___ is ___ and ___.",
    },
    quiz: [
      { question: "Where does the adjective go in English?", options: ["After the noun", "Before the noun", "At the end", "Anywhere"], correctIndex: 1, explanation: "In English, adjectives come BEFORE the noun: 'red car', not 'car red'." },
      { question: "Which is a color?", options: ["Big", "Circle", "Green", "Fast"], correctIndex: 2, explanation: "Green is a color. Big is a size, Circle is a shape, Fast is a speed." },
      { question: "'The ___ ball is round.' Fill in with a color.", options: ["big", "red", "fast", "round"], correctIndex: 1, explanation: "'The red ball is round' — red is a color adjective." },
      { question: "What shape is a ball?", options: ["Square", "Triangle", "Circle", "Rectangle"], correctIndex: 2, explanation: "A ball is round, which is a circle shape." },
      { question: "Opposite of 'big' is:", options: ["Tall", "Small", "Long", "Wide"], correctIndex: 1, explanation: "The opposite of 'big' is 'small'." },
    ],
  },

  // ============================================================
  // DAY 4 — Family Members & Relationships
  // ============================================================
  {
    day: 4,
    topic: "Family Members & Relationships",
    description:
      "Learn words for family members and how to talk about your family.",
    teluguHint: "కుటుంబ సభ్యులు & బంధుత్వాలు",
    vocabulary: [
      { word: "Father", meaning: "Male parent (Dad)", pronunciation: "FAH-ther", example: "My father is a teacher." },
      { word: "Mother", meaning: "Female parent (Mom)", pronunciation: "MUH-ther", example: "My mother cooks delicious food." },
      { word: "Brother", meaning: "Male sibling", pronunciation: "BRUH-ther", example: "I have one brother." },
      { word: "Sister", meaning: "Female sibling", pronunciation: "SIS-ter", example: "My sister is very kind." },
      { word: "Grandfather", meaning: "Father's or mother's father", pronunciation: "GRAND-fah-ther", example: "My grandfather tells nice stories." },
      { word: "Grandmother", meaning: "Father's or mother's mother", pronunciation: "GRAND-muh-ther", example: "My grandmother makes sweets." },
      { word: "Uncle", meaning: "Parent's brother", pronunciation: "UNG-kul", example: "My uncle lives in Hyderabad." },
      { word: "Aunt", meaning: "Parent's sister", pronunciation: "ANT", example: "My aunt is a doctor." },
      { word: "Cousin", meaning: "Uncle's or aunt's child", pronunciation: "KUH-zin", example: "My cousin and I play together." },
      { word: "Family", meaning: "Group of related people", pronunciation: "FAM-uh-lee", example: "I love my family." },
    ],
    grammar: {
      title: "Possessive Pronouns — My, Your, His, Her, Our, Their",
      explanation:
        "Possessive pronouns show ownership. Use 'my' for yourself, 'your' for the person you're talking to, 'his' for a boy/man, 'her' for a girl/woman, 'our' for your group, and 'their' for others. Example: 'My father', 'Her mother', 'Our family'.",
      structure: "Possessive Pronoun + Noun → My father / Her sister / Our house",
      examples: [
        "My father is a farmer.",
        "Her brother is tall.",
        "Their house is big.",
      ],
    },
    practiceSentences: [
      { english: "My family has five members.", telugu: "నా కుటుంబంలో ఐదుగురు సభ్యులు ఉన్నారు." },
      { english: "My father works in an office.", telugu: "నా నాన్న ఆఫీసులో పని చేస్తారు." },
      { english: "Her mother is very kind.", telugu: "ఆమె అమ్మ చాలా దయగలవారు." },
      { english: "Our grandmother lives with us.", telugu: "మా నాయనమ్మ మాతో నివసిస్తుంది." },
      { english: "I love my brother and sister.", telugu: "నేను నా అన్న/తమ్ముడు మరియు అక్క/చెల్లిని ప్రేమిస్తాను." },
    ],
    speakingTask: {
      instruction: "Introduce your family. Say how many members, their names, and what they do. Use 'my', 'our', 'his', 'her'.",
      exampleAnswer: "My family has four members. My father is Ramesh. He is a shopkeeper. My mother is Lakshmi. She is a homemaker. My sister is Priya. She is a student. I love my family.",
    },
    writingTask: {
      instruction: "Write a short paragraph (5–7 sentences) about your family. Mention each member, their role, and one thing about them.",
      hint: "Start with: 'I have a ___ family. My father is...'",
    },
    quiz: [
      { question: "Your mother's mother is your:", options: ["Aunt", "Sister", "Grandmother", "Cousin"], correctIndex: 2, explanation: "Your mother's mother is your grandmother." },
      { question: "'___ brother is a doctor.' (Talking about a girl)", options: ["His", "My", "Her", "Their"], correctIndex: 2, explanation: "We use 'Her' for something belonging to a girl/woman." },
      { question: "Your uncle's child is your:", options: ["Brother", "Nephew", "Cousin", "Friend"], correctIndex: 2, explanation: "Your uncle's or aunt's child is your cousin." },
      { question: "Which word means a male parent?", options: ["Mother", "Brother", "Father", "Uncle"], correctIndex: 2, explanation: "Father means male parent (dad)." },
      { question: "'Our' is used when talking about:", options: ["Myself only", "You only", "Our group", "Strangers"], correctIndex: 2, explanation: "'Our' is used when talking about something belonging to your group." },
    ],
  },

  // ============================================================
  // DAY 5 — Days of the Week & Months
  // ============================================================
  {
    day: 5,
    topic: "Days of the Week & Months of the Year",
    description:
      "Learn all 7 days and 12 months, and how to talk about dates and schedules.",
    teluguHint: "వారంలోని రోజులు & సంవత్సరంలోని నెలలు",
    vocabulary: [
      { word: "Monday", meaning: "First working day of the week", pronunciation: "MUN-day", example: "Monday is the first day of work." },
      { word: "Sunday", meaning: "Last day of the week / holiday", pronunciation: "SUN-day", example: "Sunday is a holiday." },
      { word: "January", meaning: "First month of the year", pronunciation: "JAN-yoo-air-ee", example: "January is the first month." },
      { word: "Today", meaning: "This day", pronunciation: "tuh-DAY", example: "Today is Monday." },
      { word: "Tomorrow", meaning: "The day after today", pronunciation: "tuh-MAH-roh", example: "Tomorrow is Tuesday." },
      { word: "Yesterday", meaning: "The day before today", pronunciation: "YES-ter-day", example: "Yesterday was Sunday." },
      { word: "Week", meaning: "A period of 7 days", pronunciation: "WEEK", example: "There are seven days in a week." },
      { word: "Month", meaning: "A period of about 30 days", pronunciation: "MUNTH", example: "There are twelve months in a year." },
      { word: "Birthday", meaning: "Anniversary of the day you were born", pronunciation: "BURTH-day", example: "My birthday is in March." },
      { word: "Holiday", meaning: "A day of rest or celebration", pronunciation: "HOL-ih-day", example: "Sunday is a holiday." },
    ],
    grammar: {
      title: "Prepositions of Time — On, In, At",
      explanation:
        "Use 'on' for days and dates: 'on Monday', 'on 15th January'. Use 'in' for months, years, and long periods: 'in January', 'in 2024', 'in the morning'. Use 'at' for specific times: 'at 9 o'clock', 'at night'. Remember: ON days, IN months, AT times.",
      structure: "on + day/date | in + month/year | at + time",
      examples: [
        "I go to school on Monday.",
        "My birthday is in March.",
        "I wake up at 7 o'clock.",
      ],
    },
    practiceSentences: [
      { english: "Today is Wednesday.", telugu: "ఈ రోజు బుధవారం." },
      { english: "My birthday is on 15th March.", telugu: "నా పుట్టినరోజు మార్చి 15న." },
      { english: "We have a holiday on Sunday.", telugu: "ఆదివారం మాకు సెలవు." },
      { english: "School starts in June.", telugu: "బడి జూన్‌లో మొదలవుతుంది." },
      { english: "I was born in the year 2005.", telugu: "నేను 2005 సంవత్సరంలో పుట్టాను." },
    ],
    speakingTask: {
      instruction: "Say all 7 days and all 12 months out loud. Then say: 'Today is ___. My birthday is in ___. My favorite day is ___.'",
      exampleAnswer: "Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday. January, February... December. Today is Monday. My birthday is in July. My favorite day is Saturday because I can play.",
    },
    writingTask: {
      instruction: "Write all 7 days and 12 months. Then write 5 sentences about your week using 'on', 'in', 'at'.",
      hint: "On Monday I go to... In January the weather is... At 8 o'clock I...",
    },
    quiz: [
      { question: "How many days are in a week?", options: ["5", "6", "7", "8"], correctIndex: 2, explanation: "There are 7 days in a week: Monday through Sunday." },
      { question: "'My birthday is ___ March.' Which preposition?", options: ["on", "in", "at", "by"], correctIndex: 1, explanation: "We use 'in' with months: 'in March', 'in January'." },
      { question: "Which is NOT a day of the week?", options: ["Monday", "Friday", "January", "Sunday"], correctIndex: 2, explanation: "January is a month, not a day of the week." },
      { question: "'I go to school ___ Monday.' Which preposition?", options: ["in", "at", "on", "by"], correctIndex: 2, explanation: "We use 'on' with days: 'on Monday', 'on Friday'." },
      { question: "How many months are in a year?", options: ["10", "11", "12", "13"], correctIndex: 2, explanation: "There are 12 months in a year: January through December." },
    ],
  },

  // ============================================================
  // DAY 6 — Food & Drinks
  // ============================================================
  {
    day: 6,
    topic: "Food, Drinks & Ordering Meals",
    description:
      "Learn food and drink vocabulary, express likes/dislikes, and order meals.",
    teluguHint: "ఆహారం, పానీయాలు & భోజనం ఆర్డర్ చేయడం",
    vocabulary: [
      { word: "Rice", meaning: "A staple grain food", pronunciation: "RICE", example: "I eat rice for lunch." },
      { word: "Bread", meaning: "Baked food made from flour", pronunciation: "BRED", example: "I eat bread for breakfast." },
      { word: "Water", meaning: "A clear liquid to drink", pronunciation: "WAH-ter", example: "I drink water every day." },
      { word: "Milk", meaning: "White liquid from cows", pronunciation: "MILK", example: "I drink milk in the morning." },
      { word: "Fruit", meaning: "Sweet food from plants", pronunciation: "FROOT", example: "Mango is my favorite fruit." },
      { word: "Vegetable", meaning: "Plant food like tomato, potato", pronunciation: "VEJ-tuh-bul", example: "We should eat vegetables daily." },
      { word: "Hungry", meaning: "Wanting to eat", pronunciation: "HUNG-gree", example: "I am hungry." },
      { word: "Thirsty", meaning: "Wanting to drink", pronunciation: "THUR-stee", example: "I am thirsty." },
      { word: "Delicious", meaning: "Very tasty", pronunciation: "deh-LISH-us", example: "This food is delicious!" },
      { word: "Menu", meaning: "List of food items", pronunciation: "MEN-yoo", example: "Can I see the menu, please?" },
    ],
    grammar: {
      title: "I like / I don't like — Expressing Preferences",
      explanation:
        "To say what you enjoy: 'I like ___.' To say what you don't enjoy: 'I don't like ___.' To ask: 'Do you like ___?' Use 'would like' for polite requests: 'I would like some water, please.' Short form: 'I'd like...'",
      structure: "I like + noun/verb-ing | I don't like + noun/verb-ing | I would like + noun",
      examples: [
        "I like mangoes.",
        "I don't like bitter gourd.",
        "I would like some tea, please.",
      ],
    },
    practiceSentences: [
      { english: "I am hungry. I want to eat rice.", telugu: "నాకు ఆకలిగా ఉంది. నేను అన్నం తినాలనుకుంటున్నాను." },
      { english: "Do you like tea or coffee?", telugu: "మీకు టీ ఇష్టమా లేదా కాఫీ ఇష్టమా?" },
      { english: "I would like a glass of water, please.", telugu: "దయచేసి నాకు ఒక గ్లాసు నీరు కావాలి." },
      { english: "This biryani is very delicious!", telugu: "ఈ బిర్యానీ చాలా రుచిగా ఉంది!" },
      { english: "I don't like spicy food.", telugu: "నాకు కారమైన ఆహారం ఇష్టం లేదు." },
    ],
    speakingTask: {
      instruction: "Pretend you are in a restaurant. Order food politely: 'I would like ___, please.' Tell what you like and don't like to eat.",
      exampleAnswer: "Good evening! I would like some rice and dal, please. I also want a glass of mango juice. I like spicy food but I don't like too much oil. Thank you!",
    },
    writingTask: {
      instruction: "Write about your favorite food. What do you eat for breakfast, lunch, and dinner? What do you like and dislike?",
      hint: "For breakfast, I eat... My favorite food is... I don't like...",
    },
    quiz: [
      { question: "How do you say you want food politely?", options: ["Give me food!", "I would like some food, please.", "Food now!", "I want food!"], correctIndex: 1, explanation: "'I would like..., please' is the polite way to request food." },
      { question: "'I am ___' means you want to drink.", options: ["hungry", "happy", "thirsty", "tired"], correctIndex: 2, explanation: "'Thirsty' means you want to drink something." },
      { question: "Which is a fruit?", options: ["Rice", "Mango", "Bread", "Water"], correctIndex: 1, explanation: "Mango is a fruit. Rice is a grain, bread is baked food." },
      { question: "'I ___ like bitter food.'", options: ["do", "don't", "am", "is"], correctIndex: 1, explanation: "'I don't like' is used to express something you do not enjoy." },
      { question: "What does 'delicious' mean?", options: ["Very bad", "Very big", "Very tasty", "Very hot"], correctIndex: 2, explanation: "'Delicious' means very tasty and enjoyable to eat." },
    ],
  },

  // ============================================================
  // DAY 7 — Clothes & Getting Dressed
  // ============================================================
  {
    day: 7,
    topic: "Clothes, Getting Dressed & Shopping",
    description:
      "Learn clothing vocabulary and how to describe what you wear and shop for clothes.",
    teluguHint: "దుస్తులు & షాపింగ్",
    vocabulary: [
      { word: "Shirt", meaning: "Upper body garment with buttons", pronunciation: "SHURT", example: "I am wearing a white shirt." },
      { word: "Pants", meaning: "Lower body garment for legs", pronunciation: "PANTS", example: "These pants are comfortable." },
      { word: "Dress", meaning: "One-piece garment for women", pronunciation: "DRES", example: "She is wearing a beautiful dress." },
      { word: "Shoes", meaning: "Footwear", pronunciation: "SHOOZ", example: "I need new shoes." },
      { word: "Uniform", meaning: "Matching clothes for school/work", pronunciation: "YOO-nih-form", example: "I wear a uniform to school." },
      { word: "Wear", meaning: "To have clothes on your body", pronunciation: "WAIR", example: "I wear a jacket in winter." },
      { word: "Size", meaning: "How big or small something is", pronunciation: "SIZE", example: "What size do you wear?" },
      { word: "Comfortable", meaning: "Feels nice to wear", pronunciation: "KUM-fer-tuh-bul", example: "These shoes are comfortable." },
      { word: "Expensive", meaning: "Costs a lot of money", pronunciation: "ex-PEN-siv", example: "This dress is expensive." },
      { word: "Cheap", meaning: "Costs little money", pronunciation: "CHEEP", example: "This shirt is cheap." },
    ],
    grammar: {
      title: "Present Continuous — What You Are Wearing Now",
      explanation:
        "Use present continuous to describe what is happening right now. Structure: Subject + am/is/are + verb-ing. 'I am wearing a blue shirt.' 'She is wearing a dress.' 'They are wearing uniforms.' Use 'am' with I, 'is' with he/she/it, 'are' with you/we/they.",
      structure: "Subject + am/is/are + wearing + clothes",
      examples: [
        "I am wearing a red shirt.",
        "She is wearing black shoes.",
        "They are wearing school uniforms.",
      ],
    },
    practiceSentences: [
      { english: "I am wearing a blue shirt and black pants.", telugu: "నేను నీలి షర్ట్ మరియు నల్ల ప్యాంట్ వేసుకున్నాను." },
      { english: "This dress is very beautiful.", telugu: "ఈ డ్రెస్ చాలా అందంగా ఉంది." },
      { english: "How much does this shirt cost?", telugu: "ఈ షర్ట్ ఎంత?" },
      { english: "I need new shoes for school.", telugu: "నాకు స్కూల్ కోసం కొత్త షూస్ కావాలి." },
      { english: "She is wearing a comfortable kurta.", telugu: "ఆమె సౌకర్యవంతమైన కుర్తా వేసుకుంది." },
    ],
    speakingTask: {
      instruction: "Describe what you are wearing right now. Use colors and 'I am wearing...' for each item.",
      exampleAnswer: "Right now, I am wearing a white t-shirt and blue jeans. I am wearing brown sandals. My shirt is comfortable and my jeans are new.",
    },
    writingTask: {
      instruction: "Write about your favorite clothes. What do you wear to school? What do you wear at home? What do you like to buy?",
      hint: "I wear a ___ to school. At home, I wear... My favorite dress is...",
    },
    quiz: [
      { question: "'I ___ wearing a white shirt.' Choose the correct form.", options: ["is", "are", "am", "be"], correctIndex: 2, explanation: "With 'I', we always use 'am': 'I am wearing'." },
      { question: "Which is footwear?", options: ["Shirt", "Pants", "Shoes", "Hat"], correctIndex: 2, explanation: "Shoes are footwear — worn on your feet." },
      { question: "'She ___ wearing a dress.' Choose correctly.", options: ["am", "is", "are", "be"], correctIndex: 1, explanation: "With 'she', we use 'is': 'She is wearing'." },
      { question: "Opposite of 'expensive' is:", options: ["Beautiful", "Cheap", "Big", "New"], correctIndex: 1, explanation: "Cheap means it costs less money — the opposite of expensive." },
      { question: "What does 'comfortable' mean?", options: ["Looks good", "Feels nice", "Costs less", "Very old"], correctIndex: 1, explanation: "'Comfortable' means it feels nice and easy to wear." },
    ],
  },

  // ============================================================
  // DAY 8 — Home & Daily Routine
  // ============================================================
  {
    day: 8,
    topic: "Parts of a Home & Daily Routine",
    description:
      "Learn room names, household items, and describe your daily routine.",
    teluguHint: "ఇంటి భాగాలు & దినచర్య",
    vocabulary: [
      { word: "Kitchen", meaning: "Room where food is cooked", pronunciation: "KICH-en", example: "My mother cooks in the kitchen." },
      { word: "Bedroom", meaning: "Room where you sleep", pronunciation: "BED-room", example: "I study in my bedroom." },
      { word: "Bathroom", meaning: "Room for bathing/washing", pronunciation: "BATH-room", example: "I brush my teeth in the bathroom." },
      { word: "Wake up", meaning: "To stop sleeping", pronunciation: "WAYK up", example: "I wake up at 6 AM." },
      { word: "Breakfast", meaning: "The first meal of the day", pronunciation: "BREK-fust", example: "I eat breakfast at 8 AM." },
      { word: "Lunch", meaning: "Midday meal", pronunciation: "LUNCH", example: "We eat lunch at 1 PM." },
      { word: "Dinner", meaning: "Evening meal", pronunciation: "DIN-er", example: "Our family eats dinner together." },
      { word: "Sleep", meaning: "To rest with eyes closed", pronunciation: "SLEEP", example: "I sleep at 10 PM." },
      { word: "Clean", meaning: "To remove dirt", pronunciation: "KLEEN", example: "I clean my room every day." },
      { word: "Routine", meaning: "Regular daily activities", pronunciation: "roo-TEEN", example: "My morning routine starts at 6 AM." },
    ],
    grammar: {
      title: "Simple Present Tense — Daily Habits",
      explanation:
        "Use simple present for things you do regularly or every day. For I/you/we/they: use the base verb. For he/she/it: add -s or -es. 'I wake up at 6.' 'She wakes up at 7.' Negative: 'I don't watch TV.' 'He doesn't eat meat.' Question: 'Do you eat breakfast?' 'Does she cook?'",
      structure: "I/You/We/They + verb | He/She/It + verb+s",
      examples: [
        "I wake up at 6 o'clock every day.",
        "She brushes her teeth in the morning.",
        "We eat dinner at 8 PM.",
      ],
    },
    practiceSentences: [
      { english: "I wake up at 6 AM every morning.", telugu: "నేను ప్రతి ఉదయం 6 గంటలకు లేస్తాను." },
      { english: "She cooks breakfast in the kitchen.", telugu: "ఆమె వంటగదిలో అల్పాహారం వండుతుంది." },
      { english: "I brush my teeth and take a bath.", telugu: "నేను పళ్ళు తోముకుని స్నానం చేస్తాను." },
      { english: "We eat lunch together at 1 PM.", telugu: "మేము మధ్యాహ్నం 1 గంటకు కలిసి భోజనం చేస్తాము." },
      { english: "He goes to sleep at 10 PM.", telugu: "అతను రాత్రి 10 గంటలకు నిద్రపోతాడు." },
    ],
    speakingTask: {
      instruction: "Describe your full daily routine from morning to night. Use time expressions: 'at 6 AM', 'in the morning', 'in the evening'.",
      exampleAnswer: "I wake up at 6 AM. I brush my teeth and take a bath. I eat breakfast at 8 AM. I go to school at 9 AM. I come home at 4 PM. I play with friends. I study at 7 PM. I eat dinner at 9 PM. I go to sleep at 10 PM.",
    },
    writingTask: {
      instruction: "Write your daily routine from waking up to sleeping. Include at least 8 activities with times.",
      hint: "First, I wake up at... Then, I... After that, I...",
    },
    quiz: [
      { question: "'She ___ up at 7 AM.' (wake)", options: ["wake", "wakes", "waking", "waked"], correctIndex: 1, explanation: "For he/she/it in simple present, add -s: 'She wakes up'." },
      { question: "Where do you cook food?", options: ["Bedroom", "Bathroom", "Kitchen", "Garden"], correctIndex: 2, explanation: "We cook food in the kitchen." },
      { question: "'Do you eat breakfast?' — 'Yes, I ___.'", options: ["does", "do", "am", "is"], correctIndex: 1, explanation: "Short answer to 'Do you...?' is 'Yes, I do.'" },
      { question: "Which meal do you eat in the evening?", options: ["Breakfast", "Lunch", "Snack", "Dinner"], correctIndex: 3, explanation: "Dinner is the evening meal." },
      { question: "'He ___ not eat meat.' (does/do)", options: ["do", "does", "is", "are"], correctIndex: 1, explanation: "For he/she/it in negative: 'He does not (doesn't) eat'." },
    ],
  },

  // ============================================================
  // DAY 9 — School & Classroom
  // ============================================================
  {
    day: 9,
    topic: "School, Classroom & Subjects",
    description:
      "Learn school-related vocabulary, classroom objects, and how to talk about your studies.",
    teluguHint: "పాఠశాల, తరగతి గది & సబ్జెక్టులు",
    vocabulary: [
      { word: "Teacher", meaning: "Person who teaches", pronunciation: "TEE-cher", example: "My teacher is very kind." },
      { word: "Student", meaning: "Person who studies", pronunciation: "STOO-dent", example: "I am a good student." },
      { word: "Classroom", meaning: "Room where classes happen", pronunciation: "KLAS-room", example: "Our classroom is on the second floor." },
      { word: "Book", meaning: "Pages with writing to read", pronunciation: "BOOK", example: "I read my English book." },
      { word: "Pen", meaning: "Writing tool with ink", pronunciation: "PEN", example: "I write with a blue pen." },
      { word: "Mathematics", meaning: "Study of numbers", pronunciation: "math-uh-MAT-iks", example: "I like mathematics." },
      { word: "Science", meaning: "Study of nature and world", pronunciation: "SY-ens", example: "Science is interesting." },
      { word: "Homework", meaning: "School work done at home", pronunciation: "HOHM-wurk", example: "I do my homework every evening." },
      { word: "Exam", meaning: "A test of knowledge", pronunciation: "ig-ZAM", example: "I have an exam next week." },
      { word: "Study", meaning: "To learn by reading/practicing", pronunciation: "STUH-dee", example: "I study for two hours daily." },
    ],
    grammar: {
      title: "There is / There are — Talking About What Exists",
      explanation:
        "Use 'There is' (there's) for ONE thing: 'There is a book on the table.' Use 'There are' for MORE THAN ONE: 'There are 30 students in the class.' Negative: 'There is no chalk.' 'There aren't any markers.' Question: 'Is there a pen?' 'Are there any books?'",
      structure: "There is + singular noun | There are + plural noun",
      examples: [
        "There is a map on the wall.",
        "There are 40 desks in the classroom.",
        "Is there a library in your school?",
      ],
    },
    practiceSentences: [
      { english: "There are thirty students in my class.", telugu: "నా తరగతిలో ముప్పై విద్యార్థులు ఉన్నారు." },
      { english: "My favorite subject is English.", telugu: "నాకు ఇష్టమైన సబ్జెక్ట్ ఇంగ్లీష్." },
      { english: "There is a blackboard in our classroom.", telugu: "మా తరగతి గదిలో ఒక నల్లబోర్డు ఉంది." },
      { english: "I do my homework after school.", telugu: "నేను స్కూల్ తర్వాత హోంవర్క్ చేస్తాను." },
      { english: "Our teacher explains very clearly.", telugu: "మా టీచర్ చాలా స్పష్టంగా వివరిస్తారు." },
    ],
    speakingTask: {
      instruction: "Describe your school: How many classrooms? What subjects do you study? Who is your favorite teacher? Use 'There is/are'.",
      exampleAnswer: "My school is near my house. There are 20 classrooms. There is a big playground. I study English, Mathematics, Science, Hindi, and Telugu. My favorite teacher is Mrs. Padma. She teaches English. There are 500 students in my school.",
    },
    writingTask: {
      instruction: "Write a paragraph about your school. Include: name, location, number of classrooms, subjects you study, and your favorite teacher.",
      hint: "My school name is... It is located in... There are... My favorite subject is...",
    },
    quiz: [
      { question: "'There ___ a library in our school.'", options: ["are", "is", "am", "be"], correctIndex: 1, explanation: "Library is singular, so we use 'There is'." },
      { question: "Which is a school subject?", options: ["Kitchen", "Science", "Shirt", "Mango"], correctIndex: 1, explanation: "Science is a school subject." },
      { question: "'There ___ 50 students in the hall.'", options: ["is", "are", "am", "was"], correctIndex: 1, explanation: "50 students is plural, so we use 'There are'." },
      { question: "What do you use to write?", options: ["Book", "Pen", "Desk", "Board"], correctIndex: 1, explanation: "We use a pen to write." },
      { question: "Homework is done:", options: ["At school", "At home", "In the bus", "At the shop"], correctIndex: 1, explanation: "Homework is school work done at home." },
    ],
  },

  // ============================================================
  // DAY 10 — Time & Clock
  // ============================================================
  {
    day: 10,
    topic: "Telling Time & Scheduling",
    description:
      "Learn to read the clock, tell the time, and schedule activities.",
    teluguHint: "సమయం చెప్పడం & షెడ్యూలింగ్",
    vocabulary: [
      { word: "Clock", meaning: "Device that shows time", pronunciation: "KLOK", example: "Look at the clock." },
      { word: "Hour", meaning: "60 minutes", pronunciation: "OW-er", example: "One hour has 60 minutes." },
      { word: "Minute", meaning: "60 seconds", pronunciation: "MIN-it", example: "Wait for five minutes." },
      { word: "Morning", meaning: "Early part of the day", pronunciation: "MOR-ning", example: "I exercise in the morning." },
      { word: "Afternoon", meaning: "After 12 noon", pronunciation: "af-ter-NOON", example: "I rest in the afternoon." },
      { word: "Evening", meaning: "Late part of the day", pronunciation: "EEV-ning", example: "I play in the evening." },
      { word: "Night", meaning: "Dark time of the day", pronunciation: "NITE", example: "I sleep at night." },
      { word: "Early", meaning: "Before the usual time", pronunciation: "UR-lee", example: "I wake up early." },
      { word: "Late", meaning: "After the usual time", pronunciation: "LAYT", example: "Don't be late for school." },
      { word: "O'clock", meaning: "Used to tell exact hour time", pronunciation: "uh-KLOK", example: "It is 9 o'clock." },
    ],
    grammar: {
      title: "Telling Time in English",
      explanation:
        "For exact hours: 'It is 9 o'clock.' For minutes past: 'It is 9:15' or 'It is quarter past nine.' For half: 'It is 9:30' or 'It is half past nine.' For minutes to: 'It is 8:45' or 'It is quarter to nine.' Use 'AM' for morning (12:00 midnight to 11:59 noon) and 'PM' for afternoon/evening/night (12:00 noon to 11:59 midnight).",
      structure: "It is + [time] | at + [time]",
      examples: [
        "It is 7 o'clock in the morning.",
        "The class starts at half past nine.",
        "It is quarter to five in the evening.",
      ],
    },
    practiceSentences: [
      { english: "What time is it? It is 3 o'clock.", telugu: "ఎంత సమయం? 3 గంటలు అయ్యింది." },
      { english: "I go to school at 8:30 AM.", telugu: "నేను ఉదయం 8:30 కి స్కూల్‌కి వెళ్తాను." },
      { english: "The movie starts at half past seven.", telugu: "సినిమా ఏడున్నరకు మొదలవుతుంది." },
      { english: "Don't be late! Come at 9 AM.", telugu: "ఆలస్యం చేయకు! ఉదయం 9 కి రా." },
      { english: "I study from 6 PM to 8 PM.", telugu: "నేను సాయంత్రం 6 నుండి 8 వరకు చదువుతాను." },
    ],
    speakingTask: {
      instruction: "Tell the time for these activities: when you wake up, eat breakfast, go to school, come home, study, sleep. Use 'at ___ o'clock' or 'at ___:___'.",
      exampleAnswer: "I wake up at six o'clock. I eat breakfast at seven thirty. I go to school at eight o'clock. I come home at three thirty. I study at six o'clock in the evening. I sleep at ten o'clock at night.",
    },
    writingTask: {
      instruction: "Make your daily timetable. Write what you do at each hour from 6 AM to 10 PM.",
      hint: "6:00 AM - I wake up. 6:30 AM - I brush my teeth. 7:00 AM - I eat breakfast...",
    },
    quiz: [
      { question: "How do you say 9:00?", options: ["Nine minutes", "Nine o'clock", "Nine hours", "Nine times"], correctIndex: 1, explanation: "We say '9 o'clock' for the exact hour 9:00." },
      { question: "What is 'half past three'?", options: ["3:00", "3:15", "3:30", "3:45"], correctIndex: 2, explanation: "'Half past three' means 3:30 — half of an hour (30 minutes) past 3." },
      { question: "8 AM is in the:", options: ["Afternoon", "Evening", "Morning", "Night"], correctIndex: 2, explanation: "AM times before noon are in the morning." },
      { question: "'Quarter to five' means:", options: ["5:15", "4:45", "5:45", "4:15"], correctIndex: 1, explanation: "'Quarter to five' means 15 minutes before 5:00, which is 4:45." },
      { question: "Opposite of 'early' is:", options: ["Fast", "Slow", "Late", "Quick"], correctIndex: 2, explanation: "The opposite of early is late." },
    ],
  },

  // ============================================================
  // DAY 11 — Common Verbs & Actions
  // ============================================================
  {
    day: 11,
    topic: "Common Verbs & Everyday Actions",
    description:
      "Learn the most important English verbs and how to use them in sentences.",
    teluguHint: "సాధారణ క్రియలు & చర్యలు",
    vocabulary: [
      { word: "Go", meaning: "To move to another place", pronunciation: "GOH", example: "I go to school." },
      { word: "Come", meaning: "To move toward the speaker", pronunciation: "KUM", example: "Come here, please." },
      { word: "Eat", meaning: "To consume food", pronunciation: "EET", example: "I eat lunch at 1 PM." },
      { word: "Drink", meaning: "To consume liquid", pronunciation: "DRINK", example: "I drink water." },
      { word: "Read", meaning: "To look at and understand text", pronunciation: "REED", example: "I read books every day." },
      { word: "Write", meaning: "To put words on paper", pronunciation: "RITE", example: "I write in my notebook." },
      { word: "Speak", meaning: "To use your voice to say words", pronunciation: "SPEEK", example: "I speak English." },
      { word: "Listen", meaning: "To pay attention to sounds", pronunciation: "LIS-en", example: "Listen to the teacher." },
      { word: "Run", meaning: "To move fast on feet", pronunciation: "RUN", example: "I run in the park." },
      { word: "Play", meaning: "To do fun activities", pronunciation: "PLAY", example: "We play cricket." },
    ],
    grammar: {
      title: "Subject-Verb Agreement",
      explanation:
        "In English, the verb must match the subject. For I/you/we/they — use the base verb: 'I go', 'They eat'. For he/she/it — add -s or -es: 'He goes', 'She eats'. Special cases: verbs ending in -o, -s, -sh, -ch, -x add -es: 'go → goes', 'watch → watches'. Verbs ending in consonant+y: change y to i and add -es: 'study → studies'.",
      structure: "I/You/We/They + base verb | He/She/It + verb+s/es",
      examples: [
        "I play cricket. He plays football.",
        "We go to school. She goes to college.",
        "They study English. He studies science.",
      ],
    },
    practiceSentences: [
      { english: "I read English books every day.", telugu: "నేను ప్రతిరోజూ ఇంగ్లీష్ పుస్తకాలు చదువుతాను." },
      { english: "She writes in her diary.", telugu: "ఆమె తన డైరీలో రాస్తుంది." },
      { english: "They play football in the evening.", telugu: "వాళ్ళు సాయంత్రం ఫుట్‌బాల్ ఆడతారు." },
      { english: "He goes to the gym every morning.", telugu: "అతను ప్రతి ఉదయం జిమ్‌కి వెళ్తాడు." },
      { english: "We listen to music after school.", telugu: "మేము స్కూల్ తర్వాత సంగీతం వింటాము." },
    ],
    speakingTask: {
      instruction: "Describe 10 things you do every day using different verbs. Start each with 'I' and add he/she versions too.",
      exampleAnswer: "I wake up early. I brush my teeth. I eat breakfast. My mother cooks food. She cleans the house. I go to school. I study in class. I play with friends. We come home together. I read books at night.",
    },
    writingTask: {
      instruction: "Write 10 sentences using 10 different verbs. Make 5 with 'I/we/they' and 5 with 'he/she'.",
      hint: "I eat rice. She eats bread. We play cricket. He plays football...",
    },
    quiz: [
      { question: "'She ___ to school.' (go)", options: ["go", "goes", "going", "gone"], correctIndex: 1, explanation: "With 'she', add -es to 'go': 'She goes'." },
      { question: "'They ___ cricket.' (play)", options: ["plays", "play", "playing", "played"], correctIndex: 1, explanation: "With 'they', use the base verb: 'They play'." },
      { question: "'He ___ books every day.' (read)", options: ["read", "reads", "reading", "readed"], correctIndex: 1, explanation: "With 'he', add -s: 'He reads'." },
      { question: "Which verb means 'to use your voice'?", options: ["Listen", "Write", "Speak", "Read"], correctIndex: 2, explanation: "'Speak' means to use your voice to say words." },
      { question: "'My sister ___ English.' (study)", options: ["study", "studys", "studies", "studying"], correctIndex: 2, explanation: "For verbs ending in consonant+y with he/she: change y to i, add -es: 'studies'." },
    ],
  },

  // ============================================================
  // DAY 12 — Questions & Asking for Help
  // ============================================================
  {
    day: 12,
    topic: "Asking Questions & Getting Help",
    description:
      "Learn question words (What, Where, When, Why, How, Who) and how to ask for help politely.",
    teluguHint: "ప్రశ్నలు అడగడం & సహాయం కోరడం",
    vocabulary: [
      { word: "What", meaning: "Asking about a thing", pronunciation: "WOT", example: "What is your name?" },
      { word: "Where", meaning: "Asking about a place", pronunciation: "WAIR", example: "Where do you live?" },
      { word: "When", meaning: "Asking about time", pronunciation: "WEN", example: "When is your birthday?" },
      { word: "Why", meaning: "Asking for a reason", pronunciation: "WY", example: "Why are you late?" },
      { word: "How", meaning: "Asking about manner/way", pronunciation: "HOW", example: "How are you?" },
      { word: "Who", meaning: "Asking about a person", pronunciation: "HOO", example: "Who is your teacher?" },
      { word: "Help", meaning: "To assist someone", pronunciation: "HELP", example: "Can you help me?" },
      { word: "Understand", meaning: "To know the meaning", pronunciation: "un-der-STAND", example: "I don't understand this word." },
      { word: "Repeat", meaning: "To say again", pronunciation: "reh-PEET", example: "Please repeat that." },
      { word: "Explain", meaning: "To make something clear", pronunciation: "ex-PLAYN", example: "Can you explain this to me?" },
    ],
    grammar: {
      title: "WH-Questions — How to Ask Questions",
      explanation:
        "English questions often start with WH-words: What (thing), Where (place), When (time), Why (reason), Who (person), How (way/manner). Structure for simple present: WH-word + do/does + subject + verb? 'What do you eat?' 'Where does she live?' For 'be' verbs: WH-word + am/is/are + subject? 'Where are you?' 'What is this?'",
      structure: "WH-word + do/does + subject + base verb? | WH-word + am/is/are + subject?",
      examples: [
        "What is your name? — My name is Ravi.",
        "Where do you live? — I live in Hyderabad.",
        "How does she go to school? — She goes by bus.",
      ],
    },
    practiceSentences: [
      { english: "What is your favorite color?", telugu: "మీ ఇష్టమైన రంగు ఏమిటి?" },
      { english: "Where do you study?", telugu: "మీరు ఎక్కడ చదువుతారు?" },
      { english: "When does the class start?", telugu: "క్లాస్ ఎప్పుడు మొదలవుతుంది?" },
      { english: "Can you help me, please?", telugu: "దయచేసి నాకు సహాయం చేయగలరా?" },
      { english: "I don't understand. Please repeat.", telugu: "నాకు అర్థం కాలేదు. దయచేసి మళ్ళీ చెప్పండి." },
    ],
    speakingTask: {
      instruction: "Make 6 questions, one with each WH-word: What, Where, When, Why, Who, How. Then practice asking for help: 'Can you help me with ___?'",
      exampleAnswer: "What is your hobby? Where is the library? When is the exam? Why do you like English? Who is your best friend? How do you go to school? Can you help me with my homework, please?",
    },
    writingTask: {
      instruction: "Write a conversation between two friends where one asks 5 questions and the other answers. Use different WH-words.",
      hint: "A: What is your name? B: My name is... A: Where do you live? B: I live in...",
    },
    quiz: [
      { question: "'___ is your birthday?' (asking about time)", options: ["What", "Where", "When", "Who"], correctIndex: 2, explanation: "'When' is used to ask about time." },
      { question: "'___ do you live?' (asking about place)", options: ["What", "Where", "When", "Why"], correctIndex: 1, explanation: "'Where' is used to ask about places." },
      { question: "'___ is she crying?' (asking for reason)", options: ["What", "How", "When", "Why"], correctIndex: 3, explanation: "'Why' is used to ask for a reason." },
      { question: "Polite way to ask for help:", options: ["Help me now!", "Can you help me, please?", "I want help!", "Give help!"], correctIndex: 1, explanation: "'Can you help me, please?' is the polite way to ask for help." },
      { question: "'___ does he go to school?' — 'By bus.'", options: ["What", "Where", "How", "When"], correctIndex: 2, explanation: "'How' asks about the way or manner of doing something." },
    ],
  },

  // ============================================================
  // DAY 13 — Directions & Places in a City
  // ============================================================
  {
    day: 13,
    topic: "Directions & Places in a City",
    description:
      "Learn how to ask for and give directions, and names of common places.",
    teluguHint: "దిశలు & నగరంలోని ప్రదేశాలు",
    vocabulary: [
      { word: "Left", meaning: "The opposite of right direction", pronunciation: "LEFT", example: "Turn left at the signal." },
      { word: "Right", meaning: "The opposite of left direction", pronunciation: "RITE", example: "Turn right after the bank." },
      { word: "Straight", meaning: "In a direct line ahead", pronunciation: "STRAYT", example: "Go straight for 100 meters." },
      { word: "Near", meaning: "Close to something", pronunciation: "NEER", example: "The shop is near the school." },
      { word: "Far", meaning: "A long distance away", pronunciation: "FAR", example: "The airport is far from here." },
      { word: "Hospital", meaning: "Place where sick people are treated", pronunciation: "HOS-pih-tul", example: "The hospital is on Main Road." },
      { word: "Market", meaning: "Place to buy things", pronunciation: "MAR-kit", example: "We go to the market on Sundays." },
      { word: "Bank", meaning: "Place to keep and manage money", pronunciation: "BANK", example: "The bank is next to the post office." },
      { word: "Station", meaning: "Place where buses/trains stop", pronunciation: "STAY-shun", example: "The bus station is nearby." },
      { word: "Opposite", meaning: "Directly across from", pronunciation: "OP-uh-zit", example: "The pharmacy is opposite the school." },
    ],
    grammar: {
      title: "Imperative Sentences — Giving Directions",
      explanation:
        "Imperative sentences give commands or instructions. They start with a verb and don't need a subject (the subject 'you' is understood). Used for directions: 'Turn left.' 'Go straight.' 'Walk for 5 minutes.' Use 'Please' to be polite: 'Please turn right.' Negative: 'Don't turn right.'",
      structure: "Verb + direction/detail | Please + verb + direction",
      examples: [
        "Go straight and turn left.",
        "Walk for five minutes. The hospital is on your right.",
        "Don't take the first road. Take the second road.",
      ],
    },
    practiceSentences: [
      { english: "Excuse me, where is the hospital?", telugu: "క్షమించండి, ఆసుపత్రి ఎక్కడ ఉంది?" },
      { english: "Go straight and turn left at the signal.", telugu: "నేరుగా వెళ్ళి సిగ్నల్ దగ్గర ఎడమ వైపు తిరగండి." },
      { english: "The bank is near the bus station.", telugu: "బ్యాంక్ బస్ స్టేషన్ దగ్గర ఉంది." },
      { english: "The market is not far from here.", telugu: "మార్కెట్ ఇక్కడ నుండి దూరంగా లేదు." },
      { english: "The pharmacy is opposite the school.", telugu: "ఫార్మసీ స్కూల్ ఎదురుగా ఉంది." },
    ],
    speakingTask: {
      instruction: "Imagine someone asks you: 'Where is the nearest hospital?' Give them directions from your house using left, right, straight, near, far.",
      exampleAnswer: "Go out of my house. Turn right. Walk straight for about 200 meters. At the signal, turn left. The hospital is on your right side. It is near the big market. It takes about 5 minutes to walk there.",
    },
    writingTask: {
      instruction: "Draw a simple map of your area and write directions from your house to 3 places: school, market, and a friend's house.",
      hint: "To go to my school, first go... Turn... Walk for... The school is on your...",
    },
    quiz: [
      { question: "'___ me, where is the station?'", options: ["Sorry", "Excuse", "Help", "Hello"], correctIndex: 1, explanation: "'Excuse me' is used to politely get someone's attention." },
      { question: "Opposite of 'left' is:", options: ["Straight", "Right", "Near", "Far"], correctIndex: 1, explanation: "Right is the opposite direction of left." },
      { question: "'The bank is ___ the school.' (directly across)", options: ["near", "far", "opposite", "behind"], correctIndex: 2, explanation: "'Opposite' means directly across from something." },
      { question: "Which is an imperative sentence?", options: ["I go straight.", "She turns left.", "Turn left at the signal.", "He is going straight."], correctIndex: 2, explanation: "Imperative sentences start with a verb and give a command: 'Turn left'." },
      { question: "Where do you catch a bus?", options: ["Hospital", "Market", "Bank", "Bus station"], correctIndex: 3, explanation: "You catch a bus at a bus station." },
    ],
  },

  // ============================================================
  // DAY 14 — Shopping & Money
  // ============================================================
  {
    day: 14,
    topic: "Shopping, Money & Bargaining",
    description:
      "Learn to buy things, ask prices, and have shopping conversations.",
    teluguHint: "షాపింగ్, డబ్బు & బేరం",
    vocabulary: [
      { word: "Buy", meaning: "To get something by paying money", pronunciation: "BY", example: "I want to buy a new phone." },
      { word: "Sell", meaning: "To give something for money", pronunciation: "SEL", example: "He sells vegetables." },
      { word: "Price", meaning: "The amount of money something costs", pronunciation: "PRICE", example: "What is the price of this?" },
      { word: "Cost", meaning: "The amount you need to pay", pronunciation: "KOST", example: "How much does this cost?" },
      { word: "Money", meaning: "Currency used to buy things", pronunciation: "MUH-nee", example: "I don't have enough money." },
      { word: "Change", meaning: "Money returned after paying", pronunciation: "CHAYNJ", example: "Here is your change." },
      { word: "Receipt", meaning: "Paper proof of purchase", pronunciation: "reh-SEET", example: "Can I get a receipt, please?" },
      { word: "Discount", meaning: "Reduction in price", pronunciation: "DIS-kownt", example: "Is there any discount?" },
      { word: "Customer", meaning: "Person who buys things", pronunciation: "KUS-tuh-mer", example: "The customer is always right." },
      { word: "Pay", meaning: "To give money for something", pronunciation: "PAY", example: "I will pay by card." },
    ],
    grammar: {
      title: "How much / How many — Asking About Quantity and Price",
      explanation:
        "'How much' is used for uncountable things (water, money, rice) and prices: 'How much is this?' 'How much water?' 'How many' is for countable things: 'How many books?' 'How many students?' Remember: 'How much does this cost?' = asking the price. 'How many apples do you want?' = asking the number.",
      structure: "How much + uncountable noun / is this? | How many + countable noun + do/does?",
      examples: [
        "How much is this shirt? — It is 500 rupees.",
        "How much milk do you want? — One liter, please.",
        "How many books did you buy? — I bought three books.",
      ],
    },
    practiceSentences: [
      { english: "How much does this shirt cost?", telugu: "ఈ షర్ట్ ఎంత?" },
      { english: "I want to buy two kilos of rice.", telugu: "నేను రెండు కిలోల బియ్యం కొనాలనుకుంటున్నాను." },
      { english: "Can you give me a discount?", telugu: "మీరు నాకు డిస్కౌంట్ ఇవ్వగలరా?" },
      { english: "Here is the money. Keep the change.", telugu: "ఇదిగో డబ్బు. చిల్లర ఉంచుకోండి." },
      { english: "This is too expensive. Do you have something cheaper?", telugu: "ఇది చాలా ఖరీదైనది. మీ దగ్గర తక్కువ ధరలో ఏమైనా ఉందా?" },
    ],
    speakingTask: {
      instruction: "Role-play a shopping conversation. You are buying a shirt. Ask the price, ask for discount, and pay. Practice both customer and shopkeeper roles.",
      exampleAnswer: "Customer: Hello! I want to buy a shirt. How much is this blue shirt? Shopkeeper: It is 800 rupees. Customer: That is expensive. Can you give me a discount? Shopkeeper: Okay, I can give it for 650 rupees. Customer: Okay, here is the money. Thank you! Shopkeeper: Thank you! Here is your receipt.",
    },
    writingTask: {
      instruction: "Write a shopping conversation between a customer and shopkeeper. Include asking price, bargaining, and paying.",
      hint: "Customer: Hello, I want to buy... Shopkeeper: This costs... Customer: Can you give discount?...",
    },
    quiz: [
      { question: "'___ does this pen cost?'", options: ["How many", "How much", "How old", "How far"], correctIndex: 1, explanation: "'How much' is used to ask about price." },
      { question: "'How ___ apples do you want?'", options: ["much", "many", "more", "most"], correctIndex: 1, explanation: "'How many' is used with countable things like apples." },
      { question: "A person who buys things is a:", options: ["Seller", "Customer", "Manager", "Teacher"], correctIndex: 1, explanation: "A customer is a person who buys things from a shop." },
      { question: "What is a receipt?", options: ["Discount paper", "Paper proof of purchase", "Money back", "Price list"], correctIndex: 1, explanation: "A receipt is a paper that proves you bought something." },
      { question: "Opposite of 'buy' is:", options: ["Pay", "Cost", "Sell", "Give"], correctIndex: 2, explanation: "Buy means to get something for money. Sell means to give something for money." },
    ],
  },

  // ============================================================
  // DAY 15 — Making Friends & Small Talk
  // ============================================================
  {
    day: 15,
    topic: "Making Friends & Conversation Starters",
    description:
      "Learn how to introduce yourself, make friends, and have casual conversations.",
    teluguHint: "స్నేహితులు చేసుకోవడం & సంభాషణలు",
    vocabulary: [
      { word: "Friend", meaning: "Someone you like and trust", pronunciation: "FREND", example: "She is my best friend." },
      { word: "Meet", meaning: "To see someone for the first time or again", pronunciation: "MEET", example: "Nice to meet you!" },
      { word: "Hobby", meaning: "Something you enjoy doing", pronunciation: "HOB-ee", example: "My hobby is reading." },
      { word: "Favorite", meaning: "Liked the most", pronunciation: "FAY-vur-it", example: "What is your favorite movie?" },
      { word: "Enjoy", meaning: "To take pleasure in", pronunciation: "en-JOY", example: "I enjoy playing cricket." },
      { word: "Interesting", meaning: "Holding attention, exciting", pronunciation: "IN-trest-ing", example: "Your story is very interesting." },
      { word: "Free time", meaning: "Time when you are not busy", pronunciation: "FREE time", example: "What do you do in your free time?" },
      { word: "Together", meaning: "With each other", pronunciation: "tuh-GETH-er", example: "We study together." },
      { word: "Agree", meaning: "To have the same opinion", pronunciation: "uh-GREE", example: "I agree with you." },
      { word: "Conversation", meaning: "Talk between people", pronunciation: "kon-ver-SAY-shun", example: "We had a nice conversation." },
    ],
    grammar: {
      title: "Can / Can't — Talking About Abilities",
      explanation:
        "Use 'can' to say you are able to do something: 'I can swim.' 'She can cook.' Use 'can't' (cannot) for things you cannot do: 'I can't drive.' 'He can't sing.' For questions: 'Can you play guitar?' Answer: 'Yes, I can.' or 'No, I can't.' Note: 'Can' is the same for all subjects — no -s added.",
      structure: "Subject + can/can't + base verb | Can + subject + base verb?",
      examples: [
        "I can speak English and Telugu.",
        "She can dance very well.",
        "Can you help me? — Yes, I can.",
      ],
    },
    practiceSentences: [
      { english: "Hi! I am Sai. Nice to meet you!", telugu: "హాయ్! నేను సాయి. మిమ్మల్ని కలవడం ఆనందంగా ఉంది!" },
      { english: "What do you do in your free time?", telugu: "మీ ఖాళీ సమయంలో ఏం చేస్తారు?" },
      { english: "I can play cricket and chess.", telugu: "నేను క్రికెట్ మరియు చెస్ ఆడగలను." },
      { english: "My hobby is listening to music.", telugu: "నా అభిరుచి సంగీతం వినడం." },
      { english: "Let's be friends! We can study together.", telugu: "మనం స్నేహితులం అవుదాం! మనం కలిసి చదువుకుందాం." },
    ],
    speakingTask: {
      instruction: "Imagine you meet a new person. Introduce yourself, ask their name, ask about hobbies, tell what you can do, and suggest doing something together.",
      exampleAnswer: "Hello! My name is Kavya. Nice to meet you! What is your name? I am a student. My hobbies are reading books and drawing. I can also play badminton. What about you? Can you play any sport? Let's play together sometime!",
    },
    writingTask: {
      instruction: "Write a conversation between you and a new friend. Include introductions, hobbies, abilities (can/can't), and plans.",
      hint: "You: Hi! I am... Nice to meet you! Friend: Hello! I am... You: What are your hobbies?...",
    },
    quiz: [
      { question: "'She ___ swim very well.'", options: ["cans", "can", "is can", "does can"], correctIndex: 1, explanation: "'Can' doesn't change form: 'She can swim', not 'she cans'." },
      { question: "How to politely meet someone new?", options: ["What do you want?", "Nice to meet you!", "Go away!", "Who are you?"], correctIndex: 1, explanation: "'Nice to meet you!' is the polite way to greet someone new." },
      { question: "'___ you play guitar?' — 'Yes, I ___.'", options: ["Do/do", "Can/can", "Are/am", "Is/is"], correctIndex: 1, explanation: "'Can you...?' — 'Yes, I can.' is the correct pattern for abilities." },
      { question: "A hobby is something you:", options: ["Must do", "Enjoy doing", "Don't like", "Are afraid of"], correctIndex: 1, explanation: "A hobby is an activity you enjoy doing in your free time." },
      { question: "'I ___ drive a car. I am too young.'", options: ["can", "can't", "don't can", "am can't"], correctIndex: 1, explanation: "'Can't' (cannot) means you are not able to do something." },
    ],
  },

  // ============================================================
  // DAY 16 — Phone Calls & Messages
  // ============================================================
  {
    day: 16,
    topic: "Phone Calls, Messages & Digital Communication",
    description:
      "Learn how to talk on the phone, send messages, and communicate digitally.",
    teluguHint: "ఫోన్ కాల్స్ & సందేశాలు",
    vocabulary: [
      { word: "Call", meaning: "To phone someone", pronunciation: "KAWL", example: "I will call you tonight." },
      { word: "Message", meaning: "Written communication", pronunciation: "MES-ij", example: "I sent you a message." },
      { word: "Busy", meaning: "Not free, occupied", pronunciation: "BIZ-ee", example: "I am busy right now." },
      { word: "Available", meaning: "Free, not busy", pronunciation: "uh-VAYL-uh-bul", example: "Are you available tomorrow?" },
      { word: "Later", meaning: "At a future time", pronunciation: "LAY-ter", example: "I will call you later." },
      { word: "Hold", meaning: "To wait on the phone", pronunciation: "HOHLD", example: "Please hold for a moment." },
      { word: "Contact", meaning: "To communicate with someone", pronunciation: "KON-takt", example: "How can I contact you?" },
      { word: "Reply", meaning: "To respond to a message", pronunciation: "reh-PLY", example: "Please reply to my message." },
      { word: "Dial", meaning: "To enter a phone number", pronunciation: "DY-ul", example: "Dial 100 for police." },
      { word: "Voicemail", meaning: "Recorded phone message", pronunciation: "VOYS-mayl", example: "Please leave a voicemail." },
    ],
    grammar: {
      title: "Will / Won't — Future Plans and Promises",
      explanation:
        "Use 'will' to talk about future actions, promises, or decisions made now. 'I will call you tomorrow.' 'She will come at 5.' Negative: 'won't' (will not). 'I won't be late.' Question: 'Will you come?' Short form: 'I'll', 'She'll', 'We'll'. 'I'll call you' = 'I will call you.'",
      structure: "Subject + will + base verb | Subject + won't + base verb",
      examples: [
        "I will send you a message tonight.",
        "She won't answer calls during class.",
        "Will you come to the party? — Yes, I will.",
      ],
    },
    practiceSentences: [
      { english: "Hello? May I speak to Mr. Kumar?", telugu: "హలో? నేను కుమార్ గారితో మాట్లాడవచ్చా?" },
      { english: "I am busy now. I will call you later.", telugu: "నేను ఇప్పుడు బిజీగా ఉన్నాను. తర్వాత కాల్ చేస్తాను." },
      { english: "Please hold for a moment.", telugu: "దయచేసి ఒక్క క్షణం ఆగండి." },
      { english: "I'll send you a WhatsApp message.", telugu: "నేను మీకు వాట్సాప్ మెసేజ్ పంపిస్తాను." },
      { english: "She won't be available until 5 PM.", telugu: "ఆమె సాయంత్రం 5 వరకు అందుబాటులో ఉండదు." },
    ],
    speakingTask: {
      instruction: "Role-play a phone call. Call a friend to invite them to your birthday party. Discuss date, time, and place.",
      exampleAnswer: "Hello? Hi Ramya! This is Kavya. How are you? I'm calling to invite you to my birthday party. It will be on Saturday at 4 PM at my house. Will you come? Great! I'll send you my address on WhatsApp. See you on Saturday! Bye!",
    },
    writingTask: {
      instruction: "Write a phone conversation and then write a WhatsApp message invitation for a study group meeting.",
      hint: "Phone: Hello? May I speak to...? Message: Hi everyone! We will have a study group on...",
    },
    quiz: [
      { question: "'I ___ call you tomorrow.' (future)", options: ["am", "will", "do", "can"], correctIndex: 1, explanation: "'Will' is used for future actions: 'I will call'." },
      { question: "Short form of 'I will' is:", options: ["I'm", "I'll", "I'd", "I've"], correctIndex: 1, explanation: "'I'll' is the short form of 'I will'." },
      { question: "'She ___ answer the phone. She is busy.'", options: ["will", "won't", "don't", "doesn't"], correctIndex: 1, explanation: "'Won't' (will not) is used for negative future: 'She won't answer'." },
      { question: "What do you say when you pick up a phone?", options: ["What?", "Hello?", "Yes?", "Speak!"], correctIndex: 1, explanation: "'Hello?' is the standard way to answer a phone call." },
      { question: "'Please ___ for a moment.' (wait on phone)", options: ["stop", "hold", "wait", "sit"], correctIndex: 1, explanation: "'Hold' means to wait on the phone: 'Please hold for a moment'." },
    ],
  },

  // ============================================================
  // DAY 17 — Health & At the Doctor
  // ============================================================
  {
    day: 17,
    topic: "Health, Body Parts & Visiting a Doctor",
    description:
      "Learn body parts, health problems, and how to talk to a doctor.",
    teluguHint: "ఆరోగ్యం, శరీర భాగాలు & డాక్టర్ సందర్శన",
    vocabulary: [
      { word: "Head", meaning: "Top part of the body", pronunciation: "HED", example: "I have a headache." },
      { word: "Stomach", meaning: "Part of body where food goes", pronunciation: "STUH-muk", example: "My stomach hurts." },
      { word: "Fever", meaning: "High body temperature when sick", pronunciation: "FEE-ver", example: "I have a fever." },
      { word: "Cough", meaning: "Forcing air from lungs with sound", pronunciation: "KOFF", example: "She has a bad cough." },
      { word: "Cold", meaning: "Common illness with sneezing", pronunciation: "KOHLD", example: "I caught a cold." },
      { word: "Medicine", meaning: "Substance used to treat illness", pronunciation: "MED-ih-sin", example: "Take this medicine after food." },
      { word: "Pain", meaning: "Feeling of hurt", pronunciation: "PAYN", example: "I have pain in my leg." },
      { word: "Doctor", meaning: "Person who treats sick people", pronunciation: "DOK-ter", example: "I need to see a doctor." },
      { word: "Healthy", meaning: "In good physical condition", pronunciation: "HEL-thee", example: "Eating fruits keeps you healthy." },
      { word: "Rest", meaning: "To stop and relax", pronunciation: "REST", example: "You should rest for two days." },
    ],
    grammar: {
      title: "Should / Shouldn't — Giving Advice",
      explanation:
        "Use 'should' to give advice or suggestions: 'You should drink water.' 'He should see a doctor.' Use 'shouldn't' (should not) for things to avoid: 'You shouldn't eat junk food.' 'She shouldn't go out in the rain.' Question: 'Should I take medicine?' — 'Yes, you should.'",
      structure: "Subject + should/shouldn't + base verb",
      examples: [
        "You should take rest when you are sick.",
        "He shouldn't eat cold food when he has a cough.",
        "Should I go to school today? — No, you should rest.",
      ],
    },
    practiceSentences: [
      { english: "Doctor, I have a headache and fever.", telugu: "డాక్టర్, నాకు తలనొప్పి మరియు జ్వరం ఉంది." },
      { english: "You should drink warm water.", telugu: "మీరు వెచ్చని నీరు తాగాలి." },
      { english: "She shouldn't go to school when she is sick.", telugu: "ఆమె అనారోగ్యంగా ఉన్నప్పుడు స్కూల్‌కి వెళ్ళకూడదు." },
      { english: "Take this medicine three times a day.", telugu: "ఈ మందు రోజుకు మూడు సార్లు వేసుకోండి." },
      { english: "I am feeling better now. Thank you, doctor.", telugu: "నేను ఇప్పుడు బాగా ఫీల్ అవుతున్నాను. ధన్యవాదాలు, డాక్టర్." },
    ],
    speakingTask: {
      instruction: "Role-play visiting a doctor. Describe your symptoms (headache, fever, cold). The doctor gives advice using 'should' and 'shouldn't'.",
      exampleAnswer: "Patient: Good morning, doctor. I am not feeling well. I have a headache, fever, and cold since yesterday. Doctor: Don't worry. You should take rest for two days. You should drink warm water and eat light food. You shouldn't eat ice cream or cold drinks. Take this medicine twice a day. You will feel better soon.",
    },
    writingTask: {
      instruction: "Write a conversation between you and a doctor. Describe 3 health problems and get advice for each.",
      hint: "Patient: Doctor, I have... Doctor: You should... You shouldn't...",
    },
    quiz: [
      { question: "'You ___ take rest when sick.'", options: ["should", "shouldn't", "mustn't", "don't"], correctIndex: 0, explanation: "'Should' is used for advice: 'You should take rest'." },
      { question: "What does 'fever' mean?", options: ["Stomach pain", "High body temperature", "Headache", "Leg pain"], correctIndex: 1, explanation: "Fever means having a higher than normal body temperature." },
      { question: "'She ___ eat ice cream with a cold.'", options: ["should", "shouldn't", "will", "can"], correctIndex: 1, explanation: "'Shouldn't' gives advice to avoid something." },
      { question: "Medicine is used to:", options: ["Cook food", "Clean house", "Treat illness", "Read books"], correctIndex: 2, explanation: "Medicine is a substance used to treat illness and make you better." },
      { question: "'___ I go to school today?' (asking advice)", options: ["Will", "Can", "Should", "Do"], correctIndex: 2, explanation: "'Should I...?' is used to ask for advice." },
    ],
  },

  // ============================================================
  // DAY 18 — Weather & Seasons
  // ============================================================
  {
    day: 18,
    topic: "Weather, Seasons & Climate",
    description:
      "Learn weather vocabulary, describe seasons, and talk about climate.",
    teluguHint: "వాతావరణం, కాలాలు & వాతావరణ పరిస్థితులు",
    vocabulary: [
      { word: "Sunny", meaning: "When the sun is shining", pronunciation: "SUN-ee", example: "It is a sunny day." },
      { word: "Rainy", meaning: "When it is raining", pronunciation: "RAYN-ee", example: "It is very rainy today." },
      { word: "Hot", meaning: "Very warm temperature", pronunciation: "HOT", example: "It is very hot in summer." },
      { word: "Cold", meaning: "Very cool temperature", pronunciation: "KOHLD", example: "Winters are cold in Delhi." },
      { word: "Cloudy", meaning: "Sky covered with clouds", pronunciation: "KLOW-dee", example: "It is cloudy. It might rain." },
      { word: "Wind", meaning: "Moving air", pronunciation: "WIND", example: "There is strong wind today." },
      { word: "Summer", meaning: "Hottest season", pronunciation: "SUM-er", example: "I like mangoes in summer." },
      { word: "Winter", meaning: "Coldest season", pronunciation: "WIN-ter", example: "I wear sweaters in winter." },
      { word: "Rain", meaning: "Water falling from clouds", pronunciation: "RAYN", example: "I love the smell of rain." },
      { word: "Umbrella", meaning: "Device to protect from rain", pronunciation: "um-BREL-uh", example: "Don't forget your umbrella." },
    ],
    grammar: {
      title: "It is + Weather — Describing Weather",
      explanation:
        "In English, we use 'It' as the subject when talking about weather: 'It is hot.' 'It is raining.' 'It was cold yesterday.' Use present continuous for current weather: 'It is raining now.' Use simple present for general weather: 'It rains a lot in July.' Use 'will' for predictions: 'It will be sunny tomorrow.'",
      structure: "It is/was/will be + weather adjective | It is + verb-ing (current weather)",
      examples: [
        "It is very hot today.",
        "It was rainy yesterday.",
        "It will be cloudy tomorrow.",
      ],
    },
    practiceSentences: [
      { english: "It is very hot today. The temperature is 40 degrees.", telugu: "ఈ రోజు చాలా వేడిగా ఉంది. ఉష్ణోగ్రత 40 డిగ్రీలు." },
      { english: "It is raining outside. Take an umbrella.", telugu: "బయట వర్షం పడుతోంది. గొడుగు తీసుకెళ్ళు." },
      { english: "I love winter because I can wear sweaters.", telugu: "నాకు చలికాలం ఇష్టం ఎందుకంటే స్వెటర్లు వేసుకోవచ్చు." },
      { english: "Summer in India is very hot.", telugu: "భారతదేశంలో వేసవి చాలా వేడిగా ఉంటుంది." },
      { english: "It will be cloudy tomorrow. It might rain.", telugu: "రేపు మేఘావృతంగా ఉంటుంది. వర్షం రావచ్చు." },
    ],
    speakingTask: {
      instruction: "Describe today's weather. Then talk about your favorite season — what is the weather like, what do you do, what do you wear?",
      exampleAnswer: "Today it is sunny and hot. The sky is clear and blue. My favorite season is the rainy season. It rains a lot and the weather becomes cool. I love the smell of rain. I wear a raincoat and carry an umbrella. I drink hot tea and eat pakoras during rain. It is very beautiful when it rains.",
    },
    writingTask: {
      instruction: "Write about all four seasons in India. Describe the weather, what people do, and what you like about each season.",
      hint: "Summer is very hot. People eat... Winter is cold. People wear... Rainy season...",
    },
    quiz: [
      { question: "'___ is very hot today.'", options: ["He", "She", "It", "They"], correctIndex: 2, explanation: "We use 'It' as the subject when talking about weather." },
      { question: "Which season is the hottest?", options: ["Winter", "Summer", "Rainy", "Spring"], correctIndex: 1, explanation: "Summer is the hottest season of the year." },
      { question: "'It is ___ outside.' (water from clouds)", options: ["sunny", "raining", "winding", "clouding"], correctIndex: 1, explanation: "'Raining' describes water falling from clouds." },
      { question: "You carry an umbrella when it is:", options: ["Sunny", "Hot", "Rainy", "Cold"], correctIndex: 2, explanation: "We use umbrellas to protect ourselves from rain." },
      { question: "'It ___ cold yesterday.'", options: ["is", "was", "will", "are"], correctIndex: 1, explanation: "For past weather, use 'was': 'It was cold yesterday'." },
    ],
  },

  // ============================================================
  // DAY 19 — Feelings & Emotions
  // ============================================================
  {
    day: 19,
    topic: "Feelings, Emotions & Expressing Yourself",
    description:
      "Learn words for feelings and emotions, and how to express how you feel.",
    teluguHint: "భావాలు & భావోద్వేగాలు",
    vocabulary: [
      { word: "Happy", meaning: "Feeling joy or pleasure", pronunciation: "HAP-ee", example: "I am happy today!" },
      { word: "Sad", meaning: "Feeling unhappy", pronunciation: "SAD", example: "She is sad because her friend left." },
      { word: "Angry", meaning: "Feeling very upset", pronunciation: "ANG-gree", example: "He is angry at his brother." },
      { word: "Scared", meaning: "Feeling afraid", pronunciation: "SKAIRD", example: "I am scared of the dark." },
      { word: "Excited", meaning: "Very happy and eager", pronunciation: "ek-SY-ted", example: "I am excited about the trip!" },
      { word: "Tired", meaning: "Needing rest or sleep", pronunciation: "TY-erd", example: "I am tired after running." },
      { word: "Nervous", meaning: "Feeling worried or uneasy", pronunciation: "NUR-vus", example: "I am nervous about the exam." },
      { word: "Proud", meaning: "Feeling good about achievement", pronunciation: "PROWD", example: "My parents are proud of me." },
      { word: "Surprised", meaning: "Feeling shock or wonder", pronunciation: "sur-PRIZED", example: "I was surprised by the gift!" },
      { word: "Grateful", meaning: "Feeling thankful", pronunciation: "GRAYT-ful", example: "I am grateful for my family." },
    ],
    grammar: {
      title: "Because — Giving Reasons for Feelings",
      explanation:
        "Use 'because' to explain WHY you feel something. Structure: 'I am [feeling] because [reason].' 'She is happy because she passed the exam.' 'He is sad because his dog is sick.' You can also start with 'because': 'Because it was raining, I stayed home.' (Note: comma needed when 'because' starts the sentence.)",
      structure: "Subject + am/is/are + feeling + because + reason",
      examples: [
        "I am happy because I got good marks.",
        "She is nervous because she has an interview.",
        "They are excited because tomorrow is a holiday.",
      ],
    },
    practiceSentences: [
      { english: "I am happy because today is my birthday!", telugu: "నేను సంతోషంగా ఉన్నాను ఎందుకంటే ఈ రోజు నా పుట్టినరోజు!" },
      { english: "She is sad because she lost her phone.", telugu: "ఆమె బాధగా ఉంది ఎందుకంటే ఆమె ఫోన్ పోగొట్టుకుంది." },
      { english: "I am nervous because I have an exam tomorrow.", telugu: "నేను ఆందోళనగా ఉన్నాను ఎందుకంటే రేపు పరీక్ష ఉంది." },
      { english: "We are proud of you!", telugu: "మేము నీ గురించి గర్వపడుతున్నాము!" },
      { english: "He is tired because he played cricket all day.", telugu: "అతను అలసిపోయాడు ఎందుకంటే రోజంతా క్రికెట్ ఆడాడు." },
    ],
    speakingTask: {
      instruction: "Describe 5 different situations and how they make you feel. Use 'I am ___ because ___' for each one.",
      exampleAnswer: "I am happy because I am learning English. I am excited because my friend is visiting tomorrow. I am nervous because I have a presentation next week. I am grateful because my family supports me. I am proud because I completed 19 days of this course!",
    },
    writingTask: {
      instruction: "Write about a day when you felt many emotions. Describe what happened and how you felt at each moment.",
      hint: "In the morning, I was excited because... Then I felt nervous because... At the end, I was happy because...",
    },
    quiz: [
      { question: "'I am ___ because I passed the exam!'", options: ["sad", "angry", "happy", "scared"], correctIndex: 2, explanation: "Passing an exam makes you happy (joyful)." },
      { question: "'She is sad ___ her cat is sick.'", options: ["so", "but", "because", "and"], correctIndex: 2, explanation: "'Because' gives the reason: 'She is sad because...'." },
      { question: "Feeling worried about something is:", options: ["Excited", "Nervous", "Proud", "Grateful"], correctIndex: 1, explanation: "'Nervous' means feeling worried or uneasy about something." },
      { question: "'My parents are ___ of my success.'", options: ["scared", "angry", "tired", "proud"], correctIndex: 3, explanation: "'Proud' means feeling good about someone's achievement." },
      { question: "'I am ___ for your help.'", options: ["angry", "nervous", "grateful", "scared"], correctIndex: 2, explanation: "'Grateful' means feeling thankful for something." },
    ],
  },

  // ============================================================
  // DAY 20 — Past Tense — Talking About Yesterday
  // ============================================================
  {
    day: 20,
    topic: "Simple Past Tense — What Happened Yesterday",
    description:
      "Learn to talk about things that already happened using past tense verbs.",
    teluguHint: "సాధారణ భూతకాలం — నిన్న ఏం జరిగింది",
    vocabulary: [
      { word: "Went", meaning: "Past of 'go'", pronunciation: "WENT", example: "I went to school yesterday." },
      { word: "Ate", meaning: "Past of 'eat'", pronunciation: "AYT", example: "We ate biryani for lunch." },
      { word: "Saw", meaning: "Past of 'see'", pronunciation: "SAW", example: "I saw a beautiful bird." },
      { word: "Came", meaning: "Past of 'come'", pronunciation: "KAYM", example: "She came to my house." },
      { word: "Said", meaning: "Past of 'say'", pronunciation: "SED", example: "He said hello to me." },
      { word: "Made", meaning: "Past of 'make'", pronunciation: "MAYD", example: "She made a cake." },
      { word: "Played", meaning: "Past of 'play'", pronunciation: "PLAYD", example: "We played football." },
      { word: "Studied", meaning: "Past of 'study'", pronunciation: "STUH-deed", example: "I studied for the exam." },
      { word: "Watched", meaning: "Past of 'watch'", pronunciation: "WOTCHD", example: "We watched a movie." },
      { word: "Talked", meaning: "Past of 'talk'", pronunciation: "TAWKT", example: "I talked to my friend." },
    ],
    grammar: {
      title: "Simple Past Tense",
      explanation:
        "Use past tense for things that already happened. Regular verbs: add -ed (played, watched, studied). Irregular verbs have special forms (go→went, eat→ate, see→saw, come→came, say→said, make→made). Negative: 'didn't + base verb' — 'I didn't go.' Question: 'Did + subject + base verb?' — 'Did you eat?' Time words: yesterday, last week, last month, ago.",
      structure: "Subject + verb(past) | Subject + didn't + base verb | Did + subject + base verb?",
      examples: [
        "I went to the market yesterday.",
        "She didn't come to school last Monday.",
        "Did you watch the cricket match? — Yes, I did.",
      ],
    },
    practiceSentences: [
      { english: "I went to the temple yesterday.", telugu: "నేను నిన్న గుడికి వెళ్ళాను." },
      { english: "She cooked biryani last Sunday.", telugu: "ఆమె గత ఆదివారం బిర్యానీ వండింది." },
      { english: "We didn't go to school yesterday.", telugu: "మేము నిన్న స్కూల్‌కి వెళ్ళలేదు." },
      { english: "Did you finish your homework?", telugu: "నీ హోంవర్క్ పూర్తి చేసావా?" },
      { english: "I saw a beautiful sunset last evening.", telugu: "నేను నిన్న సాయంత్రం అందమైన సూర్యాస్తమయం చూసాను." },
    ],
    speakingTask: {
      instruction: "Tell a story about your day yesterday. What did you do from morning to night? Use past tense verbs.",
      exampleAnswer: "Yesterday I woke up at 7 AM. I brushed my teeth and ate breakfast. I went to school at 8:30. I studied English and Mathematics. I ate lunch with my friends. After school, I played cricket. I came home at 5 PM. I watched TV for some time. I did my homework. I ate dinner and went to sleep at 10 PM.",
    },
    writingTask: {
      instruction: "Write about what you did last Sunday. Include at least 10 sentences using past tense.",
      hint: "Last Sunday, I woke up late. I ate... I went to... I played... I watched...",
    },
    quiz: [
      { question: "Past tense of 'go' is:", options: ["goed", "went", "gone", "goes"], correctIndex: 1, explanation: "'Go' is irregular — its past tense is 'went'." },
      { question: "'I ___ to school yesterday.'", options: ["go", "goes", "went", "going"], correctIndex: 2, explanation: "Past tense of 'go' is 'went': 'I went to school yesterday'." },
      { question: "'She ___ eat lunch.' (negative past)", options: ["don't", "doesn't", "didn't", "wasn't"], correctIndex: 2, explanation: "For negative past tense, use 'didn't + base verb': 'She didn't eat'." },
      { question: "Past tense of 'play' is:", options: ["plays", "playing", "played", "plaid"], correctIndex: 2, explanation: "'Play' is regular — add -ed: 'played'." },
      { question: "'___ you go to the market?' (past question)", options: ["Do", "Does", "Did", "Are"], correctIndex: 2, explanation: "For past tense questions, use 'Did + subject + base verb'." },
    ],
  },

  // ============================================================
  // DAY 21 — Future Plans & Dreams
  // ============================================================
  {
    day: 21,
    topic: "Future Plans, Goals & Dreams",
    description:
      "Learn to talk about your future plans, goals, and dreams using future tense.",
    teluguHint: "భవిష్యత్ ప్రణాళికలు & కలలు",
    vocabulary: [
      { word: "Plan", meaning: "An idea for what to do", pronunciation: "PLAN", example: "What is your plan for tomorrow?" },
      { word: "Goal", meaning: "Something you want to achieve", pronunciation: "GOHL", example: "My goal is to speak English fluently." },
      { word: "Dream", meaning: "Something you hope for", pronunciation: "DREEM", example: "My dream is to become a doctor." },
      { word: "Future", meaning: "Time that has not come yet", pronunciation: "FYOO-cher", example: "In the future, I want to travel." },
      { word: "Career", meaning: "A profession or job path", pronunciation: "kuh-REER", example: "What career do you want?" },
      { word: "Travel", meaning: "To go to different places", pronunciation: "TRAV-ul", example: "I want to travel to London." },
      { word: "Achieve", meaning: "To reach a goal", pronunciation: "uh-CHEEV", example: "I want to achieve my dreams." },
      { word: "Success", meaning: "Achieving what you planned", pronunciation: "suk-SES", example: "Hard work leads to success." },
      { word: "Improve", meaning: "To make better", pronunciation: "im-PROOV", example: "I want to improve my English." },
      { word: "Opportunity", meaning: "A chance to do something", pronunciation: "op-er-TOO-nuh-tee", example: "This is a great opportunity." },
    ],
    grammar: {
      title: "Going to — Planned Future Actions",
      explanation:
        "Use 'going to' for plans you have already decided: 'I am going to study medicine.' Use 'will' for decisions made now or predictions: 'I will help you.' Difference: 'going to' = already planned, 'will' = decided now. Structure: Subject + am/is/are + going to + base verb. Negative: 'I am not going to give up.' Question: 'Are you going to study tonight?'",
      structure: "Subject + am/is/are + going to + base verb",
      examples: [
        "I am going to learn coding next month.",
        "She is going to become an engineer.",
        "We are going to travel to Goa in December.",
      ],
    },
    practiceSentences: [
      { english: "I am going to become a software engineer.", telugu: "నేను సాఫ్ట్‌వేర్ ఇంజనీర్ అవ్వబోతున్నాను." },
      { english: "She is going to study abroad next year.", telugu: "ఆమె వచ్చే సంవత్సరం విదేశాల్లో చదువుకుంటుంది." },
      { english: "My dream is to help poor people.", telugu: "పేద ప్రజలకు సహాయం చేయడం నా కల." },
      { english: "I will work hard to achieve my goals.", telugu: "నా లక్ష్యాలను సాధించడానికి కష్టపడతాను." },
      { english: "We are not going to give up.", telugu: "మేము వదిలిపెట్టం." },
    ],
    speakingTask: {
      instruction: "Talk about your future plans: What career do you want? Where do you want to live? What do you want to achieve in 5 years?",
      exampleAnswer: "In the future, I am going to become a teacher. I am going to study education in college. My dream is to teach English to children in villages. I am going to improve my speaking skills. In five years, I want to have my own training center. I will work hard to achieve my goals.",
    },
    writingTask: {
      instruction: "Write 'My Future Plans' — describe your career goals, travel dreams, and what you want to achieve. Use 'going to' and 'will'.",
      hint: "My dream career is... I am going to study... In the future, I will... I want to achieve...",
    },
    quiz: [
      { question: "'I ___ going to study medicine.'", options: ["is", "are", "am", "be"], correctIndex: 2, explanation: "With 'I', use 'am': 'I am going to study'." },
      { question: "'She ___ going to travel to London.'", options: ["am", "is", "are", "was"], correctIndex: 1, explanation: "With 'she', use 'is': 'She is going to travel'." },
      { question: "'Going to' is used for:", options: ["Past actions", "Daily habits", "Planned future actions", "Present actions"], correctIndex: 2, explanation: "'Going to' is used for future actions that are already planned." },
      { question: "What does 'achieve' mean?", options: ["To fail", "To sleep", "To reach a goal", "To forget"], correctIndex: 2, explanation: "'Achieve' means to successfully reach or accomplish a goal." },
      { question: "'We are ___ going to give up!'", options: ["yes", "not", "will", "can"], correctIndex: 1, explanation: "Negative: 'We are not going to give up' — we will keep trying." },
    ],
  },

  // ============================================================
  // DAY 22 — Comparisons — Bigger, Better, Best
  // ============================================================
  {
    day: 22,
    topic: "Comparisons — Bigger, Better, Best",
    description:
      "Learn to compare things using comparative and superlative adjectives.",
    teluguHint: "పోలికలు — పెద్దది, మంచిది, అత్యుత్తమం",
    vocabulary: [
      { word: "Bigger", meaning: "More big (comparative)", pronunciation: "BIG-er", example: "An elephant is bigger than a dog." },
      { word: "Smaller", meaning: "More small (comparative)", pronunciation: "SMAWL-er", example: "An ant is smaller than a cat." },
      { word: "Taller", meaning: "More tall (comparative)", pronunciation: "TAWL-er", example: "My father is taller than me." },
      { word: "Better", meaning: "More good (comparative)", pronunciation: "BET-er", example: "This phone is better than that one." },
      { word: "Worst", meaning: "Most bad (superlative)", pronunciation: "WURST", example: "That was the worst movie." },
      { word: "Best", meaning: "Most good (superlative)", pronunciation: "BEST", example: "She is the best student." },
      { word: "Fastest", meaning: "Most fast (superlative)", pronunciation: "FAST-est", example: "The cheetah is the fastest animal." },
      { word: "More", meaning: "Greater amount (for long adjectives)", pronunciation: "MOR", example: "This book is more interesting." },
      { word: "Most", meaning: "Greatest amount (for long adjectives)", pronunciation: "MOHST", example: "She is the most beautiful." },
      { word: "Than", meaning: "Used in comparisons", pronunciation: "THAN", example: "I am taller than my sister." },
    ],
    grammar: {
      title: "Comparative & Superlative Adjectives",
      explanation:
        "Comparative (comparing 2 things): Short adjectives: add -er + than: 'tall → taller than', 'big → bigger than'. Long adjectives: more + adjective + than: 'more beautiful than'. Superlative (the best of all): Short adjectives: the + adjective-est: 'the tallest', 'the biggest'. Long adjectives: the most + adjective: 'the most beautiful'. Irregular: good → better → best, bad → worse → worst.",
      structure: "Comparative: adjective-er + than / more + adjective + than | Superlative: the + adjective-est / the most + adjective",
      examples: [
        "My brother is taller than me.",
        "English is more interesting than I thought.",
        "Mount Everest is the tallest mountain in the world.",
      ],
    },
    practiceSentences: [
      { english: "Hyderabad is bigger than Warangal.", telugu: "హైదరాబాద్ వరంగల్ కంటే పెద్దది." },
      { english: "My sister is smarter than me.", telugu: "నా చెల్లి నా కంటే తెలివైనది." },
      { english: "This is the best English course!", telugu: "ఇది అత్యుత్తమ ఇంగ్లీష్ కోర్స్!" },
      { english: "Summer is hotter than winter.", telugu: "వేసవి చలికాలం కంటే వేడిగా ఉంటుంది." },
      { english: "She is the most hardworking student in our class.", telugu: "ఆమె మా తరగతిలో అత్యంత కష్టపడే విద్యార్థిని." },
    ],
    speakingTask: {
      instruction: "Compare 5 pairs of things: cities, foods, seasons, people, animals. Use 'bigger than', 'more ___ than', 'the best/worst'.",
      exampleAnswer: "Delhi is bigger than my city. Summer is hotter than winter. My mother's cooking is better than restaurant food. The cheetah is faster than the lion. English is the most important language for my career. My best friend is taller than me.",
    },
    writingTask: {
      instruction: "Write 10 comparison sentences. Use 5 comparative (-er/more) and 5 superlative (-est/most) sentences.",
      hint: "A car is faster than a bicycle. The elephant is the biggest animal on land...",
    },
    quiz: [
      { question: "Comparative of 'good' is:", options: ["gooder", "more good", "better", "best"], correctIndex: 2, explanation: "'Good' is irregular: good → better → best." },
      { question: "'An elephant is ___ than a cat.'", options: ["big", "bigger", "biggest", "more big"], correctIndex: 1, explanation: "Short adjectives: add -er: 'bigger than'." },
      { question: "'She is the ___ student in class.'", options: ["most smart", "smarter", "smart", "smartest"], correctIndex: 3, explanation: "Superlative of short adjective: 'the smartest'." },
      { question: "'This movie is ___ interesting than that one.'", options: ["most", "more", "much", "very"], correctIndex: 1, explanation: "Long adjectives use 'more': 'more interesting than'." },
      { question: "Superlative of 'bad' is:", options: ["badder", "baddest", "worse", "worst"], correctIndex: 3, explanation: "'Bad' is irregular: bad → worse → worst." },
    ],
  },

  // ============================================================
  // DAY 23 — Prepositions of Place — In, On, Under, Between
  // ============================================================
  {
    day: 23,
    topic: "Prepositions of Place — Where Things Are",
    description:
      "Learn to describe the location of things using prepositions.",
    teluguHint: "స్థానాన్ని చెప్పే మాటలు — లో, పై, కింద",
    vocabulary: [
      { word: "In", meaning: "Inside something", pronunciation: "IN", example: "The book is in the bag." },
      { word: "On", meaning: "On the surface of", pronunciation: "ON", example: "The phone is on the table." },
      { word: "Under", meaning: "Below something", pronunciation: "UN-der", example: "The cat is under the bed." },
      { word: "Between", meaning: "In the middle of two things", pronunciation: "beh-TWEEN", example: "The shop is between the bank and hospital." },
      { word: "Behind", meaning: "At the back of", pronunciation: "beh-HYND", example: "The garden is behind the house." },
      { word: "In front of", meaning: "At the front/face of", pronunciation: "in FRUNT of", example: "The car is in front of the house." },
      { word: "Next to", meaning: "Beside, very close to", pronunciation: "NEKST too", example: "I sit next to my friend." },
      { word: "Above", meaning: "Higher than, over", pronunciation: "uh-BUV", example: "The fan is above the table." },
      { word: "Below", meaning: "Lower than, under", pronunciation: "beh-LOH", example: "The shop is below the office." },
      { word: "Inside", meaning: "Within something", pronunciation: "in-SYDE", example: "The toys are inside the box." },
    ],
    grammar: {
      title: "Prepositions of Place",
      explanation:
        "Prepositions of place tell us WHERE something is. 'in' = inside: 'in the box'. 'on' = touching surface: 'on the table'. 'under' = below: 'under the chair'. 'between' = in the middle: 'between A and B'. 'behind' = at back: 'behind the door'. 'in front of' = at face: 'in front of the school'. 'next to' = beside: 'next to the window'.",
      structure: "Subject + is/are + preposition + noun",
      examples: [
        "The keys are in my pocket.",
        "The picture is on the wall.",
        "The dog is under the table.",
      ],
    },
    practiceSentences: [
      { english: "The books are on the shelf.", telugu: "పుస్తకాలు షెల్ఫ్ మీద ఉన్నాయి." },
      { english: "My cat is hiding under the bed.", telugu: "నా పిల్లి మంచం కింద దాక్కుంటోంది." },
      { english: "The pharmacy is between the bank and the bakery.", telugu: "ఫార్మసీ బ్యాంక్ మరియు బేకరీ మధ్యలో ఉంది." },
      { english: "I sit next to my best friend in class.", telugu: "నేను తరగతిలో నా బెస్ట్ ఫ్రెండ్ పక్కన కూర్చుంటాను." },
      { english: "The garden is behind our house.", telugu: "తోట మా ఇంటి వెనుక ఉంది." },
    ],
    speakingTask: {
      instruction: "Look around your room. Describe where 8 things are using different prepositions: in, on, under, between, behind, in front of, next to, above.",
      exampleAnswer: "My phone is on the table. My books are in the shelf. My shoes are under the bed. My lamp is next to the computer. The fan is above my head. My bag is behind the chair. The window is in front of me. My bed is between the table and the wall.",
    },
    writingTask: {
      instruction: "Draw your room and write 10 sentences describing where things are. Use at least 6 different prepositions.",
      hint: "The bed is in the corner. The clock is on the wall. My shoes are under...",
    },
    quiz: [
      { question: "'The cat is ___ the box.' (inside)", options: ["on", "in", "under", "behind"], correctIndex: 1, explanation: "'In' means inside something: 'in the box'." },
      { question: "'The book is ___ the table.' (touching surface)", options: ["in", "under", "on", "behind"], correctIndex: 2, explanation: "'On' means touching the surface of something." },
      { question: "'The shop is ___ the bank and hospital.'", options: ["next to", "behind", "between", "above"], correctIndex: 2, explanation: "'Between' means in the middle of two things." },
      { question: "'She is standing ___ the door.' (at the back)", options: ["in front of", "behind", "on", "in"], correctIndex: 1, explanation: "'Behind' means at the back of something." },
      { question: "'I sit ___ my friend.' (beside)", options: ["behind", "under", "above", "next to"], correctIndex: 3, explanation: "'Next to' means beside or very close to." },
    ],
  },

  // ============================================================
  // DAY 24 — Conjunctions — And, But, Or, So, Because
  // ============================================================
  {
    day: 24,
    topic: "Conjunctions — Connecting Ideas",
    description:
      "Learn to connect sentences and ideas using conjunctions for smoother speaking.",
    teluguHint: "సంయోజకాలు — ఆలోచనలను కలపడం",
    vocabulary: [
      { word: "And", meaning: "Connects similar ideas", pronunciation: "AND", example: "I like tea and coffee." },
      { word: "But", meaning: "Shows contrast or difference", pronunciation: "BUT", example: "I want to go but I am tired." },
      { word: "Or", meaning: "Shows choices", pronunciation: "OR", example: "Do you want tea or coffee?" },
      { word: "So", meaning: "Shows result", pronunciation: "SOH", example: "It was raining, so I took an umbrella." },
      { word: "Because", meaning: "Shows reason", pronunciation: "beh-KUZ", example: "I stayed home because I was sick." },
      { word: "Although", meaning: "Despite the fact", pronunciation: "awl-THOH", example: "Although it rained, we played." },
      { word: "However", meaning: "But, on the other hand", pronunciation: "how-EV-er", example: "I was tired. However, I studied." },
      { word: "Also", meaning: "In addition", pronunciation: "AWL-soh", example: "I can sing. I can also dance." },
      { word: "Therefore", meaning: "For that reason", pronunciation: "THAIR-for", example: "He worked hard, therefore he passed." },
      { word: "While", meaning: "At the same time", pronunciation: "WY-ul", example: "I listen to music while I study." },
    ],
    grammar: {
      title: "Conjunctions — Joining Sentences Together",
      explanation:
        "Conjunctions join two ideas into one sentence. AND = adds information: 'I play cricket and football.' BUT = shows contrast: 'I am tired but happy.' OR = gives choices: 'Tea or coffee?' SO = shows result: 'It rained, so I stayed home.' BECAUSE = gives reason: 'I stayed because it was raining.' These make your English more fluent and natural.",
      structure: "Sentence 1 + conjunction + Sentence 2",
      examples: [
        "I like English and I practice every day.",
        "She is young but very talented.",
        "I stayed home because it was raining, so I watched a movie.",
      ],
    },
    practiceSentences: [
      { english: "I like cricket and football.", telugu: "నాకు క్రికెట్ మరియు ఫుట్‌బాల్ ఇష్టం." },
      { english: "I wanted to go out, but it was raining.", telugu: "నేను బయటకు వెళ్ళాలనుకున్నాను, కానీ వర్షం పడుతోంది." },
      { english: "Do you want rice or chapati?", telugu: "మీకు అన్నం కావాలా లేదా చపాతీ కావాలా?" },
      { english: "She studied hard, so she passed the exam.", telugu: "ఆమె కష్టపడి చదివింది, అందుకే పరీక్షలో పాసైంది." },
      { english: "I stayed home because I had a fever.", telugu: "నాకు జ్వరం ఉన్నందున ఇంట్లో ఉన్నాను." },
    ],
    speakingTask: {
      instruction: "Make 5 compound sentences using: and, but, or, so, because. Then tell a short story using all 5 conjunctions.",
      exampleAnswer: "I study English and Telugu. I want to travel but I don't have money. Should I study tonight or watch a movie? It was hot today, so I drank a lot of water. I am learning English because I want a good job. Yesterday I woke up early because I had an exam. I studied hard and went to school. The exam was difficult but I tried my best. I could choose between writing or speaking. I answered well, so I felt happy.",
    },
    writingTask: {
      instruction: "Write a short story (10 sentences) about 'My Best Day' using at least 5 different conjunctions.",
      hint: "Last Sunday was my best day. I woke up early and... But then... So I... Because...",
    },
    quiz: [
      { question: "'I like tea ___ coffee.' (adding)", options: ["but", "or", "and", "so"], correctIndex: 2, explanation: "'And' connects similar ideas: 'tea and coffee'." },
      { question: "'I was tired ___ I still studied.'", options: ["and", "so", "or", "but"], correctIndex: 3, explanation: "'But' shows contrast: tired ↔ still studied." },
      { question: "'Tea ___ coffee? Pick one.'", options: ["and", "but", "or", "so"], correctIndex: 2, explanation: "'Or' gives choices between options." },
      { question: "'It rained, ___ I took an umbrella.'", options: ["but", "and", "or", "so"], correctIndex: 3, explanation: "'So' shows the result: rained → took umbrella." },
      { question: "'I stayed home ___ I was sick.'", options: ["so", "but", "and", "because"], correctIndex: 3, explanation: "'Because' gives the reason for staying home." },
    ],
  },

  // ============================================================
  // DAY 25 — Email & Formal Writing
  // ============================================================
  {
    day: 25,
    topic: "Writing Emails & Formal Communication",
    description:
      "Learn to write emails, formal letters, and professional messages.",
    teluguHint: "ఈమెయిల్ రాయడం & అధికారిక సంభాషణ",
    vocabulary: [
      { word: "Subject", meaning: "Topic of the email", pronunciation: "SUB-jekt", example: "Write a clear subject line." },
      { word: "Dear", meaning: "Formal greeting in letters", pronunciation: "DEER", example: "Dear Sir/Madam," },
      { word: "Regards", meaning: "Closing word in formal emails", pronunciation: "reh-GARDZ", example: "Best regards, Ravi" },
      { word: "Request", meaning: "To ask for something formally", pronunciation: "reh-KWEST", example: "I request you to grant me leave." },
      { word: "Inform", meaning: "To tell/notify someone", pronunciation: "in-FORM", example: "I am writing to inform you..." },
      { word: "Attached", meaning: "File sent with email", pronunciation: "uh-TACHD", example: "Please find the document attached." },
      { word: "Sincerely", meaning: "Formal email closing", pronunciation: "sin-SEER-lee", example: "Yours sincerely, Priya" },
      { word: "Apologize", meaning: "To say sorry formally", pronunciation: "uh-POL-uh-jize", example: "I apologize for the delay." },
      { word: "Regarding", meaning: "About, concerning", pronunciation: "reh-GAR-ding", example: "I am writing regarding the meeting." },
      { word: "Grateful", meaning: "Thankful", pronunciation: "GRAYT-ful", example: "I would be grateful for your help." },
    ],
    grammar: {
      title: "Formal vs Informal Language",
      explanation:
        "Formal English is used in emails, letters, and professional settings. Key differences: Informal: 'Hi', 'Thanks', 'Can you...?', 'I wanna'. Formal: 'Dear Sir/Madam', 'Thank you', 'Could you kindly...?', 'I would like to'. Use formal language with teachers, bosses, and strangers. Use informal with friends and family. Common formal phrases: 'I am writing to inform you...', 'I request you to...', 'I would be grateful if...'",
      structure: "Formal Email: Dear ___, | Body with formal phrases | Regards/Sincerely, Name",
      examples: [
        "Dear Ma'am, I am writing to request leave for two days.",
        "I would be grateful if you could send me the notes.",
        "Thank you for your kind support. Regards, Ravi.",
      ],
    },
    practiceSentences: [
      { english: "Dear Sir, I am writing to request leave.", telugu: "ప్రియ సర్, నేను సెలవు కోరడానికి రాస్తున్నాను." },
      { english: "I would be grateful for your help.", telugu: "మీ సహాయానికి నేను కృతజ్ఞుడను." },
      { english: "Please find the document attached.", telugu: "దయచేసి జోడించిన డాక్యుమెంట్ చూడండి." },
      { english: "I apologize for the late reply.", telugu: "ఆలస్యంగా రిప్లై చేసినందుకు క్షమించండి." },
      { english: "Thank you for your time and support.", telugu: "మీ సమయం మరియు మద్దతుకు ధన్యవాదాలు." },
    ],
    speakingTask: {
      instruction: "Read this formal email aloud, then create your own: Write an email to your teacher requesting leave for 2 days due to a family function.",
      exampleAnswer: "Subject: Leave Request. Dear Ma'am, I am writing to request leave for two days on 20th and 21st June because of a family function. I will complete all pending work after I return. I would be grateful if you could grant me leave. Thank you. Yours sincerely, Ravi Kumar, Class 10-A.",
    },
    writingTask: {
      instruction: "Write 2 emails: (1) To your teacher requesting leave. (2) To a company asking about a job opportunity. Use formal language.",
      hint: "Subject: ___ | Dear ___, | I am writing to... | I request/I would like to... | Regards, ___",
    },
    quiz: [
      { question: "Formal greeting in an email:", options: ["Hey!", "Yo!", "Dear Sir/Madam,", "What's up!"], correctIndex: 2, explanation: "'Dear Sir/Madam' is the standard formal greeting." },
      { question: "Formal way to say 'thanks':", options: ["Thx", "Thanks a lot!", "Thank you very much", "Cheers"], correctIndex: 2, explanation: "'Thank you very much' is the formal way to express gratitude." },
      { question: "'I am writing ___ the job vacancy.'", options: ["about", "regarding", "for", "to"], correctIndex: 1, explanation: "'Regarding' is the formal way to say 'about'." },
      { question: "Formal email closing:", options: ["Bye!", "See ya!", "Best regards,", "Later!"], correctIndex: 2, explanation: "'Best regards' is a professional email closing." },
      { question: "'I ___ for the inconvenience.' (formal sorry)", options: ["sorry", "apologize", "sad", "regretful"], correctIndex: 1, explanation: "'Apologize' is the formal way to say sorry." },
    ],
  },

  // ============================================================
  // DAY 26 — Job Interview Preparation
  // ============================================================
  {
    day: 26,
    topic: "Job Interview Preparation & Common Questions",
    description:
      "Learn how to answer common interview questions and make a strong impression.",
    teluguHint: "ఉద్యోగ ఇంటర్వ్యూ తయారీ",
    vocabulary: [
      { word: "Interview", meaning: "Formal meeting to assess someone", pronunciation: "IN-ter-vyoo", example: "I have a job interview tomorrow." },
      { word: "Candidate", meaning: "Person applying for a job", pronunciation: "KAN-dih-dayt", example: "She is the best candidate." },
      { word: "Experience", meaning: "Knowledge from doing something", pronunciation: "ex-PEER-ee-ens", example: "I have 2 years of experience." },
      { word: "Qualification", meaning: "Education or skills you have", pronunciation: "kwol-ih-fih-KAY-shun", example: "What are your qualifications?" },
      { word: "Strength", meaning: "Something you are good at", pronunciation: "STRENGTH", example: "My strength is hard work." },
      { word: "Weakness", meaning: "Area where you need improvement", pronunciation: "WEEK-nes", example: "My weakness is public speaking." },
      { word: "Salary", meaning: "Money earned for work", pronunciation: "SAL-uh-ree", example: "What is the salary for this role?" },
      { word: "Resume", meaning: "Document listing your skills/experience", pronunciation: "REZ-oo-may", example: "Please bring your resume." },
      { word: "Confident", meaning: "Sure of yourself", pronunciation: "KON-fih-dent", example: "Be confident in the interview." },
      { word: "Hire", meaning: "To give someone a job", pronunciation: "HY-er", example: "We would like to hire you." },
    ],
    grammar: {
      title: "Would / Could — Polite Professional Language",
      explanation:
        "Use 'would' for polite wishes and hypothetical situations: 'I would like to work here.' 'I would be happy to join.' Use 'could' for polite ability/requests: 'Could you tell me about the role?' Past ability: 'I could handle the project.' In interviews, 'would' and 'could' make you sound professional and polite.",
      structure: "I would like to... | Could you...? | I would be happy to...",
      examples: [
        "I would like to apply for this position.",
        "Could you tell me more about the job?",
        "I would be a great addition to your team.",
      ],
    },
    practiceSentences: [
      { english: "Tell me about yourself.", telugu: "మీ గురించి చెప్పండి." },
      { english: "My strength is that I am a quick learner.", telugu: "నా బలం ఏమిటంటే నేను త్వరగా నేర్చుకుంటాను." },
      { english: "I would like to work in your company.", telugu: "నేను మీ కంపెనీలో పని చేయాలనుకుంటున్నాను." },
      { english: "Could you tell me about the working hours?", telugu: "పని గంటల గురించి చెప్పగలరా?" },
      { english: "I am confident that I can do this job well.", telugu: "ఈ ఉద్యోగం బాగా చేయగలనని నాకు నమ్మకం ఉంది." },
    ],
    speakingTask: {
      instruction: "Practice answering these interview questions aloud: (1) Tell me about yourself. (2) What are your strengths? (3) Why should we hire you? (4) Where do you see yourself in 5 years? (5) Do you have any questions?",
      exampleAnswer: "1. My name is Ravi Kumar. I am a B.Tech graduate from JNTU. I have good communication skills and I am a quick learner. 2. My strengths are hard work, teamwork, and problem-solving. 3. You should hire me because I am dedicated and eager to learn. 4. In 5 years, I see myself in a senior position. 5. Could you tell me about the training program?",
    },
    writingTask: {
      instruction: "Write your answers to 5 common interview questions. Practice formal, confident language.",
      hint: "Tell me about yourself: My name is... I am... My strengths: I am good at...",
    },
    quiz: [
      { question: "Polite way to say 'I want this job':", options: ["Give me the job!", "I want job!", "I would like this position.", "Job please!"], correctIndex: 2, explanation: "'I would like this position' is the polite, professional way." },
      { question: "What is a 'resume'?", options: ["A type of letter", "Document listing your skills", "A job application form", "A salary slip"], correctIndex: 1, explanation: "A resume lists your education, skills, and work experience." },
      { question: "'Could you tell me about the role?' is:", options: ["Rude", "Informal", "Polite and professional", "Too casual"], correctIndex: 2, explanation: "Using 'could' makes requests polite and professional." },
      { question: "In an interview, 'strength' means:", options: ["Physical power", "Something you're good at", "Your muscles", "Your salary"], correctIndex: 1, explanation: "In interviews, 'strength' refers to your skills and good qualities." },
      { question: "Best way to end an interview:", options: ["Just walk out", "Thank you for your time", "Okay bye", "Whatever"], correctIndex: 1, explanation: "'Thank you for your time' is the professional way to end an interview." },
    ],
  },

  // ============================================================
  // DAY 27 — Storytelling & Narration
  // ============================================================
  {
    day: 27,
    topic: "Storytelling & Narrating Events",
    description:
      "Learn to tell stories, describe events in order, and make your speech interesting.",
    teluguHint: "కథ చెప్పడం & సంఘటనలు వివరించడం",
    vocabulary: [
      { word: "Once upon a time", meaning: "Classic story beginning", pronunciation: "WUNS uh-pon uh TIME", example: "Once upon a time, there was a king." },
      { word: "Suddenly", meaning: "Quickly and unexpectedly", pronunciation: "SUD-en-lee", example: "Suddenly, it started raining." },
      { word: "Then", meaning: "After that, next", pronunciation: "THEN", example: "First I ate, then I studied." },
      { word: "Finally", meaning: "At last, in the end", pronunciation: "FY-nul-ee", example: "Finally, they reached home." },
      { word: "Meanwhile", meaning: "At the same time", pronunciation: "MEEN-wyl", example: "Meanwhile, her friends were waiting." },
      { word: "Character", meaning: "Person in a story", pronunciation: "KAIR-ik-ter", example: "The main character is a boy." },
      { word: "Beginning", meaning: "Start of a story", pronunciation: "beh-GIN-ing", example: "In the beginning, everything was quiet." },
      { word: "Ending", meaning: "How the story finishes", pronunciation: "END-ing", example: "The story has a happy ending." },
      { word: "Exciting", meaning: "Causing excitement and interest", pronunciation: "ek-SY-ting", example: "The movie was very exciting!" },
      { word: "Moral", meaning: "Lesson from a story", pronunciation: "MOR-ul", example: "The moral is: never give up." },
    ],
    grammar: {
      title: "Sequencing Words — First, Then, After That, Finally",
      explanation:
        "Sequencing words help you tell stories in order. Use them to organize events: 'First...' (beginning), 'Then/Next...' (middle), 'After that...' (continuation), 'Finally/In the end...' (conclusion). Also useful: 'Before that', 'During', 'Meanwhile', 'Suddenly'. These words make your narration clear and easy to follow.",
      structure: "First, ... Then/Next, ... After that, ... Finally, ...",
      examples: [
        "First, I woke up. Then, I had breakfast. After that, I went to school. Finally, I came home.",
        "Once upon a time, there was a farmer. One day, he found a golden egg. Suddenly, a thief came. In the end, the farmer saved the egg.",
      ],
    },
    practiceSentences: [
      { english: "Once upon a time, there was a clever rabbit.", telugu: "అనగనగా ఒక తెలివైన కుందేలు ఉండేది." },
      { english: "First, he went to the market. Then, he bought vegetables.", telugu: "మొదట, అతను మార్కెట్‌కి వెళ్ళాడు. తర్వాత, కూరగాయలు కొన్నాడు." },
      { english: "Suddenly, it started raining heavily.", telugu: "అకస్మాత్తుగా, భారీ వర్షం మొదలైంది." },
      { english: "Finally, everyone was happy.", telugu: "చివరగా, అందరూ సంతోషంగా ఉన్నారు." },
      { english: "The moral of the story is: hard work pays off.", telugu: "కథ నీతి: కష్టపడితే ఫలితం వస్తుంది." },
    ],
    speakingTask: {
      instruction: "Tell a short story (real or imaginary) in English. Use sequencing words: First, Then, After that, Suddenly, Finally. Make it interesting!",
      exampleAnswer: "Once upon a time, there was a poor boy named Raju. He wanted to study, but he didn't have money. First, he started working at a shop after school. Then, he saved some money and bought books. After that, he studied very hard every night. Suddenly, he got a scholarship from a big university! Finally, he became a successful engineer. The moral is: never give up on your dreams.",
    },
    writingTask: {
      instruction: "Write a short story (15 sentences) with a beginning, middle, and end. Use at least 5 sequencing words and include a moral.",
      hint: "Once upon a time... First... Then... Suddenly... After that... Finally... The moral is...",
    },
    quiz: [
      { question: "Which word starts a fairy tale?", options: ["Finally", "Suddenly", "Once upon a time", "Meanwhile"], correctIndex: 2, explanation: "'Once upon a time' is the classic way to begin a fairy tale." },
      { question: "'_____, he fell down!' (unexpectedly)", options: ["Finally", "First", "Suddenly", "Then"], correctIndex: 2, explanation: "'Suddenly' means something happened quickly and unexpectedly." },
      { question: "Correct order:", options: ["Finally, Then, First", "First, Then, Finally", "Then, Finally, First", "Finally, First, Then"], correctIndex: 1, explanation: "The correct sequence is: First → Then → Finally." },
      { question: "The lesson from a story is called:", options: ["Plot", "Character", "Moral", "Title"], correctIndex: 2, explanation: "The moral is the lesson or message of the story." },
      { question: "'___ that, we went home.' (after)", options: ["Before", "During", "After", "While"], correctIndex: 2, explanation: "'After that' means it happened next in the sequence." },
    ],
  },

  // ============================================================
  // DAY 28 — Public Speaking & Presentations
  // ============================================================
  {
    day: 28,
    topic: "Public Speaking & Giving Presentations",
    description:
      "Learn how to speak in front of people, give presentations, and express opinions.",
    teluguHint: "బహిరంగ ప్రసంగం & ప్రెజెంటేషన్లు",
    vocabulary: [
      { word: "Audience", meaning: "People watching/listening", pronunciation: "AW-dee-ens", example: "Speak clearly to the audience." },
      { word: "Presentation", meaning: "A talk or speech about a topic", pronunciation: "prez-en-TAY-shun", example: "I gave a presentation on pollution." },
      { word: "Opinion", meaning: "What you think about something", pronunciation: "uh-PIN-yun", example: "In my opinion, reading is important." },
      { word: "Conclusion", meaning: "End/summary of a speech", pronunciation: "kon-KLOO-zhun", example: "In conclusion, we must protect nature." },
      { word: "Point", meaning: "An idea in a discussion", pronunciation: "POYNT", example: "My first point is about education." },
      { word: "Example", meaning: "Something that illustrates", pronunciation: "ig-ZAM-pul", example: "For example, reading improves vocabulary." },
      { word: "Furthermore", meaning: "In addition, also", pronunciation: "FUR-ther-mor", example: "Furthermore, exercise keeps us fit." },
      { word: "Practice", meaning: "To do repeatedly to improve", pronunciation: "PRAK-tis", example: "Practice makes perfect." },
      { word: "Clearly", meaning: "In a way that is easy to understand", pronunciation: "KLEER-lee", example: "Please speak clearly." },
      { word: "Confident", meaning: "Sure about yourself", pronunciation: "KON-fih-dent", example: "Be confident when you speak." },
    ],
    grammar: {
      title: "Expressing Opinions — I think, In my opinion, I believe",
      explanation:
        "To share your views politely: 'I think + statement' — 'I think English is important.' 'In my opinion + statement' — 'In my opinion, reading helps a lot.' 'I believe + statement' — 'I believe education changes lives.' To agree: 'I agree with you.' To disagree politely: 'I respect your opinion, but I think...' These phrases are essential for discussions and presentations.",
      structure: "I think/believe/feel + statement | In my opinion, + statement",
      examples: [
        "I think technology is changing education.",
        "In my opinion, everyone should learn English.",
        "I believe that hard work is the key to success.",
      ],
    },
    practiceSentences: [
      { english: "Good morning, everyone! Today I will talk about...", telugu: "శుభోదయం, అందరికీ! ఈ రోజు నేను... గురించి మాట్లాడతాను." },
      { english: "In my opinion, learning English is very important.", telugu: "నా అభిప్రాయంలో, ఇంగ్లీష్ నేర్చుకోవడం చాలా ముఖ్యం." },
      { english: "For example, English helps us communicate globally.", telugu: "ఉదాహరణకు, ఇంగ్లీష్ ప్రపంచవ్యాప్తంగా సంభాషించడంలో సహాయపడుతుంది." },
      { english: "Furthermore, it opens many career opportunities.", telugu: "ఇంకా, ఇది అనేక కెరీర్ అవకాశాలను తెరుస్తుంది." },
      { english: "In conclusion, we should all practice English daily.", telugu: "ముగింపుగా, మనమందరం ప్రతిరోజూ ఇంగ్లీష్ ప్రాక్టీస్ చేయాలి." },
    ],
    speakingTask: {
      instruction: "Give a 1-minute speech on: 'Why Learning English Is Important'. Use: opening greeting, 3 points with examples, and a conclusion.",
      exampleAnswer: "Good morning, everyone! Today I would like to talk about why learning English is important. First, English is an international language spoken in over 100 countries. For example, when we travel abroad, we need English to communicate. Second, in my opinion, English helps in getting better jobs. Many companies require English skills. Furthermore, English gives us access to knowledge — most books, websites, and research are in English. In conclusion, I believe every student should learn English. It opens doors to a bright future. Thank you!",
    },
    writingTask: {
      instruction: "Write a speech on 'My Dream for India' or 'The Importance of Education'. Include opening, 3 main points, examples, and conclusion.",
      hint: "Good morning! Today I will talk about... First,... For example,... Second,... Furthermore,... In conclusion,...",
    },
    quiz: [
      { question: "Formal way to start a speech:", options: ["Hey guys!", "Good morning, everyone!", "Listen up!", "Okay so..."], correctIndex: 1, explanation: "'Good morning, everyone!' is the professional way to start." },
      { question: "'___ my opinion, English is important.'", options: ["At", "On", "In", "By"], correctIndex: 2, explanation: "The correct phrase is 'In my opinion'." },
      { question: "Which word introduces an example?", options: ["However", "Furthermore", "For example", "In conclusion"], correctIndex: 2, explanation: "'For example' introduces a specific illustration of your point." },
      { question: "Which word means 'in addition'?", options: ["However", "Furthermore", "Finally", "Although"], correctIndex: 1, explanation: "'Furthermore' means 'in addition' or 'moreover'." },
      { question: "How to end a speech:", options: ["That's all!", "Okay bye!", "In conclusion,... Thank you!", "I'm done."], correctIndex: 2, explanation: "'In conclusion' followed by 'Thank you' is the proper way to end." },
    ],
  },

  // ============================================================
  // DAY 29 — Common Mistakes & Tips
  // ============================================================
  {
    day: 29,
    topic: "Common English Mistakes & Pro Tips",
    description:
      "Learn the most common mistakes Indian English learners make and how to fix them.",
    teluguHint: "సాధారణ తప్పులు & ప్రో చిట్కాలు",
    vocabulary: [
      { word: "Mistake", meaning: "Something done wrong", pronunciation: "mis-TAYK", example: "Don't worry about mistakes." },
      { word: "Correct", meaning: "Right, without errors", pronunciation: "kuh-REKT", example: "Is this sentence correct?" },
      { word: "Improve", meaning: "To become better", pronunciation: "im-PROOV", example: "I want to improve my grammar." },
      { word: "Pronounce", meaning: "To say a word correctly", pronunciation: "pruh-NOWNS", example: "How do you pronounce this word?" },
      { word: "Grammar", meaning: "Rules of language", pronunciation: "GRAM-er", example: "English grammar can be tricky." },
      { word: "Fluent", meaning: "Speaking smoothly and easily", pronunciation: "FLOO-ent", example: "She speaks fluent English." },
      { word: "Accent", meaning: "Way of pronouncing words", pronunciation: "AK-sent", example: "Everyone has a different accent." },
      { word: "Vocabulary", meaning: "Words you know", pronunciation: "voh-KAB-yoo-lair-ee", example: "Build your vocabulary daily." },
      { word: "Confidence", meaning: "Belief in your abilities", pronunciation: "KON-fih-dens", example: "Speak with confidence." },
      { word: "Fluency", meaning: "Ability to speak smoothly", pronunciation: "FLOO-en-see", example: "Fluency comes with practice." },
    ],
    grammar: {
      title: "Common Mistakes by Indian English Learners",
      explanation:
        "1. 'Myself Ravi' ❌ → 'My name is Ravi' ✅ (Don't use 'myself' for introduction). 2. 'I am having a car' ❌ → 'I have a car' ✅ (Don't use continuous for possession). 3. 'He don't know' ❌ → 'He doesn't know' ✅ (Use 'doesn't' with he/she/it). 4. 'More better' ❌ → 'Better' ✅ (Don't use 'more' with comparative -er). 5. 'I can able to' ❌ → 'I can' or 'I am able to' ✅ (Don't combine both). 6. 'I went to there' ❌ → 'I went there' ✅ (No 'to' before here/there). 7. 'She is my cousin sister' ❌ → 'She is my cousin' ✅ (Cousin already means relative).",
      structure: "Wrong ❌ → Correct ✅",
      examples: [
        "❌ 'Myself Priya' → ✅ 'My name is Priya'",
        "❌ 'She don't like tea' → ✅ 'She doesn't like tea'",
        "❌ 'I can able to swim' → ✅ 'I can swim' or 'I am able to swim'",
      ],
    },
    practiceSentences: [
      { english: "My name is Ravi, not 'Myself Ravi'.", telugu: "నా పేరు రవి — 'Myself రవి' అని చెప్పకూడదు." },
      { english: "I have a car, not 'I am having a car'.", telugu: "నాకు కారు ఉంది — 'I am having' అని చెప్పకూడదు." },
      { english: "She doesn't like coffee.", telugu: "ఆమెకు కాఫీ ఇష్టం లేదు." },
      { english: "This is better, not 'more better'.", telugu: "ఇది మెరుగైనది — 'more better' తప్పు." },
      { english: "I can swim, not 'I can able to swim'.", telugu: "నేను ఈదగలను — 'I can able to' తప్పు." },
    ],
    speakingTask: {
      instruction: "Practice saying these 7 correct sentences aloud. Then introduce yourself properly without any of the common mistakes. Record yourself if possible.",
      exampleAnswer: "Hello! My name is Kavya Sharma. I am from Hyderabad. I am 22 years old. I have a degree in Computer Science. I can speak English, Telugu, and Hindi. My hobby is reading books. I want to become a software developer. I believe that practice is the key to fluency. Thank you!",
    },
    writingTask: {
      instruction: "Write a paragraph introducing yourself (10 sentences). Then check for all 7 common mistakes listed today. Fix any errors.",
      hint: "Start with: My name is... (not Myself...). I have... (not I am having...). I can... (not I can able to...)",
    },
    quiz: [
      { question: "Correct way to introduce yourself:", options: ["Myself Ravi", "My name is Ravi", "I am Ravi myself", "Ravi myself"], correctIndex: 1, explanation: "'My name is Ravi' is correct. 'Myself Ravi' is a common Indian English mistake." },
      { question: "'She ___ know the answer.'", options: ["don't", "doesn't", "isn't", "aren't"], correctIndex: 1, explanation: "With she/he/it, use 'doesn't': 'She doesn't know'." },
      { question: "Which is WRONG?", options: ["I can swim", "I am able to swim", "I can able to swim", "I know how to swim"], correctIndex: 2, explanation: "'I can able to' mixes 'can' and 'able to'. Use one or the other." },
      { question: "'This is ___.' (comparing two things)", options: ["more better", "most better", "better", "best"], correctIndex: 2, explanation: "'Better' is already comparative. Don't add 'more' before it." },
      { question: "'I ___ a phone.' (possession)", options: ["am having", "have", "having", "has been"], correctIndex: 1, explanation: "For possession, use simple present: 'I have', not 'I am having'." },
    ],
  },

  // ============================================================
  // DAY 30 — Review, Certificate & Celebration!
  // ============================================================
  {
    day: 30,
    topic: "Grand Review, Final Test & Celebration! 🎉",
    description:
      "Review everything you learned in 30 days. Take a final quiz and celebrate your achievement!",
    teluguHint: "గొప్ప సమీక్ష, చివరి పరీక్ష & వేడుక! 🎉",
    vocabulary: [
      { word: "Achievement", meaning: "Something you accomplished", pronunciation: "uh-CHEEV-ment", example: "Completing 30 days is a big achievement!" },
      { word: "Certificate", meaning: "Document of completion", pronunciation: "sur-TIF-ih-kit", example: "You earned a certificate!" },
      { word: "Congratulations", meaning: "Expression for success", pronunciation: "kon-GRAT-yoo-LAY-shunz", example: "Congratulations on finishing the course!" },
      { word: "Journey", meaning: "A trip or process of going somewhere", pronunciation: "JUR-nee", example: "This was an amazing learning journey." },
      { word: "Review", meaning: "To look at again", pronunciation: "reh-VYOO", example: "Let's review what we learned." },
      { word: "Progress", meaning: "Forward movement or improvement", pronunciation: "PRAH-gres", example: "You have made great progress!" },
      { word: "Celebrate", meaning: "To do something special for success", pronunciation: "SEL-eh-brayt", example: "Let's celebrate your success!" },
      { word: "Continue", meaning: "To keep going", pronunciation: "kon-TIN-yoo", example: "Continue practicing every day." },
      { word: "Grateful", meaning: "Feeling thankful", pronunciation: "GRAYT-ful", example: "I am grateful for this course." },
      { word: "Inspire", meaning: "To motivate someone", pronunciation: "in-SPY-er", example: "Your progress will inspire others." },
    ],
    grammar: {
      title: "30-Day Grammar Recap",
      explanation:
        "You have learned: (1) Alphabet & greetings, (2) Numbers & age, (3) Adjectives — before nouns, (4) Possessives — my/your/his/her, (5) Prepositions — on/in/at for time, (6) Likes & dislikes — I like/don't like, (7) Present continuous — am/is/are + ing, (8) Simple present — daily habits, (9) There is/are — what exists, (10) Telling time, (11) Subject-verb agreement, (12) WH-questions, (13) Imperatives — directions, (14) How much/many, (15) Can/can't — abilities, (16) Will/won't — future, (17) Should/shouldn't — advice, (18) Weather with 'It', (19) Because — reasons, (20) Past tense, (21) Going to — plans, (22) Comparatives/superlatives, (23) Prepositions of place, (24) Conjunctions, (25) Formal language, (26) Would/could — polite, (27) Sequencing words, (28) Expressing opinions, (29) Common mistakes fixed!",
      structure: "All grammar structures from 30 days",
      examples: [
        "I have completed the 30-day challenge and I am proud of myself!",
        "My English is better now than when I started.",
        "I am going to continue practicing because I want to become fluent.",
      ],
    },
    practiceSentences: [
      { english: "I have completed the 30-day English challenge!", telugu: "నేను 30 రోజుల ఇంగ్లీష్ ఛాలెంజ్ పూర్తి చేసాను!" },
      { english: "My English is much better now.", telugu: "నా ఇంగ్లీష్ ఇప్పుడు చాలా మెరుగ్గా ఉంది." },
      { english: "I am grateful for this learning journey.", telugu: "ఈ నేర్చుకునే ప్రయాణానికి కృతజ్ఞుడను." },
      { english: "I will continue to practice every day.", telugu: "నేను ప్రతిరోజూ ప్రాక్టీస్ చేయడం కొనసాగిస్తాను." },
      { english: "Congratulations! You did an amazing job!", telugu: "అభినందనలు! మీరు అద్భుతమైన పని చేసారు!" },
    ],
    speakingTask: {
      instruction: "Give a 2-minute speech about your 30-day English learning journey. What did you learn? What was difficult? What was your favorite day? What are your next goals?",
      exampleAnswer: "Hello everyone! I am so happy that I completed the 30-day English challenge. When I started on Day 1, I only knew the alphabet and basic greetings. Now, I can speak in complete sentences, tell stories, give opinions, and even prepare for interviews! The most difficult part was learning tenses — past, present, and future. But with daily practice, I improved a lot. My favorite day was Day 27 about storytelling because I love telling stories. My English is much better now than 30 days ago. I am going to continue learning by reading English books and watching English movies. My goal is to become fluent in English. I am grateful to SpeakWithYou for this amazing journey. Thank you!",
    },
    writingTask: {
      instruction: "Write a reflection essay: 'My 30-Day English Journey'. Include: how you started, what you learned, challenges, favorite lessons, and future plans.",
      hint: "30 days ago, I started... I learned... The most difficult part was... My favorite lesson was... Now I can... In the future, I will...",
    },
    quiz: [
      { question: "How do you introduce yourself correctly?", options: ["Myself Ravi", "My name is Ravi", "I am name Ravi", "Name is Ravi myself"], correctIndex: 1, explanation: "The correct way is 'My name is Ravi' — as learned in Day 29!" },
      { question: "'She ___ to school every day.' (go)", options: ["go", "goes", "going", "went"], correctIndex: 1, explanation: "Simple present with she: add -s: 'She goes' — from Day 11!" },
      { question: "'I ___ to the market yesterday.' (go)", options: ["go", "goes", "went", "going"], correctIndex: 2, explanation: "Past tense of 'go' is 'went' — from Day 20!" },
      { question: "'This book is ___ than that one.' (good)", options: ["gooder", "more good", "better", "best"], correctIndex: 2, explanation: "Good → Better → Best — from Day 22!" },
      { question: "You completed 30 days! What should you do next?", options: ["Stop learning", "Continue practicing", "Forget everything", "Give up"], correctIndex: 1, explanation: "Never stop learning! Continue practicing to become fluent. You're amazing! 🎉" },
    ],
  },
];

// Intermediate and Advanced Lesson Generation
const generateDynamicLesson = (day: number): LessonDay => {
  const isIntermediate = day >= 31 && day <= 60;
  
  // Intermediate content pools (Days 31-60)
  const intermediateTopics = [
    { topic: "Workplace Greetings & Small Talk", telugu: "కార్యాలయ పలకరింపులు & చిన్న సంభాషణలు", desc: "Learn to introduce yourself and make small talk with colleagues at work." },
    { topic: "Grammar: Present Perfect vs Past Simple", telugu: "ప్రెసెంట్ పర్ఫెక్ట్ వర్సెస్ పాస్ట్ సింపుల్", desc: "Master when to use 'I have done' versus 'I did' in professional contexts." },
    { topic: "Writing Professional Emails", telugu: "వృత్తిపరమైన ఇమెయిల్‌లు రాయడం", desc: "Learn the structure, greetings, and common phrases for business emails." },
    { topic: "Participating in Group Discussions", telugu: "గ్రూప్ డిస్కషన్లలో పాల్గొనడం", desc: "Learn how to express points, agree, and disagree politely in meetings." },
    { topic: "Grammar: Modal Verbs of Obligation", telugu: "మోడల్ వెర్బ్స్ ఆఫ్ ఆబ్లిగేషన్", desc: "Learn to use 'must', 'should', and 'have to' to describe rules and advice." },
    { topic: "Making Polite Requests & Offers", telugu: "వినమ్రమైన అభ్యర్థనలు & ఆఫర్లు", desc: "Practice using 'Would you mind', 'Could you', and 'May I' in workplace settings." },
    { topic: "Describing Job Roles & Responsibilities", telugu: "ఉద్యోగ పాత్రలు & బాధ్యతలను వివరించడం", desc: "Learn vocabulary to explain your daily tasks and job functions clearly." },
    { topic: "Grammar: Conditionals (First & Second)", telugu: "కండిషనల్స్ (ఫస్ట్ & సెకండ్)", desc: "Learn to discuss real possibilities and hypothetical scenarios ('If I win...')." },
    { topic: "Handling Phone Calls at Work", telugu: "పనిలో ఫోన్ కాల్స్ మాట్లాడటం", desc: "Learn professional telephone etiquette and standard answering phrases." },
    { topic: "Giving and Receiving Feedback", telugu: "అభిప్రాయాన్ని ఇవ్వడం మరియు స్వీకరించడం", desc: "Master constructive feedback phrasing in workplace interactions." }
  ];

  // Advanced content pools (Days 61-90)
  const advancedTopics = [
    { topic: "Advanced Vocabulary: Idioms & Phrasal Verbs", telugu: "ఐడియమ్స్ & ఫ్రేసల్ వెర్బ్స్", desc: "Learn common English idioms and phrasal verbs used in business meetings." },
    { topic: "Public Speaking & Pitching Ideas", telugu: "బహిరంగ ప్రసంగం & ఆలోచనలను పిచ్ చేయడం", desc: "Master hooks, body language, and vocal variety for public presentations." },
    { topic: "Presentation Skills: Structured Delivery", telugu: "ప్రెజెంటేషన్ నైపుణ్యాలు", desc: "Learn to organize a slide presentation and transition smoothly between points." },
    { topic: "HR Interview Prep: Answering 'Tell Me About Yourself'", telugu: "HR ఇంటర్వ్యూ: మీ గురించి చెప్పండి", desc: "Craft a high-impact self-introduction using the Present-Past-Future framework." },
    { topic: "Technical Interview Prep: Explaining Projects", telugu: "టెక్నికల్ ఇంటర్వ్యూ: ప్రాజెక్ట్‌లను వివరించడం", desc: "Practice explaining technical architectures, challenges, and solutions clearly." },
    { topic: "Advanced Grammar: Passive Voice & Indirect Speech", telugu: "ప్యాసివ్ వాయిస్ & ఇండైరెక్ట్ స్పీచ్", desc: "Learn when to use passive structures and how to report conversations formally." },
    { topic: "Negotiation Skills & Persuasion", telugu: "చర్చల నైపుణ్యాలు & ఒప్పించడం", desc: "Learn persuasive phrases and strategies to negotiate salaries or project terms." },
    { topic: "Debating Complex Issues", telugu: "సంక్లిష్టమైన సమస్యలపై చర్చించడం", desc: "Practice structuring arguments, presenting statistics, and refuting points." },
    { topic: "Acing Leadership Interviews", telugu: "నాయకత్వ ఇంటర్వ్యూలను ఎదుర్కోవడం", desc: "Learn how to answer situational and behavioral questions using the STAR method." },
    { topic: "Advanced Writing: Reports & Summaries", telugu: "నివేదికలు & సారాంశాలు రాయడం", desc: "Learn to write executive summaries and formal project reports in English." }
  ];

  const pool = isIntermediate ? intermediateTopics : advancedTopics;
  const poolIndex = (day - 31) % pool.length;
  const selected = pool[poolIndex];

  // Derive vocabulary, sentences, and quiz questions dynamically based on day
  const levelText = isIntermediate ? "Intermediate" : "Advanced";
  
  return {
    day,
    topic: `${selected.topic}`,
    description: selected.desc,
    teluguHint: selected.telugu,
    vocabulary: [
      { word: `Colleague (Day ${day})`, meaning: "A person you work with", pronunciation: "KOL-eeg", example: "I have lunch with my colleagues." },
      { word: `Task (Day ${day})`, meaning: "A piece of work to be done", pronunciation: "TASK", example: "Please complete this task today." },
      { word: `Deadline (Day ${day})`, meaning: "The time by which something must be finished", pronunciation: "DED-line", example: "We must meet the project deadline." },
      { word: `Meeting (Day ${day})`, meaning: "An assembly of people for discussion", pronunciation: "MEE-ting", example: "We have a meeting at 10 AM." },
      { word: `Feedback (Day ${day})`, meaning: "Information about reactions to a product or performance", pronunciation: "FEED-bak", example: "The manager gave helpful feedback." }
    ],
    grammar: {
      title: `${selected.topic} Grammar Focus`,
      explanation: `Today we focus on language structures for ${selected.topic.toLowerCase()}. In professional ${levelText.toLowerCase()} English, clarity and politeness are key. Use helping verbs and conditional statements to convey confidence and courtesy.`,
      structure: isIntermediate ? "Subject + Verb (Intermediate Form) + Object" : "Passive/Formal Advanced Clause Structure",
      examples: [
        `Could you please review the task?`,
        `If we finish by Friday, we will meet the deadline.`,
        `The project was completed successfully by the team.`
      ]
    },
    practiceSentences: [
      { english: `I am currently working on this task.`, telugu: "నేను ప్రస్తుతం ఈ పనిపై పని చేస్తున్నాను." },
      { english: `Could we reschedule the meeting to tomorrow?`, telugu: "మనం సమావేశాన్ని రేపటికి మార్చవచ్చా?" },
      { english: `Thank you for your constructive feedback.`, telugu: "మీ నిర్మాణాత్మక అభిప్రాయానికి ధన్యవాదాలు." }
    ],
    speakingTask: {
      instruction: `Read the practice sentences aloud. Then give a short 1-minute summary on: 'How I manage my daily tasks at work/school.'`,
      exampleAnswer: `In my daily routine, I start by listing all my tasks. I prioritize them based on deadlines. I cooperate with my colleagues and keep my manager updated. I find this helps me work efficiently.`
    },
    writingTask: {
      instruction: `Write a short paragraph (5-8 sentences) about how you handle deadlines and tasks.`,
      hint: "Use words like: first, priority, deadlines, colleague, collaborate."
    },
    quiz: [
      { question: `Which word means 'a person you work with'?`, options: ["Boss", "Client", "Colleague", "Competitor"], correctIndex: 2, explanation: "A colleague is someone who works in the same organization as you." },
      { question: `Complete: 'We must finish this before the ___.'`, options: ["Meeting", "Deadline", "Task", "Feedback"], correctIndex: 1, explanation: "A deadline is the limit date/time by which a task must be done." },
      { question: `Which is a polite request?`, options: ["Do this now.", "Give me the file.", "Could you please do this?", "I want the file."], correctIndex: 2, explanation: "'Could you please...' is a standard polite workplace request form." }
    ]
  };
};

// Generate Days 31 to 90
const dynamicLessons: LessonDay[] = [];
for (let d = 31; d <= 90; d++) {
  dynamicLessons.push(generateDynamicLesson(d));
}

export const lessons: LessonDay[] = [...handcraftedLessons, ...dynamicLessons];

