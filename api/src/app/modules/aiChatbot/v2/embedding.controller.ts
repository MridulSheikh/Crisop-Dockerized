import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import httpStatus from "http-status";
import { addKnowladgeServices } from "./embadding.services";


export const addKnowladgeController = catchAsync(async(req: Request, res: Response)=>{
     const {content, title, description} = req.body;

     const result = await addKnowladgeServices(content, title, description)

     sendResponse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: "successfully embedded data",
        data: result
     })
})