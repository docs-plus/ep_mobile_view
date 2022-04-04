const padInfo = require('ep_etherpad-lite/node/utils/nestedPad'); // @Hossein
const db = require('ep_etherpad-lite/node/db/DB');
const eejs = require('ep_etherpad-lite/node/eejs');
const useragent = require('express-useragent');
const packageJson = require('./package.json');

let userAgent = {};

exports.eejsBlock_styles = (hookName, args, cb) => {
  if (!userAgent.isMobile) return cb();
  const css = `outterMobile.css?v=${packageJson.version}`;
  args.content += `<link
      rel="stylesheet"
      href="../static/plugins/ep_mobile_view/static/css/${css}"
      type="text/css"
    />`;
  return cb();
};

exports.clientVars = (hookName, context, callback) => {
  const clientVars = {
    userAgent: {
      ...userAgent,
    },
  };
  return callback(clientVars);
};

exports.expressCreateServer = (hookName, args, callback) => {
  args.app.use(useragent.express(), (req, res, next) => {
    userAgent = req.useragent;
    return next();
  });

  args.app.get('/p/:pad*', async (req, res, next) => {
    if (/(\/static\/plugins\/(.*))/.test(req.path)) return next();
    if (!userAgent.isMobile) return next();

    let staticRootAddress = req.path.split('/');

    const {padId, padName, padView} = padInfo(req);

    staticRootAddress = req.path.split('/')
        .filter((x) => x.length)
        .map((path) => '../')
        .join('');

    // @Samir Sayyad Added for social preview
    // can be removed when require-kernel is dropped
    res.header('Feature-Policy', 'sync-xhr \'self\'');
    // @Samir Sayyad Added for social preview
    const padTitle = await db.get(`title:${padId}`);

    // can be removed when require-kernel is dropped
    res.header('Feature-Policy', 'sync-xhr \'self\'');
    res.send(eejs.require('ep_mobile_view/static/templates/pad.html', {
      meta: {title: (padTitle) ? padTitle : req.params.pad},
      padId,
      padView,
      padName,
      staticRootAddress,
      req,
      userAgent,

    }));
  });
  return callback();
};
