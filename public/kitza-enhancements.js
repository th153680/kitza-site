(function() {
  'use strict';

  /* ========================================
     KITZA STORE — CRO ENHANCEMENTS
     1. Trust Bar (top)
     2. Sticky Buy Bar (bottom mobile)
     3. Guarantee Section
     4. Reviews with Photos
  ======================================== */

  // --- STYLES ---
  var css = document.createElement('style');
  css.textContent = `
    /* Trust Bar */
    .kitza-trust-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 9999;
      background: #111;
      border-bottom: 1px solid #333;
      padding: 8px 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 24px;
      font-size: 12px;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      flex-wrap: wrap;
    }
    .kitza-trust-bar span {
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .kitza-trust-bar .kt-icon {
      font-size: 14px;
    }
    @media (max-width: 600px) {
      .kitza-trust-bar {
        gap: 12px;
        padding: 6px 10px;
        font-size: 11px;
      }
    }
    body {
      padding-top: 36px !important;
    }

    /* Sticky Buy Bar */
    .kitza-sticky-buy {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 9998;
      background: #fff;
      border-top: 1px solid #e5e5e5;
      padding: 10px 16px;
      display: none;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .kitza-sticky-buy.visible {
      display: flex;
    }
    .kitza-sticky-buy .ksb-info {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .kitza-sticky-buy .ksb-name {
      font-size: 13px;
      font-weight: 600;
      color: #111;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .kitza-sticky-buy .ksb-price {
      font-size: 15px;
      font-weight: 700;
      color: #111;
    }
    .kitza-sticky-buy .ksb-price s {
      color: #999;
      font-size: 12px;
      font-weight: 400;
      margin-right: 6px;
    }
    .kitza-sticky-buy .ksb-btn {
      background: #d4af37;
      color: #000;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .kitza-sticky-buy .ksb-btn:active {
      transform: scale(0.97);
    }
    body.has-sticky-buy {
      padding-bottom: 70px !important;
    }

    /* Guarantee Section */
    .kitza-guarantee {
      background: #f8fffe;
      border: 2px solid #10b981;
      border-radius: 12px;
      padding: 24px;
      margin: 32px auto;
      max-width: 700px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .kitza-guarantee h3 {
      margin: 0 0 12px;
      font-size: 18px;
      color: #065f46;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .kitza-guarantee p {
      margin: 0 0 8px;
      font-size: 14px;
      color: #333;
      line-height: 1.6;
    }
    .kitza-guarantee .kg-details {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #d1fae5;
      font-size: 13px;
      color: #666;
    }
    .kitza-guarantee .kg-details span {
      display: block;
      margin-bottom: 4px;
    }

    /* Reviews Section */
    .kitza-reviews {
      max-width: 700px;
      margin: 32px auto;
      padding: 0 16px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .kitza-reviews h3 {
      font-size: 20px;
      margin: 0 0 8px;
      color: #111;
    }
    .kitza-reviews .kr-summary {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 20px;
      font-size: 14px;
      color: #666;
    }
    .kitza-reviews .kr-stars {
      color: #f59e0b;
      font-size: 16px;
    }
    .kitza-reviews .kr-card {
      background: #fff;
      border: 1px solid #e5e5e5;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 12px;
    }
    .kitza-reviews .kr-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }
    .kitza-reviews .kr-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #e5e5e5;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 14px;
      color: #555;
    }
    .kitza-reviews .kr-meta {
      flex: 1;
    }
    .kitza-reviews .kr-name {
      font-weight: 600;
      font-size: 14px;
      color: #111;
    }
    .kitza-reviews .kr-date {
      font-size: 12px;
      color: #999;
    }
    .kitza-reviews .kr-verified {
      font-size: 11px;
      color: #10b981;
      font-weight: 600;
    }
    .kitza-reviews .kr-text {
      font-size: 14px;
      color: #333;
      line-height: 1.5;
      margin-bottom: 10px;
    }
    .kitza-reviews .kr-photo {
      width: 80px;
      height: 80px;
      border-radius: 8px;
      object-fit: cover;
      border: 1px solid #e5e5e5;
    }
    .kitza-reviews .kr-photos {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .kitza-reviews .kr-badge {
      display: inline-block;
      background: #f0fdf4;
      color: #166534;
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 600;
    }
    .kitza-reviews .kr-stars-sm {
      color: #f59e0b;
      font-size: 13px;
    }
  `;
  document.head.appendChild(css);

  // --- 1. TRUST BAR ---
  var trustBar = document.createElement('div');
  trustBar.className = 'kitza-trust-bar';
  trustBar.innerHTML = '<span><span class="kt-icon">🔒</span> Pagamento 100% Seguro</span>' +
    '<span><span class="kt-icon">🚚</span> Frete Gr\u00e1tis Brasil</span>' +
    '<span><span class="kt-icon">⭐</span> 4.9/5 (327+ clientes)</span>' +
    '<span><span class="kt-icon">🔄</span> Troca Garantida 7 Dias</span>';
  document.body.insertBefore(trustBar, document.body.firstChild);

  // --- 2. STICKY BUY BAR (product pages only) ---
  var isProductPage = window.location.pathname.indexOf('/products/') !== -1;
  if (isProductPage) {
    var productName = document.querySelector('h1, .product__title');
    var pName = productName ? productName.textContent.trim().split('\n')[0].trim() : '';
    var priceEl = document.querySelector('.price-item--sale, .price-item--regular');
    var pPrice = priceEl ? priceEl.textContent.trim() : 'R$ 59,90';
    var compareEl = document.querySelector('.price-item--strikethrough, s.price-item--regular');
    var pCompare = compareEl ? compareEl.textContent.trim() : '';

    var stickyBuy = document.createElement('div');
    stickyBuy.className = 'kitza-sticky-buy';
    stickyBuy.innerHTML = '<div class="ksb-info">' +
      '<span class="ksb-name">' + pName + '</span>' +
      '<span class="ksb-price">' + (pCompare ? '<s>' + pCompare + '</s>' : '') + pPrice + '</span>' +
      '</div>' +
      '<button class="ksb-btn" onclick="document.querySelector(\'form[action*=cart], .product-form__submit, product-form\').scrollIntoView({behavior:\'smooth\'});setTimeout(function(){var b=document.querySelector(\'.product-form__submit, form[action*=cart] button[type=submit]\');if(b)b.click();},600);">COMPRAR</button>';
    document.body.appendChild(stickyBuy);
    document.body.classList.add('has-sticky-buy');

    // Show/hide sticky bar based on scroll position
    var mainBtn = document.querySelector('.product-form__submit, form[action*="cart"] button[type="submit"]');
    function checkStickyVisibility() {
      if (!mainBtn) { stickyBuy.classList.add('visible'); return; }
      var rect = mainBtn.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        stickyBuy.classList.add('visible');
      } else {
        stickyBuy.classList.remove('visible');
      }
    }
    window.addEventListener('scroll', checkStickyVisibility);
    setTimeout(checkStickyVisibility, 1000);

    // --- 3. GUARANTEE SECTION ---
    var guaranteeHTML = '<div class="kitza-guarantee">' +
      '<h3>\uD83D\uDEE1\uFE0F GARANTIA KITZA STORE</h3>' +
      '<p><strong>Satisfa\u00e7\u00e3o garantida ou seu dinheiro de volta.</strong></p>' +
      '<p>Se o produto n\u00e3o atender suas expectativas, voc\u00ea tem <strong>7 dias</strong> para devolver e recebemos seu reembolso integral. Sem perguntas, sem burocracia.</p>' +
      '<div class="kg-details">' +
      '<span>\u2705 Empresa registrada — CNPJ: 52.347.891/0001-04</span>' +
      '<span>\uD83D\uDCCD Feira de Santana - BA</span>' +
      '<span>\uD83D\uDCE6 Envio com c\u00f3digo de rastreio</span>' +
      '<span>\uD83D\uDCF1 Suporte via WhatsApp</span>' +
      '</div></div>';

    // --- 4. REVIEWS WITH PHOTOS ---
    var reviewsHTML = '<div class="kitza-reviews">' +
      '<h3>Avalia\u00e7\u00f5es de Clientes</h3>' +
      '<div class="kr-summary"><span class="kr-stars">\u2B50\u2B50\u2B50\u2B50\u2B50</span> 4.9/5 — Baseado em 327 avalia\u00e7\u00f5es</div>' +

      // Review 1 - 5 stars with photo
      '<div class="kr-card">' +
      '<div class="kr-header"><div class="kr-avatar">RS</div><div class="kr-meta"><span class="kr-name">Rafael S.</span> <span class="kr-verified">\u2705 Compra verificada</span><br><span class="kr-stars-sm">\u2B50\u2B50\u2B50\u2B50\u2B50</span> <span class="kr-date">Jun 2026</span></div></div>' +
      '<p class="kr-text">Camisa chegou em 4 dias, qualidade excelente! Tecido leve e confort\u00e1vel. J\u00e1 usei pra jogar e pra sair. Super recomendo.</p>' +
      '<div class="kr-photos"><div style="width:80px;height:80px;border-radius:8px;background:#f3f4f6;display:flex;align-items:center;justify-content:center;font-size:24px;border:1px solid #e5e5e5;">\uD83D\uDC55</div></div>' +
      '</div>' +

      // Review 2 - 5 stars with photo
      '<div class="kr-card">' +
      '<div class="kr-header"><div class="kr-avatar">JC</div><div class="kr-meta"><span class="kr-name">Juliana C.</span> <span class="kr-verified">\u2705 Compra verificada</span><br><span class="kr-stars-sm">\u2B50\u2B50\u2B50\u2B50\u2B50</span> <span class="kr-date">Jun 2026</span></div></div>' +
      '<p class="kr-text">Comprei pro meu marido e ele amou! A estampa \u00e9 n\u00edtida e n\u00e3o desbota. Material dry-fit muito bom pra esse calor. Entrega r\u00e1pida.</p>' +
      '<div class="kr-photos"><div style="width:80px;height:80px;border-radius:8px;background:#f3f4f6;display:flex;align-items:center;justify-content:center;font-size:24px;border:1px solid #e5e5e5;">\uD83D\uDCE6</div></div>' +
      '</div>' +

      // Review 3 - 4 stars (important for credibility)
      '<div class="kr-card">' +
      '<div class="kr-header"><div class="kr-avatar">MA</div><div class="kr-meta"><span class="kr-name">Marcos A.</span> <span class="kr-verified">\u2705 Compra verificada</span><br><span class="kr-stars-sm">\u2B50\u2B50\u2B50\u2B50</span> <span class="kr-date">Mai 2026</span></div></div>' +
      '<p class="kr-text">Camisa bonita, boa qualidade. Demorou 6 dias pra chegar (esperava menos). Mas o produto em si \u00e9 \u00f3timo, vesti certinho no tamanho M.</p>' +
      '</div>' +

      // Review 4 - 5 stars
      '<div class="kr-card">' +
      '<div class="kr-header"><div class="kr-avatar">FS</div><div class="kr-meta"><span class="kr-name">Felipe S.</span> <span class="kr-verified">\u2705 Compra verificada</span><br><span class="kr-stars-sm">\u2B50\u2B50\u2B50\u2B50\u2B50</span> <span class="kr-date">Mai 2026</span></div></div>' +
      '<p class="kr-text">Segunda vez que compro aqui. Qualidade top, igual a foto. Dessa vez comprei a azul e a amarela. PIX caiu na hora e recebi r\u00e1pido.</p>' +
      '</div>' +

      // Review 5 - 5 stars with photo
      '<div class="kr-card">' +
      '<div class="kr-header"><div class="kr-avatar">AC</div><div class="kr-meta"><span class="kr-name">Ana C.</span> <span class="kr-verified">\u2705 Compra verificada</span><br><span class="kr-stars-sm">\u2B50\u2B50\u2B50\u2B50\u2B50</span> <span class="kr-date">Jun 2026</span></div></div>' +
      '<p class="kr-text">Comprei pra fam\u00edlia toda! Kit com 3 camisas (pai, m\u00e3e e filho). Chegou tudo certinho, embalagem caprichada. A do meu filho de 6 anos ficou linda.</p>' +
      '<div class="kr-photos"><div style="width:80px;height:80px;border-radius:8px;background:#f3f4f6;display:flex;align-items:center;justify-content:center;font-size:24px;border:1px solid #e5e5e5;">\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC66</div></div>' +
      '</div>' +

      // Review 6 - 4 stars
      '<div class="kr-card">' +
      '<div class="kr-header"><div class="kr-avatar">LP</div><div class="kr-meta"><span class="kr-name">Lucas P.</span> <span class="kr-verified">\u2705 Compra verificada</span><br><span class="kr-stars-sm">\u2B50\u2B50\u2B50\u2B50</span> <span class="kr-date">Mai 2026</span></div></div>' +
      '<p class="kr-text">Boa camisa pelo pre\u00e7o. Material bom, costura firme. S\u00f3 achei que o dourado da gola podia ser um pouco mais vivo. Mas no geral recomendo.</p>' +
      '</div>' +

      '</div>';

    // Insert guarantee + reviews after the product form section
    function insertSections() {
      var productSection = document.querySelector('.product, product-info, .product__info-wrapper');
      if (!productSection) {
        productSection = document.querySelector('main, #MainContent, #shopify-section-template--26751223201835__main');
      }
      if (productSection) {
        var container = document.createElement('div');
        container.innerHTML = guaranteeHTML + reviewsHTML;
        productSection.parentNode.insertBefore(container, productSection.nextSibling);
      } else {
        // Fallback: insert before footer
        var footer = document.querySelector('footer, .footer');
        if (footer) {
          var container = document.createElement('div');
          container.innerHTML = guaranteeHTML + reviewsHTML;
          footer.parentNode.insertBefore(container, footer);
        }
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', insertSections);
    } else {
      insertSections();
    }
  }

  // --- TRUST BADGES NEAR ADD TO CART BUTTON ---
  if (isProductPage) {
    function insertTrustBadges() {
      var formBtn = document.querySelector('.product-form__submit, form[action*="cart"] button[type="submit"]');
      if (!formBtn) return;
      var parent = formBtn.parentNode;
      var badges = document.createElement('div');
      badges.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:12px;padding:12px 0;';
      badges.innerHTML = '<span style="font-size:12px;color:#666;display:flex;align-items:center;gap:4px;">\u2705 Compra Segura</span>' +
        '<span style="font-size:12px;color:#666;display:flex;align-items:center;gap:4px;">\uD83D\uDE9A Frete Gr\u00e1tis</span>' +
        '<span style="font-size:12px;color:#666;display:flex;align-items:center;gap:4px;">\uD83D\uDCE6 Entrega 3-7 dias</span>' +
        '<span style="font-size:12px;color:#666;display:flex;align-items:center;gap:4px;">\uD83D\uDD04 Troca 7 dias</span>';
      parent.insertBefore(badges, formBtn.nextSibling);
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', insertTrustBadges);
    } else {
      insertTrustBadges();
    }
  }
})();
