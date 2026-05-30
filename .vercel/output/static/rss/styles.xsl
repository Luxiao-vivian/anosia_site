<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" doctype-system="about:legacy-compat" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <title>RSS Feed | <xsl:value-of select="/rss/channel/title"/></title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg"/>
        <style>
          :root {
            --bean-50: #FAF7F0;
            --bean-100: #F5F1E8;
            --bean-200: #E8E0D0;
            --olive-300: #A3B18A;
            --olive-500: #588157;
            --olive-700: #3A5A40;
            --olive-900: #2D4A2B;
            --ink-700: #5C5C4F;
            --ink-900: #2D2D2D;
          }
          * { box-sizing: border-box; }
          html, body { margin: 0; padding: 0; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
            color: var(--ink-900);
            background: var(--bean-50);
            line-height: 1.65;
            padding: 3rem 1.5rem 5rem;
          }
          .container { max-width: 720px; margin: 0 auto; }
          .brand {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 600;
            font-size: 1.0625rem;
            color: var(--olive-900);
            text-decoration: none;
            margin-bottom: 2.5rem;
          }
          .brand:hover { color: var(--olive-700); }
          .brand-icon {
            width: 1.5rem;
            height: 1.5rem;
            fill: currentColor;
          }
          h1 {
            font-size: 2rem;
            color: var(--ink-900);
            margin: 0 0 0.5rem;
            letter-spacing: -0.01em;
          }
          p.lead {
            color: var(--ink-700);
            margin: 0 0 1.5rem;
            font-size: 1rem;
          }
          .callout {
            background: var(--bean-100);
            border: 1px solid var(--bean-200);
            border-left: 4px solid var(--olive-500);
            padding: 1.25rem 1.5rem;
            border-radius: 0.5rem;
            margin: 2rem 0;
          }
          .callout h2 {
            font-size: 1.0625rem;
            margin: 0 0 0.5rem;
            color: var(--olive-900);
            letter-spacing: -0.01em;
          }
          .callout p {
            margin: 0.5rem 0;
            color: var(--ink-700);
            font-size: 0.9375rem;
          }
          .url-box {
            display: block;
            background: var(--bean-200);
            color: var(--olive-900);
            padding: 0.75rem 1rem;
            border-radius: 0.375rem;
            font-family: "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
            font-size: 0.8125rem;
            margin: 0.75rem 0;
            word-break: break-all;
            user-select: all;
          }
          h2.items-title {
            font-size: 1.25rem;
            color: var(--ink-900);
            margin: 3rem 0 0.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid var(--bean-200);
            letter-spacing: -0.01em;
          }
          ul.items { list-style: none; padding: 0; margin: 0; }
          ul.items li {
            padding: 1.125rem 0;
            border-bottom: 1px solid var(--bean-200);
          }
          ul.items li:last-child { border-bottom: none; }
          .item-title {
            font-size: 1.0625rem;
            font-weight: 600;
            color: var(--olive-900);
            text-decoration: none;
          }
          .item-title:hover { color: var(--olive-700); text-decoration: underline; }
          .item-date {
            display: block;
            font-size: 0.8125rem;
            color: var(--ink-700);
            margin-top: 0.25rem;
            letter-spacing: 0.02em;
          }
          .item-desc {
            margin: 0.5rem 0 0;
            color: var(--ink-700);
            font-size: 0.9375rem;
          }
          a { color: var(--olive-700); }
          a:hover { color: var(--olive-900); }
          .hint { font-size: 0.8125rem; color: var(--ink-700); margin-top: 0.5rem; }
        </style>
      </head>
      <body>
        <div class="container">
          <a href="/" class="brand">
            <svg class="brand-icon" viewBox="0 0 24 24"><use href="/brand.svg#brand"/></svg>
            <span><xsl:value-of select="/rss/channel/title"/></span>
          </a>

          <h1>RSS Feed</h1>
          <p class="lead"><xsl:value-of select="/rss/channel/description"/></p>

          <div class="callout">
            <h2>This is a web feed (RSS)</h2>
            <p>Subscribe in your favorite reader (Feedly, NetNewsWire, Inoreader, Reeder, Miniflux&#8230;) and new posts will arrive automatically &#8212; no algorithms, no ads, no accounts.</p>
            <p>Copy this URL into your reader:</p>
            <code class="url-box"><xsl:value-of select="concat(/rss/channel/link, 'rss.xml')"/></code>
            <p class="hint">New to RSS? <a href="https://aboutfeeds.com" target="_blank" rel="noopener">aboutfeeds.com</a> has a friendly intro.</p>
          </div>

          <h2 class="items-title">Recent entries</h2>
          <ul class="items">
            <xsl:for-each select="/rss/channel/item">
              <li>
                <a class="item-title">
                  <xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute>
                  <xsl:value-of select="title"/>
                </a>
                <span class="item-date">
                  <xsl:value-of select="substring(pubDate, 6, 11)"/>
                </span>
                <p class="item-desc"><xsl:value-of select="description"/></p>
              </li>
            </xsl:for-each>
          </ul>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
