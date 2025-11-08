// Zoom SDK API Integration Examples

/**
 * Function to get access token
 * @returns {Promise<string>} Access token
 */
async function getAccessToken() {
  const response = await fetch('http://localhost:5000/api/zoom/access-token', {
    method: 'POST'
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message);
  }
  return data.data.access_token;
}

/**
 * Function to generate meeting signature
 * @param {string} meetingNumber - The Zoom meeting number
 * @param {0 | 1} role - Role (0 for attendee, 1 for host)
 * @returns {Promise<string>} Meeting signature
 */
async function getMeetingSignature(meetingNumber, role) {
  const response = await fetch('http://localhost:5000/api/zoom/signature', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ meetingNumber, role })
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message);
  }
  return data.data.signature;
}

/**
 * Function to get ZAK token
 * @param {string} accessToken - The access token
 * @returns {Promise<string>} ZAK token
 */
async function getZAKToken(accessToken) {
  const response = await fetch('http://localhost:5000/api/zoom/zak', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message);
  }
  return data.data.token;
}

/**
 * Function to register participant
 * @param {string} accessToken - The access token
 * @param {string} meetingId - The Zoom meeting ID
 * @param {string} email - Participant's email
 * @param {string} firstName - Participant's first name
 * @param {string} [lastName] - Participant's last name (optional)
 * @returns {Promise<Object>} Registration data including join URL
 */
async function registerParticipant(accessToken, meetingId, email, firstName, lastName) {
  const response = await fetch('http://localhost:5000/api/zoom/registrant', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      meetingId,
      email,
      firstName,
      lastName
    })
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message);
  }
  return data.data;
}

/**
 * Function to get user info
 * @param {string} accessToken - The access token
 * @returns {Promise<Object>} User information
 */
async function getUserInfo(accessToken) {
  const response = await fetch('http://localhost:5000/api/zoom/get-user', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message);
  }
  return data.data;
}

// Example usage:
async function joinZoomMeeting() {
  try {
    // 1. Get access token
    const accessToken = await getAccessToken();

    // 2. Get meeting signature
    const meetingNumber = '123456789';
    const signature = await getMeetingSignature(meetingNumber, 0); // 0 for attendee

    // 3. Initialize Zoom client
    const client = ZoomMtg.createClient();
    
    // 4. Initialize meeting
    client.init({
      leaveUrl: 'http://localhost:3000', // URL to redirect to after leaving
      isSupportAV: true,
      success: () => {
        // 5. Join meeting
        client.join({
          meetingNumber: meetingNumber,
          signature: signature,
          userName: 'Test User',
          success: (data) => {
            console.log('Joined meeting successfully:', data);
          },
          error: (error) => {
            console.error('Failed to join meeting:', error);
          }
        });
      },
      error: (error) => {
        console.error('Failed to initialize Zoom client:', error);
      }
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Example of registering for a meeting
async function registerForMeeting() {
  try {
    // 1. Get access token
    const accessToken = await getAccessToken();

    // 2. Register participant
    const registrationData = await registerParticipant(
      accessToken,
      '123456789',
      'attendee@example.com',
      'John',
      'Doe'
    );

    console.log('Registration successful:', registrationData);
    // registrationData will contain the join URL and other details

  } catch (error) {
    console.error('Error:', error.message);
  }
}