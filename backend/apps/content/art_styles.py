"""
Art Direction Style Definitions
"""

ART_STYLE_PROMPTS = {
    'minimalistic': {
        'name': 'Minimalistic',
        'description': 'Clean, simple, modern design with lots of white space',
        'prompt': 'minimalist design, clean lines, white space, simple, modern, uncluttered, geometric shapes, limited color palette, sans-serif typography',
        'colors': ['#FFFFFF', '#000000', '#F5F5F5', '#E0E0E0']
    },
    'retro': {
        'name': 'Retro',
        'description': '1970s-1980s aesthetic with vintage vibes',
        'prompt': '1970s-1980s aesthetic, vintage colors, retro fonts, nostalgic vibes, groovy patterns, warm tones, analog feel',
        'colors': ['#FF6B35', '#F7931E', '#FDC830', '#37B5A6', '#5B3A29']
    },
    'vintage': {
        'name': 'Vintage',
        'description': 'Classic, timeless design with aged look',
        'prompt': 'vintage style, classic, timeless, aged look, sepia tones, traditional, weathered textures, ornate details',
        'colors': ['#8B7355', '#D4A574', '#E8D5B7', '#4A4A4A', '#F5E6D3']
    },
    'pop': {
        'name': 'Pop Art',
        'description': 'Bold, colorful, vibrant Andy Warhol inspired',
        'prompt': 'pop art style, bold colors, high contrast, vibrant, Andy Warhol inspired, comic book aesthetic, halftone dots, bright and energetic',
        'colors': ['#FF0080', '#00FFFF', '#FFFF00', '#FF4500', '#8A2BE2']
    },
    'modern': {
        'name': 'Modern',
        'description': 'Contemporary, sleek, cutting-edge design',
        'prompt': 'modern contemporary design, sleek, cutting-edge, gradient colors, glass morphism, 3D elements, futuristic',
        'colors': ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe']
    },
    'elegant': {
        'name': 'Elegant',
        'description': 'Sophisticated, luxurious, refined aesthetic',
        'prompt': 'elegant sophisticated design, luxurious, refined, gold accents, serif typography, premium feel, high-end',
        'colors': ['#D4AF37', '#000000', '#FFFFFF', '#C0C0C0', '#2C2C2C']
    },
    'bold': {
        'name': 'Bold',
        'description': 'Strong, impactful, attention-grabbing',
        'prompt': 'bold impactful design, strong typography, high contrast, attention-grabbing, powerful, dramatic, intense colors',
        'colors': ['#FF0000', '#000000', '#FFFFFF', '#FFA500', '#8B0000']
    },
    'playful': {
        'name': 'Playful',
        'description': 'Fun, whimsical, lighthearted design',
        'prompt': 'playful whimsical design, fun, lighthearted, rounded shapes, bright colors, cartoon-like, cheerful, friendly',
        'colors': ['#FF6B9D', '#C44569', '#FFC312', '#12CBC4', '#FDA7DF']
    }
}

def get_style_prompt(style_name: str, custom_instructions: str = '') -> str:
    """
    Get the full prompt for an art style
    """
    if style_name == 'surprise':
        import random
        style_name = random.choice(list(ART_STYLE_PROMPTS.keys()))
    
    style = ART_STYLE_PROMPTS.get(style_name, ART_STYLE_PROMPTS['modern'])
    
    prompt = style['prompt']
    if custom_instructions:
        prompt += f", {custom_instructions}"
    
    return prompt

def get_all_styles():
    """Get all available art styles"""
    return [
        {
            'value': key,
            'name': value['name'],
            'description': value['description'],
            'colors': value['colors']
        }
        for key, value in ART_STYLE_PROMPTS.items()
    ]
