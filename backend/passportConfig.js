import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "./models/user.model.js";
import { generateTokenAndSetCookie } from './utils/generateTokenAndSetCookie.js';


// Initialize Passport with Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: `${process.env.API_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user exists
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          // Create a new user if not found
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            isVerified: true, // Mark Google users as verified
          });
          await user.save();
        }

      

        // Generate JWT token
        const token = generateTokenAndSetCookie(user._id);

        // Pass both user and token to Passport
        return done(null, { user, token });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((data, done) => done(null, data));
passport.deserializeUser((data, done) => done(null, data));

export default passport;
