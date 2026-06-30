# Contributing to Gnist

Thank you for your interest in Gnist!

Please note that this repository is maintained strictly as a personal project and its **issue tracker is closed**. At this time, **I do not accept pull requests, feature requests, or external code contributions**.

## Can I still use and modify it?

Yes, absolutely! Gnist is open-source software licensed under the [MIT license](./LICENSE). You are completely free to:

- Install the NPM package and integrate the Gnist into any personal or commercial project.
- Download and inspect the source code.
- Fork the repository, customize Gnist to suit your own needs, and maintain your own independent version.

## Requirements

For local development — cloning the repository, running tests, or building from source — you need:

- [Node.js](https://nodejs.org/): >=20.19.0 (>=22.13.0 LTS recommended)
- [npm](https://www.npmjs.com/): >=10.2.0

## Scripts

The following commands are available for local development and documentation generation:

| Command                     | Description                                                                                |
|-----------------------------|--------------------------------------------------------------------------------------------|
| `npm run dev`               | Start the development server and the Sandbox demo                                          |
| `npm run lint`              | Run ESLint to check the codebase for syntax, style, and formatting issues                  |
| `npm run lint:fix`          | Automatically fix fixable linting issues                                                   |
| `npm run types`             | Run the TypeScript compiler to generate type declaration files into the `types/` directory |
| `npm run doc:api`           | Generate the local API reference documentation using JSDoc and the Docdash theme           |
| `npm run doc:deploy`        | Generate the latest API documentation and publish it directly to GitHub Pages              |
| `npm run version:changelog` | Generate or update the changelog based on structured Git commit history                    |
