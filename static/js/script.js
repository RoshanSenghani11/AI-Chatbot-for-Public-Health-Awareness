// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const mobileLoginBtn = document.getElementById('mobileLoginBtn');
const mobileSignupBtn = document.getElementById('mobileSignupBtn');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const closeModalButtons = document.querySelectorAll('.close-modal');
const showSignup = document.getElementById('showSignup');
const showLogin = document.getElementById('showLogin');
const sendOtpBtn = document.getElementById('sendOtpBtn');
const otpSection = document.getElementById('otpSection');
const verifyOtpBtn = document.getElementById('verifyOtpBtn');
const voiceBtn = document.getElementById('voiceBtn');
const sendBtn = document.getElementById('sendBtn');
const symptomInput = document.getElementById('symptomInput');
const chatbox = document.getElementById('chatbox');
const clearChatBtn = document.getElementById('clearChatBtn');
const connectBluetoothBtn = document.getElementById('connectBluetoothBtn');
const bluetoothStatus = document.getElementById('bluetoothStatus');

// Debug: Check if elements are found
console.log('Send button:', sendBtn);
console.log('Symptom input:', symptomInput);
console.log('Chatbox:', chatbox);

// Mobile Menu Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(item => {
            item.classList.remove('active');
        });
        link.classList.add('active');
    });
});

// Modal Controls
loginBtn.addEventListener('click', () => {
    loginModal.classList.add('active');
});

signupBtn.addEventListener('click', () => {
    signupModal.classList.add('active');
});

mobileLoginBtn.addEventListener('click', () => {
    loginModal.classList.add('active');
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
});

mobileSignupBtn.addEventListener('click', () => {
    signupModal.classList.add('active');
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
});

closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        loginModal.classList.remove('active');
        signupModal.classList.remove('active');
    });
});

showSignup.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.classList.remove('active');
    signupModal.classList.add('active');
});

showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    signupModal.classList.remove('active');
    loginModal.classList.add('active');
});

// OTP Simulation
sendOtpBtn.addEventListener('click', () => {
    const phoneNumber = document.getElementById('signupPhone').value;
    
    if (!phoneNumber) {
        alert('Please enter a phone number first.');
        return;
    }
    
    // Call backend API
    fetch('/api/send-otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: phoneNumber })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('OTP has been sent to your phone number!');
            otpSection.style.display = 'block';
            verifyOtpBtn.style.display = 'block';
            
            // Auto-focus first OTP input
            document.querySelector('.otp-input').focus();
        } else {
            alert('Failed to send OTP. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error sending OTP:', error);
        alert('Failed to send OTP. Please try again.');
    });
});

// OTP Input Navigation
const otpInputs = document.querySelectorAll('.otp-input');
otpInputs.forEach((input, index) => {
    input.addEventListener('input', () => {
        if (input.value && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
        }
    });
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !input.value && index > 0) {
            otpInputs[index - 1].focus();
        }
    });
});

// Form Submissions
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Call backend API
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Login successful!');
            loginModal.classList.remove('active');
        } else {
            alert('Login failed: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
    });
});

document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Combine OTP inputs
    data.otp = Array.from(otpInputs).map(input => input.value).join('');
    
    // Call backend API
    fetch('/api/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Account created successfully!');
            signupModal.classList.remove('active');
        } else {
            alert('Signup failed: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Signup error:', error);
        alert('Signup failed. Please try again.');
    });
});

// Contact Form Submission
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Message sent successfully! We will get back to you soon.');
            e.target.reset();
        } else {
            alert('Failed to send message. Please try again.');
        }
    })
    .catch(error => {
        console.error('Contact form error:', error);
        alert('Failed to send message. Please try again.');
    });
});

// Voice Input Simulation
let isListening = false;
let recognition = null;

// Check if browser supports Web Speech API
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        symptomInput.value = transcript;
        isListening = false;
        voiceBtn.classList.remove('listening');
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    };
    
    recognition.onerror = function(event) {
        console.error('Speech recognition error', event.error);
        isListening = false;
        voiceBtn.classList.remove('listening');
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        alert('Speech recognition failed. Please try again or type your symptoms.');
    };
}

