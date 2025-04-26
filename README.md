# SnapFlow Desktop

![SnapFlow Logo](assets/logo.png)

## Overview

SnapFlow Desktop is a powerful, modern desktop application built with Electron and React that provides a seamless chat experience with advanced content moderation capabilities. The application features a robust real-time messaging system with AI-powered content filtering to ensure a safe and productive communication environment.

## Features

- **Real-time Messaging**: Instant message delivery with WebSocket technology
- **Content Moderation**: AI-powered content filtering to detect and prevent harmful messages
- **User Authentication**: Secure login and user management
- **Modern UI**: Clean, responsive interface built with React and modern CSS
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Offline Support**: Messages are cached locally when offline
- **Message History**: View and search through past conversations
- **User Profiles**: Customizable user profiles and avatars

## Architecture

SnapFlow Desktop follows a modern architecture pattern:

- **Frontend**: React-based UI with Redux for state management
- **Backend**: Node.js with Express and Socket.IO for real-time communication
- **Database**: MySQL for persistent storage
- **Content Moderation**: Integration with n8n for AI-powered content filtering
- **Desktop Integration**: Electron for cross-platform desktop capabilities

### Key Components

- **ChatProvider**: Manages WebSocket connections and message handling
- **MessageHandler**: Processes incoming messages and applies content moderation
- **Redux Store**: Centralized state management for the application
- **Database Service**: Handles data persistence and retrieval

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MySQL database
- n8n workflow server (for content moderation)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/snapflow-desktop.git
   cd snapflow-desktop
   ```

2. Install dependencies:
   ```
   # Install main application dependencies
   npm install
   
   # Install backend dependencies
   cd chat_feature_node_express_mySQL
   npm install
   ```

3. Configure the database:
   - Create a MySQL database
   - Update the database configuration in `chat_feature_node_express_mySQL/config/database.js`

4. Set up n8n for content moderation:
   - Install and configure n8n
   - Create a workflow for content moderation
   - Update the webhook URL in `chat_feature_node_express_mySQL/sockets/messageHandler.js`

### Running the Application

1. Start the backend server:
   ```
   cd chat_feature_node_express_mySQL
   npm start
   ```

2. Start the frontend development server:
   ```
   cd frontend
   npm run dev
   ```

3. Build and run the desktop application:
   ```
   npm run build
   npm run start
   ```

## Usage

1. **Login**: Enter your credentials to access the application
2. **Send Messages**: Type your message in the input field and press Enter or click Send
3. **View History**: Scroll through previous messages in the chat window
4. **User Settings**: Access your profile and application settings through the menu

## Content Moderation

SnapFlow Desktop includes AI-powered content moderation to detect and prevent harmful messages:

- Messages are analyzed in real-time before being saved
- Harmful content is automatically filtered out
- Users receive notifications when their messages are flagged
- Administrators can review and adjust moderation settings

## Contributing

We welcome contributions to SnapFlow Desktop! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request



## Acknowledgments

- [Electron](https://www.electronjs.org/) - For the desktop application framework
- [React](https://reactjs.org/) - For the UI library
- [Socket.IO](https://socket.io/) - For real-time communication
- [n8n](https://n8n.io/) - For workflow automation and content moderation
- [MySQL](https://www.mysql.com/) - For data persistence

## Contact

Mahdi Talal  - mahditalal.789@gmail.com

Project Link: [https://github.com/Mahdi-Talal-01/snapflow-desktop](https://github.com/Mahdi-Talal-01/snapflow-desktop)