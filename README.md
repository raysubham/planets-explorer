<img src='https://www.subhamray.com/_next/image?url=%2F_next%2Fstatic%2Fimage%2Fcomponents%2Fassets%2Fplanets-explorer.8f122e8172655f77cc779721301423f7.jpeg&w=1920&q=75' alt='nomad-travels' />

# [Planets Explorer](http://65.2.1.18:1199/)

## Description

### Frontend Tech

- [reactjs](https://reactjs.org/) as the main UI library.
- [arwes-theme](https://github.com/arwes/arwes) for the background UI theme. It's cool looking.

### Backend Tech

- [expressjs](https://expressjs.com/) framework on top of the [nodejs](https://nodejs.org/en/) runtime.
- [mongodb-atlas](https://www.mongodb.com/cloud/atlas) for the database.It's free and awesome.
- [google-oauth-2.0](https://developers.google.com/identity/protocols/oauth2) for authenticating users.

### Deployment

I had deployed this using [docker](https://www.docker.com/) on a [aws-ec2](https://aws.amazon.com/ec2/) instance.

## Getting Started

### Installing

- Since some of the above mentioned services requires test API and ID keys, please go ahead and signup for these accounts and get the keys.
- Rename the sample.env file to .env in the backend directory and add the test keys in it.

### Dependencies

- Just run `npm install` in both the frontend and backend directories to install all the necessary dependancies.

### Running the website locally

- Just run `npm watch` in the root directory to start the local development servers.

### That's it. Have fun 😃
