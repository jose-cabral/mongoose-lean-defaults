import mongoose from 'mongoose';
import mongooseLeanDefaults from '../..';

const { MONGO_URI = 'mongodb://localhost:27017/mongooseLeanDefaults' } =
  process.env;

interface SubSchema {
  a: string | null | undefined;
}

interface MySchema {
  sub?: SubSchema | null;
  sub2?: SubSchema | null;
}

const SubSchema = new mongoose.Schema({
  a: { type: String, default: 'whatever' },
});

const MySchema = new mongoose.Schema(
  {
    sub: {
      type: SubSchema,
      default: undefined,
    },
    sub2: {
      type: SubSchema,
    },
  },
  {
    collection: 'issues_32',
  },
);

MySchema.plugin(mongooseLeanDefaults, { defaults: true });

// 30.spec.ts
describe('Issue #32', () => {
  let MyModel: mongoose.Model<MySchema>;

  beforeAll(async () => {
    await mongoose.connect(MONGO_URI);
    MyModel = mongoose.model('Test', MySchema);
  });

  beforeEach(async () => {
    await MyModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should respect undefined default on sub-schema', async () => {
    await MyModel.collection.insertOne({});
    const result = await MyModel.findOne({}).lean().exec();
    expect(result?.sub).toBeUndefined();
  });

  it('should not apply defaults on non-required and non-defaulted paths', async () => {
    await MyModel.collection.insertOne({});
    const result = await MyModel.findOne({}).lean().exec();
    expect(result?.sub2).toBeUndefined();
  });
});
