import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const existing = await this.userModel.findOne({ username: createUserDto.username }).exec();
        if (existing) {
            throw new ConflictException('Username already exists');
        }
        const hashed = await bcrypt.hash(createUserDto.password, 10);
        const created = new this.userModel({ username: createUserDto.username, password: hashed });
        return created.save();
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.userModel.findOne({ username }).exec();
    }

    async findById(id: Types.ObjectId): Promise<User | null> {
        return this.userModel.findById(id).exec();
    }

    async updatePassword(id: Types.ObjectId, dto: UpdateUserDto): Promise<User | null> {
        if (!dto.password) return null;
        const hashed = await bcrypt.hash(dto.password, 10);
        return this.userModel.findByIdAndUpdate(id, { password: hashed }, { new: true }).exec();
    }
}
