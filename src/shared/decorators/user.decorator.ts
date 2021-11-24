/* eslint-disable prettier/prettier */
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "src/user/entities/user.entity";

export const GetUserFromRequest = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return key ? user?.[key] : user;
  },
);

export const GetUserFromRequests = createParamDecorator(
  (key: User, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return key ? user : user;
  },
);