// This file is used to load environment variables from the .env file and make them available to the app
const raw = {
  storagePrefix: process.env.EXPO_PUBLIC_STORAGE_PREFIX,
  passwordPepper: process.env.EXPO_PUBLIC_PASSWORD_PEPPER,
};

//a function that checks if an environment variable is defined, and throws an error if it is not
function requireVar(name: string, value: string | undefined): string {
    if(!value) {
        throw new Error(`Missing env variable: ${name}, check your .env file or environment variables`);
    }
    return value;
}

//a constant object that contains all the required environment variables for the app to run
export const ENV = {
    STORAGE_PREFIX: requireVar('EXPO_PUBLIC_STORAGE_PREFIX', raw.storagePrefix),
    PASSWORD_PEPPER: requireVar('EXPO_PUBLIC_PASSWORD_PEPPER', raw.passwordPepper),
} as const;