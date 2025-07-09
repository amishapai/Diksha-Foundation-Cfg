import pandas as pd
import numpy as np
import pickle
import re
import warnings
warnings.filterwarnings('ignore')
from dotenv import load_dotenv
import os

load_dotenv()  # Load environment variables from .env
api_key = os.getenv("GEMINI_API_KEY")  # Read the key

from transformers import (
    AutoModelForSequenceClassification, 
    AutoTokenizer, 
    AutoConfig,
    pipeline
)
from scipy.special import softmax
import torch

class EnhancedSentimentPredictor:
    def __init__(self, model_path='enhanced_sentiment_model.pkl'):
        """Load the enhanced model configuration and initialize transformers"""
        try:
            # Load model configuration
            with open(model_path, 'rb') as f:
                model_data = pickle.load(f)
            
            self.sentiment_model_name = model_data['sentiment_model_name']
            self.emotion_model_name = model_data['emotion_model_name']
            self.concern_patterns = model_data['concern_patterns']
            self.concern_emotion_mapping = model_data['concern_emotion_mapping']
            
            print("Loading pre-trained transformer models...")
            
            # Initialize RoBERTa sentiment model
            self.sentiment_tokenizer = AutoTokenizer.from_pretrained(self.sentiment_model_name)
            self.sentiment_config = AutoConfig.from_pretrained(self.sentiment_model_name)
            self.sentiment_model = AutoModelForSequenceClassification.from_pretrained(self.sentiment_model_name)
            
            # Initialize emotion model
            self.emotion_classifier = pipeline(
                "text-classification",
                model=self.emotion_model_name,
                return_all_scores=True
            )
            
            print("Enhanced models loaded successfully!")
            
        except FileNotFoundError:
            print(f"Error: Model file '{model_path}' not found!")
            print("Please run the enhanced training script first to create the model.")
            raise
        except Exception as e:
            print(f"Error loading model: {e}")
            raise
    
    def preprocess_text(self, text):
        """Preprocess text for transformer models"""
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
        encoded_input = self.sentiment_tokenizer(
            processed_text, 
            return_tensors='pt', 
            truncation=True, 
            max_length=512,
            padding=True
        )
        
        with torch.no_grad():
            output = self.sentiment_model(**encoded_input)
        
        scores = output.logits[0].detach().numpy()
        scores = softmax(scores)
        
        # Get the prediction
        predicted_class_id = np.argmax(scores)
        predicted_label = self.sentiment_config.id2label[predicted_class_id]
        confidence = scores[predicted_class_id] * 100
        
        # Convert label format (LABEL_0 -> negative, etc.)
        label_mapping = {
            'LABEL_0': 'negative',
            'LABEL_1': 'neutral', 
            'LABEL_2': 'positive'
        }
        
        mapped_label = label_mapping.get(predicted_label, predicted_label.lower())
        
        return mapped_label, confidence
    
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
    
    def analyze_sentiment(self, text):
        """Main analysis function that returns formatted results"""
        if not text or text.strip() == "":
            return self.create_error_table("Empty input provided")
        
        try:
            # Sentiment analysis using RoBERTa
            sentiment, sent_conf = self.analyze_sentiment_roberta(text)
            
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
                emot_conf = 95.0  # High confidence for pattern-matched concerns
            
            # Create results table
            results_table = self.create_results_table(
                sentiment, sent_conf, emotion, emot_conf, flag, text, concern_type, risk_level
            )
            
            return results_table
            
        except Exception as e:
            return self.create_error_table(f"Error during analysis: {str(e)}")
    
    def create_results_table(self, sentiment, sentiment_conf, emotion, emotion_conf, flag, original_text, concern_type=None, risk_level=None):
        """Create formatted results table"""
        
        # Prepare the data
        analysis_types = ['Sentiment', 'Emotion', 'Flag Status']
        results = [sentiment.upper(), emotion.upper(), flag]
        confidences = [f"{sentiment_conf:.1f}%", f"{emotion_conf:.1f}%", "-"]
        
        # Add concern information if present
        if concern_type:
            analysis_types.append('Mental Health Concern')
            results.append(concern_type.replace('_', ' ').upper())
            confidences.append(f"Risk: {risk_level}")
        
        # Create the data for the table
        data = {
            'Analysis Type': analysis_types,
            'Result': results,
            'Confidence (%)': confidences
        }
        
        # Create DataFrame
        df = pd.DataFrame(data)
        
        # Create summary with additional information
        summary = f"""
ENHANCED SENTIMENT ANALYSIS RESULTS
{'='*50}
Input Text: "{original_text}"
{'='*50}"""
        
        if concern_type:
            summary += f"""
⚠️  MENTAL HEALTH CONCERN DETECTED ⚠️ 
Concern Type: {concern_type.replace('_', ' ').title()}
Risk Level: {risk_level}
{'='*50}"""
        
        return summary, df
    
    def create_error_table(self, error_message):
        """Create error table"""
        data = {
            'Analysis Type': ['Error'],
            'Result': [error_message],
            'Confidence (%)': ['-']
        }
        
        df = pd.DataFrame(data)
        summary = f"""
ENHANCED SENTIMENT ANALYSIS RESULTS
{'='*50}
ERROR: {error_message}
{'='*50}
"""
        return summary, df
    
    def print_results(self, text):
        """Print formatted results"""
        summary, table = self.analyze_sentiment(text)
        
        print(summary)
        print(table.to_string(index=False))
        print("\n" + "="*50)
        
        return table

