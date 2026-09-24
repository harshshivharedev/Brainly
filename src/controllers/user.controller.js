
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";

const generateAccessAndRefreshTokens = async ( userId ) => {
    try{
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave : false });
         
        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "something went wrong")
    }
}

const registerUser = asyncHandler ( async (req, res) => {
    // get user details
    // validation 
    // check user already exist 
    // create user object
    // remove password and refresh token 
    // check for user creation
    // return res

    const { fullName , email , username, password} = req.body;

    if(!fullName || !username || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne ({
        $or: [{username}, {email}]
    })

    if(existedUser) {
       throw new ApiError(409, "User already registered")
    }

    const user = await User.create({
        fullName,
        email,
        password,
        username
    })

    const createdUser = await User.findById(user._id).select (
        "-password -refreshToken"
    )

    if(!createdUser) {
        throw new ApiError(500, "Something went wrong")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registerd successfully")
    )
})

const loginUser = asyncHandler(async (req, res) => {
    // req.body -> data
    // username or email
    // find the user 
    // password check 
    // access and refresh token
    // send cookies

    const { email , username , password } = req.body;

    if(!(email || username)){
        throw new ApiError(401, "Email or username are required");
    }

    const user = await User.findOne({
        $or: [{email}, {username}]
    })
    if(!user){
        throw new ApiError(404, "Invalid credential")
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(404, "invalid credential")
    }
    
    const {accessToken, refreshToken } = generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id)
       .select("-password -refreshToken")

    const options = {
        httpOnly : true,
        secure : process.env.NODE_ENV === "production"
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user : loggedInUser, accessToken, refreshToken
            },
            "user logged in successfully"
        )
    )
})

const logoutUser = asyncHandler ( async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set : {
                refreshToken : undefined
            }
        },
        {
            new : true
        }
    )
    const options = {
        httpOnly: true,
        secure : process.env.NODE_ENV === "production"
    }

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200), {}, "User loggedout successfully")
})