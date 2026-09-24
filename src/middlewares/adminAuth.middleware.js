
import jwt from "jsonwebtoken";

import { ApiError } from "../utils/apiError.js";
import { Admin } from "../models/admin.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler( async(req, res, next) => {
    try{
        // take token
        const token = req.cookies?.accessToken || 
        req.header("Authorization")?.replace("Bearer ", "");
        
       // validate token exist or not
        if(!token){
            throw new ApiError(401, "Unauthorized access");
        }
        // token varify 
        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // user from token 
        const admin = await Admin.findById(decodeToken?._id).select("-password -refreshToken")

        if(!admin) {
            throw new ApiError(401, "Invalid access token")
        }

        req.admin = admin;
        next();
    } 
    catch(error) {
        throw new ApiError(401, error?.message || "Invalide access token")
    }
})