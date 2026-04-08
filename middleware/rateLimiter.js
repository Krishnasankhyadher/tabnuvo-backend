import rateLimit from "express-rate-limit";

// Strict limiter for login attempts
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // max 10 login attempts per 15 min
    message: {
        success: false,
        message: "Too many login attempts. Please try again after 15 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// General limiter for form submissions (enquiry, newsletter)
export const formLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // max 20 submissions per 15 min
    message: {
        success: false,
        message: "Too many submissions. Please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// General API limiter
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
});
