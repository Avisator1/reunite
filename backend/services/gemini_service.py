from ollama import Client
from config import Config
import json
import base64
import tempfile
import os
from datetime import datetime

# Initialize Ollama client with custom host
client = Client(host=Config.OLLAMA_HOST)
OLLAMA_MODEL = Config.OLLAMA_MODEL

def analyze_item_for_matching(lost_item, found_items):
    """
    Match lost items with found items using rule-based algorithm.
    Returns list of matches with confidence scores.
    """
    # Use rule-based matching (no AI for now)
    return fallback_matching(lost_item, found_items)

def analyze_photo_similarity(image_bytes, found_item_description):
    """
    Use Ollama Vision to analyze if a photo matches a found item description.
    Returns similarity score and analysis.
    """
    try:
        # Truncate description to save tokens
        desc = found_item_description[:150] if len(found_item_description) > 150 else found_item_description
        prompt = f"Compare photo with: {desc}. Return JSON: {{\"match_confidence\":85,\"visual_similarities\":[\"color match\"],\"differences\":[],\"analysis\":\"brief\"}}"
        
        # Save image to temporary file for Ollama
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp_file:
            tmp_file.write(image_bytes)
            tmp_path = tmp_file.name
        
        try:
            response = client.chat(
                model=OLLAMA_MODEL,
                messages=[{
                    'role': 'user',
                    'content': prompt,
                    'images': [tmp_path]
                }]
            )
            
            result_text = response['message']['content'].strip()
            if result_text.startswith('```'):
                result_text = result_text.split('```')[1]
                if result_text.startswith('json'):
                    result_text = result_text[4:]
            result_text = result_text.strip()
            
            analysis = json.loads(result_text)
            return analysis
        finally:
            # Clean up temp file
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)
        
    except Exception as e:
        print(f"Error in Ollama photo analysis: {str(e)}")
        # Return neutral analysis if API fails
        return {
            "match_confidence": 50,
            "visual_similarities": ["Photo submitted - manual review recommended"],
            "differences": [],
            "analysis": "Photo submitted but AI analysis unavailable. Please review manually."
        }

def verify_claim_with_photo(image_bytes, lost_item_description, verification_question=None):
    """
    Use Ollama Vision to verify a claim by analyzing proof photo.
    """
    try:
        # Truncate description to save tokens
        desc = lost_item_description[:120] if len(lost_item_description) > 120 else lost_item_description
        prompt = f"Verify proof photo. Item: {desc}"
        if verification_question:
            q = verification_question[:80] if len(verification_question) > 80 else verification_question
            prompt += f" Q: {q}"
        prompt += ' Return JSON: {"verification_confidence":90,"is_valid_proof":true,"evidence_found":["feature"],"analysis":"brief"}'
        
        # Save image to temporary file for Ollama
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp_file:
            tmp_file.write(image_bytes)
            tmp_path = tmp_file.name
        
        try:
            response = client.chat(
                model=OLLAMA_MODEL,
                messages=[{
                    'role': 'user',
                    'content': prompt,
                    'images': [tmp_path]
                }]
            )
            
            result_text = response['message']['content'].strip()
            if result_text.startswith('```'):
                result_text = result_text.split('```')[1]
                if result_text.startswith('json'):
                    result_text = result_text[4:]
            result_text = result_text.strip()
            
            verification = json.loads(result_text)
            return verification
        finally:
            # Clean up temp file
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)
        
    except Exception as e:
        print(f"Error in Ollama claim verification: {str(e)}")
        # Return neutral verification if API fails
        return {
            "verification_confidence": 50,
            "is_valid_proof": True,  # Let admin review manually
            "evidence_found": ["Manual review required - API unavailable"],
            "analysis": "Photo submitted but AI verification unavailable. Please review manually."
        }

