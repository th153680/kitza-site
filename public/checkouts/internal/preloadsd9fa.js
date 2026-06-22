
    (function() {
      var preconnectOrigins = ["https://cdn.shopify.com"];
      var scripts = ["/cdn/shopifycloud/checkout-web/assets/c1/polyfills-legacy.DdM_vFj8.js","/cdn/shopifycloud/checkout-web/assets/c1/app-legacy.zPiAISwb.js","/cdn/shopifycloud/checkout-web/assets/c1/esnext-vendor-legacy.DgvOxEBb.js","/cdn/shopifycloud/checkout-web/assets/c1/context-browser-legacy.0mv5M9B5.js","/cdn/shopifycloud/checkout-web/assets/c1/NotFound-legacy.SW-v-9Py.js","/cdn/shopifycloud/checkout-web/assets/c1/types-UnauthenticatedErrorModalPayload-legacy.X2GMj0T8.js","/cdn/shopifycloud/checkout-web/assets/c1/images-payment-icon-legacy.5IgMAFKm.js","/cdn/shopifycloud/checkout-web/assets/c1/FullScreenBackground-legacy.BmtJT9QQ.js","/cdn/shopifycloud/checkout-web/assets/c1/helpers-userPrivacySettingsExperimentConsent-legacy.CYtTaIpj.js","/cdn/shopifycloud/checkout-web/assets/c1/phone-phoneCountryCode-legacy.B8SW5huU.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useShopPayCheckoutGqlVersion-legacy.C-434OHl.js","/cdn/shopifycloud/checkout-web/assets/c1/shared-unactionable-errors-legacy.CgQfQsnu.js","/cdn/shopifycloud/checkout-web/assets/c1/utils-getCommonShopPayExternalTelemetryAttributes-legacy.DEs1LutZ.js","/cdn/shopifycloud/checkout-web/assets/c1/graphql-ShopPayCheckoutSessionQuery-legacy.DK-RonEi.js","/cdn/shopifycloud/checkout-web/assets/c1/graphql-UserPrivacySettingsSetMutation-legacy.DqGng-OW.js","/cdn/shopifycloud/checkout-web/assets/c1/hydrate-legacy.CGWTk7kJ.js","/cdn/shopifycloud/checkout-web/assets/c1/locale-pt-BR-legacy.CPtUu-wc.js","/cdn/shopifycloud/checkout-web/assets/c1/page-Information-legacy.BtBzWJqG.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useWalletsTimeout-legacy.CbU_aetE.js","/cdn/shopifycloud/checkout-web/assets/c1/remember-me-hooks-legacy.BC2S8y5e.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useStableHostMethodsReferences-legacy.tjKlZd72.js","/cdn/shopifycloud/checkout-web/assets/c1/MarketsProDisclaimer-legacy.COiQzNLB.js","/cdn/shopifycloud/checkout-web/assets/c1/BillingAddressForm-legacy.DMYZ-6Rx.js","/cdn/shopifycloud/checkout-web/assets/c1/PhoneField-legacy.hptCt79h.js","/cdn/shopifycloud/checkout-web/assets/c1/images-flag-icon-legacy.Bfupgm8k.js","/cdn/shopifycloud/checkout-web/assets/c1/useShopPayButtonClassName-legacy.C8hZ_E1H.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useCheckoutProtocolDarkTheme-legacy.BC7Srj7r.js","/cdn/shopifycloud/checkout-web/assets/c1/types-index-legacy.C7bM1IgE.js","/cdn/shopifycloud/checkout-web/assets/c1/SplitDeliveryMerchandiseContainer-legacy.tCVwdQkN.js","/cdn/shopifycloud/checkout-web/assets/c1/ChangeCompanyLocationLink-legacy.CutqhqaG.js","/cdn/shopifycloud/checkout-web/assets/c1/WalletsSandbox-WalletSandbox-legacy.CwNWT6qY.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useForceShopPayUrl-legacy.jNYdHOZY.js","/cdn/shopifycloud/checkout-web/assets/c1/ButtonWithRegisterWebPixel-legacy.B68PABFm.js","/cdn/shopifycloud/checkout-web/assets/c1/GooglePayButton-index-legacy.FpDOlGpH.js","/cdn/shopifycloud/checkout-web/assets/c1/PendingShipping-legacy.CN6UipsW.js","/cdn/shopifycloud/checkout-web/assets/c1/ImpressionEventCapture-legacy.DWCo9M2U.js","/cdn/shopifycloud/checkout-web/assets/c1/AutocompleteField-hooks-legacy.CDYrkkdG.js","/cdn/shopifycloud/checkout-web/assets/c1/billing-address-hooks-legacy.C87mpPbx.js"];
      var styles = [];
      var fontPreconnectUrls = [];
      var fontPrefetchUrls = [];
      var imgPrefetchUrls = ["https://cdn.shopify.com/s/files/1/0689/9502/2891/files/JesusChristLogoBlack_1_x320.png?v=1780338278"];

      function preconnect(url, callback) {
        var link = document.createElement('link');
        link.rel = 'dns-prefetch preconnect';
        link.href = url;
        link.crossOrigin = '';
        link.onload = link.onerror = callback;
        document.head.appendChild(link);
      }

      function preconnectAssets() {
        var resources = preconnectOrigins.concat(fontPreconnectUrls);
        var index = 0;
        (function next() {
          var res = resources[index++];
          if (res) preconnect(res, next);
        })();
      }

      function prefetch(url, as, callback) {
        var link = document.createElement('link');
        if (link.relList.supports('prefetch')) {
          link.rel = 'prefetch';
          link.fetchPriority = 'low';
          link.as = as;
          if (as === 'font') link.type = 'font/woff2';
          link.href = url;
          link.crossOrigin = '';
          link.onload = link.onerror = callback;
          document.head.appendChild(link);
        } else {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.onloadend = callback;
          xhr.send();
        }
      }

      function prefetchAssets() {
        var resources = [].concat(
          scripts.map(function(url) { return [url, 'script']; }),
          styles.map(function(url) { return [url, 'style']; }),
          fontPrefetchUrls.map(function(url) { return [url, 'font']; }),
          imgPrefetchUrls.map(function(url) { return [url, 'image']; })
        );
        var index = 0;
        function run() {
          var res = resources[index++];
          if (res) prefetch(res[0], res[1], next);
        }
        var next = (self.requestIdleCallback || setTimeout).bind(self, run);
        next();
      }

      function onLoaded() {
        try {
          if (parseFloat(navigator.connection.effectiveType) > 2 && !navigator.connection.saveData) {
            preconnectAssets();
            prefetchAssets();
          }
        } catch (e) {}
      }

      if (document.readyState === 'complete') {
        onLoaded();
      } else {
        addEventListener('load', onLoaded);
      }
    })();
  