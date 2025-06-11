/**
 * This is the main Node.js server script for your project
 * Check out the two endpoints this back-end API provides in fastify.get and fastify.post below
 */

const path = require("path");

// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  // Set this to true for detailed logging:
  logger: false,
});

// ADD FAVORITES ARRAY VARIABLE FROM TODO HERE

// Setup our static files
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/", // optional: default '/'
});

// Formbody lets us parse incoming forms
fastify.register(require("@fastify/formbody"));

// View is a templating manager for fastify
fastify.register(require("@fastify/view"), {
  engine: {
    handlebars: require("handlebars"),
  },
});

const codes = require("./src/codes.json");

// Handle 404s
fastify.setNotFoundHandler((request, reply) => {
  let params = {};
  params = codes;
  params.img =
    "https://cdn.glitch.global/b8209f22-6edd-46cc-8707-e2d42e09b6e7/thankeanu.jpg?v=1702506252169";
  params.status = "";
  return reply.view("/src/pages/index.hbs", params);
});

/**
 * Our home page route
 *
 * Returns src/pages/index.hbs with data built into it
 */
fastify.get("/", function (request, reply) {
  // params is an object we'll pass to our handlebars template
  let params = {};

  if (request.query.code == undefined) {
    params = codes;
    params.img =
      "https://cdn.glitch.global/b8209f22-6edd-46cc-8707-e2d42e09b6e7/thankeanu.jpg?v=1702506252169";
    params.status = "";
  } else {
    params.selected = true;
    let found;
    if (request.query.code < 0) {
      found = codes.list[Math.floor(Math.random() * codes.list.length)];
      reply.header("Surrogate-Control", "max-age=0");
    } else
      found = codes.list.find((element) => element.code == request.query.code);
    if (found) {
      params.code = found.code;
      params.name = found.name;
      params.pic = found.pic;
      params.info = found.info;
      params.alt = found.alt;
      params.img = found.pic;
      params.status = found.code;
    } else {
      params.joker = true;
      params.code = 0;
      params.name = "WELP";
      params.pic =
        "https://cdn.glitch.global/b8209f22-6edd-46cc-8707-e2d42e09b6e7/keanu.jpg?v=1702505475354";
      params.info = "Whoops! This one isn't on the list.";
      params.alt = "Keanu holding his hands up";
      params.img = params.pic;
      params.status = 0;
    }
  }

  if (request.query.raw) 
    return params;
  
  // The Handlebars code will be able to access the parameter values and build them into the page
  else return reply.view("/src/pages/index.hbs", params);
});

// Run the server and report out to the logs
fastify.listen(
  { port: process.env.PORT, host: "0.0.0.0" },
  function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
  }
);
