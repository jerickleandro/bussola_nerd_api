import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersRepository } from '../domain/interfaces/users.repository.interface';
import { User, UserDocument } from './schemas/user.schema';

export class UsersMongooseRepository implements UsersRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().lean().exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).lean().exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).lean().exec();
  }

  async create(data: {
    name: string;
    email: string;
    passwordHash: string;
    role: string;
  }): Promise<User> {
    const created = new this.userModel(data);
    return created.save();
  }
}
