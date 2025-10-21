import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string, name: string) {
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const user = await this.usersService.create({
      email,
      password: hashedPassword,
      name,
    })

    const { password: _, ...result } = user
    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    })

    return {
      ...result,
      accessToken,
    }
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email)

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const { password: _, ...result } = user
    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    })

    return {
      ...result,
      accessToken,
    }
  }

  async validateUser(userId: string) {
    return this.usersService.findOne(userId)
  }
}
