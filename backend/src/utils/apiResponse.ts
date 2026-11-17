import { Response } from 'express';
import { ApiResponseData, PaginationMeta } from '../types';

export class ApiResponse {
  static success<T>(
    res: Response,
    message: string,
    data?: T,
    statusCode = 200,
    pagination?: PaginationMeta
  ): Response {
    const payload: ApiResponseData<T> = {
      success: true,
      message,
      ...(data !== undefined && { data }),
      ...(pagination && { pagination }),
    };

    return res.status(statusCode).json(payload);
  }

  static error(
    res: Response,
    message: string,
    statusCode = 500,
    errors?: unknown[]
  ): Response {
    const payload: ApiResponseData = {
      success: false,
      message,
      ...(errors && { errors }),
    };

    return res.status(statusCode).json(payload);
  }
}