voiceBtn.addEventListener('click', () => {
    if (!isListening) {
        if (recognition) {
            isListening = true;
            voiceBtn.classList.add('listening');
            voiceBtn.innerHTML = '<i class="fas fa-stop"></i>';
            recognition.start();
        } else {
            // Fallback simulation
            isListening = true;
            voiceBtn.classList.add('listening');
            voiceBtn.innerHTML = '<i class="fas fa-stop"></i>';
            
            setTimeout(() => {
                if (isListening) {
                    symptomInput.value = "I've been having headaches and feeling dizzy for the past two days.";
                    isListening = false;
                    voiceBtn.classList.remove('listening');
                    voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
                }
            }, 2000);
        }
    } else {
        isListening = false;
        voiceBtn.classList.remove('listening');
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        
        if (recognition) {
            recognition.stop();
        }
    }
});

// Clear Chat Functionality
clearChatBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the chat?')) {
        chatbox.innerHTML = `
            <div class="message ai-message">
                <p>Hello! I'm your AI health assistant. How can I help you today? You can describe any symptoms you're experiencing, ask health-related questions, or request information about medications.</p>
            </div>
        `;
    }
});

// AI Symptom Checker - Fixed with better event handling
function sendMessage() {
    const symptoms = symptomInput.value.trim();
    const language = document.getElementById('languageSelect').value;
    
    if (!symptoms) {
        alert('Please describe your symptoms first.');
        return;
    }
    
    console.log('Sending message:', symptoms);
    
    // Add user message to chat
    const userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
    userMessage.innerHTML = `<p>${symptoms}</p>`;
    chatbox.appendChild(userMessage);
    
    // Clear input
    symptomInput.value = '';
    
    // Scroll to bottom
    chatbox.scrollTop = chatbox.scrollHeight;
    
    // Show typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message ai-message';
    typingIndicator.id = 'typing-indicator';
    typingIndicator.innerHTML = '<p><i>AI is analyzing your symptoms...</i></p>';
    chatbox.appendChild(typingIndicator);
    chatbox.scrollTop = chatbox.scrollHeight;
    
    // Send to backend for AI analysis
    fetch('/api/analyze-symptoms', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            symptoms: symptoms,
            language: language
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Received response:', data);
        
        // Remove typing indicator
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
        
        // Add AI response
        const aiMessage = document.createElement('div');
        aiMessage.className = 'message ai-message';
        
        if (data.error) {
            aiMessage.innerHTML = `<p>${data.analysis}</p>`;
        } else {
            aiMessage.innerHTML = `<p>${data.analysis}</p>`;
        }
        
        chatbox.appendChild(aiMessage);
        
        // Scroll to bottom
        chatbox.scrollTop = chatbox.scrollHeight;
        
        // Save to history
        saveToHistory(symptoms, data.analysis);
    })
    .catch(error => {
        console.error('Analysis error:', error);
        
        // Remove typing indicator
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
        
        // Fallback response if API fails
        const aiMessage = document.createElement('div');
        aiMessage.className = 'message ai-message';
        aiMessage.innerHTML = `
            <p>I apologize, but I'm having trouble connecting to the medical database right now. Please try again in a moment.</p>
            <p>In the meantime, if this is a medical emergency, please contact your local emergency services immediately.</p>
        `;
        chatbox.appendChild(aiMessage);
        
        // Scroll to bottom
        chatbox.scrollTop = chatbox.scrollHeight;
        
        // Save to history
        saveToHistory(symptoms, "AI provided general health advice due to connection issues.");
    });
}

// Event listeners for send functionality
if (sendBtn) {
    sendBtn.addEventListener('click', sendMessage);
    console.log('Send button event listener added');
}

if (symptomInput) {
    // Enter key to send message
    symptomInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    console.log('Input event listener added');
}

