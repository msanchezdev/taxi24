import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export type SeederConfig<C extends new () => I, I> = {
  type: C;
  records: (InstanceType<C> extends {
    id: infer ID;
  }
    ? Omit<InstanceType<C>, 'id'> & { id?: ID }
    : InstanceType<C>)[];
};

export async function seed<C extends new () => I, I>(
  app: INestApplication,
  modelClass: C,
  data: SeederConfig<C, I>['records'],
) {
  const model = app.get<Model<C>>(getModelToken(modelClass.name));

  const docs = await model.create(data);
  return docs;
}
