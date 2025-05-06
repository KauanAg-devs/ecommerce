import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailValidationService {
  private readonly requirements = [
    { rule: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'not valid email format' },
  ];

  getValidationErrors(email: string): string[] {
    const errors: string[] = [];
    this.requirements.forEach((validation) => {
      if (!validation.rule.test(email)) errors.push(validation.message);
    });
    return errors;
  }
}
