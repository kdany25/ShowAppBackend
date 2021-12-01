import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

import { Observable } from 'rxjs';

@Injectable()
export class IsUserAdminOrOrganizerGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const param = request.params;
    const user = request.user;

    if (!user || !param) return false;

    // find if logged in user ORGANIZER is ADMIN
    return (user.role === 'ADMIN' || user.role === 'ORGANISER');
  }
}
