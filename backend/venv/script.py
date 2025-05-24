import language_tool_python
import speech_recognition as sr
import pyttsx3

# Initialize the engine
engine = pyttsx3.init()

# Initialize recognizer
recognizer = sr.Recognizer()

engine.setProperty('rate', 120)

voices = engine.getProperty('voices')
engine.setProperty('voice', voices[1].id)  # 0 = male, 1 = female 

#Intro
text1="Hello!!Iam you'r friend i will enhance your English speaking skills.we will discuss something"

# Speak it
engine.say(text1)
engine.runAndWait()

# Use microphone as source
with sr.Microphone() as source:
    print("🎤 Say something...")
    audio = recognizer.listen(source)

    try:
        # Recognize speech using Speech API
        text = recognizer.recognize_google(audio)
        print("You said:", text)
    except sr.UnknownValueError:
        print("❌ Could not understand audio")
    except sr.RequestError as e:
        print("Could not request results; {0}".format(e))

tool = language_tool_python.LanguageTool('en-US')

matches = tool.check(text)

corrected = language_tool_python.utils.correct(text, matches)

print("Original:", text)
print("Corrected:", corrected)
textLower=text.lower()
correctedLower=corrected.lower()
if textLower == correctedLower:
    updated1="Yes Its coorrect !! Say something to improve your english"
    # Speak it
    engine.say(updated1)
    engine.runAndWait()
else:
    updated2="You said wrong Its not"+text+"Its"+corrected
    # Speak it
    engine.say(updated2)
    engine.runAndWait()