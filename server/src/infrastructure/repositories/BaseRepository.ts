import { Model, Document, QueryFilter, UpdateQuery } from "mongoose";

export abstract class BaseRepository<TEntity, TDoc extends Document> {
  constructor(protected readonly model: Model<TDoc>) { }

  protected abstract mapToEntity(doc: TDoc): TEntity;

  async create(data: Partial<TDoc>): Promise<TEntity> {
    const created = await this.model.create(data);
    return this.mapToEntity(created as TDoc);
  }

  async findOne(filter: QueryFilter<TDoc>): Promise<TEntity | null> {
    const found = await this.model.findOne(filter).exec();
    return found ? this.mapToEntity(found) : null;
  }

  async find(filter: QueryFilter<TDoc>): Promise<TEntity[]> {
    const docs = await this.model.find(filter).exec();
    return docs.map((doc) => this.mapToEntity(doc));
  }

  async findAll(skip: number = 0, limit: number = 10): Promise<TEntity[]> {
    const docs = await this.model.find().skip(skip).limit(limit).exec();
    return docs.map((doc) => this.mapToEntity(doc));
  }

  async updateOne(filter: QueryFilter<TDoc>, update: UpdateQuery<TDoc>): Promise<TEntity | null> {
    const updated = await this.model.findOneAndUpdate(filter, update, { returnDocument: "after" }).exec();
    return updated ? this.mapToEntity(updated) : null;
  }

  async deleteOne(filter: QueryFilter<TDoc>): Promise<boolean> {
    const result = await this.model.deleteOne(filter).exec();
    return result.deletedCount === 1;
  }
}
