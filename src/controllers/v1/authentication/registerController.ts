import { NextFunction, Response } from "express"
import signUpService from "../../../services/v1/authentication/signupService"
import { IRequest } from "../../../typings/interface/express"
import BaseController from "../baseController"

export default new class RegisterController extends BaseController {
    /** Sign up user
     * @returns message
     */
    public async handle(req: IRequest, res: Response, next: NextFunction) {
        try {
            /** Get email, username, password from req.body
             * and calling User Registration Service
             * @param email
             * @param username
             * @param password
             */
            await signUpService({ ...req.body })

            // Return message
            return this.infoMessage(res, {
                message: "Your account was successfully registered. Please refer to your email for activation",
                status: 200,
            })
        } catch (error) {
            next(error)
        }
    }
}
