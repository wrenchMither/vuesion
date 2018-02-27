/* tslint:disable:no-console */

import * as fs                        from 'fs';
import * as path                      from 'path';
import * as Express                   from 'express';
import * as favicon                   from 'serve-favicon';
import { BundleRenderer }             from 'vue-server-renderer';
import { Handler, Request, Response } from 'express';
import * as cookieParser              from 'cookie-parser';
import acceptLanguage                 from 'accept-language';

const app: Express.Application = Express();
const compression: any = require('compression');
const isProd: boolean = process.env.NODE_ENV === 'production';

const resolve = (file: string): string => path.resolve(__dirname, file);
const serve = (servePath: string, cache: boolean): Handler => Express.static(resolve(servePath), {
  maxAge: cache && isProd ? 60 * 60 * 24 * 30 : 0,
});
const createRenderer = (bundle: string, template: string): BundleRenderer => {
  return nodeRequire('vue-server-renderer').createBundleRenderer(bundle, {
    template,
    cache: nodeRequire('lru-cache')({
                                      max:    1000,
                                      maxAge: 1000 * 60 * 15,
                                    }),
  });
};
const packageJson: any = JSON.parse(fs.readFileSync(resolve('../../package.json')).toString());

let renderer: BundleRenderer;

if (isProd) {
  const bundle: any = nodeRequire('../../dist/server/vue-ssr-bundle.json');
  const template: string = fs.readFileSync(resolve('../../dist/client/index.html'), 'utf-8');

  renderer = createRenderer(bundle, template);
} else {
  const devServer: any = nodeRequire('../../dist/server/dev-server.js').devServer;

  devServer(app, (bundle: string, template: string) => {
    renderer = createRenderer(bundle, template);
  });
}

/**
 * middlewares
 */
app.use(cookieParser());
app.use(compression());

/**
 * http -> https redirect for heroku
 */
app.get('*', (req: Request, res: Response, next: any) => {
  const host: string = req.headers.host || 'localhost:3000';
  const redirect: string = `https://${host}` + req.url;

  if (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'] !== 'https') {
    res.redirect(redirect);
  } else {
    next();
  }
});

/**
 * assets
 */
app.use('/i18n', serve('../../i18n', false));
app.use('/client', serve('../../dist/client', true));
app.use('/assets', serve('../../dist/assets', true));
app.use(favicon(path.resolve(__dirname, '../assets/logo.png')));

/**
 * PWA
 */
app.use('/browserconfig.xml', serve('../../dist/assets/pwa/browserconfig.xml', false));
app.use('/sw.js', serve('../../dist/client/sw.js', false));
app.use('/manifest.json', serve('../../dist/assets/pwa/manifest.json', false));

/**
 * storybook
 * TODO: enable this route only in non production environments
 * if (!isProd) {
 *    app.use('/storybook', serve('../../storybook-static', true));
 * }
 */
app.use('/storybook', serve('../../storybook-static', true));

/**
 * SSR
 */
app.get('*', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('max-age', '0');

  acceptLanguage.languages(packageJson.config['supported-languages']);

  if (!renderer) {
    return res.end('waiting for compilation... refresh in a moment.');
  }

  const startTime: number = Date.now();
  const errorHandler = (err: any): void => {
    if (err && err.code === 404) {
      res.status(404).end('404 | Page Not Found');
    } else {
      res.status(500).end('500 | Internal Server Error');
      console.error(`error during render : ${req.url}`);
      console.error(err);
    }
  };
  const acceptLang: string = req.headers['accept-language']
    ? req.headers['accept-language'].toString()
    : packageJson.config['default-language'];
  const defaultLang: string = acceptLanguage.get(acceptLang);

  renderer
  .renderToStream({
                    url:            req.url,
                    cookies:        req.cookies,
                    acceptLanguage: defaultLang,
                    htmlLang:       defaultLang.substr(0, 2),
                  })
  .on('error', errorHandler)
  .on('end', () => console.log(`whole request: ${Date.now() - startTime}ms`))
  .pipe(res);
});

const port: string = process.env.PORT || '3000';

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
