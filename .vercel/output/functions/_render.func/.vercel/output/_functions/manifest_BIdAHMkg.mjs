import 'cookie';
import 'kleur/colors';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_BHcEy2Ep.mjs';
import 'es-module-lexer';
import { f as decodeKey } from './chunks/astro/server_C135b2vm.mjs';
import 'clsx';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///D:/websiteFront/anosia_site/","adapterName":"@astrojs/vercel/serverless","routes":[{"file":"blog/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/blog","isIndex":true,"type":"page","pattern":"^\\/blog\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog/index.astro","pathname":"/blog","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"cabinet/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/cabinet","isIndex":true,"type":"page","pattern":"^\\/cabinet\\/?$","segments":[[{"content":"cabinet","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/cabinet/index.astro","pathname":"/cabinet","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"chat/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/chat","isIndex":true,"type":"page","pattern":"^\\/chat\\/?$","segments":[[{"content":"chat","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/chat/index.astro","pathname":"/chat","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"projects/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/projects","isIndex":true,"type":"page","pattern":"^\\/projects\\/?$","segments":[[{"content":"projects","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/projects/index.astro","pathname":"/projects","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"robots.txt","links":[],"scripts":[],"styles":[],"routeData":{"route":"/robots.txt","isIndex":false,"type":"endpoint","pattern":"^\\/robots\\.txt\\/?$","segments":[[{"content":"robots.txt","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/robots.txt.ts","pathname":"/robots.txt","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"rss.xml","links":[],"scripts":[],"styles":[],"routeData":{"route":"/rss.xml","isIndex":false,"type":"endpoint","pattern":"^\\/rss\\.xml\\/?$","segments":[[{"content":"rss.xml","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/rss.xml.ts","pathname":"/rss.xml","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"search/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/search","isIndex":true,"type":"page","pattern":"^\\/search\\/?$","segments":[[{"content":"search","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/search/index.astro","pathname":"/search","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/chat","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/chat\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"chat","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/chat.ts","pathname":"/api/chat","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"site":"https://astro-sphere-demo.vercel.app","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["D:/websiteFront/anosia_site/src/layouts/ArticleBottomLayout.astro",{"propagation":"in-tree","containsHead":false}],["D:/websiteFront/anosia_site/src/pages/blog/[...slug].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/blog/[...slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["D:/websiteFront/anosia_site/src/pages/projects/[...slug].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/projects/[...slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["D:/websiteFront/anosia_site/src/pages/blog/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/blog/index@_@astro",{"propagation":"in-tree","containsHead":false}],["D:/websiteFront/anosia_site/src/pages/cabinet/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/cabinet/index@_@astro",{"propagation":"in-tree","containsHead":false}],["D:/websiteFront/anosia_site/src/pages/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/index@_@astro",{"propagation":"in-tree","containsHead":false}],["D:/websiteFront/anosia_site/src/pages/projects/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/projects/index@_@astro",{"propagation":"in-tree","containsHead":false}],["D:/websiteFront/anosia_site/src/pages/rss.xml.ts",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/rss.xml@_@ts",{"propagation":"in-tree","containsHead":false}],["D:/websiteFront/anosia_site/src/pages/search/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/search/index@_@astro",{"propagation":"in-tree","containsHead":false}],["D:/websiteFront/anosia_site/src/pages/chat/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(o,t)=>{let i=async()=>{await(await o())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-page:src/pages/blog/index@_@astro":"pages/blog.astro.mjs","\u0000@astro-page:src/pages/blog/[...slug]@_@astro":"pages/blog/_---slug_.astro.mjs","\u0000@astro-page:src/pages/cabinet/index@_@astro":"pages/cabinet.astro.mjs","\u0000@astro-page:src/pages/chat/index@_@astro":"pages/chat.astro.mjs","\u0000@astro-page:src/pages/projects/index@_@astro":"pages/projects.astro.mjs","\u0000@astro-page:src/pages/projects/[...slug]@_@astro":"pages/projects/_---slug_.astro.mjs","\u0000@astro-page:src/pages/robots.txt@_@ts":"pages/robots.txt.astro.mjs","\u0000@astro-page:src/pages/rss.xml@_@ts":"pages/rss.xml.astro.mjs","\u0000@astro-page:src/pages/search/index@_@astro":"pages/search.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astro-page:src/pages/api/chat@_@ts":"pages/api/chat.astro.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","D:/websiteFront/anosia_site/node_modules/astro/dist/env/setup.js":"chunks/astro/env-setup_Cr6XTFvb.mjs","D:/websiteFront/anosia_site/src/content/blog/01-开站小记/index.md?astroContentCollectionEntry=true":"chunks/index_lOi03ng8.mjs","D:/websiteFront/anosia_site/src/content/cabinet/01-welcome.md?astroContentCollectionEntry=true":"chunks/01-welcome_CGhVF5B3.mjs","D:/websiteFront/anosia_site/src/content/projects/coming-soon/index.md?astroContentCollectionEntry=true":"chunks/index_Bt5k-0wN.mjs","D:/websiteFront/anosia_site/src/content/blog/01-开站小记/index.md?astroPropagatedAssets":"chunks/index_BB0UJAjp.mjs","D:/websiteFront/anosia_site/src/content/cabinet/01-welcome.md?astroPropagatedAssets":"chunks/01-welcome_Cof0ZoQn.mjs","D:/websiteFront/anosia_site/src/content/projects/coming-soon/index.md?astroPropagatedAssets":"chunks/index_gy_NylWA.mjs","\u0000astro:asset-imports":"chunks/_astro_asset-imports_D9aVaOQr.mjs","\u0000astro:data-layer-content":"chunks/_astro_data-layer-content_BcEe_9wP.mjs","D:/websiteFront/anosia_site/src/content/blog/01-开站小记/index.md":"chunks/index_BR_5lNaj.mjs","D:/websiteFront/anosia_site/src/content/cabinet/01-welcome.md":"chunks/01-welcome_BdeWJbjd.mjs","D:/websiteFront/anosia_site/src/content/projects/coming-soon/index.md":"chunks/index_C041-5nG.mjs","\u0000@astrojs-manifest":"manifest_BIdAHMkg.mjs","@components/SearchCollection":"_astro/SearchCollection.BDO1euCs.js","@components/Search":"_astro/Search.DumBdsr_.js","@components/Chat":"_astro/Chat.DQokQlVk.js","@astrojs/solid-js/client.js":"_astro/client.CyG_8K5d.js","/astro/hoisted.js?q=0":"_astro/hoisted.BGfjo5mV.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/_slug_.B8ddMcvT.css","/brand.svg","/copy.svg","/favicon.svg","/open-graph.jpg","/robots.txt","/social.svg","/stack.svg","/ui.svg","/fonts/atkinson-bold.woff","/fonts/atkinson-regular.woff","/rss/styles.xsl","/js/animate.js","/js/copy.js","/js/scroll.js","/_astro/Chat.DQokQlVk.js","/_astro/client.CyG_8K5d.js","/_astro/Search.DumBdsr_.js","/_astro/SearchBar.DFAuS7yZ.js","/_astro/SearchCollection.BDO1euCs.js","/_astro/web.B0WjuPY8.js","/blog/index.html","/cabinet/index.html","/chat/index.html","/projects/index.html","/robots.txt","/rss.xml","/search/index.html","/index.html"],"buildFormat":"directory","checkOrigin":false,"serverIslandNameMap":[],"key":"Yc0GvTMUlNxv88Q8igUpIrfzvoa9eLy8s5ON949cd0c=","experimentalEnvGetSecretEnabled":false});

export { manifest };
