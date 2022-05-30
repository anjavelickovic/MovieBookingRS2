import { IBasicResponse } from "./basic-response";

export interface IRefreshTokenResponse extends IBasicResponse {
    accessToken: string;
    refreshToken: string;
}