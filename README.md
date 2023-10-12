# VERY BASIC Trello clone

## Installation

1. You will need to have `pnpm` installed, then run `pnpm install` in the root of the project to install all dependencies.
2. Copy `.env.example` to `.env` and fill in the values. (For auth keys visit [https://clerk.com/](https://clerk.com/))
3. Run `pnpx turbo db:push` to create the database.
4. _Optional_ Run `pnpx turbo db:seed` to seed the database with some data.
5. Run `pnpm run dev` to start the development server.

## Usage

1. Go to `localhost:3000` in your browser.
2. Log in with one of available auth providers.
3. Enjoy!

## Testing

1. Execute `pnpx turbo test` to run all tests.