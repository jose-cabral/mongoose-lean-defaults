import mongoose, { Model, Schema } from 'mongoose';
import mongooseLeanDefaults from '..';

interface IChild {
  first_name: string;
  last_name: string;
}

interface IProjection {
  name: string;
  child1: IChild;
  children1: {
    child1: IChild;
    child2: IChild;
  };
  child2: IChild;
  children2: {
    child1: IChild;
    child2: IChild;
  };
  grandchildren: Array<{
    child1: IChild;
    child2: IChild;
  }>;
}

const childSchema = new Schema({
  first_name: { type: String, default: 'child first name' },
  last_name: { type: String, default: 'child last name' },
});

const childrenSchema = new Schema({
  child1: childSchema,
  child2: childSchema,
});

const schema = new Schema<IProjection>(
  {
    name: { type: String, default: 'parent name' },
    child1: {
      first_name: { type: String, default: 'child first name' },
      last_name: { type: String, default: 'child last name' },
    },
    children1: {
      child1: {
        first_name: { type: String, default: 'child first name' },
        last_name: { type: String, default: 'child last name' },
      },
      child2: {
        first_name: { type: String, default: 'child first name' },
        last_name: { type: String, default: 'child last name' },
      },
    },
    child2: childSchema,
    children2: {
      child1: childSchema,
      child2: childSchema,
    },
    grandchildren: [childrenSchema],
  },
  { collection: 'projection' },
);

schema.plugin(mongooseLeanDefaults);

const { MONGO_URI = 'mongodb://localhost:27017/mongooseLeanDefaults' } =
  process.env;
describe('projections', () => {
  let MyModel: Model<IProjection>;

  beforeAll(async () => {
    await mongoose.connect(MONGO_URI);
    MyModel = mongoose.model('Projection', schema);
  });

  beforeEach(async () => {
    await MyModel.deleteMany({}).exec();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should respect projections', async () => {
    // arrange
    await MyModel.collection.insertOne({
      grandchildren: [
        {
          child2: { last_name: 'child last name' },
        },
      ],
    });
    // act
    const result = (await MyModel.findOne({})
      .select({
        name: 1,
        child1: 1,
        'children1.child1': 1,
        'children1.child2.first_name': 1,
        child2: 1,
        'children2.child1': 1,
        'children2.child2.first_name': 1,
        'grandchildren.child1': 1,
        'grandchildren.child2.first_name': 1,
      })
      .lean({ defaults: true })
      .exec())!;
    // assert
    expect(result.name).toEqual('parent name');
    expect(result.child1).toEqual(expect.objectContaining({ first_name: 'child first name', last_name: 'child last name' }));
    expect(result.children1.child1).toEqual(expect.objectContaining({ first_name: 'child first name', last_name: 'child last name' }));
    expect(result.children1.child2.first_name).toEqual('child first name');
    expect(result.children1.child2.last_name).toBeUndefined();
    expect(result.child2).toBeUndefined();
    expect(result.children2).toBeUndefined();
    expect(result.grandchildren[0].child1).toBeUndefined();
    expect(result.grandchildren[0].child2.first_name).toEqual('child first name');
    expect(result.grandchildren[0].child2.last_name).toBeUndefined();
  });
});
