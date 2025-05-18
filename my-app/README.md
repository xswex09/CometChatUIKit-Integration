
# CometChat UI Kit Integration

The CometChat UI Kit for React is a powerful solution designed to seamlessly integrate chat functionality into applications. It provides a robust set of prebuilt UI components that are modular, customizable, and highly scalable, allowing developers to accelerate their development process with minimal effort.

Why Choose CometChat UI Kit?

Rapid Integration – Prebuilt UI components for faster deployment.
Customizable & Flexible – Modify the UI to align with your brand’s identity.
Cross-Platform Compatibility – Works seamlessly across various React-based frameworks.
Scalable & Reliable – Built on CometChat's robust chat infrastructure for enterprise-grade performance.

Features:

- Integration of CometChat UI Kit in React.js
- Real-time chat interface with conversations and messaging
- User authentication (if applicable)
- Responsive design and user-friendly interface
- Easy to customize and extend

Getting Started with CometChat React UI Kit
The CometChat UI Kit for React streamlines the integration of in-app chat functionality by providing a comprehensive set of prebuilt UI components. It offers seamless theming options, including light and dark modes, customizable fonts, colors, and extensive styling capabilities.

With built-in support for one-to-one and group conversations, developers can efficiently enable chat features within their applications. Follow this guide to quickly integrate chat functionality using the CometChat React UI Kit.

https://www.cometchat.com/docs/assets/images/intro_web_screens-7ee27b256c54ea069273e198ec2aad4e.png

Prerequisites
Before installing the CometChat UI Kit for React, you must first create a CometChat application via the CometChat Dashboard. The dashboard provides all the essential chat service components, including:

User Management
Group Chat & Messaging
Voice & Video Calling
Real-time Notifications
note
To initialize the UI Kit, you will need the following credentials from your CometChat application:

App ID
Auth Key
Region
Ensure you have these details ready before proceeding with the installation and configuration.

Register & Set Up CometChat
Follow these steps to register on CometChat and set up your development environment.

Step 1: Register on CometChat
To use CometChat UI Kit, you first need to register on the CometChat Dashboard.

🔗 Click here to Sign Up

Step 2: Get Your Application Keys
After registering, create a new app and retrieve your authentication details:

Navigate to Application, then select the Credentials section.
Note down the following keys:
App ID
Auth Key
Region
note
Each CometChat application can be integrated with a single client app. Users within the same application can communicate across multiple platforms, including web and mobile.

Step 3: Set Up Your Development Environment
Ensure your system meets the following prerequisites before proceeding with integration.

System Requirements:

Node.js installed on your machine.
A code editor like Visual Studio Code or Cursor.
npm or Yarn package manager installed.

Getting Started
Step 1: Create a React Project
Open your code editor (e.g., VS Code, Cursor).
Initialize a new React project using one of the following methods:
vite
npx
Using Vite (Recommended)

npm create vite@latest my-app --template react-ts
cd my-app

Open the project directory in your code editor.
Start developing your React components inside the src directory.
Install additional dependencies as needed.
Step 2: Install Dependencies
The CometChat UI Kit for React is an extension of the CometChat JavaScript SDK.
Installing it will automatically include the core Chat SDK, enabling seamless integration.

To install the CometChat UI Kit
npm
yarn
npm install @cometchat/chat-uikit-react

Step 3: Initialize CometChat UI Kit
Before using any features of the CometChat UI Kit or CometChat SDK, you must initialize the required settings. This is done using the Init method.

Initialization Process
Call the Init method at the beginning of your application to ensure all CometChat functionalities are properly configured.

Auth Key Usage
The Auth Key is an optional property of the UIKitSettings class. It is primarily recommended for proof-of-concept (POC) development or early-stage application development.

For secure authentication, use the Auth Token method instead.

TypeScript

import { CometChatUIKit, UIKitSettingsBuilder } from "@cometchat/chat-uikit-react";

/**
 * CometChat Constants - Replace with your actual credentials
 */
const COMETCHAT_CONSTANTS = {
  APP_ID: "APP_ID", // Replace with your actual App ID from CometChat
  REGION: "REGION", // Replace with your App's Region
  AUTH_KEY: "AUTH_KEY", // Replace with your Auth Key (leave blank if using Auth Token)
};

/**
 * Configure the CometChat UI Kit using the UIKitSettingsBuilder.
 * This setup determines how the chat UI behaves.
 */
const UIKitSettings = new UIKitSettingsBuilder()
  .setAppId(COMETCHAT_CONSTANTS.APP_ID) // Assign the App ID
  .setRegion(COMETCHAT_CONSTANTS.REGION) // Assign the App's Region
  .setAuthKey(COMETCHAT_CONSTANTS.AUTH_KEY) // Assign the Authentication Key (if applicable)
  .subscribePresenceForAllUsers() // Enable real-time presence updates for all users
  .build(); // Build the final configuration

/**
 * Initialize the CometChat UI Kit with the configured settings.
 * Once initialized successfully, you can proceed with user authentication and chat features.
 */
CometChatUIKit.init(UIKitSettings)!
  .then(() => {
    console.log("CometChat UI Kit initialized successfully.");
    // You can now call login function to authenticate users
  })
  .catch((error) => {
    console.error("CometChat UI Kit initialization failed:", error); // Log errors if initialization fails
  });

note:
Ensure you replace the following placeholders with your actual CometChat credentials:

