"""
Content Humanization Module
Makes AI-generated content more natural and authentic
"""
import os
import requests
from typing import Optional

def humanize_content(content: str, style: str = 'casual', user_context: Optional[dict] = None) -> str:
    """
    Makes AI-generated content more natural and human-like
    
    Args:
        content: The AI-generated content to humanize
        style: Writing style (casual, professional, friendly, etc.)
        user_context: Optional user brand guidelines and preferences
    
    Returns:
        Humanized version of the content
    """
    
    # Build humanization prompt
    humanization_prompt = f"""Rewrite the following content to make it more natural, authentic, and human-like.

Style: {style}

Guidelines:
- Use contractions naturally (it's, don't, we're, you'll)
- Add conversational phrases and transitions
- Vary sentence length and structure significantly
- Include occasional colloquialisms appropriate for the audience
- Add personality and genuine emotion
- Remove overly formal, robotic, or AI-sounding language
- Make it feel like a real person wrote it spontaneously
- Keep the core message and key points intact
- Add subtle imperfections that make it feel authentic
- Use active voice predominantly
- Include rhetorical questions where appropriate
- Add personal touches and relatable examples

"""

    if user_context:
        if user_context.get('brand_voice'):
            humanization_prompt += f"\nBrand Voice: {user_context['brand_voice']}"
        if user_context.get('target_audience'):
            humanization_prompt += f"\nTarget Audience: {user_context['target_audience']}"
    
    humanization_prompt += f"""

Content to humanize:
{content}

Return ONLY the humanized version. No explanations, no meta-commentary."""
    
    # Call LiteLLM API
    try:
        response = requests.post(
            os.environ.get('LITELLM_API_URL', 'https://litellm.ai-it.io/v1') + '/chat/completions',
            headers={
                'Authorization': f"Bearer {os.environ.get('LITELLM_API_KEY')}",
                'Content-Type': 'application/json'
            },
            json={
                'model': 'gpt-4o',
                'messages': [
                    {'role': 'user', 'content': humanization_prompt}
                ],
                'temperature': 0.9,  # Higher temperature for more creativity
                'max_tokens': 2000
            },
            timeout=60
        )
        
        if response.status_code == 200:
            result = response.json()
            return result['choices'][0]['message']['content'].strip()
        else:
            print(f"Humanization API error: {response.status_code}")
            return content  # Return original if humanization fails
            
    except Exception as e:
        print(f"Humanization error: {str(e)}")
        return content  # Return original if error occurs


def apply_brand_voice(content: str, brand_guidelines: dict) -> str:
    """
    Apply brand guidelines to content
    
    Args:
        content: The content to brand
        brand_guidelines: Dictionary with brand voice, tone, values, etc.
    
    Returns:
        Content with brand voice applied
    """
    
    brand_prompt = f"""Rewrite this content to match the following brand guidelines:

Brand Voice: {brand_guidelines.get('voice', 'Professional and engaging')}
Brand Tone: {brand_guidelines.get('tone', 'Friendly yet authoritative')}
Brand Values: {brand_guidelines.get('values', 'Quality, Innovation, Trust')}
Target Audience: {brand_guidelines.get('target_audience', 'General audience')}

Additional Instructions:
{brand_guidelines.get('instructions', 'Follow the brand voice consistently')}

Content:
{content}

Return the rewritten content that perfectly matches the brand guidelines."""
    
    try:
        response = requests.post(
            os.environ.get('LITELLM_API_URL', 'https://litellm.ai-it.io/v1') + '/chat/completions',
            headers={
                'Authorization': f"Bearer {os.environ.get('LITELLM_API_KEY')}",
                'Content-Type': 'application/json'
            },
            json={
                'model': 'gpt-4o',
                'messages': [
                    {'role': 'user', 'content': brand_prompt}
                ],
                'temperature': 0.7
            },
            timeout=60
        )
        
        if response.status_code == 200:
            result = response.json()
            return result['choices'][0]['message']['content'].strip()
        else:
            return content
            
    except Exception as e:
        print(f"Brand voice error: {str(e)}")
        return content
