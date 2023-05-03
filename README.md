# Driply

## Deployed App

[App](http://157.245.250.208:3000/)

## Description and Product Vision Statement

**To connect fashion enthusiast and promote greater accessibility of fashion trends and outfits.**

Driply is a fashion social networking app where users can share their outfits as well as find inspirations and new stores. This application and the community will be dedicated entirely to budget fashion and making fashion and trends as accessible as apossible for everyone. Users can share and view outfits with accompanying information like price range and source. Liking, commenting, and chatting will be some functionalities to increase interactivity between users. Users also can personalize their feed by following other users as well as bookmarking particularly interesting posts.

## The Team

[Brandon Chen](https://github.com/b-chen00)

[Darren Le](https://github.com/DarrenLe20)

[Emmanuel Soto Ruiz](https://github.com/MannySotoRuiz)

[Kevin Park](https://github.com/kevincwpark)

[Amaan Khwaja](https://github.com/Amaanmkhwaja)

## History

### Initial Idea

- Many people such as high school and college students often are interested in fashion. They are looking for new fashion and styles to experiment with but often find the most popular options seen on influencers and social networks are out of my price ranges. As such, there is a need for a social networking app entirely dedicated to budget fashion where users can find and share their outfits/inspirations. Fashion and trends should be accessible for everyone especially students and others who might not have the budget for designer brands.

- While most social networking applications with a photo-posting function can do implement this idea to an extend, we want to build a community specialized in and dedicated to making fashion and trends as accessible as possible for everyone, especially students and others who might not have the budget for designer brands.

### How to contribute

- Refer to our contribution guidelines [here](./CONTRIBUTING.md)

## Instructions for Building and Testing

### Acquire the source code

1. Clone the repository into your local machine
2. Run ```cd final_project_driply``` to navigate into the local directory

### Build and launch the back end

1. Run ```cd back-end``` to navigate into the back-end directory
2. Run ```npm install``` to install all dependencies listed in the package.json file.
3. Create a .env file in the back-end directory and add the following content:

```
  PORT={BACKEND_PORT}

  FRONT_END_URI=localhost:{FRONTEND_PORT}
  ORIGIN="http://localhost:{FRONTEND_PORT}"

  MONGO_USERNAME={Your MongoDB username}
  MONGO_PASSWORD={Your MongoDB password}
  FRONT_END_DOMAIN="*"
  JWT_SECRET={Your JWT secret}
  JWT_EXP_DAYS={Your JWT expiration days}
  MONGODB_URI={Your MongoDB URI}
  ```

4. Run ```npm start``` to launch the back-end server

### Build and launch the front end

1. Run ```cd front-end``` to navigate into the front-end directory
2. Run ```npm install``` to install all dependencies listed in the package.json file.
3. Create a .env file in the front-end directory and add the following content:

    ```REACT_APP_BACKEND_URL=http://localhost:{FRONTEND_PORT}```

4. Run ```npm start``` to launch the React.js server

## Additional Documents

[Figma Site Map](https://www.figma.com/file/GDSuo2aF4WtsP4yC0udytx/Driply-Site-Map?node-id=0%3A1&t=xS0gTKp5Jl3fxWuG-1)

[Figma Wireframe and Prototype](https://www.figma.com/file/K1GxXaFQa89F1rCprwuhIf/Driply?node-id=0%3A1&t=r2VuqVoeON8Y47Tl-0)
