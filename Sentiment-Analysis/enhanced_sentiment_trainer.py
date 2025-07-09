import pandas as pd
import numpy as np
import pickle
import re
import warnings
warnings.filterwarnings('ignore')

from transformers import (
    AutoModelForSequenceClassification, 
    AutoTokenizer, 
    AutoConfig,
    pipeline
)
from scipy.special import softmax
import torch

class EnhancedSentimentAnalyzer:
    def __init__(self):
        """Initialize with pre-trained transformer models"""
        print("Loading pre-trained models...")
        
        # RoBERTa model for sentiment (more accurate than basic sklearn)
        self.sentiment_model_name = "cardiffnlp/twitter-roberta-base-sentiment-latest"
        self.sentiment_tokenizer = AutoTokenizer.from_pretrained(self.sentiment_model_name)
        self.sentiment_config = AutoConfig.from_pretrained(self.sentiment_model_name)
        self.sentiment_model = AutoModelForSequenceClassification.from_pretrained(self.sentiment_model_name)
        
        # Emotion detection model
        self.emotion_model_name = "j-hartmann/emotion-english-distilroberta-base"
        self.emotion_classifier = pipeline(
            "text-classification",
            model=self.emotion_model_name,
            return_all_scores=True
        )
        
        # Mental health concern detection patterns
        self.concern_patterns = [
            # Suicide/Self-harm indicators
            r'\b(kill myself|suicide|end my life|want to die|don\'t want to live)\b',
            r'\b(hurt myself|harm myself|cut myself)\b',
            r'\b(can\'t go on|can\'t take it|give up|done with life)\b',
            
            # Depression indicators
            r'\b(can\'t do this|too hard|overwhelmed|hopeless)\b',
            r'\b(nothing matters|pointless|useless|worthless)\b',
            r'\b(tired of everything|exhausted|drained)\b',
            
            # Anxiety/Fear indicators
            r'\b(scared|terrified|afraid|anxious|worried sick)\b',
            r'\b(panic|can\'t breathe|heart racing)\b',
            
            # General distress
            r'\b(help me|save me|desperate|lost|alone)\b',
            r'\b(can\'t cope|breaking down|falling apart)\b'
        ]
        
        # Emotion mapping for mental health concerns
        self.concern_emotion_mapping = {
            'suicide': 'sadness',
            'self_harm': 'sadness', 
            'depression': 'sadness',
            'anxiety': 'fear',
            'panic': 'fear',
            'desperation': 'sadness',
            'anger_issues': 'anger'
        }
        
        print("Models loaded successfully!")
    
    def preprocess_text(self, text):
        """Preprocess text for transformer models"""
        # Basic preprocessing for transformers
        new_text = []
        for t in text.split(" "):
            t = '@user' if t.startswith('@') and len(t) > 1 else t
            t = 'http' if t.startswith('http') else t
            new_text.append(t)
        return " ".join(new_text)
    
    def detect_mental_health_concerns(self, text):
        """Detect mental health concerns using pattern matching"""
        text_lower = text.lower()
        
        concern_type = None
        concern_level = "NONE"
        
        # Check for concerning patterns
        for pattern in self.concern_patterns:
            if re.search(pattern, text_lower, re.IGNORECASE):
                if any(word in text_lower for word in ['kill', 'suicide', 'die', 'end my life']):
                    concern_type = 'suicide'
                    concern_level = "HIGH_RISK"
                elif any(word in text_lower for word in ['hurt myself', 'harm myself', 'cut']):
                    concern_type = 'self_harm'
                    concern_level = "HIGH_RISK"
                elif any(word in text_lower for word in ['can\'t do this', 'give up', 'done']):
                    concern_type = 'depression'
                    concern_level = "MODERATE_RISK"
                elif any(word in text_lower for word in ['scared', 'terrified', 'panic']):
                    concern_type = 'anxiety'
                    concern_level = "MODERATE_RISK"
                else:
                    concern_type = 'general_distress'
                    concern_level = "LOW_RISK"
                break
        
        return concern_type, concern_level
    
    def analyze_sentiment_roberta(self, text):
        """Analyze sentiment using RoBERTa model"""
        processed_text = self.preprocess_text(text)
        
        # Tokenize and get prediction
        encoded_input = self.sentiment_tokenizer(processed_text, return_tensors='pt', truncation=True, max_length=512)
        
        with torch.no_grad():
            output = self.sentiment_model(**encoded_input)
        
        scores = output.logits[0].detach().numpy()
        scores = softmax(scores)
        
        # Get the prediction
        predicted_class_id = np.argmax(scores)
        predicted_label = self.sentiment_config.id2label[predicted_class_id]
        confidence = scores[predicted_class_id] * 100
        
        return predicted_label, confidence, scores
    
    def analyze_emotion(self, text):
        """Analyze emotion using DistilRoBERTa emotion model"""
        try:
            results = self.emotion_classifier(text)
            
            # Get the top emotion
            top_emotion = max(results[0], key=lambda x: x['score'])
            emotion_label = top_emotion['label'].lower()
            emotion_confidence = top_emotion['score'] * 100
            
            return emotion_label, emotion_confidence
            
        except Exception as e:
            print(f"Emotion analysis error: {e}")
            return "unknown", 0.0
    
    def comprehensive_analysis(self, text):
        """Perform comprehensive sentiment and emotion analysis"""
        if not text or text.strip() == "":
            return {
                'sentiment': 'neutral',
                'sentiment_confidence': 0.0,
                'emotion': 'unknown',
                'emotion_confidence': 0.0,
                'flag': 'NONE',
                'concern_type': None,
                'risk_level': 'NONE'
            }
        
        try:
            # Sentiment analysis
            sentiment, sent_conf, sent_scores = self.analyze_sentiment_roberta(text)
            
            # Emotion analysis  
            emotion, emot_conf = self.analyze_emotion(text)
            
            # Mental health concern detection
            concern_type, risk_level = self.detect_mental_health_concerns(text)
            
            # Determine flag based on sentiment and concerns
            flag = "NONE"
            if concern_type:
                if risk_level == "HIGH_RISK":
                    flag = "URGENT_FLAG"
                elif risk_level == "MODERATE_RISK":
                    flag = "FLAG"
                else:
                    flag = "MONITOR"
            elif sentiment.lower() == 'negative' and sent_conf > 70:
                flag = "FLAG"
            
            # Override emotion if mental health concern detected
            if concern_type and concern_type in self.concern_emotion_mapping:
                emotion = self.concern_emotion_mapping[concern_type]
            
            return {
                'sentiment': sentiment,
                'sentiment_confidence': sent_conf,
                'emotion': emotion,
                'emotion_confidence': emot_conf,
                'flag': flag,
                'concern_type': concern_type,
                'risk_level': risk_level
            }
            
        except Exception as e:
            print(f"Analysis error: {e}")
            return {
                'sentiment': 'error',
                'sentiment_confidence': 0.0,
                'emotion': 'error',
                'emotion_confidence': 0.0,
                'flag': 'ERROR',
                'concern_type': None,
                'risk_level': 'NONE'
            }
    
    def save_model(self, filename='enhanced_sentiment_model.pkl'):
        """Save the model configuration and components"""
        model_data = {
            'sentiment_model_name': self.sentiment_model_name,
            'emotion_model_name': self.emotion_model_name,
            'concern_patterns': self.concern_patterns,
            'concern_emotion_mapping': self.concern_emotion_mapping,
            'version': '2.0_transformers'
        }
        
        with open(filename, 'wb') as f:
            pickle.dump(model_data, f)
        
        print(f"Enhanced model configuration saved as {filename}")
        print("Note: Transformer models are downloaded and cached by Hugging Face automatically")

