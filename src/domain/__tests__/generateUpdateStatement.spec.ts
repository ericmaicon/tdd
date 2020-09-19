import generateUpdateStatement, { Document } from '../generateUpdateStatement';

const document = {
  _id: 1,
  name: 'Johnny Content Creator',
  posts: [
    {
      _id: 2,
      value: 'one',
      mentions: [],
    },
    {
      _id: 3,
      value: 'two',
      mentions: [
        {
          _id: 5,
          text: 'apple',
        }, {
        }],
    }, {
      _id: 4, value: 'three', mentions: [],
    }],
} as Document;

describe('generateUpdateStatement', () => {
  test('Should return "Update value field of post at index 0" with the input "Update value field of post at index 0"', () => {
    const input = { posts: [{ _id: 2, value: 'too' }] };

    const output = generateUpdateStatement(document, input);

    expect(output).toEqual({
      $update: {
        'posts.0.value': 'too',
      },
    });
  });
});