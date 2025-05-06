import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordValidationService {
    private readonly requirements = [
          { rule:  /^.{8,}$/, message: 'at least 8 characters'},
          { rule: /[0-9]/, message: 'at least one number' },
          { rule: /[a-zA-Z]/, message: 'at least one letter' },
        ]
    
    getValidationErrors(password: string) {
      const errors: string[] = [];

      this.requirements.forEach(validation =>{
        if(!validation.rule.test(password)) errors.push(validation.message)
      })

      return errors
    }

    async hash(password: string): Promise<string> {
      return bcrypt.hash(password, 12);
    }

    async compare(password: string, hashedPassword: string): Promise<boolean>{
        return bcrypt.compare(password, hashedPassword)
    }
}