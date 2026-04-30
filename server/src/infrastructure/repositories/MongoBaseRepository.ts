import { Model, Document } from "mongoose";

export abstract class MongoBaseRepository<TEntity, TDoc extends Document> {
  constructor(protected readonly model: Model<TDoc>) { }

  protected abstract mapToEntity(doc: TDoc): TEntity;

  async create(data: Partial<TDoc>): Promise<TEntity> {
    const created = await this.model.create(data);
    return this.mapToEntity(created as TDoc);
  }

  async findOne(filter: any): Promise<TEntity | null> {
    const found = await this.model.findOne(filter).exec();
    return found ? this.mapToEntity(found) : null;
  }

  async find(filter: any): Promise<TEntity[]> {
    const docs = await this.model.find(filter).exec();
    return docs.map((doc) => this.mapToEntity(doc));
  }

  async findAll(skip: number = 0, limit: number = 10): Promise<TEntity[]> {
    const docs = await this.model.find().skip(skip).limit(limit).exec();
    return docs.map((doc) => this.mapToEntity(doc));
  }

  async updateOne(filter: any, update: any): Promise<TEntity | null> {
    const updated = await this.model.findOneAndUpdate(filter, update, { new: true }).exec();
    return updated ? this.mapToEntity(updated) : null;
  }

  async deleteOne(filter: any): Promise<boolean> {
    const result = await this.model.deleteOne(filter).exec();
    return result.deletedCount === 1;
  }
}
