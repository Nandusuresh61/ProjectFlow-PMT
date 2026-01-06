import { Model } from "mongoose";

export class MongoBaseRepository {
  protected model: Model<any>;

  constructor(model: Model<any>) {
    this.model = model;
  }

  async create(data: any) {
    return this.model.create(data);
  }

  async findById(id: string) {
    return this.model.findById(id);
  }

  async findOne(filter: any) {
    return this.model.findOne(filter);
  }

  async findAll() {
    return this.model.find();
  }

  async updateById(id: string, data: any) {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteById(id: string) {
    return this.model.findByIdAndDelete(id);
  }
}