def main():
    """Main function for interactive use"""
    try:
        # Initialize predictor
        predictor = EnhancedSentimentPredictor()
        
        print("\n" + "="*70)
        print("ENHANCED SENTIMENT & EMOTION ANALYSIS SYSTEM")
        print("Powered by Transformer Models (RoBERTa + DistilRoBERTa)")
        print("="*70)
        print("Enter text to analyze sentiment, emotion, and mental health concerns.")
        print("Type 'quit' to exit.")
        print("="*70)
        
        while True:
            # Get user input
            text = input("\nEnter text to analyze: ").strip()
            
            if text.lower() in ['quit', 'exit', 'q']:
                print("Goodbye!")
                break
            
            if not text:
                print("Please enter some text to analyze.")
                continue
            
            # Analyze and print results
            result_table = predictor.print_results(text)
            
    except KeyboardInterrupt:
        print("\n\nProgram interrupted by user. Goodbye!")
    except Exception as e:
        print(f"An error occurred: {e}")
        print("Make sure you have run the enhanced training script first.")

# Function for direct use in other scripts
def analyze_text(text, model_path='enhanced_sentiment_model.pkl'):
    """
    Direct function to analyze text sentiment and emotion with enhanced accuracy
    
    Args:
        text (str): Text to analyze
        model_path (str): Path to the enhanced model file
    
    Returns:
        tuple: (summary_string, pandas_dataframe)
    """
    predictor = EnhancedSentimentPredictor(model_path)
    return predictor.analyze_sentiment(text)

# Example usage functions
def demo_analysis():
    """Demonstrate the enhanced analysis with sample texts"""
    predictor = EnhancedSentimentPredictor()
    
    sample_texts = [
        "I want to kill myself",
        "I can't do this anymore I'm done",
        "I'm too sad", 
        "I am very scared I can't do this",
        "I absolutely love this amazing product! It's fantastic!",
        "This is terrible and I hate it completely!",
        "The weather today is quite normal and average.",
        "I'm having thoughts of self-harm",
        "I feel hopeless and worthless",
        "I'm so excited about this opportunity!"
    ]
    
    print("DEMONSTRATION OF ENHANCED SENTIMENT ANALYSIS")
    print("="*70)
    
    for i, text in enumerate(sample_texts, 1):
        print(f"\nExample {i}:")
        predictor.print_results(text)

if __name__ == "__main__":
    # Uncomment the line below to run demo instead of interactive mode
    # demo_analysis()
    main()