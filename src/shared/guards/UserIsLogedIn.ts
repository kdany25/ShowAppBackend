import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

import { Observable } from 'rxjs';

@Injectable()
export class UserIsUserGuard implements CanActivate{

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const param = request.params;
    const user = request.user;

    if (!user || !param) return false;

    // give admin right of update user
    if (user.role === 'ADMIN') return true;

    // find if logged in user is the same as the one who is going to be updated
    return user.userId === param.id;
  }
}