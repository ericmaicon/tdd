# TDD small project

This is a small TDD Project NOT ready for production.

The purpose of the project is to implement small functions with TDD, Typescript and Node.

## Table of Contents

- [Functional Requirements](#functional-requirements)
- [Install](#install)
- [Usage](#usage)
- [Tests](#tests)
- [To Improve](#to-improve)

## Functional Requirements

Write a generic routine that accepts as input:

`original document`

a `mutation` that describes only what needs updating in the original document

and outputs

an `update statement`.

## Install

This project uses [node](http://nodejs.org) and [yarn](https://yarnpkg.com/). Go check them out if you don't have them locally installed.

```sh
yarn install
```

## Usage

To simple check functions output, you can:

```sh
yarn execute
```

## Tests

To run the tests, you can:

```sh
yarn test
```

You can also run in the watch mode:

```sh
yarn test --watch
```

## To Improve

1. Implement tests for each function.
2. Integration tests with Mongo.
3. Check by unexistent attributes.
4. Refactor to reduce the code and improve quality.
