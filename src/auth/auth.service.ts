import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';


@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
    ) { }

    async validateUser(username: string, pass: string) {
        const user = await this.userModel.findOne({ username }).exec();
        if (!user) return null;
        const matched = await bcrypt.compare(pass, user.password);
        if (matched) {
            // strip password
            const { password, ...result } = user as any;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user._id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async loginWithCredentials(username: string, password: string) {
        const user = await this.validateUser(username, password);
        if (!user) throw new UnauthorizedException('Invalid credentials');
        return this.login(user);
    }

    async register(createUserDto: { username: string; password: string }) {
        const existing = await this.userModel.findOne({ username: createUserDto.username }).exec();
        if (existing) {
            throw new UnauthorizedException('Username already exists');
        }
        const hashed = await bcrypt.hash(createUserDto.password, 10);
        const created = new this.userModel({ username: createUserDto.username, password: hashed });
        const saved = await created.save();
        const { password, ...result } = saved.toObject();
        return result;
    }
}
