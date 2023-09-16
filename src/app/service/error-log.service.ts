import { Injectable } from "@angular/core";

@Injectable()
export class ErrorLogService {
  logError(message: string) {
    console.error(message);
  }
}
