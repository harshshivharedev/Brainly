
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Admin } from "../models/admin.model.js";

const generateAccessAndRefreshTokens = async (adminId)=> {
    try{
        const admin = await Admin.findById(adminId)
        const accessToken = Admin.generateAccessToken();
        const refreshToken = Admin.generateRefreshToken();

        admin.refreshToken = refreshToken;
        await admin.save({ validateBeforeSave : false})

        return {accessToken, refreshToken};

    } catch(error) {
        throw new ApiError(500, "something went wrong while generating token")
    }
}

const registerAdmin = asyncHandler( async (req, res) => {
    // get admin details 
    // vallidate
    // check already exist 
    // crate admin 
    // remove password
    // retrun response

    const { fullName, username, email, password } = req.body;

    if(!fullName || !username || !email || !password) {
        throw new ApiError(404, "All fields are required")
    }

    const existedAdmin = await Admin.findOne({
        $or : [{email}, {username}]
    })

    if(existedAdmin){
        throw new ApiError(409, "Admin already register");
    }

    const admin = await Admin.create({
         username,
         email,
         fullName,
         password
    });

    const createdAdmin = await admin.findById(Admin._id).select(
        "-password -refreshToken"
    )

    if(!createdAdmin){
        throw new ApiError(401, "something went wrong")
    }

    return res.status(201).json(
        ApiResponse(200, createdAdmin, "Admin registered successfully")
    )
})


const loginAdmin = asyncHandler( async (req, res) => {
    // req body -> data
    // check username or email
    // admin search
    // password chekc 
    // accesstokem refresh token
    //send cookie

    const { username, email } = req.body;
    if(!(username || email)){
        throw new ApiError (401, "username or email rewuired");
    }

    const admin = await Admin.findOne({
        $or: [{username}, {email}]
    })

    if(!admin){
        throw new ApiError(404, "Invalid creadential")
    }

    const isPasswordValid = await isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(404, "Invalid creadential");
    }

    const {accessToken, refreshToken} = generateAccessAndRefreshTokens(admin._id);

    const loggedInAdmin = await User.findById(admin._id)
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
                admin : loggedInUser, accessToken, refreshToken
            },
            "admin logged in successfully"
        )
    )
})


const logoutAdmin = asyncHandler ( async (req, res) => {
    await User.findByIdAndUpdate(
        req.admin._id,
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
    .json(new ApiResponse(200), {}, "Admin loggedout successfully")
})
