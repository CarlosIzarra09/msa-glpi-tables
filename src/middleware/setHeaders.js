export function setHeaders(req, res, next) {
  res.setHeader('Content-Type', 'application/json');  
  res.setHeader('X-Frame-Options', 'deny');
  res.setHeader(
    'Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; font-src 'self'; img-src 'self'; frame-src 'self'"
  );
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  res.setHeader('Access-Control-Allow-Origin','*');
  res.removeHeader('X-RateLimit-Limit');
  res.removeHeader('X-RateLimit-Remaining');
  res.removeHeader('Date');
  res.removeHeader('X-Powered-By');
  res.removeHeader('X-RateLimit-Reset');
  res.removeHeader('Cross-Origin-Embedder-Policy');
  // res.removeHeader('Cross-Origin-Opener-Policy');
  res.removeHeader('Cross-Origin-Resource-Policy');
  res.removeHeader('X-DNS-Prefetch-Control');
  res.removeHeader('X-Download-Options');
  res.removeHeader('X-Content-Type-Options');
  res.removeHeader('Origin-Agent-Cluster');
  res.removeHeader('X-Permitted-Cross-Domain-Policies');
  res.removeHeader('Referrer-Policy');
  res.removeHeader('Content-Type');
  res.removeHeader('Connection');
  res.removeHeader('Keep-Alive');
  res.removeHeader('Server');
  res.removeHeader('X-XSS-Protection');
  // res.removeHeader('Content-Security-Policy');
  next();

  // res.setHeader('Content-Security-Policy', `default-src 'self'`);
  // res.setHeader(
  //   'Content-Security-Policy-Report-Only', "default-src 'self'; script-src 'self' https://code.jquery.com/jquery-3.5.1.min.js https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.31/moment-timezone-with-data.js https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.bundle.min.js https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js; style-src 'self' https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css; font-src 'self' https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/webfonts/fa-brands-400.woff2 https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/webfonts/fa-brands-400.woff https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/webfonts/fa-brands-400.ttf https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/webfonts/fa-regular-400.woff2 https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/webfonts/fa-regular-400.woff https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/webfonts/fa-regular-400.ttf https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/webfonts/fa-solid-900.woff2 https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/webfonts/fa-solid-900.woff https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/webfonts/fa-solid-900.ttf; img-src 'self'; frame-src 'self'"
  // );
}
