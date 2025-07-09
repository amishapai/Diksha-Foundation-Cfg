import google.generativeai as genai
import json
import datetime
from fpdf import FPDF
import os
import re
from typing import List, Dict
from dotenv import load_dotenv
class ChildAssessmentBot:
    def __init__(self, api_key: str):
        """Initialize the assessment bot with Gemini API"""
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash-exp')
        self.conversation_history = []
        self.child_responses = []
        self.question_count = 0
        self.assessment_complete = False
        self.detected_language = "english"  # Track primary language
        self.language_pattern = "mixed"     # Track if user mixes languages
        
        # Core assessment prompt for the AI with multilingual support
        self.system_prompt = """
        You are a friendly, supportive AI counselor conducting an assessment conversation with a child aged 9-12 from India. 
        Your goal is to assess three key attributes: CONFIDENCE, LEADERSHIP, and CREATIVITY through natural conversation.
        
        LANGUAGE GUIDELINES:
        - You MUST respond in the SAME language the child uses
        - If they speak in Hindi, respond in Hindi
        - If they speak in English, respond in English  
        - If they use Hinglish (Hindi written in English), respond in Hinglish
        - If they mix languages, you can mix too but maintain the same proportion
        - Always detect the language pattern and maintain consistency
        - Use age-appropriate vocabulary in the language they choose
        
        ASSESSMENT GUIDELINES:
        1. Always start with "How are you feeling today?" (in their preferred language after detection)
        2. Ask follow-up questions based on their responses to keep the conversation engaging
        3. Gradually incorporate questions that reveal confidence, leadership, and creativity
        4. Ask at least 10 meaningful questions before concluding
        5. Be warm, encouraging, and age-appropriate
        6. Show genuine interest in their responses
        7. Adapt cultural context to Indian school/home environment
        
        CONFIDENCE ASSESSMENT AREAS:
        - How they handle challenges and setbacks (परेशानियों से कैसे निपटते हैं)
        - Their willingness to try new things (नई चीज़ें करने की इच्छा)
        - How they feel about speaking up in class (क्लास में बोलने में कैसा लगता है)
        - Their self-perception and self-worth (अपने बारे में क्या सोचते हैं)
        - How they handle mistakes or criticism (गलतियों को कैसे संभालते हैं)
        
        LEADERSHIP ASSESSMENT AREAS:
        - How they work in groups (ग्रुप में काम कैसे करते हैं)
        - Whether they take initiative (पहल करते हैं या नहीं)
        - How they help others (दूसरों की मदद कैसे करते हैं)
        - Their ability to make decisions (फैसले लेने की क्षमता)
        - Whether they stand up for what they believe in (अपनी बात के लिए खड़े होते हैं)
        
        CREATIVITY ASSESSMENT AREAS:
        - How they approach problem-solving (समस्याओं का समाधान कैसे करते हैं)
        - Their interests in arts, writing, or creative activities (कला, लेखन में रुचि)
        - How they think outside the box (अलग तरीके से सोचना)
        - Their imagination and original thinking (कल्पनाशीलता)
        - How they express themselves (अपनी अभिव्यक्ति)
        
        Keep responses conversational and under 2-3 sentences unless the child needs more detailed guidance.
        Remember their previous answers and reference them naturally in follow-up questions.
        Be culturally sensitive and use appropriate examples from Indian context.
        
        Detected language pattern: {language_pattern}
        Current conversation context: {context}
        """

    def detect_language(self, text: str) -> str:
        """Detect the primary language of the input text"""
        # Hindi unicode range detection
        hindi_chars = len(re.findall(r'[\u0900-\u097F]', text))
        
        # English alphabet detection
        english_chars = len(re.findall(r'[a-zA-Z]', text))
        
        # Common Hinglish words (Hindi words written in English)
        hinglish_words = [
            'hai', 'hoon', 'mein', 'tumhara', 'tumhari', 'mera', 'meri', 'kya', 'kaun', 'kahan', 
            'kab', 'kyun', 'kaise', 'achha', 'accha', 'theek', 'thik', 'nahi', 'nahin', 'haan',
            'ji', 'bhai', 'didi', 'yaar', 'dost', 'ghar', 'school', 'padhna', 'padhai', 'exam',
            'teacher', 'sir', 'madam', 'mummy', 'papa', 'family', 'friends', 'matlab', 'samjha',
            'samjhi', 'pata', 'maloom', 'dekho', 'suno', 'bolo', 'karo', 'jana', 'aana', 'khana',
            'paani', 'time', 'bas', 'bilkul', 'sach', 'jhooth', 'kitna', 'kitni', 'bohot', 'bahut'
        ]
        
        # Convert to lowercase for checking
        text_lower = text.lower()
        hinglish_count = sum(1 for word in hinglish_words if word in text_lower)
        
        total_chars = hindi_chars + english_chars
        
        if total_chars == 0:
            return "mixed"
        
        # Determine language based on character distribution and hinglish words
        if hindi_chars > 0 and hindi_chars / total_chars > 0.3:
            return "hindi"
        elif hinglish_count >= 2 or (hinglish_count >= 1 and english_chars > 0):
            return "hinglish"
        elif english_chars > 0:
            return "english"
        else:
            return "mixed"

    def get_initial_question(self) -> str:
        """Get the initial question in appropriate language"""
        questions = {
            "english": "How are you feeling today?",
            "hindi": "आज आप कैसा महसूस कर रहे हैं?", 
            "hinglish": "Aaj aap kaisa feel kar rahe hain?",
            "mixed": "How are you feeling today? / आज कैसा लग रहा है?"
        }
        return questions.get(self.detected_language, questions["english"])

    def start_conversation(self):
        """Start the assessment conversation"""
        print("🌟 Welcome to your daily check-in! / आपके दैनिक चेक-इन में आपका स्वागत है! 🌟")
        print("I'm here to chat with you and learn more about your day and experiences.")
        print("मैं यहाँ आपसे बात करने और आपके दिन के बारे में जानने के लिए हूँ।")
        print("Let's have a friendly conversation! / चलिए एक दोस्ताना बातचीत करते हैं!\n")
        
        # Start with language detection question
        first_question = "How are you feeling today? / आज आप कैसा महसूस कर रहे हैं?"
        print(f"AI: {first_question}")
        
        # Get the first response to detect language
        first_response = input("\nYou: ").strip()
        if first_response:
            self.detected_language = self.detect_language(first_response)
            self.language_pattern = self.detected_language
            
            # Store first response
            self.child_responses.append({
                'question_number': 1,
                'response': first_response,
                'timestamp': datetime.datetime.now().isoformat(),
                'detected_language': self.detected_language
            })
            
            # Generate appropriate response and continue
            self.generate_response_and_continue(first_response)
        else:
            print("AI: मुझे आपके विचार सुनना अच्छा लगेगा! / I'd love to hear your thoughts!")
            self.start_conversation()
    
    def generate_response_and_continue(self, user_response: str):
        """Generate response and continue conversation"""
        context = self.build_context()
        
        try:
            prompt = self.system_prompt.format(
                language_pattern=self.language_pattern, 
                context=context
            ) + f"\n\nChild's response (in {self.detected_language}): {user_response}\n\nProvide your next question or response in the SAME language pattern (Question #{self.question_count + 1}):"
            
            response = self.model.generate_content(prompt)
            ai_response = response.text.strip()
            
            # Store conversation
            self.conversation_history.append({
                'user': user_response,
                'ai': ai_response,
                'question_number': self.question_count + 1,
                'user_language': self.detected_language
            })
            
            print(f"\nAI: {ai_response}")
            self.question_count += 1
            
            # Continue conversation
            if self.question_count < 10:
                self.conduct_conversation()
            else:
                self.conclude_conversation()
                
        except Exception as e:
            print(f"Error generating response: {e}")
            fallback_msg = {
                "english": "I'm having trouble right now. Could you tell me more about that?",
                "hindi": "मुझे अभी कुछ परेशानी हो रही है। क्या आप इसके बारे में और बता सकते हैं?",
                "hinglish": "Mujhe abhi thoda problem ho raha hai. Aap iske baare mein aur bata sakte hain?",
                "mixed": "I'm having trouble / मुझे परेशानी हो रही है। Could you tell me more?"
            }
            print(f"AI: {fallback_msg.get(self.detected_language, fallback_msg['english'])}")
            self.conduct_conversation()

    def conduct_conversation(self):
        """Main conversation loop"""
        while self.question_count < 10 and not self.assessment_complete:
            # Get user input
            user_response = input("\nYou: ").strip()
            
            if not user_response:
                empty_prompts = {
                    "english": "I'd love to hear your thoughts! Please share what's on your mind.",
                    "hindi": "मुझे आपके विचार सुनना अच्छा लगेगा! कृपया बताएं कि आपके मन में क्या है।",
                    "hinglish": "Mujhe aapke thoughts sunna achha lagega! Please share kya chal raha hai mind mein.",
                    "mixed": "मुझे आपके thoughts सुनना अच्छा लगेगा! Please share what's on your mind."
                }
                print(f"AI: {empty_prompts.get(self.detected_language, empty_prompts['english'])}")
                continue
            
            # Update language detection for this response
            current_lang = self.detect_language(user_response)
            if current_lang != self.detected_language:
                self.language_pattern = "mixed"
            
            # Store the child's response
            self.child_responses.append({
                'question_number': self.question_count + 1,
                'response': user_response,
                'timestamp': datetime.datetime.now().isoformat(),
                'detected_language': current_lang
            })
            
            # Update context with conversation history
            context = self.build_context()
            
            # Generate AI response using Gemini
            try:
                prompt = self.system_prompt.format(
                    language_pattern=self.language_pattern,
                    context=context
                ) + f"\n\nChild's latest response (in {current_lang}): {user_response}\n\nProvide your next question or response in the SAME language as the child used (Question #{self.question_count + 1}):"
                
                response = self.model.generate_content(prompt)
                ai_response = response.text.strip()
                
                # Store conversation
                self.conversation_history.append({
                    'user': user_response,
                    'ai': ai_response,
                    'question_number': self.question_count + 1,
                    'user_language': current_lang
                })
                
                print(f"\nAI: {ai_response}")
                self.question_count += 1
                
            except Exception as e:
                print(f"Error generating response: {e}")
                fallback_msg = {
                    "english": "I'm having trouble right now. Could you tell me more about that?",
                    "hindi": "मुझे अभी कुछ परेशानी हो रही है। क्या आप इसके बारे में और बता सकते हैं?",
                    "hinglish": "Mujhe abhi thoda problem ho raha hai. Aap iske baare mein aur bata sakte hain?",
                    "mixed": "I'm having trouble / मुझे परेशानी हो रही है। Could you tell me more?"
                }
                print(f"AI: {fallback_msg.get(current_lang, fallback_msg['english'])}")
        
        # After 10 questions, conclude and assess
        if self.question_count >= 10:
            self.conclude_conversation()
    
    def build_context(self) -> str:
        """Build context from conversation history"""
        context_parts = []
        for entry in self.conversation_history[-5:]:  # Last 5 exchanges for context
            context_parts.append(f"Child said: {entry['user']}")
            context_parts.append(f"AI responded: {entry['ai']}")
        return "\n".join(context_parts)
    
    def conclude_conversation(self):
        """Conclude the conversation and generate assessment"""
        closing_messages = {
            "english": "Thank you so much for sharing with me today! You've given me some wonderful insights.",
            "hindi": "आज मेरे साथ साझा करने के लिए बहुत-बहुत धन्यवाद! आपने मुझे कुछ बेहतरीन अंतर्दृष्टि दी है।",
            "hinglish": "Aaj mere saath share karne ke liye bahut dhanyawad! Aapne mujhe kuch wonderful insights di hain.",
            "mixed": "Thank you / धन्यवाद for sharing with me today! You've given wonderful insights."
        }
        
        processing_messages = {
            "english": "Give me a moment to prepare a summary of our conversation...",
            "hindi": "हमारी बातचीत का सारांश तैयार करने के लिए मुझे एक क्षण दें...",
            "hinglish": "Hamari conversation ka summary prepare karne ke liye mujhe ek moment dijiye...",
            "mixed": "Give me a moment / एक क्षण दें to prepare summary..."
        }
        
        print(f"\nAI: {closing_messages.get(self.detected_language, closing_messages['english'])}")
        print(f"{processing_messages.get(self.detected_language, processing_messages['english'])}")
        
        # Generate assessment
        self.generate_assessment()
    
    def generate_assessment(self):
        """Generate detailed assessment using Gemini"""
        assessment_prompt = f"""
        Based on the following multilingual conversation with a child aged 9-12 from India, provide a detailed assessment of their:
        1. CONFIDENCE level (आत्मविश्वास)
        2. LEADERSHIP qualities (नेतृत्व गुण)
        3. CREATIVITY traits (रचनात्मकता)
        
        The child communicated primarily in: {self.detected_language}
        Language mixing pattern: {self.language_pattern}
        
        Conversation data:
        {json.dumps(self.child_responses, indent=2)}
        
        For each attribute, provide (in both English and Hindi):
        - A score from 1-10 (where 10 is highest)
        - 2-3 specific examples from their responses that support this score
        - 2-3 recommendations for growth in this area (culturally appropriate for Indian context)
        - Positive reinforcement highlighting their strengths
        
        Consider cultural context:
        - Indian family dynamics and expectations
        - School environment in India
        - Age-appropriate activities for Indian teenagers
        - Language preferences and comfort level
        
        Format the response as a structured assessment report that would be appropriate for Indian parents/teachers.
        Be encouraging and constructive, focusing on growth opportunities rather than deficits.
        Include observations about their language comfort and communication style.
        """
        
        try:
            response = self.model.generate_content(assessment_prompt)
            assessment_text = response.text.strip()
            
            # Generate reports
            self.save_assessment_report(assessment_text)
            
            completion_messages = {
                "english": "Assessment complete! Reports have been generated.",
                "hindi": "मूल्यांकन पूरा हो गया! रिपोर्ट तैयार की गई है।",
                "hinglish": "Assessment complete ho gaya! Reports generate ho gayi hain.",
                "mixed": "Assessment complete! / मूल्यांकन पूरा! Reports generated."
            }
            print(f"\n✅ {completion_messages.get(self.detected_language, completion_messages['english'])}")
            
        except Exception as e:
            print(f"Error generating assessment: {e}")
    
    def save_assessment_report(self, assessment_text: str):
        """Save assessment as both PDF and TXT with multilingual support"""
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Save as TXT with UTF-8 encoding for multilingual support
        txt_filename = f"child_assessment_{timestamp}.txt"
        with open(txt_filename, 'w', encoding='utf-8') as f:
            f.write("CHILD DEVELOPMENT ASSESSMENT REPORT / बाल विकास मूल्यांकन रिपोर्ट\n")
            f.write("=" * 70 + "\n\n")
            f.write(f"Date / दिनांक: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"Primary Language Detected / मुख्य भाषा: {self.detected_language}\n")
            f.write(f"Language Pattern / भाषा पैटर्न: {self.language_pattern}\n\n")
            f.write("CONVERSATION RESPONSES / बातचीत के उत्तर:\n")
            f.write("-" * 50 + "\n\n")
            
            for i, response in enumerate(self.child_responses, 1):
                f.write(f"Response {i} (Language: {response.get('detected_language', 'unknown')}): {response['response']}\n\n")
            
            f.write("\nASSESSMENT RESULTS / मूल्यांकन परिणाम:\n")
            f.write("-" * 50 + "\n\n")
            f.write(assessment_text)
        
        # Save as PDF with Unicode support
        try:
            self.create_multilingual_pdf_report(assessment_text, timestamp)
        except Exception as e:
            print(f"PDF creation failed: {e}")
            print(f"TXT report saved as: {txt_filename}")
    
    def create_multilingual_pdf_report(self, assessment_text: str, timestamp: str):
        """Create PDF report with basic multilingual support"""
        try:
            from fpdf import FPDF
            
            class MultilingualPDF(FPDF):
                def header(self):
                    self.set_font('Arial', 'B', 15)
                    self.cell(0, 10, 'Child Development Assessment Report', 0, 1, 'C')
                    self.ln(5)
            
            pdf = MultilingualPDF()
            pdf.add_page()
            pdf.set_font("Arial", size=12)
            
            # Basic info
            pdf.cell(0, 10, f"Date: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", ln=True)
            pdf.cell(0, 10, f"Primary Language: {self.detected_language}", ln=True)
            pdf.cell(0, 10, f"Language Pattern: {self.language_pattern}", ln=True)
            pdf.ln(5)
            
            # Conversation responses
            pdf.set_font("Arial", "B", 14)
            pdf.cell(0, 10, "Conversation Responses:", ln=True)
            pdf.set_font("Arial", size=10)
            
            for i, response in enumerate(self.child_responses, 1):
                pdf.ln(3)
                # Handle both English and transliterated text
                response_text = f"Q{i} ({response.get('detected_language', 'unknown')}): {response['response']}"
                # Convert non-ASCII characters for PDF compatibility
                safe_text = response_text.encode('ascii', 'ignore').decode('ascii')
                if len(safe_text) < len(response_text):
                    safe_text += " [Contains multilingual text - see TXT file for complete version]"
                pdf.multi_cell(0, 5, safe_text)
            
            pdf.ln(10)
            
            # Assessment results
            pdf.set_font("Arial", "B", 14)
            pdf.cell(0, 10, "Assessment Results:", ln=True)
            pdf.set_font("Arial", size=10)
            
            # Handle assessment text
            assessment_lines = assessment_text.split('\n')
            for line in assessment_lines:
                if line.strip():
                    # Convert non-ASCII characters for PDF compatibility
                    safe_line = line.encode('ascii', 'ignore').decode('ascii')
                    if len(safe_line) < len(line):
                        safe_line += " [Multilingual content - see TXT file]"
                    pdf.multi_cell(0, 5, safe_line)
            
            pdf_filename = f"child_assessment_{timestamp}.pdf"
            pdf.output(pdf_filename)
            print(f"Reports saved as: {pdf_filename} and {txt_filename}")
            print("Note: For complete multilingual content, please refer to the TXT file.")
            
        except Exception as e:
            print(f"PDF creation error: {e}")
            print("TXT report contains complete multilingual assessment.")

def main():
    """Main function to run the assessment"""
    print("🎯 Child Development Assessment Tool / बाल विकास मूल्यांकन उपकरण")
    print("=" * 60)
    print("This tool supports English, Hindi, and Hinglish responses!")
    print("यह उपकरण अंग्रेजी, हिंदी और हिंग्लिश उत्तरों का समर्थन करता है!")
    print("=" * 60)
    
    load_dotenv()  # Load environment variables from .env
    api_key = os.getenv("GEMINI_API_KEY")
    
    if not api_key:
        print("❌ API key is required to run this assessment.")
        print("❌ इस मूल्यांकन को चलाने के लिए API key आवश्यक है।")
        return
    
    try:
        # Initialize and start assessment
        bot = ChildAssessmentBot(api_key)
        bot.start_conversation()
        
    except Exception as e:
        print(f"❌ Error initializing the assessment: {e}")
        print("Please check your API key and internet connection.")
        print("कृपया अपनी API key और इंटरनेट कनेक्शन की जांच करें।")

if __name__ == "__main__":
    # Note: You'll need to install required packages:
    # pip install google-generativeai fpdf2
    main()