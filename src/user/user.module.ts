import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { ValidationModule } from "src/validation/validation.module";

@Module({
    controllers: [],
    exports: [UserService],
    providers: [UserService],
    imports: [ValidationModule]
})
export class UserModule {}