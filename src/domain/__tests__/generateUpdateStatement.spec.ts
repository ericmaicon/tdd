import { generateUpdateStatement } from '..';
import { Document } from '../protocol';

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
        },
        {
          _id: 6,
          text: 'orange',
        },
      ],
    },
    {
      _id: 4,
      value: 'three',
      mentions: [],
    },
  ],
} as Document;

describe('generateUpdateStatement', () => {
  test('Should "Update value field of post at index 0" with the input "Update value field of post at index 0"', () => {
    const input = { posts: [{ _id: 2, value: 'too' }] };

    const output = generateUpdateStatement(document, input);

    expect(output).toEqual({
      $update: {
        'posts.0.value': 'too',
      },
    });
  });

  test('Should "Update text field in mention with _id of 5, for post with _id of 2" with the input "Update text field in mention at index 1, for post at index 0"', () => {
    const input = { posts: [{ _id: 3, mentions: [{ _id: 5, text: 'pear' }] }] };

    const output = generateUpdateStatement(document, input);

    expect(output).toEqual({ $update: { 'posts.1.mentions.0.text': 'pear' } });
  });

  test('Should "Add post" with the input "Add post; notice that there is no _id because the post doesnt exist yet"', () => {
    const input = { posts: [{ value: 'four' }] };

    const output = generateUpdateStatement(document, input);

    expect(output).toEqual({ $add: { posts: [{ value: 'four' }] } });
  });

  test('Should "Add mention to post with _id of 3" with the input "Add mention for post at index 2"', () => {
    const input = { posts: [{ _id: 3, mentions: [{ text: 'banana' }] }] };

    const output = generateUpdateStatement(document, input);

    expect(output).toEqual({ $add: { 'posts.1.mentions': [{ text: 'banana' }] } });
  });

  test('Should "Remove post at index 0" with the input "Remove post with _id of 2"', () => {
    const input = { posts: [{ _id: 2, _delete: true }] };

    const output = generateUpdateStatement(document, input);

    expect(output).toEqual({ $remove: { 'posts.0': true } });
  });

  test('Should "Remove mention with _id of 6, for post with _id of 3" with the input "Remove mention at index 1, for post at index 1"', () => {
    const input = { posts: [{ _id: 3, mentions: [{ _id: 6, _delete: true }] }] };

    const output = generateUpdateStatement(document, input);

    expect(output).toEqual({ $remove: { 'posts.1.mentions.1': true } });
  });

  test('Should Update, Add and Remove in single statement', () => {
    const input = {
      posts: [
        { _id: 2, value: 'too' },
        { value: 'four' },
        { _id: 4, _delete: true },
      ],
    } as Document;

    const output = generateUpdateStatement(document, input);

    expect(output).toEqual({
      $update: {
        'posts.0.value': 'too',
      },
      $add: {
        posts: [
          {
            value: 'four',
          },
        ],
      },
      $remove: {
        'posts.2': true,
      },
    });
  });

  test('Should update all items', () => {
    const input = {
      posts: [
        {
          _id: 2,
          value: 'one-changed',
        },
        {
          _id: 3,
          value: 'two-changed',
          mentions: [
            {
              _id: 5,
              text: 'apple-changed',
            },
            {
              _id: 6,
              text: 'orange-changed',
            },
          ],
        },
        {
          _id: 4,
          value: 'three-changed',
        },
      ],
    } as Document;

    const output = generateUpdateStatement(document, input);

    expect(output).toEqual({
      $update: {
        'posts.0.value': 'one-changed',
        'posts.1.mentions.0.text': 'apple-changed',
        'posts.1.mentions.1.text': 'orange-changed',
        'posts.1.value': 'two-changed',
        'posts.2.value': 'three-changed',
      },
    });
  });

  test('Should update two values', () => {
    const input = {
      posts: [
        {
          _id: 3,
          value: 'two-changed',
          anotherValue: 'two-changed',
          mentions: [
            {
              _id: 5,
              text: 'apple-changed',
              anotherValue: 'apple-changed',
            },
          ],
        },
      ],
    } as Document;

    const anotherDocument = {
      _id: 1,
      name: 'Johnny Content Creator',
      posts: [
        {
          _id: 3,
          value: 'two',
          anotherValue: 'two',
          mentions: [
            {
              _id: 5,
              text: 'apple',
              anotherValue: 'apple',
            },
          ],
        },
      ],
    } as Document;

    const output = generateUpdateStatement(anotherDocument, input);

    expect(output).toEqual({
      $update: {
        'posts.0.value': 'two-changed',
        'posts.0.anotherValue': 'two-changed',
        'posts.0.mentions.0.text': 'apple-changed',
        'posts.0.mentions.0.anotherValue': 'apple-changed',
      },
    });
  });

  test('Should add in all sub documents', () => {
    const input = {
      posts: [
        {
          _id: 2,
          mentions: [
            {
              value: '2 - new mention',
            },
            {
              value: '2 - new mention twice',
            },
          ],
        },
        {
          _id: 3,
          mentions: [
            {
              value: '3 - new mention',
            },
          ],
        },
        {
          _id: 4,
          mentions: [
            {
              value: '4 - new mention',
            }],
        },
        {
          value: 'new comment',
        },
        {
          value: 'new comment twice',
        },
      ],
    } as Document;
    const output = generateUpdateStatement(document, input);

    expect(output).toEqual({
      $add: {
        'posts.0.mentions': [
          {
            value: '2 - new mention',
          },
          {
            value: '2 - new mention twice',
          },
        ],
        'posts.1.mentions': [
          {
            value: '3 - new mention',
          },
        ],
        'posts.2.mentions': [
          {
            value: '4 - new mention',
          },
        ],
        posts: [
          {
            value: 'new comment',
          },
          {
            value: 'new comment twice',
          },
        ],
      },
    });
  });

  test('Should add with different sub documents', () => {
    const input = {
      posts: [
        {
          _id: 2,
          mentions: [
            {
              value: '2 - new mention',
            },
            {
              value: '2 - new mention twice',
            },
          ],
          authors: [
            {
              name: 'Eric',
            },
            {
              name: 'John',
            },
          ],
        },
      ],
    } as Document;

    const anotherDocument = {
      _id: 1,
      name: 'Johnny Content Creator',
      posts: [
        {
          _id: 2,
          value: 'one',
          mentions: [],
          authors: [],
        },
      ],
    } as Document;

    const output = generateUpdateStatement(anotherDocument, input);

    expect(output).toEqual({
      $add: {
        'posts.0.mentions': [
          {
            value: '2 - new mention',
          },
          {
            value: '2 - new mention twice',
          },
        ],
        'posts.0.authors': [
          {
            name: 'Eric',
          },
          {
            name: 'John',
          },
        ],
      },
    });
  });

  test('Should remove all data', () => {
    const input = {
      posts: [
        {
          _id: 2,
          _delete: true,
        },
        {
          _id: 3,
          value: 'two',
          mentions: [
            {
              _id: 5,
              _delete: true,
            },
            {
              _id: 6,
              _delete: true,
            },
          ],
        },
        {
          _id: 4,
          _delete: true,
        },
      ],
    } as Document;

    const output = generateUpdateStatement(document, input);

    expect(output).toEqual({
      $remove: {
        'posts.0': true,
        'posts.1.mentions.0': true,
        'posts.1.mentions.1': true,
        'posts.2': true,
      },
    });
  });
});
