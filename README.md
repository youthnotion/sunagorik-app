# Sunagorik App - Comprehensive Guide 👋

![Sunagorik App](https://i.pinimg.com/originals/e8/d2/1b/e8d21b0b49a569b3abbd864440150fce.png)

## Table of Contents
- [Introduction](#introduction)
- [Project Architecture](#project-architecture)
- [Core Components](#core-components)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Introduction

Sunagorik is a mobile application built with [Expo](https://expo.dev) and React Native. The app provides a platform for users to report and track issues in their neighborhoods, featuring map integration, user authentication, and multilingual support.

## Project Architecture

The project follows a modular architecture with clear separation of concerns:

### Directory Structure

```
sunagorik-app/
├── api/                  # API integration and endpoints
├── app/                  # Main application screens and navigation (file-based routing)
├── assets/               # Static assets like images, fonts, etc.
├── components/           # Reusable UI components
├── constants/            # App-wide constants and configuration
├── lib/                  # Utility functions and services
├── providers/            # Context providers for state management
├── scripts/              # Utility scripts for development
└── types/                # TypeScript type definitions
```

## Core Components

### App Structure (`/app`)

The app uses Expo Router for file-based navigation with the following structure:

- `(auth)/` - Authentication-related screens
- `(form)/` - Form screens for user input
- `(root)/` - Main app screens after authentication
- `_layout.tsx` - Root layout component
- `index.tsx` - Entry point of the application

### API Integration (`/api`)

Contains API endpoints and service functions for:
- Post management
- User profiles
- Report handling
- Severity ratings

### Components (`/components`)

Reusable UI components including:
- `ActivityIndicator.tsx` - Loading spinner
- `AppForm.tsx` & `AppFormField.tsx` - Form handling components
- `CustomButton.tsx` - Styled button component
- `DialogBox.tsx` - Modal dialog component
- `GoogleAuth.tsx` & `OAuth.tsx` - Authentication components
- `InputField.tsx` - Text input component
- `LanguageSwitcher.tsx` - Language selection component
- `Map.tsx` - Map integration component
- `NeighborhoodDropdown.tsx` - Location selection component
- `OfflineNotice.tsx` - Network status indicator
- `ReportCard.tsx` - Report display component
- `StarRating.tsx` - Rating component

### State Management (`/providers`)

Context providers for global state management:
- `AuthProvider.tsx` - Authentication state
- `PostFormProvider.tsx` - Post creation state
- `ProfileFormProvider.tsx` - User profile state

### Utilities (`/lib`)

Helper functions and services:
- `i18n/` - Internationalization setup
- `map.ts` - Map-related utilities
- `supabase.ts` - Supabase client configuration
- `utils.ts` - General utility functions

## Getting Started

### Prerequisites

#### Required Tools
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Git](https://git-scm.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Android Studio (for Android development)

#### Key Technologies
- [React Native](https://reactnative.dev/) - Core framework for building the mobile app
- [Expo](https://expo.dev/) - Development platform and toolchain
- [Supabase](https://supabase.com/) - Backend as a service for database and authentication
- [TanStack Query](https://tanstack.com/query) - Data fetching and state management
- [React Native Google Sign-In](https://react-native-google-signin.github.io/) - Google authentication
- [React Native Maps](https://www.npmjs.com/package/react-native-maps) - Map integration
- [i18next](https://www.i18next.com/) - Internationalization
- [Expo Development Client](https://docs.expo.dev/develop/development-builds/introduction/) - For running development builds

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/youthnotion/sunagorik-app.git
   cd sunagorik-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_google_web_client_id
   EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your_google_android_client_id
   EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

### Running the App

#### Important Note About Expo Go Limitations

This app won't work properly in Expo Go because it relies on Google OAuth libraries that use native modules. The default React Native bridge (JavaScript to Android) isn't sufficient for a smooth experience. To run the app properly, you'll need a development build which has the native modules built in. Technically, the app can still run with minimizable errors in Expo Go, but it's not ideal.

#### Using EAS for Development Builds (Recommended)

When building a React Native app locally with the Android SDK, you may encounter hard-to-diagnose issues due to missing configurations, tools, or dependencies. Expo simplifies this process by allowing you to build your app on their cloud infrastructure. This way, you don't need to worry about configuring the Android SDK locally.

Follow these steps to create and run a development build:

1. Install the EAS CLI globally:
   ```bash
   npm install -g eas-cli
   ```

2. Log in to your Expo account (create one first if needed):
   ```bash
   eas login
   ```

3. Initialize EAS for your project:
   ```bash
   eas init
   ```

4. Build the development version in the Expo cloud:
   ```bash
   eas build --profile development --platform android
   ```

5. Download and install the APK file on your mobile device once it's successfully built

6. Start the development server:
   ```bash
   npx expo start
   ```

7. Scan the QR code with your device to connect to the development server

> **Note**: There may be API issues with Google authentication if the API keys haven't been properly updated. The app should still load to the welcome screen, but login functionality might not work until API issues are resolved.

#### Important: SHA-1 Keys and Google OAuth

When building with EAS, each development build will have a different SHA-1 key by default. This affects Google OAuth configuration since Google APIs require the app's SHA-1 fingerprint to be registered in the Google API Console.

**Options for handling SHA-1 keys:**

1. **Use a Custom Keystore**:
   - Configure your `eas.json` to use a consistent keystore for development builds
   ```json
   {
     "build": {
       "development": {
         "android": {
           "buildType": "apk",
           "gradleCommand": ":app:assembleDebug",
           "withoutCredentials": false,
           "credentialsSource": "local"
         }
       }
     }
   }
   ```

2. **Use EAS Credentials**:
   - Store your credentials in the EAS cloud for consistent builds
   ```bash
   eas credentials
   ```

3. **Extract and Update SHA-1 After Building**:
   - Extract the SHA-1 from your APK after building
   - Update your Google API Console with this new SHA-1

**Simplest Solution**: To avoid this hassle, you can use the pre-provided development build APK that has already been configured with the correct SHA-1 key. Contact the project maintainers to obtain this APK.

#### Standard Expo Options

If you're just exploring the app and don't need full functionality, you can still use these options:

- **On a physical device**: Scan the QR code with the Expo Go app (limited functionality)
- **On an Android emulator**: Press `a` in the terminal
- **On an iOS simulator**: Press `i` in the terminal
- **On the web**: Press `w` in the terminal

## Navigation Structure

The app uses Expo Router for file-based navigation with a mix of Stack and Tab navigators organized in a hierarchical structure.

### Navigation Hierarchy

```
app/
├── _layout.tsx                # Root Stack Navigator
├── (auth)/                    # Authentication Stack
│   ├── _layout.tsx            # Auth Stack Navigator
│   ├── welcome.tsx            # Welcome/Login Screen
│   └── sign-up.tsx            # Sign Up Screen
├── (form)/                    # Forms Group
│   ├── _layout.tsx            # Form Group Layout
│   ├── (post)/                # Post Form Stack
│   │   ├── _layout.tsx        # Post Form Stack Navigator
│   │   ├── category.tsx       # Category Selection Screen
│   │   ├── body.tsx           # Report Body Screen
│   │   ├── details.tsx        # Report Details Screen
│   │   └── image.tsx          # Image Upload Screen
│   └── (profile)/             # Profile Form Stack
│       ├── _layout.tsx        # Profile Form Stack Navigator
│       ├── body.tsx           # Profile Main Screen
│       ├── about.tsx          # Profile About Screen
│       └── avatar.tsx         # Avatar Update Screen
└── (root)/                    # Main App
    ├── _layout.tsx            # Root Layout
    └── (tabs)/                # Bottom Tab Navigator
        ├── _layout.tsx        # Tab Navigator Configuration
        ├── home.tsx           # Home Tab Screen
        ├── feed/              # Feed Tab Section
        └── profile.tsx        # Profile Tab Screen
```

### Navigation Types

1. **Root Stack Navigator** (`app/_layout.tsx`)
   - Main navigation container that wraps the entire app
   - Manages transitions between auth, form, and main app sections
   - Implemented using `<Stack>` from Expo Router

2. **Authentication Stack** (`app/(auth)/_layout.tsx`)
   - Handles authentication flow screens
   - Uses Stack navigation for transitions between welcome and sign-up

3. **Form Stacks**
   - **Post Form Stack** (`app/(form)/(post)/_layout.tsx`)
     - Sequential form flow for creating reports
     - Uses Stack navigation with custom header configuration
     - Screens: category → body → details → image
   
   - **Profile Form Stack** (`app/(form)/(profile)/_layout.tsx`)
     - Profile editing screens
     - Uses Stack navigation
     - Screens: body → about → avatar

4. **Bottom Tab Navigator** (`app/(root)/(tabs)/_layout.tsx`)
   - Main app navigation after authentication
   - Custom styled bottom tabs with icons
   - Tab screens: Home, Feed, Profile

## Development Workflow

### File-Based Routing

The app uses Expo Router for file-based routing. To add a new screen:

1. Create a new file in the appropriate directory under `/app`
2. Export a React component as the default export
3. The file path becomes the route path

### Adding Components

1. Create a new component file in the `/components` directory
2. Import and use it in your screens

### State Management

The app uses React Context API for state management:

1. Create a new provider in the `/providers` directory if needed
2. Wrap your components with the provider in the appropriate layout file

### API Integration

1. Create endpoint functions in the `/api` directory
2. Use React Query for data fetching and caching

## Deployment

### Development Build

```bash
eas build --profile development --platform android
```

### Production Build

```bash
eas build --platform android
```

## Contributing

1. Fork the repository
2. Create a feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes
   ```bash
   git commit -m 'Add some feature'
   ```
4. Push to the branch
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request

---

Built with ❤️ by [YouthNotion](https://github.com/youthnotion)
