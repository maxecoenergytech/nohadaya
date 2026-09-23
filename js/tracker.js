/**
 * NOHADAYA Real-Time Visitor Analytics Tracker
 * Privacy-friendly, lightweight client-side & API analytics engine
 */
(function() {
  try {
    const STORAGE_KEY = 'NOHADAYA_ANALYTICS_V1';
    const SESSION_KEY = 'NOHADAYA_SESSION_ACTIVE';

    // 1. Get or create anonymous Visitor ID
    let visitorId = localStorage.getItem('nohadaya_visitor_id');
    let isNewVisitor = false;
    if (!visitorId) {
      visitorId = 'v_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now().toString(36);
      localStorage.setItem('nohadaya_visitor_id', visitorId);
      isNewVisitor = true;
    }

    // 2. Determine session
    let isNewSession = false;
    if (!sessionStorage.getItem(SESSION_KEY)) {
      sessionStorage.setItem(SESSION_KEY, 'active');
      isNewSession = true;
    }

    // 3. Detect Device & Traffic Source
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const deviceType = isMobile ? 'Mobile' : 'Desktop';
    
    let referrer = document.referrer || 'Direct';
    let source = 'Direct';
    if (referrer.includes('google.')) source = 'Google Search';
    else if (referrer.includes('facebook.') || referrer.includes('fb.')) source = 'Facebook';
    else if (referrer.includes('instagram.')) source = 'Instagram';
    else if (referrer.includes('wa.me') || referrer.includes('whatsapp')) source = 'WhatsApp';
    else if (referrer.includes('bing.') || referrer.includes('yahoo.')) source = 'Other Search';
    else if (referrer !== 'Direct') {
      try { source = new URL(referrer).hostname; } catch(e) { source = 'External Site'; }
    }

    const currentPath = window.location.pathname || '/';
    const today = new Date().toISOString().slice(0, 10);

    // 4. Update Local Analytics Store
    let stats = {};
    try {
      stats = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch(e) { stats = {}; }

    stats.total_pageviews = (stats.total_pageviews || 0) + 1;
    stats.visitors = stats.visitors || {};
    stats.visitors[visitorId] = stats.visitors[visitorId] || { first_seen: today, last_seen: today, visits: 0 };
    stats.visitors[visitorId].visits += 1;
    stats.visitors[visitorId].last_seen = today;

    // Daily breakdown
    stats.daily = stats.daily || {};
    stats.daily[today] = stats.daily[today] || { views: 0, unique: 0, visitors_set: [] };
    stats.daily[today].views += 1;
    if (!stats.daily[today].visitors_set.includes(visitorId)) {
      stats.daily[today].visitors_set.push(visitorId);
      stats.daily[today].unique = stats.daily[today].visitors_set.length;
    }

    // Page breakdown
    stats.pages = stats.pages || {};
    stats.pages[currentPath] = (stats.pages[currentPath] || 0) + 1;

    // Source breakdown
    stats.sources = stats.sources || {};
    stats.sources[source] = (stats.sources[source] || 0) + 1;

    // Device breakdown
    stats.devices = stats.devices || {};
    stats.devices[deviceType] = (stats.devices[deviceType] || 0) + 1;

    // Save back to storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));

    // Optional: send beacon to backend if API is available
    if (navigator.sendBeacon) {
      const payload = JSON.stringify({
        visitor_id: visitorId,
        path: currentPath,
        source: source,
        device: deviceType,
        timestamp: new Date().toISOString()
      });
      navigator.sendBeacon('/api/analytics/track', payload);
    }
  } catch(err) {
    console.debug('[NOHADAYA Tracker]', err);
  }
})();
