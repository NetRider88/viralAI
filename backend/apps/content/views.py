from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import ContentBlock, PlatformContent, BrandKit, ImageLibrary
from .serializers import (
    ContentBlockSerializer,
    PlatformContentSerializer,
    ContentGenerationRequestSerializer,
    ImageGenerationRequestSerializer,
    BrandKitSerializer,
    ImageLibrarySerializer
)
from .services import ContentGenerationService
import logging

logger = logging.getLogger(__name__)


class ContentBlockViewSet(viewsets.ModelViewSet):
    """API endpoint for content blocks"""
    
    serializer_class = ContentBlockSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Return content blocks for current user"""
        return ContentBlock.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def generate(self, request):
        """
        Generate AI-powered content for multiple platforms
        
        POST /api/content/generate/
        {
            "keyword": "AI tools for productivity",
            "platforms": ["instagram", "linkedin"],
            "content_type": "carousel",
            "tone": "professional",
            "angle": "listicle",
            "niche": "tech",
            "generate_images": true,
            "image_count": 5,
            "generate_video_script": false
        }
        """
        serializer = ContentGenerationRequestSerializer(data=request.data)
        
        if not serializer.is_valid():
            logger.error(f"Validation errors: {serializer.errors}")
            logger.error(f"Request data: {request.data}")
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        
        data = serializer.validated_data
        
        try:
            service = ContentGenerationService()
            
            # Create content block
            content_block = ContentBlock.objects.create(
                user=request.user,
                title=f"{data['keyword']} - {data.get('content_type', 'post')}",
                keyword_text=data['keyword'],
                niche=data.get('niche', ''),
                content_angle=data.get('angle', 'informative'),
                tone=data.get('tone', 'professional'),
                status='draft'
            )
            
            platform_contents = []
            
            # Generate content for each platform
            for platform in data['platforms']:
                logger.info(f"Generating content for {platform}")
                
                # Generate text content
                logger.info(f"Custom prompt received: {data.get('custom_prompt', 'None')}")
                print(f"DEBUG: Custom prompt = {data.get('custom_prompt', 'EMPTY')}")
                with open('/tmp/custom_prompt_debug.txt', 'a') as f: f.write(f"Custom prompt: {data.get('custom_prompt', 'EMPTY')}\n")
                content_data = service.generate_content(
                    keyword=data['keyword'],
                    platform=platform,
                    content_type=data.get('content_type', 'post'),
                    tone=data.get('tone', 'professional'),
                    angle=data.get('angle', 'informative'),
                    niche=data.get('niche'),
                    custom_prompt=data.get('custom_prompt')
                )

                # Post-process: Append custom instructions if provided
                if data.get('custom_prompt'):
                    custom_text = data.get('custom_prompt')
                    # Extract the actual instruction (e.g., "Always end with: Visit ai-it.io")
                    if 'end with:' in custom_text.lower():
                        ending = custom_text.split('end with:', 1)[1].strip()
                        if content_data.get('caption'):
                            content_data['caption'] = content_data['caption'].rstrip() + f" {ending}"
                        if content_data.get('cta'):
                            content_data['cta'] = content_data['cta'].rstrip() + f" {ending}"
                    elif 'mention:' in custom_text.lower():
                        mention = custom_text.split('mention:', 1)[1].strip()
                        if content_data.get('caption'):
                            content_data['caption'] = content_data['caption'].rstrip() + f" {mention}"
                
                
                images = []
                video_script = {}
                
                # Generate images based on generation_mode
                generation_mode = data.get('generation_mode', 'both')
                if generation_mode in ['both', 'image']:
                    logger.info(f"Generating {data.get('image_count', 1)} images")
                    
                    if data.get('image_count', 1) > 1:
                        # Generate carousel images
                        images_data = service.generate_carousel_images(
                            keyword=data['keyword'],
                            slide_count=data.get('image_count', 5)
                        )
                        images = [img['url'] for img in images_data]
                    else:
                        # Generate single image with platform-specific size
                        platform_size = service.PLATFORM_SPECS.get(platform, {}).get('image_size', '1024x1024')
                        image_prompt = f"Professional social media image about {data['keyword']}, high quality, minimalist design"
                        image_data = service.generate_image(image_prompt, size=platform_size)
                        if image_data:
                            images = [image_data['url']]
                
                # Generate video script if requested
                if data.get('generate_video_script'):
                    logger.info("Generating video script")
                    video_script = service.generate_video_script(
                        keyword=data['keyword'],
                        platform=platform,
                        tone=data.get('tone', 'energetic')
                    )
                
                # Create platform content
                platform_content = PlatformContent.objects.create(
                    content_block=content_block,
                    platform=platform,
                    content_type=data.get('content_type', 'post'),
                    caption=content_data.get('caption', ''),
                    hashtags=content_data.get('hashtags', []),
                    content_data={
                        'hook': content_data.get('hook', ''),
                        'cta': content_data.get('cta', ''),
                        'slides': content_data.get('slides', []),
                    },
                    images=images,
                    video_script=video_script.get('voiceover', '') if video_script else ''
                )
                
                platform_contents.append(platform_content)
            
            logger.info(f"Content generated for {len(data['platforms'])} platforms")
            
            # Format response for frontend
            platforms_data = []
            for pc in platform_contents:
                platforms_data.append({
                    'platform': pc.platform,
                    'caption': pc.caption,
                    'hashtags': pc.hashtags,
                    'hook': pc.content_data.get('hook', ''),
                    'cta': pc.content_data.get('cta', ''),
                    'character_count': len(pc.caption)
                })
            
            return Response({
                'id': str(content_block.id),
                'keyword': content_block.keyword_text,
                'platforms': platforms_data,
                'content_type': data.get('content_type', 'post'),
                'tone': data.get('tone', 'professional'),
                'angle': data.get('angle', 'informative'),
                'images': images if images else [],
                'video_script': video_script.get('voiceover', '') if video_script else '',
                'created_at': content_block.created_at.isoformat()
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Error generating content: {str(e)}")
            return Response(
                {'error': 'Failed to generate content', 'detail': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['post'])
    def generate_image(self, request):
        """
        Generate a single image using DALL-E 3
        
        POST /api/content/generate_image/
        {
            "prompt": "Professional social media image about AI",
            "style": "natural",
            "size": "1024x1024"
        }
        """
        serializer = ImageGenerationRequestSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            service = ContentGenerationService()
            image_data = service.generate_image(
                prompt=serializer.validated_data['prompt'],
                style=serializer.validated_data.get('style', 'natural'),
                size=serializer.validated_data.get('size', '1024x1024')
            )
            
            # Save to image library
            image = ImageLibrary.objects.create(
                user=request.user,
                filename=f"ai_generated_{image_data['url'].split('/')[-1][:20]}.png",
                file_url=image_data['url'],
                is_ai_generated=True,
                tags=['ai-generated', 'dall-e-3']
            )
            
            return Response({
                'image': ImageLibrarySerializer(image).data,
                'metadata': {
                    'revised_prompt': image_data.get('revised_prompt'),
                    'size': image_data.get('size'),
                    'style': image_data.get('style'),
                }
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Error generating image: {str(e)}")
            return Response(
                {'error': 'Failed to generate image', 'detail': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class BrandKitViewSet(viewsets.ModelViewSet):
    """API endpoint for brand kits"""
    
    serializer_class = BrandKitSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return BrandKit.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ImageLibraryViewSet(viewsets.ModelViewSet):
    """API endpoint for image library"""
    
    serializer_class = ImageLibrarySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ImageLibrary.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
