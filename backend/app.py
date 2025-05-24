from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import speech_recognition as sr
from gtts import gTTS
import io
from pydub import AudioSegment
from pydub.utils import which
import language_tool_python

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Set path to ffmpeg
AudioSegment.converter = r"C:\Users\akshi\AppData\ffmpeg-7.1.1-essentials_build\bin\ffmpeg.exe"

# Initialize recognizer and grammar tool
recognizer = sr.Recognizer()
tool = language_tool_python.LanguageTool('en-US', remote_server='http://localhost:8081')


# Grammar correction helper
def correct_grammar(text):
    matches = tool.check(text)
    return language_tool_python.utils.correct(text, matches)

# Route for audio analysis
@app.route('/analyze', methods=['POST'])
def analyze():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files['audio']

    try:
        # Convert webm to wav
        audio = AudioSegment.from_file(audio_file, format="webm")
        wav_io = io.BytesIO()
        audio.export(wav_io, format="wav")
        wav_io.seek(0)

        # Speech recognition
        with sr.AudioFile(wav_io) as source:
            audio_data = recognizer.record(source)
            text = recognizer.recognize_google(audio_data)

        # Grammar correction
        corrected = correct_grammar(text)

        # Text-to-speech (corrected output)
        tts = gTTS(corrected)
        audio_io = io.BytesIO()
        tts.write_to_fp(audio_io)
        audio_io.seek(0)

        # Return mp3 response
        return send_file(audio_io, mimetype='audio/mpeg')

    except sr.UnknownValueError:
        return jsonify({"error": "Speech Recognition could not understand audio"}), 400
    except sr.RequestError as e:
        return jsonify({"error": f"Speech Recognition request error: {e}"}), 500
    except Exception as e:
        return jsonify({"error": f"Internal server error: {e}"}), 500

# if __name__ == "__main__":
#     app.run(debug=True, port=5000)

if __name__ == '__main__':
    sentence = "She go to school every day."
    print("Corrected:", correct_grammar(sentence))
    app.run(debug=True, port=5001)