def extract_item_details_from_photo(image_bytes):
    """
    Use Ollama Vision to extract item details from a photo.
    Returns category, color, brand, description, etc.
    """
    try:
        prompt = 'Extract: category, color, brand, model, unique_features[], condition, description. Return JSON: {"category":"phone","color":"black","brand":"Apple","model":"iPhone 13","unique_features":["scratch"],"condition":"good","description":"brief"}'
        
        # Save image to temporary file for Ollama
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp_file:
            tmp_file.write(image_bytes)
            tmp_path = tmp_file.name
        
        try:
            response = client.chat(
                model=OLLAMA_MODEL,
                messages=[{
                    'role': 'user',
                    'content': prompt,
                    'images': [tmp_path]
                }]
            )
            
            result_text = response['message']['content'].strip()
            if result_text.startswith('```'):
                result_text = result_text.split('```')[1]
                if result_text.startswith('json'):
                    result_text = result_text[4:]
            result_text = result_text.strip()
            
            details = json.loads(result_text)
            return details
        finally:
            # Clean up temp file
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)
        
    except Exception as e:
        print(f"Error in Ollama photo extraction: {str(e)}")
        # Return basic fallback - user can fill in manually
        return {
            "category": "other",
            "color": "",
            "brand": None,
            "model": None,
            "unique_features": [],
            "condition": "unknown",
            "description": "Please fill in item details manually"
        }

def fallback_matching(lost_item, found_items):
    """
    Fallback matching algorithm when AI is unavailable.
    Uses basic rule-based matching.
    """
    matches = []
    
    for idx, found in enumerate(found_items):
        score = 0
        reasons = []
        
        # Category match (40 points)
        if lost_item.get('category', '').lower() == found.get('category', '').lower():
            score += 40
            reasons.append(f"Category matches ({lost_item.get('category')})")
        elif lost_item.get('category', '') and found.get('category', ''):
            # Partial category match
            if lost_item.get('category', '').lower() in found.get('category', '').lower() or \
               found.get('category', '').lower() in lost_item.get('category', '').lower():
                score += 20
                reasons.append("Similar category")
        
        # Color match (20 points)
        if lost_item.get('color', '').lower() == found.get('color', '').lower():
            score += 20
            reasons.append(f"Color matches ({lost_item.get('color')})")
        elif lost_item.get('color', '') and found.get('color', ''):
            lost_color = lost_item.get('color', '').lower()
            found_color = found.get('color', '').lower()
            if lost_color in found_color or found_color in lost_color:
                score += 10
                reasons.append("Similar color")
        
        # Brand match (20 points)
        if lost_item.get('brand', '').lower() == found.get('brand', '').lower():
            score += 20
            reasons.append(f"Brand matches ({lost_item.get('brand')})")
        
        # Description keyword match (20 points)
        lost_desc = (lost_item.get('description', '') + ' ' + lost_item.get('title', '')).lower()
        found_desc = (found.get('description', '') + ' ' + found.get('title', '')).lower()
        # Filter out common stop words
        stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'was', 'are', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'my', 'your', 'his', 'her', 'its', 'our', 'their'}
        lost_words = set(word for word in lost_desc.split() if word not in stop_words and len(word) > 2)
        found_words = set(word for word in found_desc.split() if word not in stop_words and len(word) > 2)
        common_words = lost_words & found_words
        if len(common_words) > 2:
            score += 20
            reasons.append(f"Description keywords match ({len(common_words)} words)")
        elif len(common_words) > 0:
            score += 10
            reasons.append(f"Some description overlap ({len(common_words)} words)")
        
        # Date check (bonus)
        try:
            if lost_item.get('lost_date') and found.get('found_date'):
                lost_date = datetime.fromisoformat(lost_item.get('lost_date').replace('Z', '+00:00'))
                found_date = datetime.fromisoformat(found.get('found_date').replace('Z', '+00:00'))
                if found_date > lost_date:
                    score += 5
                    reasons.append("Found after lost date")
        except:
            pass
        
        if score > 0:
            matches.append({
                "found_item_index": idx,
                "match_score": min(score, 100),  # Cap at 100
                "match_reasons": reasons if reasons else ["Basic match"]
            })
    
    # Sort by score descending
    matches.sort(key=lambda x: x['match_score'], reverse=True)
    return matches