APP_ID → Your CometChat App ID
AUTH_KEY → Your CometChat Auth Key
REGION → Your App Region
These values are required for proper authentication and seamless integration.

Step 4: User Login
To authenticate a user, you need a UID. You can either:

Create new users on the CometChat Dashboard, CometChat SDK Method or via the API.

Use pre-generated test users:

cometchat-uid-1
cometchat-uid-2
cometchat-uid-3
cometchat-uid-4
cometchat-uid-5
The Login method returns a User object containing all relevant details of the logged-in user.

info
Security Best Practices

The Auth Key method is recommended for proof-of-concept (POC) development and early-stage testing.
For production environments, it is strongly advised to use an Auth Token instead of an Auth Key to enhance security and prevent unauthorized access.

TypeScript

import { CometChatUIKit } from "@cometchat/chat-uikit-react";

const UID = "UID"; // Replace with your actual UID

CometChatUIKit.getLoggedinUser().then((user: CometChat.User | null) => {
  if (!user) {
    // If no user is logged in, proceed with login
    CometChatUIKit.login(UID)
      .then((user: CometChat.User) => {
        console.log("Login Successful:", { user });
        // Mount your app
      })
      .catch(console.log);
  } else {
    // If user is already logged in, mount your app
  }
});

Step 5: Choose a Chat Experience
Integrate a conversation view that suits your application's UX requirements. Below are the available options:

1️⃣ Conversation List + Message View
Best for: Applications that need a two-panel layout, such as web-based chat interfaces (e.g., WhatsApp Web, Slack).

Features:

Two-panel layout – Displays the conversation list on the left and the active chat window on the right.
One-to-one & group conversations – Seamless switching between private and group chats.
Multiple conversations – Effortlessly switch between different chat windows.
Easy navigation – Intuitive UI for finding and accessing chats quickly.
Tap-to-view on mobile – In mobile layouts, tapping a conversation opens the Message View, optimizing space.
Real-time updates – Auto-refreshes messages and conversation lists.
Message sync – Ensures messages stay updated across all sessions and devices.
Image
Recommended for:

Desktop-first applications
Apps requiring a rich user experience with seamless navigation
Platforms supporting both individual and group messaging
Mobile-friendly apps needing a tap-to-open message view
Edit React - Conversation List + Message Experience

Tip: You can fork the sandbox, insert your CometChat credentials (App ID, Region, Auth Key.) in the code, and immediately preview how the UI and messages respond in real time.


2️⃣ One-to-One/Group Chat
Best for: Apps that require a focused, direct messaging experience without a sidebar.

Features:

Dedicated chat window – Ideal for one-on-one or group messaging.
No conversation list – Users directly enter the chat without navigating through a list.
Supports both One-to-One and Group Chats – Easily configurable with minor code modifications.
Optimized for mobile – Full-screen chat experience without distractions.
Seamless real-time communication – Auto-updates messages for a smooth experience.
Ideal for support chat or community-based messaging.
Image
Recommended for:

Support chat applications – Direct user-agent communication.
Apps focusing on direct messaging – No distractions from other conversations.
Community or group chat applications – A structured way to interact in groups.
Mobile-first applications – Designed for compact and dedicated messaging experiences.
Edit React - One-to-One/Group Chat Experience

Tip: You can fork the sandbox, insert your CometChat credentials (App ID, Region, Auth Key.) in the code, and immediately preview how the UI and messages respond in real time.


3️⃣ Tab-Based Chat Experience
Best for: Apps that need a structured, multi-feature navigation system for seamless interaction between chats, calls, users, and settings.

Features:

Tab Navigation – Easily switch between Chat, Call Logs, Users, and Settings.
Dedicated Chat Window – Full-screen messaging experience for focused communication.
No Sidebar – Unlike multi-panel UI, this design prioritizes individual interactions.
Unified Experience – Users can seamlessly manage conversations, call history, and settings from a single interface.
Scalable for future features – Easily extend to include more functionalities such as notifications or contact management.
Optimized for both desktop and mobile – Ensures a smooth experience across different screen sizes.
Image
Recommended for:

Apps requiring structured navigation – Clearly separate chat, calls, and settings.
Multi-feature chat apps – Supporting different functionalities in an organized way.
Mobile-first applications – Ideal for apps needing tab-based UI for easy access to features.
Support & enterprise chat solutions – Perfect for help desks, business chat platforms, and customer support apps.
Edit React - Tab-Based Chat Experience

Tip: You can fork the sandbox, insert your CometChat credentials (App ID, Region, Auth Key.) in the code, and immediately preview how the UI and messages respond in real time.


Build Your Own Chat Experience
Best for: Developers who need complete control over their chat interface, allowing customization of components, themes, and features to align with their app’s design and functionality. Whether you're enhancing an existing chat experience or building from scratch, this approach provides the flexibility to tailor every aspect to your needs.

Recommended for:

Apps that require a fully customized chat experience.
Developers who want to extend functionalities and modify UI components.
Businesses integrating chat seamlessly into existing platforms.
Key Areas to Explore:

React Sample App – Fully functional sample applications to accelerate your development.
Core Features – Learn about messaging, real-time updates, and other essential capabilities.
Components – Utilize prebuilt UI elements or customize them to fit your design.
Themes – Adjust colors, fonts, and styles to match your branding.
Build Your Own UI – Prefer a custom UI over our UI Kits? Explore our SDKs to create a tailored chat experience.