def main():
    """Main training/setup function"""
    print("Initializing Enhanced Sentiment and Emotion Analyzer with Transformers...")
    print("This will download pre-trained models on first run...")
    
    try:
        analyzer = EnhancedSentimentAnalyzer()
        
        print("\nSaving model configuration...")
        analyzer.save_model()
        
        print("\nTesting with concerning sample inputs...")
        test_sentences = [
            "I want to kill myself",
            "I can't do this anymore I'm done", 
            "I'm too sad",
            "I am very scared I can't do this",
            "I love this amazing product!",
            "This is terrible and disappointing!",
            "The weather is okay today.",
            "I'm having thoughts of self-harm",
            "I feel hopeless and worthless"
        ]
        
        for sentence in test_sentences:
            result = analyzer.comprehensive_analysis(sentence)
            print(f"\nText: '{sentence}'")
            print(f"Sentiment: {result['sentiment']} ({result['sentiment_confidence']:.1f}%)")
            print(f"Emotion: {result['emotion']} ({result['emotion_confidence']:.1f}%)")
            print(f"Flag: {result['flag']}")
            if result['concern_type']:
                print(f"Concern: {result['concern_type']} (Risk: {result['risk_level']})")
        
        print("\n" + "="*60)
        print("SETUP COMPLETE!")
        print("The enhanced model is ready for use.")
        print("Run the prediction script to start analyzing text.")
        
    except Exception as e:
        print(f"Error during setup: {e}")
        print("Make sure you have internet connection for downloading models.")

if __name__ == "__main__":
    main()