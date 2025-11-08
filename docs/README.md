# Zoom SDK Backend API Integration Guide

## Overview
This guide provides information about integrating the Zoom SDK Backend API into your frontend application. The API provides endpoints for generating access tokens, signatures, and managing Zoom meeting participants.

## Base URL
```
http://localhost:5000/api/zoom
```

## Authentication
Most endpoints require authentication using a Bearer token. Include the access token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Endpoints

### 1. Health Check
- **GET /** 
- No authentication required
- Returns API status

### 2. Generate Access Token
- **POST /access-token**
- No authentication required
- Returns an access token for API authentication

### 3. Generate Meeting Signature
- **POST /signature**
- Requires meeting number and role
- Used for joining Zoom meetings

### 4. Generate ZAK Token
- **POST /zak**
- Requires authentication
- Returns a Zoom Access Key token

### 5. Register Meeting Participant
- **POST /registrant**
- Requires authentication
- Registers a participant for a meeting

### 6. Get User Information
- **GET /get-user**
- Requires authentication
- Returns current user's Zoom account information

## Error Handling
All endpoints follow a consistent error response format:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Implementation Steps

1. First, obtain an access token:
```javascript
const response = await fetch('http://localhost:5000/api/zoom/access-token', {
  method: 'POST'
});
const { data: { access_token } } = await response.json();
```

2. Use the access token for authenticated requests:
```javascript
const headers = {
  'Authorization': `Bearer ${access_token}`,
  'Content-Type': 'application/json'
};
```

3. Generate a meeting signature before joining:
```javascript
const response = await fetch('http://localhost:5000/api/zoom/signature', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    meetingNumber: '123456789',
    role: 0 // 0 for attendee, 1 for host
  })
});
const { data: { signature } } = await response.json();
```

4. Initialize Zoom client and join meeting:
```javascript
ZoomMtg.init({
  leaveUrl: 'http://yourwebsite.com',
  success: () => {
    ZoomMtg.join({
      signature: signature,
      meetingNumber: '123456789',
      userName: 'Your Name',
      success: (data) => {
        console.log('Joined meeting:', data);
      },
      error: (error) => {
        console.error('Failed to join:', error);
      }
    });
  }
});
```

## Sample Code
See `frontend-examples.js` for complete implementation examples including:
- Token management
- Meeting join flow
- Participant registration
- Error handling

## Best Practices
1. Always handle errors appropriately
2. Store access tokens securely
3. Refresh tokens when they expire
4. Validate input before making API calls
5. Implement proper error handling
6. Use HTTPS in production

## Security Considerations
1. Never expose your client secret in frontend code
2. Always use HTTPS in production
3. Implement rate limiting
4. Validate all input data
5. Handle errors securely
6. Monitor API usage

## Need Help?
Check the following resources:
1. API Reference Documentation
2. Frontend Examples
3. Zoom API Documentation
4. GitHub Repository