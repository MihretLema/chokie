export class ApiError extends Error {constructor(public status:number,public code:string,message:string){super(message);}}
export const unauthorized=()=>new ApiError(401,'UNAUTHORIZED','Authentication is required.');
export const forbidden=()=>new ApiError(403,'FORBIDDEN','You do not have permission to perform this action.');
export const missing=()=>new ApiError(404,'NOT_FOUND','The requested resource was not found.');
