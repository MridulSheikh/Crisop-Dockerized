"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = __importDefault(require("./user.model"));
const config_1 = __importDefault(require("../../config"));
const user_utils_1 = require("./user.utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const email_1 = __importDefault(require("../../helpers/email"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const fs_1 = __importDefault(require("fs"));
const fetchGoogleUserInfo_1 = require("../../utils/fetchGoogleUserInfo");
const fechFacebookUserInfo_1 = require("../../utils/fechFacebookUserInfo");
const generateVerificationCode_1 = require("../../utils/generateVerificationCode");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const redis_service_1 = require("../Redis/redis.service");
const RedisClient_1 = __importDefault(require("../../config/RedisClient"));
// create user into database
const createUserIntoDatabaseService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // is user exists on database
    const isUserExists = yield user_model_1.default.isUserExsitsByUserEmail(payload.email);
    if (isUserExists) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, 'This email already taken');
    }
    const newUser = yield user_model_1.default.create(payload);
    // send verification mail
    yield createVerificationCodeService(newUser.email);
    return newUser;
});
// login user service
const loginUserService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // is user exists on databse
    const isUserExists = yield user_model_1.default.isUserExsitsByUserEmail(payload.email);
    if (!isUserExists) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Wrong credential input');
    }
    // is password matched
    const isPasswordMatched = yield user_model_1.default.isPasswordMatch(payload.password, isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.password);
    if (!isPasswordMatched) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Wrong credential input');
    }
    // check is user verified or not
    if (!isUserExists.isVerified) {
        yield createVerificationCodeService(payload.email);
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You are not verified, please check your email!');
    }
    // update user need user login status
    yield user_model_1.default.findOneAndUpdate({ email: payload.email }, { needLogin: false });
    const jwtPayload = {
        _id: isUserExists._id,
        role: isUserExists.role,
        email: isUserExists.email,
        name: isUserExists.name,
        image: isUserExists.image,
        authProvider: isUserExists.authProvider,
    };
    // create token and sent to the client
    const accessToken = (0, user_utils_1.createToken)(jwtPayload, config_1.default.JWT_ACCESS_SECRET, config_1.default.JWT_ACCESS_EXPIRES_ID);
    // create refresh token
    const refreshToken = (0, user_utils_1.createToken)(jwtPayload, config_1.default.REFRESH_SECRET, config_1.default.REFRESH_EXPIREIN);
    // return jwt token
    return {
        accessToken,
        refreshToken,
        role: isUserExists.role,
    };
});
// get single user from db
const getSingleUserFromDBService = (email, role, requestEmail) => __awaiter(void 0, void 0, void 0, function* () {
    // validation for only admin or user can access this data
    const isValidRequest = requestEmail === email ? true : role === 'admin' ? true : false;
    if (!isValidRequest) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid request');
    }
    const result = yield user_model_1.default.findOne({ email: email });
    // if user not exist in database
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'user not found!');
    }
    return result;
});
// refresh token serivce
const refreshTokenService = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the give token is valid
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.REFRESH_SECRET);
    const { email } = decoded;
    // checking if the user is exists
    const user = yield user_model_1.default.isUserExsitsByUserEmail(email);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'User not found!');
    }
    const jwtPayload = {
        _id: user._id,
        role: user.role,
        email: user.email,
        name: user.name,
        image: user.image,
        authProvider: user.authProvider,
    };
    // create refresh token
    const accessToken = (0, user_utils_1.createToken)(jwtPayload, config_1.default.JWT_ACCESS_SECRET, config_1.default.JWT_ACCESS_EXPIRES_ID);
    return {
        accessToken,
    };
});
// forgot password
const forgotPassowrdService = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const RATE_LIMIT_KEY = `forgot_password_rate_limit:${email}`;
    const MAX_REQUESTS = 3;
    const RATE_LIMIT_WINDOW = 60 * 15;
    // Rate Limiting
    const attempts = yield RedisClient_1.default.incr(RATE_LIMIT_KEY);
    if (attempts === 1) {
        yield RedisClient_1.default.expire(RATE_LIMIT_KEY, RATE_LIMIT_WINDOW);
    }
    if (attempts > MAX_REQUESTS) {
        const ttl = yield RedisClient_1.default.ttl(RATE_LIMIT_KEY);
        throw new AppError_1.default(http_status_1.default.TOO_MANY_REQUESTS, `Too many reset password requests. Please try again after ${Math.round(ttl / 60)} Minute.`);
    }
    // Check User
    const user = yield user_model_1.default.isUserExsitsByUserEmail(email);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Invalid request, user not found!');
    }
    const jwtPayload = {
        _id: user._id,
        role: user.role,
        email: user.email,
    };
    // Create Reset Token
    const forgotPasswordToken = (0, user_utils_1.createToken)(jwtPayload, config_1.default.JWT_RESETPASSWORD_TOKEN_SECRET, config_1.default.JWT_RESETPASSWORD_TOKEN_EXPIREIN);
    // Store token inside Redis
    yield redis_service_1.RedisService.set(`reset-password:${email}`, forgotPasswordToken, 60 * 3);
    // Create Reset Link
    const resetPasswordLink = `${config_1.default.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : config_1.default.CLIENT_URL}/reset-password?token=${forgotPasswordToken}`;
    const templatePath = path_1.default.join(
    // eslint-disable-next-line no-undef
    __dirname, '../../utils/templates/resetPassword/html.ejs');
    const emailTemplate = yield ejs_1.default.renderFile(templatePath, {
        name: user.name,
        resetLink: resetPasswordLink,
    });
    try {
        yield (0, email_1.default)(user.email, 'Action needed! Reset your password', emailTemplate);
    }
    catch (error) {
        yield RedisClient_1.default.del(`reset-password:${email}`);
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to send reset password email.');
    }
    return null;
});
// Reset password
const resetPasswordServices = (token, password) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not Authorized');
    }
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.JWT_RESETPASSWORD_TOKEN_SECRET);
    const { email } = decoded;
    const user = yield user_model_1.default.isUserExsitsByUserEmail(email);
    // if user not exist
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Invalid request, user not found!');
    }
    // if resetlink not expire
    const cacheToken = yield redis_service_1.RedisService.get(`reset-password:${email}`);
    if (!cacheToken) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Invalid request, link already expire');
    }
    // // hased password
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    // Update the user's password in DB
    yield user_model_1.default.findOneAndUpdate({ email }, {
        password: hashedPassword,
    });
    // make jwt expire after one time use
    yield redis_service_1.RedisService.del(`reset-password:${email}`);
});
const createUserTokens = (user) => {
    const jwtPayload = {
        _id: user._id,
        role: user.role,
        email: user.email,
        name: user.name,
        image: user.image,
        authProvider: user.authProvider,
    };
    const accessToken = (0, user_utils_1.createToken)(jwtPayload, config_1.default.JWT_ACCESS_SECRET, config_1.default.JWT_ACCESS_EXPIRES_ID);
    const refreshToken = (0, user_utils_1.createToken)(jwtPayload, config_1.default.REFRESH_SECRET, config_1.default.REFRESH_EXPIREIN);
    return { accessToken, refreshToken };
};
const updateMyProfileService = (requestEmail, payload, 
// eslint-disable-next-line no-undef
file) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.isUserExsitsByUserEmail(requestEmail);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    const updateData = {};
    if (payload.name) {
        updateData.name = payload.name;
    }
    if (payload.email && payload.email !== user.email) {
        if (user.authProvider !== 'local') {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Email change is only available for email/password accounts');
        }
        if (!payload.currentPassword) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Current password is required to change email');
        }
        const isPasswordMatched = yield user_model_1.default.isPasswordMatch(payload.currentPassword, user.password);
        if (!isPasswordMatched) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Current password is wrong');
        }
        const emailOwner = yield user_model_1.default.findOne({ email: payload.email });
        if (emailOwner) {
            throw new AppError_1.default(http_status_1.default.CONFLICT, 'This email already taken');
        }
        updateData.email = payload.email;
    }
    if (file) {
        const uploadedImage = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(file.path, {
            folder: 'users',
        });
        updateData.image = uploadedImage.url;
        fs_1.default.unlinkSync(file.path);
    }
    if (!Object.keys(updateData).length) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'No profile changes provided');
    }
    const updatedUser = yield user_model_1.default.findOneAndUpdate({ email: requestEmail }, updateData, { new: true });
    if (!updatedUser) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Profile not updated');
    }
    return Object.assign({ user: updatedUser }, createUserTokens(updatedUser));
});
const changeMyPasswordService = (requestEmail, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.isUserExsitsByUserEmail(requestEmail);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    if (user.authProvider !== 'local') {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Password change is only available for email/password accounts');
    }
    const isPasswordMatched = yield user_model_1.default.isPasswordMatch(payload.currentPassword, user.password);
    if (!isPasswordMatched) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Current password is wrong');
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.newPassword, 10);
    yield user_model_1.default.findOneAndUpdate({ email: requestEmail }, { password: hashedPassword });
    return null;
});
// Oauth login
const handleOAuthService = (token, method) => __awaiter(void 0, void 0, void 0, function* () {
    let oauthUser;
    if (method === 'google') {
        oauthUser = yield (0, fetchGoogleUserInfo_1.fetchGoogleUserInfo)(token);
    }
    if (method === 'facebook') {
        oauthUser = yield (0, fechFacebookUserInfo_1.fetchFacebookUserInfo)(token);
    }
    if (!(oauthUser === null || oauthUser === void 0 ? void 0 : oauthUser.email)) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'There was a problem with this Google account. Please try another.');
    }
    let user = yield user_model_1.default.isUserExsitsByUserEmail(oauthUser.email);
    // if user does not exist database
    if (!user) {
        user = yield user_model_1.default.create({
            name: oauthUser.name,
            email: oauthUser.email,
            image: oauthUser.image,
            isVerified: true,
            authProvider: method,
        });
    }
    if (!user.isVerified) {
        user = yield user_model_1.default.findOneAndUpdate({ email: user.email }, { isVerified: true }, { new: true, upsert: true });
    }
    // update user need user login status
    yield user_model_1.default.findOneAndUpdate({ email: user.email }, { needLogin: false });
    const jwtPayload = {
        _id: user._id,
        role: user.role,
        email: user.email,
        name: user.name,
        image: user.image,
        authProvider: user.authProvider,
    };
    // generate jwt token
    const accessToken = (0, user_utils_1.createToken)(jwtPayload, config_1.default.JWT_ACCESS_SECRET, config_1.default.JWT_ACCESS_EXPIRES_ID);
    // create refresh token
    const refreshToken = (0, user_utils_1.createToken)(jwtPayload, config_1.default.REFRESH_SECRET, config_1.default.REFRESH_EXPIREIN);
    return {
        accessToken,
        refreshToken,
    };
});
// create verification code service
const createVerificationCodeService = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const RATE_LIMIT_KEY = `email_verify_rate_limit:${email}`;
    const OTP_KEY = `email-verification:${email}`;
    const MAX_REQUESTS = 3;
    const RATE_LIMIT_WINDOW = 60;
    const OTP_EXPIRE_TIME = 60 * 3;
    // Rate Limiting
    const attempts = yield RedisClient_1.default.incr(RATE_LIMIT_KEY);
    // First request
    if (attempts === 1) {
        yield RedisClient_1.default.expire(RATE_LIMIT_KEY, RATE_LIMIT_WINDOW);
    }
    if (attempts > MAX_REQUESTS) {
        const ttl = yield RedisClient_1.default.ttl(RATE_LIMIT_KEY);
        throw new AppError_1.default(http_status_1.default.TOO_MANY_REQUESTS, `Too many requests. Please try again after ${ttl} seconds.`);
    }
    // Check User
    const user = yield user_model_1.default.isUserExsitsByUserEmail(email);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Invalid request, user not found!');
    }
    // Generate OTP
    const code = (0, generateVerificationCode_1.generateVerificationCode)();
    yield redis_service_1.RedisService.set(OTP_KEY, code, OTP_EXPIRE_TIME);
    // Email Template
    const templatePath = path_1.default.join(
    // eslint-disable-next-line no-undef
    __dirname, '../../utils/templates/varification/email-verification.ejs');
    const emailTemplate = yield ejs_1.default.renderFile(templatePath, {
        name: user.name,
        code,
    });
    try {
        // Send Email
        yield (0, email_1.default)(user.email, 'Action needed! Verify your email address', emailTemplate);
    }
    catch (error) {
        // delete otp if eamil failed
        yield redis_service_1.RedisService.del(OTP_KEY);
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to send verification email.');
    }
    return null;
});
// verify email service
const verifyEmailSerivce = (email, code) => __awaiter(void 0, void 0, void 0, function* () {
    // Get verification code
    const verificationCode = yield redis_service_1.RedisService.get(`email-verification:${email}`);
    // check code match or not
    if (verificationCode !== code) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Incorrect Code');
    }
    // make verified user
    const verified = yield user_model_1.default.findOneAndUpdate({ email }, { isVerified: true }, { upsert: true, new: true });
    // delete code frome cache
    yield redis_service_1.RedisService.del(`email-verification:${email}`);
    const jwtPayload = {
        _id: verified._id,
        role: verified.role,
        email: verified.email,
        name: verified.name,
        image: verified.image,
        authProvider: verified.authProvider,
    };
    // create token and sent to the client
    const accessToken = (0, user_utils_1.createToken)(jwtPayload, config_1.default.JWT_ACCESS_SECRET, config_1.default.JWT_ACCESS_EXPIRES_ID);
    // create refresh token
    const refreshToken = (0, user_utils_1.createToken)(jwtPayload, config_1.default.REFRESH_SECRET, config_1.default.REFRESH_EXPIREIN);
    return {
        accessToken,
        refreshToken,
    };
});
// change user role
const changeUserRoleServices = (email, role) => __awaiter(void 0, void 0, void 0, function* () {
    // check if user exists
    const isExists = yield user_model_1.default.isUserExsitsByUserEmail(email);
    // check role is super or not
    if (isExists.role === 'super') {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Super Admin cannot be removed or modified.');
    }
    // check if user not exist in database
    if (!isExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'user not founed!');
    }
    const result = yield user_model_1.default.findOneAndUpdate({ email }, { role: role, needLogin: true }, { new: true, upsert: true });
    return result;
});
// add team member
const AddTeamMemberServices = (email, role) => __awaiter(void 0, void 0, void 0, function* () {
    const restricRole = ['admin', 'super', 'manager'];
    const user = yield user_model_1.default.isUserExsitsByUserEmail(email);
    // check user exist or not
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found.');
    }
    // check if user already have team
    if (restricRole.includes(user.role)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'This user already team member.');
    }
    // check authentic role
    if (!restricRole.includes(role)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Please provide valid role (admin, super, manager)');
    }
    const result = yield user_model_1.default.findOneAndUpdate({ email }, { role: role, needLogin: true }, { new: true, upsert: true });
    return result;
});
// get all user service
const getAlluserFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const mongoQuery = {};
    // handle role=admin,manager
    if (query.role && typeof query.role === 'string') {
        mongoQuery.role = { $in: query.role.split(',') };
    }
    // final output result
    const userQuery = new QueryBuilder_1.default(user_model_1.default.find(mongoQuery), query)
        .search(['email', 'name'])
        .filter()
        .fields()
        .paginate();
    const result = yield userQuery.modelQuery;
    // pagination info
    const total = yield user_model_1.default.countDocuments(mongoQuery);
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 10);
    const totalPages = Math.ceil(total / limit);
    return {
        meta: {
            total,
            page,
            limit,
            totalPages,
        },
        data: result,
    };
});
const userService = {
    changeUserRoleServices,
    createUserIntoDatabaseService,
    loginUserService,
    getSingleUserFromDBService,
    refreshTokenService,
    forgotPassowrdService,
    resetPasswordServices,
    handleOAuthService,
    createVerificationCodeService,
    verifyEmailSerivce,
    getAlluserFromDB,
    AddTeamMemberServices,
    updateMyProfileService,
    changeMyPasswordService,
};
exports.default = userService;
