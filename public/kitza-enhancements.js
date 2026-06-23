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

    /* Enhance existing reviews visibility */
    .rw-main-wrapper .lumin-text__fancy1 {
      background-image: none !important;
      -webkit-background-clip: unset !important;
      background-clip: unset !important;
      color: #d4af37 !important;
    }
    .rw-main-wrapper {
      background: #111 !important;
      padding: 40px 0 !important;
    }
    .rw-sub-wrapper {
      max-width: 900px !important;
      margin: 0 auto !important;
    }
    .rw-title {
      font-size: 26px !important;
      font-weight: 700 !important;
      color: #fff !important;
      margin-bottom: 24px !important;
    }
    .rating-summary {
      border: 2px solid #d4af37 !important;
      padding: 24px !important;
      margin-bottom: 24px !important;
    }
    .rating-summary-score {
      font-size: 48px !important;
      font-weight: 800 !important;
    }
    .rating-summary-count {
      font-size: 16px !important;
    }
    /* Review cards - bigger images, clearer text */
    .review-item img, .rw-review-image img {
      width: 100% !important;
      max-width: 200px !important;
      height: auto !important;
      border-radius: 10px !important;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
    }
    .review-item, .rw-review-card {
      background: #fff !important;
      border-radius: 12px !important;
      padding: 16px !important;
      margin-bottom: 16px !important;
    }
    /* Testimonial slider images bigger */
    image-testimony-slider-imagetestimonyhbrexr img {
      border-radius: 10px !important;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
    }
    /* "Quem comprou, amou" section more prominent */
    .image-testimony-title, [class*="testimony"] h2 {
      font-size: 22px !important;
      font-weight: 700 !important;
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

    // Insert guarantee after the product form section
    function insertSections() {
      var productSection = document.querySelector('.product, product-info, .product__info-wrapper');
      if (!productSection) {
        productSection = document.querySelector('main, #MainContent, #shopify-section-template--26751223201835__main');
      }
      if (productSection) {
        var container = document.createElement('div');
        container.innerHTML = guaranteeHTML;
        productSection.parentNode.insertBefore(container, productSection.nextSibling);
      } else {
        // Fallback: insert before footer
        var footer = document.querySelector('footer, .footer');
        if (footer) {
          var container = document.createElement('div');
          container.innerHTML = guaranteeHTML;
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
