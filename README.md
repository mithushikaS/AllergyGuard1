# React Native Expo Project Setup

A step-by-step guide to clone, set up, and run a React Native Expo project on your mobile device.

## Prerequisites

Before you begin, make sure you have the following installed on your system:

- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)
- **Git** (for cloning repositories)

## Quick Setup Guide

### Step 1: Clone the Project

Clone your React Native Expo project repository to your local machine:

```bash
git clone <your-repository-url>
cd <your-project-folder>
```

### Step 2: Install Dependencies

Install all the required dependencies using npm:

```bash
npm install
```

This command will:
- Read the `package.json` file
- Download and install all required packages
- Create a `node_modules` folder with all dependencies

### Step 3: Start the Development Server

Launch the Expo development server:

```bash
npx expo start
```

This command will:
- Start the Metro bundler
- Generate a QR code in your terminal
- Open the Expo DevTools in your browser (optional)

### Step 4: Install Expo Go App

Download and install the **Expo Go** app on your mobile device:

#### For Android:
- Open **Google Play Store**
- Search for "Expo Go"
- Install the app by Expo

#### For iOS:
- Open **App Store**
- Search for "Expo Go"
- Install the app by Expo

### Step 5: Run the App on Your Device

1. Open the **Expo Go** app on your mobile device
2. Make sure your phone and computer are connected to the same Wi-Fi network
3. Scan the QR code displayed in your terminal using:
   - **Android**: Use the Expo Go app's built-in QR scanner
   - **iOS**: Use your device's camera app, then tap the notification to open in Expo Go

## Troubleshooting

### Common Issues and Solutions

#### QR Code Not Scanning
- Ensure both devices are on the same Wi-Fi network
- Check if your firewall is blocking the connection
- Try running `npx expo start --tunnel` for tunnel connection

#### Metro Bundler Issues
- Clear the cache: `npx expo start --clear`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

#### Network Connection Problems
- Use tunnel mode: `npx expo start --tunnel`
- Check your network firewall settings
- Try using a mobile hotspot

#### Dependencies Issues
- Make sure you're using compatible versions
- Run `npm install` again
- Check the `package.json` for version conflicts

## Development Workflow

### Making Changes
1. Edit your code in your preferred editor
2. Save the files
3. The app will automatically reload on your device (Fast Refresh)

### Viewing Logs
- Check the terminal where you ran `npx expo start`
- Use the Expo Go app's developer menu (shake your device)
- View logs in the Expo DevTools browser interface

## Project Structure

```
your-project/
├── App.js                 # Main app component
├── package.json          # Dependencies and scripts
├── app.json             # Expo configuration
├── assets/              # Images, fonts, etc.
├── components/          # Reusable components
├── screens/            # App screens
└── node_modules/       # Installed dependencies
```

## Useful Commands

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Start with cache cleared
npx expo start --clear

# Start with tunnel (for network issues)
npx expo start --tunnel

# Install a new package
npm install package-name

# Check Expo CLI version
npx expo --version
```

## Environment Setup Verification

To verify your setup is working correctly:

1. ✅ Node.js installed: `node --version`
2. ✅ npm installed: `npm --version`
3. ✅ Project cloned and dependencies installed
4. ✅ Expo Go app installed on mobile device
5. ✅ Both devices on same Wi-Fi network
6. ✅ QR code scannable and app loads

## Next Steps

After successfully running your app:

- Explore the codebase in your text editor
- Make small changes to see Fast Refresh in action
- Read the [Expo documentation](https://docs.expo.dev/)
- Learn about React Native components and navigation

## Support

If you encounter issues:

- Check the [Expo documentation](https://docs.expo.dev/)
- Visit [Expo Forums](https://forums.expo.dev/)
- Check [React Native documentation](https://reactnative.dev/)

---

**Happy coding! 🚀**

Your React Native Expo app should now be running on your mobile device. Start building amazing mobile experiences!