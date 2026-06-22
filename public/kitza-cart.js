/* KITZA Store - Cart + PIX Payment Gateway */
(function(){
'use strict';

var PIX_API = 'https://kitza-pay-api.netlify.app';
var WA_NUMBER = '5575988231829';

/* === CART === */
var cart = [];
try { cart = JSON.parse(localStorage.getItem('kitza_cart') || '[]') || []; } catch(e) { cart = []; }
function saveCart() { try { localStorage.setItem('kitza_cart', JSON.stringify(cart)); } catch(e) {} }
function cartTotal() { return cart.reduce(function(s, it) { return s + it.price * it.qty; }, 0); }
function cartCount() { return cart.reduce(function(s, it) { return s + it.qty; }, 0); }
function brl(v) { return 'R$ ' + v.toFixed(2).replace('.', ','); }

function addToCart(name, price, size, img) {
  var f = cart.filter(function(x) { return x.name === name && x.size === size; })[0];
  if (f) f.qty++; else cart.push({ name: name, price: price, size: size, img: img || '', qty: 1 });
  saveCart();
  updateCartBadge();
  showToast('Adicionado ao carrinho ✓');
  if (typeof fbq === 'function') fbq('track', 'AddToCart', { content_name: name, value: price, currency: 'BRL' });
}

function removeFromCart(idx) { cart.splice(idx, 1); saveCart(); renderCartPage(); updateCartBadge(); }
function changeQty(idx, delta) { cart[idx].qty += delta; if (cart[idx].qty <= 0) cart.splice(idx, 1); saveCart(); renderCartPage(); updateCartBadge(); }

function updateCartBadge() {
  var count = cartCount();
  document.querySelectorAll('.cart-count-badge, [data-cart-count]').forEach(function(el) { el.textContent = count; el.style.display = count > 0 ? '' : 'none'; });
  var bubbles = document.querySelectorAll('.header__cart-count, .cart-count-bubble');
  bubbles.forEach(function(el) { el.textContent = count; if (count > 0) el.style.display = ''; });
}

function showToast(msg) {
  var t = document.getElementById('kitza-toast');
  if (!t) { t = document.createElement('div'); t.id = 'kitza-toast'; t.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#1db954;color:#fff;padding:14px 28px;border-radius:12px;font-weight:700;font-size:15px;z-index:99999;opacity:0;transition:opacity .3s;pointer-events:none;'; document.body.appendChild(t); }
  t.textContent = msg; t.style.opacity = '1';
  clearTimeout(t._h); t._h = setTimeout(function() { t.style.opacity = '0'; }, 2000);
}

/* === INTERCEPT ADD TO CART === */
function interceptForms() {
  document.querySelectorAll('form[action*="/cart/add"], form[action*="cart/add"], product-form form').forEach(function(form) {
    if (form._kitzaHooked) return;
    form._kitzaHooked = true;
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      e.stopPropagation();
      var nameEl = document.querySelector('h1.product__title, .product__title h1, h1');
      var name = nameEl ? nameEl.textContent.trim().split('\n')[0].trim() : 'Produto';
      var priceEl = document.querySelector('.price-item--sale .money, .price-item--sale, .price-item--regular .money, .price-item--regular, .price .money');
      var priceText = priceEl ? priceEl.textContent.trim() : '0';
      var price = parseFloat(priceText.replace(/[^\d,]/g, '').replace(',', '.')) || 99.90;
      var sizeContainer = form.closest('section, product-info, .product');
      var sizeEl = sizeContainer ? sizeContainer.querySelector('input[type="radio"]:checked, variant-selects input:checked') : null;
      var size = 'Único';
      if (sizeEl) {
        size = sizeEl.getAttribute('text') || sizeEl.getAttribute('data-value') || 'Único';
        if (size === 'Único') {
          var lbl = sizeEl.nextElementSibling;
          if (lbl && lbl.tagName === 'LABEL') size = lbl.textContent.trim().split(/[^A-Za-z0-9]/)[0] || 'Único';
        }
      }
      var imgEl = document.querySelector('.product__media img, .product-single__photo img, media-gallery img, .product__media-item img');
      var img = imgEl ? imgEl.src : '';
      addToCart(name, price, size, img);
    });
  });
}

/* === RENDER CART PAGE === */
function renderCartPage() {
  var container = document.getElementById('kitza-cart-items') || document.querySelector('.cart__items, cart-items, .cart-items, #CartDrawer-CartItems');
  if (!container) return;
  
  if (cart.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:60px 20px;"><h2 style="font-size:1.4rem;margin-bottom:12px;">Seu carrinho está vazio</h2><p style="color:#666;margin-bottom:20px;">Adicione produtos para continuar</p><a href="collections/all.html" style="display:inline-block;background:#000;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;">Ver Produtos</a></div>';
    updateCheckoutSection();
    return;
  }

  var html = '<table class="cart-items" style="width:100%;border-collapse:collapse;">';
  html += '<thead><tr><th style="text-align:left;padding:12px 0;border-bottom:1px solid #e5e5e5;">Produto</th><th style="padding:12px 0;border-bottom:1px solid #e5e5e5;">Qtd</th><th style="text-align:right;padding:12px 0;border-bottom:1px solid #e5e5e5;">Total</th></tr></thead><tbody>';
  cart.forEach(function(it, idx) {
    html += '<tr style="border-bottom:1px solid #f0f0f0;">';
    html += '<td style="padding:16px 0;display:flex;align-items:center;gap:12px;">';
    if (it.img) html += '<img src="' + it.img + '" style="width:80px;height:80px;object-fit:cover;border-radius:8px;" alt="">';
    html += '<div><strong style="display:block;font-size:14px;">' + it.name + '</strong><span style="color:#666;font-size:13px;">Tam: ' + it.size + '</span><br><span style="color:#666;font-size:13px;">' + brl(it.price) + '</span>';
    html += '<br><button onclick="window.kitzaRemove(' + idx + ')" style="color:#c00;background:none;border:none;cursor:pointer;font-size:12px;padding:4px 0;">Remover</button></div></td>';
    html += '<td style="text-align:center;"><div style="display:inline-flex;align-items:center;gap:8px;border:1px solid #ddd;border-radius:6px;padding:4px 8px;"><button onclick="window.kitzaQty(' + idx + ',-1)" style="background:none;border:none;cursor:pointer;font-size:18px;">−</button><span>' + it.qty + '</span><button onclick="window.kitzaQty(' + idx + ',1)" style="background:none;border:none;cursor:pointer;font-size:18px;">+</button></div></td>';
    html += '<td style="text-align:right;font-weight:700;">' + brl(it.price * it.qty) + '</td>';
    html += '</tr>';
  });
  html += '</tbody></table>';
  container.innerHTML = html;
  updateCheckoutSection();
}

function updateCheckoutSection() {
  var total = cartTotal();
  var count = cartCount();
  var ctas = document.getElementById('kitza-cart-ctas') || document.querySelector('.cart__ctas, .cart__footer-ctas, #cart-ctas-kitza');
  if (!ctas) {
    ctas = document.createElement('div');
    ctas.id = 'kitza-cart-ctas';
    var parent = document.querySelector('main');
    if (parent) parent.appendChild(ctas);
  }
  if (count === 0) { ctas.innerHTML = ''; return; }
  
  ctas.innerHTML = '<div style="padding:20px 0;border-top:2px solid #000;margin-top:20px;">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;"><span style="font-size:16px;font-weight:600;">Subtotal</span><strong style="font-size:20px;">' + brl(total) + '</strong></div>' +
    '<div style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:10px 14px;margin-bottom:16px;font-size:14px;color:#166534;">💰 No PIX: <strong>' + brl(total * 0.95) + '</strong> (5% OFF)</div>' +
    '<button onclick="window.kitzaOpenCheckout()" style="width:100%;background:#000;color:#fff;border:none;padding:16px;border-radius:10px;font-size:16px;font-weight:700;cursor:pointer;margin-bottom:10px;">⚡ FINALIZAR COMPRA</button>' +
    '<button onclick="window.kitzaWhatsApp()" style="width:100%;background:#25d366;color:#fff;border:none;padding:14px;border-radius:10px;font-size:15px;font-weight:700;cursor:pointer;">💬 Finalizar no WhatsApp</button>' +
    '<p style="text-align:center;margin-top:12px;font-size:12px;color:#666;">🔒 Pagamento seguro · PIX instantâneo · Troca em 7 dias</p>' +
    '</div>';
  updateCartBadge();
}

/* === CHECKOUT MODAL === */
function createCheckoutModal() {
  if (document.getElementById('kitza-checkout-modal')) return;
  var modal = document.createElement('div');
  modal.id = 'kitza-checkout-modal';
  modal.style.cssText = 'display:none;position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.6);overflow-y:auto;padding:20px;';
  modal.innerHTML = '<div style="max-width:500px;margin:40px auto;background:#fff;border-radius:16px;padding:32px;position:relative;">' +
    '<button onclick="window.kitzaCloseCheckout()" style="position:absolute;top:12px;right:16px;background:none;border:none;font-size:28px;cursor:pointer;">&times;</button>' +
    '<h2 style="font-size:20px;margin-bottom:20px;">Dados para envio</h2>' +
    '<div style="display:flex;flex-direction:column;gap:14px;" id="kitza-checkout-form">' +
    '<input type="text" id="kz-nome" placeholder="Nome completo" style="padding:12px 16px;border:1px solid #ddd;border-radius:8px;font-size:15px;">' +
    '<input type="tel" id="kz-tel" placeholder="WhatsApp (00) 00000-0000" style="padding:12px 16px;border:1px solid #ddd;border-radius:8px;font-size:15px;">' +
    '<input type="text" id="kz-cep" placeholder="CEP" maxlength="9" oninput="window.kitzaBuscaCep(this)" style="padding:12px 16px;border:1px solid #ddd;border-radius:8px;font-size:15px;">' +
    '<p style="font-size:12px;color:#666;margin:-8px 0 0;">Digite o CEP para preencher automaticamente</p>' +
    '<div id="kz-addr-fields" style="display:none;display:flex;flex-direction:column;gap:14px;">' +
    '<div style="display:flex;gap:10px;"><input type="text" id="kz-rua" placeholder="Endereço" style="flex:3;padding:12px 16px;border:1px solid #ddd;border-radius:8px;font-size:15px;"><input type="text" id="kz-num" placeholder="Nº" style="flex:1;padding:12px 16px;border:1px solid #ddd;border-radius:8px;font-size:15px;"></div>' +
    '<div style="display:flex;gap:10px;"><input type="text" id="kz-complemento" placeholder="Complemento (opcional)" style="flex:1;padding:12px 16px;border:1px solid #ddd;border-radius:8px;font-size:15px;"><input type="text" id="kz-bairro" placeholder="Bairro" style="flex:1;padding:12px 16px;border:1px solid #ddd;border-radius:8px;font-size:15px;"></div>' +
    '<div style="display:flex;gap:10px;"><input type="text" id="kz-cidade" placeholder="Cidade" style="flex:2;padding:12px 16px;border:1px solid #ddd;border-radius:8px;font-size:15px;"><select id="kz-estado" style="flex:1;padding:12px 16px;border:1px solid #ddd;border-radius:8px;font-size:15px;"><option value="">UF</option><option>AC</option><option>AL</option><option>AP</option><option>AM</option><option>BA</option><option>CE</option><option>DF</option><option>ES</option><option>GO</option><option>MA</option><option>MT</option><option>MS</option><option>MG</option><option>PA</option><option>PB</option><option>PR</option><option>PE</option><option>PI</option><option>RJ</option><option>RN</option><option>RS</option><option>RO</option><option>RR</option><option>SC</option><option>SP</option><option>SE</option><option>TO</option></select></div>' +
    '</div>' +
    '<input type="tel" id="kz-cpf" placeholder="CPF (necessário para PIX)" maxlength="14" style="padding:12px 16px;border:1px solid #ddd;border-radius:8px;font-size:15px;">' +
    '<input type="email" id="kz-email" placeholder="E-mail (opcional)" style="padding:12px 16px;border:1px solid #ddd;border-radius:8px;font-size:15px;">' +
    '<div style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:14px;text-align:center;"><strong>Total no PIX: ' + brl(cartTotal() * 0.95) + '</strong> <span style="color:#666;font-size:13px;">(5% OFF)</span></div>' +
    '<button onclick="window.kitzaOpenPix()" style="width:100%;background:#000;color:#fff;border:none;padding:16px;border-radius:10px;font-size:16px;font-weight:700;cursor:pointer;">⚡ PAGAR VIA PIX — ' + brl(cartTotal() * 0.95) + '</button>' +
    '<button onclick="window.kitzaWhatsApp()" style="width:100%;background:#25d366;color:#fff;border:none;padding:14px;border-radius:10px;font-size:15px;font-weight:700;cursor:pointer;">💬 Finalizar no WhatsApp</button>' +
    '<p style="text-align:center;font-size:11px;color:#666;margin-top:8px;">🔒 SSL · PIX instantâneo · Compra garantida · CNPJ 52.347.891/0001-04</p>' +
    '</div></div>';
  document.body.appendChild(modal);
  modal.addEventListener('click', function(e) { if (e.target === modal) window.kitzaCloseCheckout(); });
}

/* === PIX MODAL === */
function createPixModal() {
  if (document.getElementById('kitza-pix-modal')) return;
  var modal = document.createElement('div');
  modal.id = 'kitza-pix-modal';
  modal.style.cssText = 'display:none;position:fixed;inset:0;z-index:999999;background:rgba(0,0,0,.7);overflow-y:auto;padding:20px;';
  modal.innerHTML = '<div style="max-width:420px;margin:40px auto;background:#fff;border-radius:16px;padding:32px;position:relative;text-align:center;">' +
    '<button onclick="window.kitzaClosePix()" style="position:absolute;top:12px;right:16px;background:none;border:none;font-size:28px;cursor:pointer;">&times;</button>' +
    '<div id="kz-pix-loading" style="padding:40px;">Gerando seu PIX…</div>' +
    '<div id="kz-pix-content" style="display:none;">' +
    '<h3 style="font-size:18px;margin-bottom:8px;">Pagar com PIX</h3>' +
    '<div id="kz-pix-val" style="font-size:24px;font-weight:700;margin-bottom:8px;">R$ 0,00</div>' +
    '<div style="display:flex;align-items:center;justify-content:center;gap:6px;color:#f59e0b;font-size:13px;margin-bottom:16px;"><span style="width:8px;height:8px;background:#f59e0b;border-radius:50%;display:inline-block;animation:pulse 1.5s infinite;"></span> Aguardando pagamento…</div>' +
    '<div id="kz-pix-qr" style="margin:0 auto 16px;"></div>' +
    '<p style="font-size:13px;color:#666;margin-bottom:8px;">PIX copia e cola:</p>' +
    '<textarea id="kz-pix-code" readonly style="width:100%;height:60px;font-size:11px;padding:10px;border:1px solid #ddd;border-radius:8px;resize:none;margin-bottom:12px;"></textarea>' +
    '<button onclick="window.kitzaCopyPix()" id="kz-pix-copy-btn" style="width:100%;background:#000;color:#fff;border:none;padding:14px;border-radius:10px;font-size:15px;font-weight:700;cursor:pointer;">Copiar código PIX</button>' +
    '<p style="font-size:12px;color:#666;margin-top:12px;">Escaneie o QR Code ou use o copia e cola. O pagamento é confirmado automaticamente.</p>' +
    '</div>' +
    '<div id="kz-pix-approved" style="display:none;padding:20px;">' +
    '<div style="font-size:60px;color:#22c55e;margin-bottom:12px;">✓</div>' +
    '<h3 style="font-size:20px;margin-bottom:8px;">Pagamento aprovado!</h3>' +
    '<p style="color:#666;margin-bottom:20px;">Recebemos seu PIX. Em breve falaremos no WhatsApp para combinar a entrega. Obrigado!</p>' +
    '<a href="https://wa.me/' + WA_NUMBER + '" target="_blank" rel="noopener" style="display:block;width:100%;background:#25d366;color:#fff;padding:14px;border-radius:10px;font-size:15px;font-weight:700;text-decoration:none;text-align:center;">Falar no WhatsApp</a>' +
    '</div>' +
    '<div id="kz-pix-error" style="display:none;padding:20px;">' +
    '<p id="kz-pix-err-msg" style="color:#c00;margin-bottom:16px;">Erro ao gerar PIX</p>' +
    '<button onclick="window.kitzaClosePix()" style="width:100%;background:#000;color:#fff;border:none;padding:14px;border-radius:10px;font-weight:700;cursor:pointer;">Fechar</button>' +
    '</div>' +
    '</div>';
  modal.innerHTML += '<style>@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}</style>';
  document.body.appendChild(modal);
  modal.addEventListener('click', function(e) { if (e.target === modal) window.kitzaClosePix(); });
}

/* === PIX FUNCTIONS === */
var pixPoll = null, pixTid = null;
function pixShow(which) {
  ['kz-pix-loading', 'kz-pix-content', 'kz-pix-approved', 'kz-pix-error'].forEach(function(id) {
    var el = document.getElementById(id); if (el) el.style.display = (id === which) ? '' : 'none';
  });
}
function pixDigits(s) { return (s || '').replace(/\D/g, ''); }
function cpfValido(c) {
  c = pixDigits(c);
  if (c.length !== 11 || /^(\d)\1{10}$/.test(c)) return false;
  var s = 0, i;
  for (i = 0; i < 9; i++) s += parseInt(c.charAt(i), 10) * (10 - i);
  var d1 = (s * 10) % 11; if (d1 === 10) d1 = 0; if (d1 !== parseInt(c.charAt(9), 10)) return false;
  s = 0; for (i = 0; i < 10; i++) s += parseInt(c.charAt(i), 10) * (11 - i);
  var d2 = (s * 10) % 11; if (d2 === 10) d2 = 0; return d2 === parseInt(c.charAt(10), 10);
}

window.kitzaOpenPix = function() {
  if (!cart.length) return;
  var nome = gv('kz-nome'), email = gv('kz-email'), cpf = pixDigits(gv('kz-cpf')), tel = pixDigits(gv('kz-tel'));
  if (!nome || cpf.length !== 11 || tel.length < 10) {
    showToast('Preencha nome, CPF e WhatsApp'); return;
  }
  if (!cpfValido(cpf)) { showToast('CPF inválido'); return; }
  
  createPixModal();
  pixShow('kz-pix-loading');
  document.getElementById('kitza-pix-modal').style.display = '';
  document.body.style.overflow = 'hidden';
  
  var body = { amount: Math.round(cartTotal() * 0.95 * 100) / 100, client: { name: nome, email: email || 'cliente@kitzastore.store', document: cpf, phone: tel } };
  fetch(PIX_API + '/.netlify/functions/create-pix', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    .then(function(r) { return r.json().then(function(d) { return { ok: r.ok, d: d }; }); })
    .then(function(res) {
      if (!res.ok || !res.d.ok || !res.d.code) throw new Error((res.d && res.d.detail) || 'Não foi possível gerar o PIX');
      var d = res.d; pixTid = d.transactionId;
      document.getElementById('kz-pix-val').textContent = brl(d.amount || cartTotal());
      document.getElementById('kz-pix-code').value = d.code;
      var qrEl = document.getElementById('kz-pix-qr');
      if (d.base64) { qrEl.innerHTML = '<img alt="QR Code PIX" src="data:image/png;base64,' + d.base64 + '" style="max-width:200px;margin:0 auto;">'; }
      else if (typeof qrcode !== 'undefined') { var qr = qrcode(0, 'M'); qr.addData(d.code); qr.make(); qrEl.innerHTML = qr.createImgTag(5, 8); }
      pixShow('kz-pix-content');
      startPixPoll();
    })
    .catch(function(e) {
      document.getElementById('kz-pix-err-msg').textContent = (e && e.message) || 'Erro ao gerar o PIX.';
      pixShow('kz-pix-error');
    });
};

function startPixPoll() {
  stopPixPoll();
  pixPoll = setInterval(function() {
    if (!pixTid) return;
    fetch(PIX_API + '/.netlify/functions/status?id=' + pixTid).then(function(r) { return r.json(); }).then(function(d) {
      if (d && d.paid) { stopPixPoll(); onPixApproved(); }
    }).catch(function() {});
  }, 4000);
}
function stopPixPoll() { if (pixPoll) { clearInterval(pixPoll); pixPoll = null; } }
function onPixApproved() { pixShow('kz-pix-approved'); cart = []; saveCart(); updateCartBadge(); }

window.kitzaClosePix = function() { stopPixPoll(); document.getElementById('kitza-pix-modal').style.display = 'none'; document.body.style.overflow = ''; };
window.kitzaCopyPix = function() {
  var t = document.getElementById('kz-pix-code'); t.select(); t.setSelectionRange(0, 99999);
  try { document.execCommand('copy'); } catch(e) {}
  if (navigator.clipboard) navigator.clipboard.writeText(t.value).catch(function() {});
  var b = document.getElementById('kz-pix-copy-btn'); b.textContent = 'Copiado ✓'; setTimeout(function() { b.textContent = 'Copiar código PIX'; }, 1600);
};

/* === CHECKOUT === */
window.kitzaOpenCheckout = function() {
  if (!cart.length) return;
  createCheckoutModal();
  var totalEl = document.querySelector('#kitza-checkout-modal strong');
  document.getElementById('kitza-checkout-modal').style.display = '';
  document.body.style.overflow = 'hidden';
};
window.kitzaCloseCheckout = function() { document.getElementById('kitza-checkout-modal').style.display = 'none'; document.body.style.overflow = ''; };

/* === WHATSAPP === */
window.kitzaWhatsApp = function() {
  if (!cart.length) return;
  var parts = ['Olá! Quero finalizar meu pedido na KITZA:', ''];
  cart.forEach(function(it) { parts.push('• ' + it.qty + 'x ' + it.name + ' (Tam ' + it.size + ') — ' + brl(it.price * it.qty)); });
  parts.push(''); parts.push('Total: ' + brl(cartTotal()));
  var nome = gv('kz-nome'), tel = gv('kz-tel'), cep = gv('kz-cep'), rua = gv('kz-rua'), num = gv('kz-num'), bairro = gv('kz-bairro'), cid = gv('kz-cidade'), uf = gv('kz-estado');
  if (nome) parts.push('Nome: ' + nome);
  if (tel) parts.push('WhatsApp: ' + tel);
  if (rua || cid) parts.push('Endereço: ' + rua + ', ' + num + ' · ' + bairro + ' · ' + cid + '/' + uf + ' · CEP ' + cep);
  window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(parts.join('\n')), '_blank');
};

/* === CEP === */
window.kitzaBuscaCep = function(input) {
  var c = input.value.replace(/\D/g, '');
  if (c.length !== 8) return;
  fetch('https://viacep.com.br/ws/' + c + '/json/').then(function(r) { return r.json(); }).then(function(d) {
    if (!d.erro) {
      sv('kz-rua', d.logradouro || ''); sv('kz-bairro', d.bairro || ''); sv('kz-cidade', d.localidade || ''); sv('kz-estado', d.uf || '');
      var f = document.getElementById('kz-addr-fields'); if (f) f.style.display = '';
      var n = document.getElementById('kz-num'); if (n) n.focus();
    }
  }).catch(function() {});
};

function gv(id) { var e = document.getElementById(id); return e ? e.value.trim() : ''; }
function sv(id, v) { var e = document.getElementById(id); if (e) e.value = v; }

/* === CART PAGE OVERRIDE === */
window.kitzaRemove = removeFromCart;
window.kitzaQty = changeQty;

/* === INIT === */
function init() {
  interceptForms();
  updateCartBadge();
  
  // If on cart page, render custom cart
  if ((window.location.pathname === '/cart' || window.location.pathname === '/cart.html' || window.location.pathname.match(/\/cart(\/|$)/)) || document.title.indexOf('Carrinho') !== -1) {
    setTimeout(function() {
      // Replace main content entirely to avoid Shopify custom element conflicts
      var mainEl = document.querySelector('main');
      if (mainEl) {
        mainEl.innerHTML = '<div style="max-width:800px;margin:0 auto;padding:20px;"><h1 style="font-size:2rem;margin-bottom:8px;">Carrinho</h1><a href="collections/all.html" style="color:#666;text-decoration:underline;font-size:14px;">Voltar à loja</a><div id="kitza-cart-items" style="margin-top:20px;"></div><div id="kitza-cart-ctas"></div></div>';
      }
      renderCartPage();
      // Hide Shopify checkout button
      var btn = document.getElementById('CartDrawer-Checkout');
      if (btn) btn.style.display = 'none';
    }, 500);
  }
  
  // Observe for dynamically loaded forms
  var observer = new MutationObserver(function() { interceptForms(); });
  observer.observe(document.body, { childList: true, subtree: true });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();

})();
