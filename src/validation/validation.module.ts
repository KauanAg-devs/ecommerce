import { Module } from "@nestjs/common";
import { PasswordValidationService } from "./password.validation.service";
import { EmailValidationService } from "./email.validation.service";

@Module({
    providers: [PasswordValidationService, EmailValidationService],
    exports: [PasswordValidationService, EmailValidationService]
})
export class ValidationModule {}