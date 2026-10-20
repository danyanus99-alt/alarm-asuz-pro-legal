(() => {
  'use strict';

  const supported = ['de', 'en', 'es', 'fr', 'it', 'ja', 'ko', 'pt', 'pt-BR', 'tr'];
  const ui = {
    de: { language: 'Sprache', legal: 'Rechtliches', privacy: 'Datenschutz', terms: 'Nutzungsbedingungen' },
    en: { language: 'Language', legal: 'Legal', privacy: 'Privacy Policy', terms: 'Terms of Use' },
    es: { language: 'Idioma', legal: 'Información legal', privacy: 'Privacidad', terms: 'Términos de Uso' },
    fr: { language: 'Langue', legal: 'Informations légales', privacy: 'Confidentialité', terms: 'Conditions d’utilisation' },
    it: { language: 'Lingua', legal: 'Informazioni legali', privacy: 'Privacy', terms: 'Termini di Utilizzo' },
    ja: { language: '言語', legal: '法的情報', privacy: 'プライバシー', terms: '利用規約' },
    ko: { language: '언어', legal: '법적 정보', privacy: '개인정보 처리방침', terms: '이용약관' },
    pt: { language: 'Idioma', legal: 'Informação legal', privacy: 'Privacidade', terms: 'Termos de Utilização' },
    'pt-BR': { language: 'Idioma', legal: 'Informações legais', privacy: 'Privacidade', terms: 'Termos de Uso' },
    tr: { language: 'Dil', legal: 'Yasal', privacy: 'Gizlilik Politikası', terms: 'Kullanım Şartları' }
  };

  function canonicalize(raw) {
    if (!raw) return 'en';
    const cleaned = String(raw).trim().replace('_', '-');
    if (!cleaned) return 'en';
    const lower = cleaned.toLowerCase();
    if (lower === 'pt-br') return 'pt-BR';
    const exact = supported.find((code) => code.toLowerCase() === lower);
    return exact || 'en';
  }

  const params = new URLSearchParams(window.location.search);
  const locale = canonicalize(params.get('lang'));

  document.documentElement.lang = locale;

  document.querySelectorAll('.legal-document').forEach((el) => {
    el.hidden = el.dataset.locale !== locale;
  });

  const activeDocument = document.querySelector(`.legal-document[data-locale="${locale}"]`);
  const activeHeading = activeDocument && activeDocument.querySelector('h1');
  if (activeHeading) document.title = `Alarm Asuz Pro — ${activeHeading.textContent.trim()}`;

  const select = document.getElementById('language-select');
  if (select) {
    select.value = locale;
    select.addEventListener('change', () => {
      const nextLocale = canonicalize(select.value);
      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.set('lang', nextLocale);
      window.location.assign(nextUrl.toString());
    });
  }

  const labels = ui[locale] || ui.en;
  const languageLabel = document.getElementById('language-label');
  const privacyNav = document.getElementById('privacy-nav');
  const termsNav = document.getElementById('terms-nav');
  if (languageLabel) languageLabel.textContent = labels.language;
  if (select) select.setAttribute('aria-label', labels.language);
  const legalNav = document.querySelector('.legal-nav');
  if (legalNav) legalNav.setAttribute('aria-label', labels.legal);
  if (privacyNav) privacyNav.textContent = labels.privacy;
  if (termsNav) termsNav.textContent = labels.terms;

  document.querySelectorAll('a[data-legal-target]').forEach((link) => {
    const target = link.dataset.legalTarget;
    if (target !== 'privacy' && target !== 'terms') return;
    const url = new URL(target === 'privacy' ? '../privacy/' : '../terms/', window.location.href);
    url.searchParams.set('lang', locale);
    link.href = url.toString();
  });

  // Preserve the selected locale for links inside the translated legal body as well.
  document.querySelectorAll('.legal-document a').forEach((link) => {
    const raw = link.getAttribute('href');
    if (!raw) return;
    if (raw === '../privacy/' || raw === '../terms/') {
      const url = new URL(raw, window.location.href);
      url.searchParams.set('lang', locale);
      link.href = url.toString();
    }
  });
})();