// Save search to history
function saveToHistory(symptoms, analysis) {
    const historyItem = {
        symptoms: symptoms,
        analysis: analysis,
        timestamp: new Date().toISOString()
    };
    
    // Call backend API
    fetch('/api/save-history', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(historyItem)
    })
    .then(response => response.json())
    .then(data => {
        console.log('History saved:', data);
    })
    .catch(error => {
        console.error('Error saving history:', error);
    });
}

// Bluetooth Connectivity Simulation
connectBluetoothBtn.addEventListener('click', () => {
    // In a real application, you would use the Web Bluetooth API here
    bluetoothStatus.textContent = 'Status: Connecting...';
    
    // Simulate Bluetooth connection
    setTimeout(() => {
        bluetoothStatus.textContent = 'Status: Connected to Heart Rate Monitor (Simulated)';
        connectBluetoothBtn.innerHTML = '<i class="fas fa-check"></i> Device Connected';
        connectBluetoothBtn.style.background = 'var(--secondary)';
        
        // Simulate receiving heart rate data
        simulateHeartRateData();
    }, 2000);
});

function simulateHeartRateData() {
    // Simulate receiving heart rate data every 5 seconds
    setInterval(() => {
        const simulatedHeartRate = Math.floor(Math.random() * 20) + 65; // Random between 65-85
        updateHeartRate(simulatedHeartRate);
    }, 5000);
}

function updateHeartRate(heartRate) {
    // Update the heart rate display
    document.querySelector('.metric-card .metric-value').innerHTML = `${heartRate} <span style="font-size: 1rem; color: var(--gray);">bpm</span>`;
    
    // Update the chart
    if (window.heartRateChart) {
        const newData = [...window.heartRateChart.data.datasets[0].data.slice(1), heartRate];
        window.heartRateChart.data.datasets[0].data = newData;
        window.heartRateChart.update();
    }
}

// Initialize Charts
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing charts...');
    
    // Heart Rate Chart
    const heartRateCtx = document.getElementById('heartRateChart');
    if (heartRateCtx) {
        window.heartRateChart = new Chart(heartRateCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'],
                datasets: [{
                    label: 'Resting Heart Rate (bpm)',
                    data: [72, 71, 73, 70, 69, 72, 68],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 60
                    }
                }
            }
        });
    }

    // Symptom Chart
    const symptomCtx = document.getElementById('symptomChart');
    if (symptomCtx) {
        new Chart(symptomCtx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Headache', 'Fatigue', 'Fever', 'Cough', 'Dizziness'],
                datasets: [{
                    label: 'Severity Level (1-10)',
                    data: [7, 5, 2, 4, 6],
                    backgroundColor: [
                        'rgba(37, 99, 235, 0.7)',
                        'rgba(16, 185, 129, 0.7)',
                        'rgba(245, 158, 11, 0.7)',
                        'rgba(239, 68, 68, 0.7)',
                        'rgba(139, 92, 246, 0.7)'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10
                    }
                }
            }
        });
    }
    
    console.log('All event listeners should be active now');
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});

// Load user data on page load (if logged in)
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    if (token) {
        // Fetch user data and update UI
        fetch('/api/user-data', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(userData => {
            // Update UI with user data
            updateUserInterface(userData);
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
    }
});

function updateUserInterface(userData) {
    // Update dashboard with user's health data
    if (userData.healthMetrics) {
        document.querySelector('.metric-card .metric-value').innerHTML = 
            `${userData.healthMetrics.heartRate || 72} <span style="font-size: 1rem; color: var(--gray);">bpm</span>`;
    }
    
    // Update auth buttons to show user is logged in
    const authButtons = document.querySelector('.auth-buttons');
    authButtons.innerHTML = `
        <span style="margin-right: 15px;">Hello, ${userData.name || 'User'}</span>
        <button class="btn btn-outline" id="logoutBtn">Logout</button>
    `;
    
    document.getElementById('logoutBtn').addEventListener('click', logout);
}

function logout() {
    localStorage.removeItem('authToken');
    location.reload();
}