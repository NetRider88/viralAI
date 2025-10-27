from openai import OpenAI
from django.conf import settings
from typing import Dict, List, Optional
import logging
import json

logger = logging.getLogger(__name__)


class ContentGenerationService:
    """Service for AI-powered content generation"""
    
    # Platform-specific content guidelines
    PLATFORM_SPECS = {
        'instagram': {
            'caption_max_length': 2200,
            'hashtag_limit': 30,
            'optimal_hashtags': 10,
            'content_types': ['post', 'story', 'reel', 'carousel'],
            'image_size': '1024x1024',  # Square for feed posts
        },
        'tiktok': {
            'caption_max_length': 2200,
            'hashtag_limit': 100,
            'optimal_hashtags': 5,
            'content_types': ['video', 'story'],
            'image_size': '1024x1792',  # Vertical 9:16
        },
        'linkedin': {
            'caption_max_length': 3000,
            'hashtag_limit': 30,
            'optimal_hashtags': 5,
            'content_types': ['post', 'article', 'carousel'],
            'image_size': '1024x1024',  # Square or landscape
        },
        'twitter': {
            'caption_max_length': 280,
            'hashtag_limit': 10,
            'optimal_hashtags': 3,
            'content_types': ['tweet', 'thread'],
            'image_size': '1024x1024',  # Square or landscape
        },
        'facebook': {
            'caption_max_length': 63206,
            'hashtag_limit': 30,
            'optimal_hashtags': 5,
            'content_types': ['post', 'story'],
            'image_size': '1024x1024',  # Square or landscape
        },
        'youtube': {
            'caption_max_length': 5000,
            'hashtag_limit': 15,
            'optimal_hashtags': 10,
            'content_types': ['video', 'short'],
            'image_size': '1792x1024',  # Horizontal 16:9
        },
    }
    
    def __init__(self):
        # Try OpenAI first, then fall back to LiteLLM
        if hasattr(settings, 'OPENAI_API_KEY') and settings.OPENAI_API_KEY and settings.OPENAI_API_KEY != 'your_openai_api_key_here':
            self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
            self.image_client = OpenAI(api_key=settings.OPENAI_API_KEY)  # Separate client for images
            self.model = "gpt-4o-mini"
            self.image_model = "dall-e-3"
            self.use_openai = True
            logger.info("OpenAI client initialized successfully")
        elif hasattr(settings, 'LITELLM_API_KEY') and settings.LITELLM_API_KEY:
            self.client = OpenAI(
                api_key=settings.LITELLM_API_KEY,
                base_url=settings.LITELLM_BASE_URL
            )
            self.image_client = self.client  # Use same client for LiteLLM
            self.model = "gpt-4o-mini"
            self.image_model = "gpt-image-1"
            self.use_openai = False
            logger.info("LiteLLM client initialized successfully")
        else:
            self.client = None
            self.image_client = None
            self.model = None
            self.image_model = None
            self.use_openai = False
            logger.error("No API key configured. Content generation will not work.")
    
    def generate_content(
        self,
        keyword: str,
        platform: str,
        content_type: str,
        tone: str = 'professional',
        angle: str = 'informative',
        niche: Optional[str] = None
    ) -> Dict:
        """
        Generate platform-optimized content using Claude Sonnet 3.7
        
        Args:
            keyword: Main keyword/topic
            platform: Target platform (instagram, tiktok, etc.)
            content_type: Type of content (post, carousel, reel, etc.)
            tone: Content tone (professional, casual, energetic, etc.)
            angle: Content angle (listicle, how-to, story, etc.)
            niche: Optional niche specification
        
        Returns:
            Dict with caption, hashtags, and content structure
        """
        try:
            guidelines = self.PLATFORM_SPECS.get(platform, {})
            
            prompt = self._build_content_prompt(
                keyword=keyword,
                platform=platform,
                content_type=content_type,
                tone=tone,
                angle=angle,
                niche=niche,
                guidelines=guidelines
            )
            
            logger.info(f"Generating content for {platform} - {content_type}")
            
            if not self.client:
                raise Exception("LiteLLM client not initialized. Please configure LITELLM_API_KEY.")
            
            # Use configured model (OpenAI or LiteLLM)
            response = self.client.chat.completions.create(
                model=self.model,
                max_tokens=2000,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            # Parse the response
            content_text = response.choices[0].message.content
            parsed_content = self._parse_content_response(content_text, platform)
            
            logger.info(f"Content generated successfully for {platform}")
            
            return parsed_content
            
        except Exception as e:
            logger.error(f"Error generating content: {str(e)}")
            raise
    
    def _build_content_prompt(
        self,
        keyword: str,
        platform: str,
        content_type: str,
        tone: str,
        angle: str,
        niche: Optional[str],
        guidelines: Dict
    ) -> str:
        """Build the prompt for Claude"""
        
        niche_text = f" in the {niche} niche" if niche else ""
        
        prompt = f"""Create viral {platform} content about "{keyword}"{niche_text}.

Platform: {platform.upper()}
Content Type: {content_type}
Tone: {tone}
Angle: {angle}

Platform Guidelines:
- Max caption length: {guidelines.get('caption_max_length', 2000)} characters
- Optimal hashtags: {guidelines.get('optimal_hashtags', 10)}

Requirements:
1. Write an engaging caption that hooks viewers in the first line
2. Include a clear call-to-action
3. Add relevant emojis naturally (don't overdo it)
4. Generate {guidelines.get('optimal_hashtags', 10)} highly relevant hashtags
5. If it's a carousel/thread, provide slide/tweet breakdowns

Format your response as JSON:
{{
    "caption": "The main caption text",
    "hook": "The first line/hook",
    "cta": "Call to action",
    "hashtags": ["hashtag1", "hashtag2", ...],
    "slides": ["Slide 1 content", "Slide 2 content", ...] // Only for carousel/thread
}}

Make it viral-worthy and platform-optimized!"""
        
        return prompt
    
    def _parse_content_response(self, response_text: str, platform: str) -> Dict:
        """Parse Claude's response into structured data"""
        try:
            # Try to extract JSON from the response
            # Claude sometimes wraps JSON in markdown code blocks
            if "```json" in response_text:
                json_start = response_text.find("```json") + 7
                json_end = response_text.find("```", json_start)
                json_text = response_text[json_start:json_end].strip()
            elif "```" in response_text:
                json_start = response_text.find("```") + 3
                json_end = response_text.find("```", json_start)
                json_text = response_text[json_start:json_end].strip()
            else:
                json_text = response_text
            
            parsed = json.loads(json_text)
            
            return {
                'caption': parsed.get('caption', ''),
                'hook': parsed.get('hook', ''),
                'cta': parsed.get('cta', ''),
                'hashtags': parsed.get('hashtags', []),
                'slides': parsed.get('slides', []),
                'platform': platform,
            }
            
        except json.JSONDecodeError:
            logger.warning("Failed to parse JSON, returning raw response")
            return {
                'caption': response_text,
                'hook': '',
                'cta': '',
                'hashtags': [],
                'slides': [],
                'platform': platform,
            }
    
    def generate_image(
        self,
        prompt: str,
        style: str = 'natural',
        size: str = '1024x1024'
    ) -> Dict:
        """
        Generate image using OpenAI DALL-E 3
        
        Args:
            prompt: Image description
            style: Image style (natural, vivid)
            size: Image size (1024x1024, 1024x1792, 1792x1024)
        
        Returns:
            Dict with image URL and metadata
        """
        try:
            if not self.image_client:
                logger.error("Image client not initialized. Cannot generate images.")
                return None
            
            logger.info(f"Generating image with prompt: {prompt[:100]}...")
            
            # Use appropriate model based on client type
            if self.use_openai:
                # OpenAI DALL-E 3
                response = self.image_client.images.generate(
                    model="dall-e-3",
                    prompt=prompt,
                    size=size,
                    quality="standard",
                    n=1,
                )
            else:
                # LiteLLM
                response = self.image_client.images.generate(
                    model=self.image_model,
                    prompt=prompt,
                    size=size,
                    n=1,
                )
            
            image_url = response.data[0].url
            revised_prompt = getattr(response.data[0], 'revised_prompt', prompt)
            
            logger.info(f"Image generated successfully: {image_url[:50]}...")
            
            return {
                'url': image_url,
                'prompt': prompt,
                'revised_prompt': revised_prompt,
                'size': size,
                'style': style,
            }
            
        except Exception as e:
            logger.error(f"Error generating image: {str(e)}")
            logger.exception(e)  # Log full traceback
            return None  # Return None instead of raising to prevent content generation from failing
    
    def generate_carousel_images(
        self,
        keyword: str,
        slide_count: int = 5,
        style: str = 'natural'
    ) -> List[Dict]:
        """Generate multiple images for carousel posts"""
        images = []
        
        for i in range(slide_count):
            prompt = f"Professional social media image about {keyword}, slide {i+1} of {slide_count}, minimalist design, high quality"
            
            try:
                image_data = self.generate_image(prompt, style=style, size='1080x1080')
                images.append(image_data)
            except Exception as e:
                logger.error(f"Failed to generate image {i+1}: {str(e)}")
                continue
        
        return images
    
    def generate_video_script(
        self,
        keyword: str,
        platform: str,
        duration: int = 60,
        tone: str = 'energetic'
    ) -> Dict:
        """Generate video script using Claude"""
        try:
            prompt = f"""Create a {duration}-second video script for {platform} about "{keyword}".

Tone: {tone}
Duration: {duration} seconds

Format your response as JSON:
{{
    "hook": "First 3 seconds hook",
    "intro": "Introduction (5 seconds)",
    "main_points": ["Point 1", "Point 2", "Point 3"],
    "outro": "Conclusion and CTA (5 seconds)",
    "voiceover": "Full voiceover script",
    "visual_suggestions": ["Visual 1", "Visual 2", ...],
    "music_suggestion": "Type of background music"
}}

Make it engaging and viral-worthy!"""
            
            if not self.client:
                raise Exception("LiteLLM client not initialized. Please configure LITELLM_API_KEY.")
            
            response = self.client.chat.completions.create(
                model=self.model,
                max_tokens=1500,
                messages=[{"role": "user", "content": prompt}]
            )
            
            script_text = response.choices[0].message.content
            
            # Parse JSON response
            if "```json" in script_text:
                json_start = script_text.find("```json") + 7
                json_end = script_text.find("```", json_start)
                json_text = script_text[json_start:json_end].strip()
            else:
                json_text = script_text
            
            script = json.loads(json_text)
            script['duration'] = duration
            script['platform'] = platform
            
            return script
            
        except Exception as e:
            logger.error(f"Error generating video script: {str(e)}")
            raise
