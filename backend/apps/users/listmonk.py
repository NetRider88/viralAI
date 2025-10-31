"""
Listmonk Email Marketing Integration
"""
import os
import requests
import logging

logger = logging.getLogger(__name__)

LISTMONK_URL = os.environ.get('LISTMONK_URL', 'https://marketingusers.ai-it.io')
LISTMONK_USERNAME = os.environ.get('LISTMONK_USERNAME', 'admin')
LISTMONK_PASSWORD = os.environ.get('LISTMONK_PASSWORD', 'ListmonkSecure2025!')

def add_subscriber_to_listmonk(email: str, name: str = '', lists: list = [1]):
    """
    Add a new subscriber to Listmonk
    
    Args:
        email: Subscriber email
        name: Subscriber name
        lists: List IDs to subscribe to (default: [1] for new users list)
    
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        response = requests.post(
            f'{LISTMONK_URL}/api/subscribers',
            auth=(LISTMONK_USERNAME, LISTMONK_PASSWORD),
            json={
                'email': email,
                'name': name,
                'status': 'enabled',
                'lists': lists,
                'attribs': {
                    'source': 'viral_ai_signup'
                }
            },
            timeout=10
        )
        
        if response.status_code in [200, 201]:
            logger.info(f"Added {email} to Listmonk")
            return True
        else:
            logger.error(f"Listmonk error: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        logger.error(f"Listmonk integration error: {str(e)}")
        return False


def update_subscriber_status(email: str, status: str = 'enabled'):
    """
    Update subscriber status in Listmonk
    
    Args:
        email: Subscriber email
        status: New status (enabled, disabled, blocklisted)
    """
    try:
        # First, get subscriber ID
        response = requests.get(
            f'{LISTMONK_URL}/api/subscribers',
            auth=(LISTMONK_USERNAME, LISTMONK_PASSWORD),
            params={'query': f'subscribers.email = \'{email}\''},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('data', {}).get('results'):
                subscriber_id = data['data']['results'][0]['id']
                
                # Update status
                update_response = requests.put(
                    f'{LISTMONK_URL}/api/subscribers/{subscriber_id}',
                    auth=(LISTMONK_USERNAME, LISTMONK_PASSWORD),
                    json={'status': status},
                    timeout=10
                )
                
                return update_response.status_code == 200
                
    except Exception as e:
        logger.error(f"Listmonk update error: {str(e)}")
        return False
