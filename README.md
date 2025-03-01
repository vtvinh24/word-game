# Word Game

A mobile word game application built with React Native and Expo.

## Overview

Word Game is a cross-platform mobile application that challenges players with word puzzles. Built with React Native, the app offers an engaging word game experience for both Android and iOS users.

## Prerequisites

- Node.js (v14 or newer)
- npm or Yarn
- Expo CLI (`npm install -g expo-cli`)
- For iOS development: macOS with Xcode
- For Android development: Android Studio with SDK

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/vtvinh24/word-game.git
   cd word-game
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the Expo development server:
   ```bash
   npx expo
   ```
4. Open the Expo Go app on your mobile device and scan the QR code to run the app.
   or run the app on an emulator/device using
   ```bash
   npm run android
   npm run ios
   ```
   _Note: This project will not run on the web platform due to the use of native modules._

## Project Structure

```
word-game-client/
├── assets/             # Static assets
├── src/
│   ├── api/            # API integration
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React Context providers
│   ├── hooks/          # Custom React hooks
│   ├── navigation/     # Navigation configuration
│   ├── screens/        # App screens
│   ├── store/          # State management
│   ├── theme/          # UI styling themes
│   └── utils/          # Helper functions
├── App.js              # App entry point
├── app.json            # Expo configuration
├── metro.config.js     # Metro bundler config
└── package.json        # Dependencies
```

## Git Workflow

1. Development cycle:
   `dev` → `test` → `main` → `deploy`
2. Contributing
   - Create feature branches from `dev` branch
   - Submit pull requests to the `dev` branch
   - After review and testing in `dev`, changes move to `test`
   - Once verified in `test`, changes are merged to `main`
   - Production deployments are made from the `deploy` branch
