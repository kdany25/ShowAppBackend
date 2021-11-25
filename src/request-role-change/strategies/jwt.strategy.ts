import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "src/shared/interfaces";
import { User } from "src/user/entities/user.entity";
import { RequestRoleChangeService } from "../request-role-change.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly requestRoleChangeService: RequestRoleChangeService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET,
    })
  }
  async validate(payload: JwtPayload): Promise<User> {
    return await this.requestRoleChangeService.validateUser(payload)
  }
}