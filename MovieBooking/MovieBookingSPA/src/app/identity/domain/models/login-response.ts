import { IBasicResponse } from "./basic-response";

export interface ILoginResponse extends IBasicResponse {
    accessToken: string;
    refreshToken: string;
}