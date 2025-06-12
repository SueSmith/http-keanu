import { defineConfig } from "vite";
import handlebars from "vite-plugin-handlebars";
import settings from "./codes.json";

const content = `
<html lang="en">
  <head>

    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="https://glitch.com/favicon.ico" />
    <meta
      name="description"
      content="An app for learning about status codes!"
    />
    <meta
      name="og:description"
      content="An app for learning about status codes!"
    />
    <meta property="og:title" content="HTTP Keanu ({{{status}}} {{{name}}})" />
    <meta property="og:image" content="{{{img}}}" />

    <title>HTTP Keanu ({{{status}}} {{{name}}})</title>

    <link rel="stylesheet" href="/style.css" />

  </head>
  <body>
    <div class="wrapper">
      <div class="content" role="main">
        <h1><a href="/">HTTP Keanu</a></h1>
        <p class="intro">
          A fun way to learn about status codes, inspired by
          <a href="https://http.cat">http.cat</a>!
        </p>
        <p class="random">
          🎲
          <a href="/random.html">Choose a random code</a>
        </p>
        <div class="codes">
            <div class="highlight selected" id="code{{{code}}}">

              <h2>{{code}}</h2>
              <h3>{{name}}</h3>
              <div class="imghold">
                <img src="{{pic}}" alt="{{alt}}" />
              </div>

              <div class="extra">
                <p>{{info}}</p>
                {{#if joker}}
                  <a
                    href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/"
                  >HTTP status codes on MDN</a>
                {{else}}
                  <a
                    href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/{{{code}}}"
                  >{{code}} on MDN</a>
                {{/if}}
              </div>
            </div>
        </div>
        <p id="bonus">
          Bonus: try selecting an invalid code, like
          <a href="?code=1000">1000</a>
        </p>
      </div>
    </div>

  </body>
</html>
`;
const codePages = settings.list.map(function (c) {
    return {
        [c.code + ".html"]:  c
    }
});
let rand = {
  rand: true,
  settings: JSON.stringify(settings.list)
}
console.log(rand)
const pageData = {
    '/index.html': {
        settings,
    },
    '/random.html': {
        rand
    }
};
settings.list.forEach((c) => {
    pageData["/" + c.code + ".html"] =  c
});
//console.log(pageData);
const fse = require('fs-extra');
codePages.forEach((cp) => {
    fse.outputFileSync(Object.keys(cp)[0], content);
});

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        handlebars({
            context(pagePath) {
                return pageData[pagePath];
            },
        }),
    ],
    build: {
        outDir: "docs",
    },
    rollupOptions: {
        input: {
            main: 'index.html',
            codePages
        },
    }
});