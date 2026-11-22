// Apply data-theme early to prevent a theme flash (CoreLogicUI pattern). It lives as a file rather than
// inline in index.html: the content security policy (CSP) does not allow inline scripts.
(function () {
  try {
    var t = localStorage.getItem('pc_theme');
    if (t !== 'dark' && t !== 'light') {
      t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', t);
  } catch (e) {}
})();
