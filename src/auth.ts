import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from './db/drizzle'
import { nextCookies } from 'better-auth/next-js'
import {
  anonymous,
  magicLink,
  emailOTP,
  oneTap,
  admin,
  apiKey,
  organization,
  deviceAuthorization,
  captcha,
  haveIBeenPwned,
  lastLoginMethod,
  multiSession,
} from 'better-auth/plugins'
import { passkey } from 'better-auth/plugins/passkey'
import { emailHarmony } from 'better-auth-harmony'
import { sso } from '@better-auth/sso'

export const auth = betterAuth({
  rateLimit: {
    enabled: true,
    window: 10, // time window in seconds
    max: 100, // max requests in the window
  },
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  plugins: [
    nextCookies(),
    anonymous(),
    magicLink({
      sendMagicLink: async ({ email, token, url }, request) => {
        // send email to user
      },
    }),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === 'sign-in') {
          // Send the OTP for sign in
        } else if (type === 'email-verification') {
          // Send the OTP for email verification
        } else {
          // Send the OTP for password reset
        }
      },
    }),
    passkey(),
    oneTap(),
    admin(),
    apiKey(),
    organization(),
    deviceAuthorization({
      // Optional configuration
      expiresIn: '30m', // Device code expiration time
      interval: '5s', // Minimum polling interval
    }),
    captcha({
      provider: 'cloudflare-turnstile', // or google-recaptcha, hcaptcha, captchafox
      secretKey: process.env.TURNSTILE_SECRET_KEY!,
    }),
    haveIBeenPwned(),
    lastLoginMethod(),
    multiSession(),
    emailHarmony(),
    sso(),
  ],
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
})
