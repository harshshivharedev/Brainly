import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const authPlugin = (schema) => {
    schema.add({
        password: {
            type: String,
            required: [true, "Password is required"],
            select: false, // default query mein nahi aayega; chahiye to .select("+password")
        },
        refreshToken: {
            type: String,
            select: false,
        },
    });

    schema.pre("save", async function () {
        if (!this.isModified("password")) return;
        this.password = await bcrypt.hash(this.password, 10);
    });

    // Password verify
    schema.methods.isPasswordCorrect = async function (password) {
        return await bcrypt.compare(password, this.password);
    };

    // Short-lived access token (payload: _id, email, username)
    schema.methods.generateAccessToken = function () {
        return jwt.sign(
            {
                _id: this._id,
                email: this.email,
                username: this.username,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
            }
        );
    };

    // Long-lived refresh token (payload: sirf _id)
    schema.methods.generateRefreshToken = function () {
        return jwt.sign(
            {
                _id: this._id,
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
            }
        );
    };
};

export default authPlugin;