from django.test import TestCase, override_settings
from django.urls import reverse
from django.contrib.auth import get_user_model
from unittest.mock import patch, MagicMock
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()

class PasswordResetTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )
        self.url = reverse('forgot_password')

    @patch('apps.users.views.SendGridAPIClient')
    @override_settings(FROM_EMAIL='noreply@viral.ai-it.io')
    def test_forgot_password_email_sent(self, mock_sendgrid):
        # Setup mock
        mock_sg_instance = MagicMock()
        mock_sendgrid.return_value = mock_sg_instance
        
        # Execute request
        data = {'email': 'test@example.com'}
        response = self.client.post(self.url, data)
        
        # Verify response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Password reset email sent')
        
        # Verify SendGrid was called
        mock_sendgrid.assert_called_once()
        mock_sg_instance.send.assert_called_once()
        
        # Verify email content (inspect the call args)
        args, kwargs = mock_sg_instance.send.call_args
        message = args[0]
        message_dict = message.get()
        self.assertEqual(message_dict['from']['email'], 'noreply@viral.ai-it.io')
        self.assertEqual(message_dict['personalizations'][0]['to'][0]['email'], 'test@example.com')
        self.assertIn('reset-password', message_dict['content'][0]['value'])
        self.assertIn('https://viral.ai-it.io', message_dict['content'][0]['value'])

    def test_forgot_password_invalid_email(self):
        data = {'email': 'nonexistent@example.com'}
        response = self.client.post(self.url, data)
        
        # Should still return 200 for security (as per implementation)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('If an account exists', response.data['message'])

    def test_forgot_password_missing_email(self):
        data = {}
        response = self.client.post(self.url, data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
