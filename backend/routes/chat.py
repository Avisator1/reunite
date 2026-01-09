from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.gemini_service import client, OLLAMA_MODEL

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/message', methods=['POST'])
@jwt_required()
def send_chat_message():
    """Send a message to the AI chatbot"""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        message = data.get('message', '').strip()
        conversation_history = data.get('history', [])  # Array of {role, content} objects
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Build messages array for Ollama
        messages = []
        
        # System prompt for context
        system_prompt = """You are a helpful AI assistant for Reunite, a lost and found platform. 
You help users with:
- Finding lost items
- Reporting found items
- Understanding how to use the platform
- Answering questions about lost and found processes
- Providing tips for better item recovery

Be friendly, concise, and helpful. If you don't know something specific about the user's account, suggest they check their dashboard."""
        
        # Add conversation history (last 10 messages to keep context manageable)
        if conversation_history and len(conversation_history) > 0:
            # Add conversation history
            for msg in conversation_history[-10:]:
                if msg.get('role') in ['user', 'assistant']:
                    messages.append({
                        'role': msg['role'],
                        'content': msg['content']
                    })
            # Add current message
            messages.append({
                'role': 'user',
                'content': message
            })
        else:
            # First message - include system context
            messages.append({
                'role': 'user',
                'content': system_prompt + '\n\nNow, the user is asking: ' + message
            })
        
        # Call Ollama - try with configured model, fallback to common models if not available
        print(f"Calling Ollama with model: {OLLAMA_MODEL}, messages count: {len(messages)}")
        print(f"First message preview: {messages[0]['content'][:100] if messages else 'No messages'}")
        
        model_to_use = OLLAMA_MODEL
        fallback_models = ['llama3.2', 'llama3', 'llama2', 'mistral', 'phi']
        
        response = None
        last_error = None
        
        # Try the configured model first
        try:
            response = client.chat(
                model=model_to_use,
                messages=messages
            )
        except Exception as ollama_error:
            error_str = str(ollama_error)
            last_error = ollama_error
            print(f"Error with model {model_to_use}: {error_str}")
            
            # If model not found, try fallback models
            if 'not found' in error_str.lower() or 'try pulling' in error_str.lower():
                print(f"Model {model_to_use} not found, trying fallback models...")
                for fallback_model in fallback_models:
                    try:
                        print(f"Trying fallback model: {fallback_model}")
                        response = client.chat(
                            model=fallback_model,
                            messages=messages
                        )
                        print(f"Successfully used fallback model: {fallback_model}")
                        model_to_use = fallback_model
                        break
                    except Exception as fallback_error:
                        print(f"Fallback model {fallback_model} also failed: {str(fallback_error)}")
                        last_error = fallback_error
                        continue
                
                # If all models failed, raise the original error
                if response is None:
                    raise Exception(f"Model {OLLAMA_MODEL} not found and no fallback models available. Please pull a model using: ollama pull {OLLAMA_MODEL}")
            else:
                # Other errors, re-raise
                raise
        
        print(f"Ollama response type: {type(response)}")
        print(f"Ollama response keys: {response.keys() if isinstance(response, dict) else 'Not a dict'}")
        
        # Handle different response formats
        if isinstance(response, dict):
            if 'message' in response:
                if isinstance(response['message'], dict) and 'content' in response['message']:
                    ai_response = response['message']['content'].strip()
                else:
                    ai_response = str(response['message']).strip()
            elif 'response' in response:
                ai_response = response['response'].strip()
            else:
                # Try to extract content from any nested structure
                ai_response = str(response).strip()
        else:
            ai_response = str(response).strip()
            
        if not ai_response:
            ai_response = "I'm sorry, I didn't get a response. Please try again."
        
        return jsonify({
            'response': ai_response,
            'success': True
        }), 200
        
    except Exception as e:
        error_msg = str(e)
        print(f"Error in chat endpoint: {error_msg}")
        import traceback
        traceback.print_exc()
        
        # Return more detailed error for debugging
        return jsonify({
            'error': f'Failed to get AI response: {error_msg}',
            'response': "I'm having trouble processing your request right now. Please try again in a moment.",
            'details': error_msg if 'localhost' in str(e) or 'connection' in str(e).lower() else None
        }), 500
