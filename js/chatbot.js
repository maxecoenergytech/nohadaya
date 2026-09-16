/**
 * NOHADAYA AI Assistant - Interactive 24/7 Question Answering & Trial Booking Widget
 * Features:
 * - Instant local NLP knowledge engine (zero latency, offline capable)
 * - Optional Google Gemini API integration (via window.NOHADAYA_AI_CONFIG)
 * - Deep awareness of NOHADAYA fees, schedules, age limits, location & courses
 * - Direct triggers to website trial modal and WhatsApp support
 */

(function () {
  'use strict';

  // --- KNOWLEDGE BASE CONFIGURATION ---
  const STUDIO_INFO = {
    name: 'NOHADAYA Mind & Motion Studio',
    phone: '+91 91010 65541',
    phone2: '+91 88761 21675',
    whatsapp: '919101065541',
    address: 'H/No. 422, 1st Floor, Roseland Road, Near Satgaon Nowapara Jame Masjid, Behind Apple Pie, Bagharbari, Guwahati, Assam 781037',
    mapsUrl: 'https://maps.google.com/?q=NOHADAYA+Mind+and+Motion+Studio+Bagharbari+Guwahati',
    fees: {
      yoga: '₹500/month (3-day batch) or ₹800/month (5-day batch)',
      abacus: '₹600/month (includes workbook & abacus kit guidance)',
      calligraphy: '₹500/month (handwriting correction & calligraphy styles)',
      registration: '₹200 one-time registration fee'
    },
    timings: {
      yoga: 'Morning: 6:00 AM – 7:30 AM | Evening: 5:00 PM – 6:30 PM (Mon–Fri)',
      abacus: 'Morning: 9:00 AM – 11:00 AM | Evening: 4:00 PM – 6:00 PM (Weekend batches available)',
      calligraphy: 'Morning: 10:00 AM – 12:00 PM | Evening: 5:00 PM – 6:30 PM (Flexible weekend slots)'
    },
    ageGroups: {
      abacus: 'Designed for children aged 5 to 14 years.',
      calligraphy: 'Suitable for children (6+ years), teens, and adults.',
      yoga: 'Open to all age groups (Kids, Teens, Adults, Senior Citizens, Gentle Prenatal).'
    }
  };

  // --- SMART RESPONSES & INTENT MATCHING ---
  const INTENT_PATTERNS = [
    {
      id: 'greeting',
      patterns: [/\b(hi|hello|hey|namaste|greetings|good morning|good evening|good afternoon)\b/i],
      response: () => ({
        text: `Hello! 🙏 Welcome to **NOHADAYA Mind & Motion Studio** in Bagharbari, Guwahati. How can I help you today? You can ask me about our **fees**, **batch timings**, **age groups**, or **book a 100% free trial class**!`,
        chips: ['💰 Fees & Pricing', '🕒 Batch Timings', '📍 Studio Location', '✨ Book Free Trial']
      })
    },
    {
      id: 'fees',
      patterns: [/\b(fee|fees|cost|price|pricing|charge|charges|rate|how much|per month)\b/i],
      response: () => ({
        text: `Here is our transparent, affordable fee schedule:\n\n• **Yoga & Meditation**: ₹500/month (3 days/wk) or ₹800/month (5 days/wk)\n• **Abacus Mental Math**: ₹600/month (Ages 5–14)\n• **Calligraphy & Handwriting**: ₹500/month (Ages 6+ to Adults)\n• **One-time Registration**: ₹200 only\n\n*All new students are eligible for a **Free Trial Class** before enrolling!*`,
        actions: [
          { text: '✨ Book Free Trial', action: 'book_trial' },
          { text: '💬 Inquire on WhatsApp', action: 'whatsapp', query: 'Hi, I would like more details about your class fees.' }
        ],
        chips: ['🕒 Timings', '📍 Where is it located?', '✨ Book Free Trial']
      })
    },
    {
      id: 'timings',
      patterns: [/\b(timing|timings|time|batch|batches|schedule|hours|opening|when|slot|slots)\b/i],
      response: () => ({
        text: `We offer convenient **morning & evening batches** to suit school & work routines:\n\n🧘 **Yoga**: Morning 6:00–7:30 AM | Evening 5:00–6:30 PM\n🧮 **Abacus**: Morning 9:00–11:00 AM | Evening 4:00–6:00 PM\n✍️ **Calligraphy**: Morning 10:00–12:00 PM | Evening 5:00–6:30 PM\n\n*Weekend intensive batches are also available for school students!*`,
        actions: [
          { text: '✨ Reserve a Slot', action: 'book_trial' },
          { text: '💬 WhatsApp Timings', action: 'whatsapp', query: 'Hi, which batch timings are currently open for enrollment?' }
        ],
        chips: ['💰 Fees & Pricing', '👶 Abacus Age Group', '✨ Book Free Trial']
      })
    },
    {
      id: 'location',
      patterns: [/\b(location|address|where|place|route|direction|directions|locate|landmark|bagharbari|satgaon|panjabari|six mile)\b/i],
      response: () => ({
        text: `📍 **NOHADAYA Studio Address**:\n\nH/No. 422, 1st Floor, Roseland Road, Near Satgaon Nowapara Jame Masjid, Behind Apple Pie, Bagharbari, Guwahati, Assam 781037.\n\n**Key Landmarks**:\n• 2 mins from Satgaon Nowapara Masjid\n• Behind Apple Pie, Bagharbari\n• Conveniently connected to Panjabari, VIP Road, and Six Mile.`,
        actions: [
          { text: '🗺️ Open Google Maps', action: 'link', url: STUDIO_INFO.mapsUrl },
          { text: '📞 Call for Directions', action: 'call' }
        ],
        chips: ['💰 Class Fees', '🕒 Batch Timings', '✨ Book Free Trial']
      })
    },
    {
      id: 'trial',
      patterns: [/\b(trial|demo|free class|sample|free trial|test class|book trial|attend|try)\b/i],
      response: () => ({
        text: `Yes! 🎉 NOHADAYA offers a **100% Free Trial Class** for every new student in Yoga, Abacus, or Calligraphy. Come experience our studio, meet the certified instructors, and see if it's the right fit!`,
        actions: [
          { text: '✨ Book Free Trial Now', action: 'book_trial' },
          { text: '💬 WhatsApp to Book', action: 'whatsapp', query: 'Hi, I want to book a free trial class at NOHADAYA.' }
        ],
        chips: ['🧘 Yoga Trial', '🧮 Abacus Trial', '✍️ Calligraphy Trial']
      })
    },
    {
      id: 'abacus',
      patterns: [/\b(abacus|mental math|math|maths|calculation|brain|kids math|abacus age)\b/i],
      response: () => ({
        text: `🧮 **Abacus Mental Arithmetic Program**:\n\n• **Ages**: 5 to 14 years\n• **Curriculum**: Structured 8-level mental math program in affiliation with NE Green Abacus\n• **Benefits**: Hyper-speed calculation, photographic memory, laser focus, eliminates math phobia\n• **Fee**: ₹600/month (Small batches of 8-10 students max)\n• **Timings**: Morning 9:00 AM & Evening 4:00 PM`,
        actions: [
          { text: '✨ Book Abacus Trial', action: 'book_trial_abacus' },
          { text: '💬 Chat with Abacus Teacher', action: 'whatsapp', query: 'Hi, I want to inquire about Abacus for my child.' }
        ],
        chips: ['💰 Fees & Pricing', '🕒 Batch Timings', '✨ Book Free Trial']
      })
    },
    {
      id: 'calligraphy',
      patterns: [/\b(calligraphy|handwriting|writing|cursive|gothic|neat|improve handwriting)\b/i],
      response: () => ({
        text: `✍️ **Calligraphy & Handwriting Mastery**:\n\n• **Who can join**: Children (6+ yrs), teens, and adults wishing to improve handwriting\n• **Styles**: Cursive writing, print script, speed handwriting improvement, and artistic Gothic script\n• **Certification**: Assessment & certificate provided upon module completion\n• **Fee**: ₹500/month\n• **Timings**: Morning 10:00 AM & Evening 5:00 PM`,
        actions: [
          { text: '✨ Book Calligraphy Trial', action: 'book_trial_calligraphy' },
          { text: '💬 Ask About Handwriting', action: 'whatsapp', query: 'Hi, I would like to improve handwriting/learn calligraphy.' }
        ],
        chips: ['💰 Fees & Pricing', '🕒 Batch Timings', '✨ Book Free Trial']
      })
    },
    {
      id: 'yoga',
      patterns: [/\b(yoga|pranayama|meditation|asana|weight loss|back pain|stress|fitness|wellness|morning yoga)\b/i],
      response: () => ({
        text: `🧘 **Yoga & Holistic Wellness**:\n\n• **Offerings**: Traditional Hatha Yoga, Vinyasa Flow, Pranayama breathwork, guided meditation, and posture correction\n• **Instructors**: Government-certified yoga teachers with 5+ years of daily teaching experience\n• **Batches**: Morning 6:00–7:30 AM & Evening 5:00–6:30 PM (All fitness levels welcome)\n• **Fee**: ₹500/month (3 days/wk) or ₹800/month (5 days/wk)`,
        actions: [
          { text: '✨ Book Yoga Trial', action: 'book_trial_yoga' },
          { text: '💬 Inquire on WhatsApp', action: 'whatsapp', query: 'Hi, I want to join the morning/evening yoga batch.' }
        ],
        chips: ['💰 Fees & Pricing', '🕒 Batch Timings', '📍 Location']
      })
    },
    {
      id: 'certification',
      patterns: [/\b(certificate|certificates|certification|certified|accredited|iso|recognition|winner|competition)\b/i],
      response: () => ({
        text: `🏆 **Accreditation & Certifications**:\n\n• NOHADAYA is an **ISO 9001:2015 certified** quality learning studio.\n• Our Abacus program awards level completion certificates affiliated with **NE Green Abacus**.\n• Calligraphy students receive certified course completion credentials.\n• Our students regularly win regional and state-level abacus & calligraphy competitions!`,
        actions: [
          { text: '✨ Explore Programs', action: 'book_trial' },
          { text: '💬 Speak with Instructors', action: 'whatsapp', query: 'Hi, I would like to know more about NOHADAYA certifications.' }
        ],
        chips: ['🧮 Abacus', '✍️ Calligraphy', '🧘 Yoga']
      })
    },
    {
      id: 'contact',
      patterns: [/\b(contact|phone|call|mobile|number|email|whatsapp|reach|touch)\b/i],
      response: () => ({
        text: `📞 **Contact NOHADAYA Directly**:\n\n• **Phone**: +91 91010 65541 / +91 88761 21675\n• **WhatsApp**: +91 91010 65541\n• **Email**: nohadayastudio@gmail.com\n• **Studio**: Bagharbari, Guwahati (Open Mon–Sat, 6:00 AM – 7:30 PM)`,
        actions: [
          { text: '📞 Call Now', action: 'call' },
          { text: '💬 Chat on WhatsApp', action: 'whatsapp', query: 'Hello NOHADAYA team, I have a quick question.' }
        ],
        chips: ['✨ Book Free Trial', '📍 Location', '💰 Fees']
      })
    }
  ];

  // Default Fallback
  function getFallbackResponse(query) {
    return {
      text: `Thank you for your question! I want to ensure you get the exact information for "${query}".\n\nOur studio coordinators are available right now to answer your questions or schedule a visit:`,
      actions: [
        { text: '✨ Book Free Trial', action: 'book_trial' },
        { text: '💬 Ask on WhatsApp', action: 'whatsapp', query: `Hi, I have a question about: ${query}` },
        { text: '📞 Call +91 91010 65541', action: 'call' }
      ],
      chips: ['💰 Fees & Pricing', '🕒 Batch Timings', '📍 Studio Location', '👶 Abacus Age Group']
    };
  }

  // --- CHATBOT UI BUILDER ---
  class NohadayaChatbot {
    constructor() {
      this.isOpen = false;
      this.messages = [];
      this.hasGreeted = false;
      this.init();
    }

    init() {
      this.renderWidget();
      this.bindEvents();
      this.triggerProactiveGreeting();
    }

    renderWidget() {
      const wrapper = document.createElement('div');
      wrapper.className = 'nh-chatbot-wrapper';
      wrapper.id = 'nhChatbotWrapper';
      wrapper.innerHTML = `
        <!-- Floating Launcher -->
        <button class="nh-chat-launcher" id="nhChatLauncher" aria-label="Open NOHADAYA AI Assistant">
          <div class="nh-launcher-badge" id="nhLauncherBadge">1</div>
          <svg class="nh-icon-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <svg class="nh-icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <!-- Chat Window -->
        <div class="nh-chat-window" id="nhChatWindow" role="dialog" aria-modal="true" aria-label="NOHADAYA Assistant Chat">
          <!-- Header -->
          <div class="nh-chat-header">
            <div class="nh-chat-header-info">
              <div class="nh-chat-avatar">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
                <span class="nh-status-dot"></span>
              </div>
              <div>
                <h3 class="nh-chat-title">NOHADAYA Assistant</h3>
                <p class="nh-chat-status">Online • Instant Answers</p>
              </div>
            </div>
            <div class="nh-header-controls">
              <button class="nh-ctrl-btn" id="nhChatReset" title="Restart conversation" aria-label="Restart">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
              </button>
              <button class="nh-ctrl-btn" id="nhChatClose" title="Minimize chat" aria-label="Close">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
          </div>

          <!-- Messages Container -->
          <div class="nh-chat-body" id="nhChatBody">
            <div class="nh-chat-messages" id="nhChatMessages"></div>
          </div>

          <!-- Quick Suggestions / Chips -->
          <div class="nh-chips-container" id="nhChipsContainer"></div>

          <!-- Input Area -->
          <form class="nh-chat-input-area" id="nhChatForm">
            <input type="text" class="nh-chat-input" id="nhChatInput" placeholder="Ask about fees, timings, classes..." autocomplete="off" />
            <button type="submit" class="nh-chat-send" id="nhChatSend" aria-label="Send message">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </form>
          <div class="nh-chat-footer-note">
            <span>Powered by NOHADAYA AI • Bagharbari, Guwahati</span>
          </div>
        </div>
      `;
      document.body.appendChild(wrapper);
    }

    bindEvents() {
      const launcher = document.getElementById('nhChatLauncher');
      const closeBtn = document.getElementById('nhChatClose');
      const resetBtn = document.getElementById('nhChatReset');
      const form = document.getElementById('nhChatForm');
      const input = document.getElementById('nhChatInput');

      launcher.addEventListener('click', () => this.toggleChat());
      closeBtn.addEventListener('click', () => this.toggleChat(false));
      resetBtn.addEventListener('click', () => this.resetConversation());

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (text) {
          this.handleUserMessage(text);
          input.value = '';
        }
      });

      // Handle Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.toggleChat(false);
        }
      });
    }

    toggleChat(forceState) {
      this.isOpen = typeof forceState === 'boolean' ? forceState : !this.isOpen;
      const windowEl = document.getElementById('nhChatWindow');
      const launcher = document.getElementById('nhChatLauncher');
      const badge = document.getElementById('nhLauncherBadge');

      if (this.isOpen) {
        windowEl.classList.add('active');
        launcher.classList.add('active');
        if (badge) badge.style.display = 'none';

        if (this.messages.length === 0) {
          this.sendBotGreeting();
        }

        setTimeout(() => {
          document.getElementById('nhChatInput').focus();
          this.scrollToBottom();
        }, 150);
      } else {
        windowEl.classList.remove('active');
        launcher.classList.remove('active');
      }
    }

    triggerProactiveGreeting() {
      setTimeout(() => {
        if (!this.isOpen && !this.hasGreeted) {
          const badge = document.getElementById('nhLauncherBadge');
          if (badge) badge.style.display = 'flex';
        }
      }, 4000);
    }

    sendBotGreeting() {
      this.hasGreeted = true;
      const greeting = INTENT_PATTERNS[0].response();
      this.renderBotMessage(greeting.text, greeting.actions, greeting.chips);
    }

    resetConversation() {
      this.messages = [];
      document.getElementById('nhChatMessages').innerHTML = '';
      document.getElementById('nhChipsContainer').innerHTML = '';
      this.sendBotGreeting();
    }

    handleUserMessage(text) {
      // Append user message
      this.appendMessage('user', text);
      this.scrollToBottom();

      // Clear chips while processing
      this.renderChips([]);

      // Show typing indicator
      this.showTypingIndicator();

      // Determine response (local NLP engine or Gemini API)
      setTimeout(() => {
        this.hideTypingIndicator();
        this.processQuery(text);
      }, 450);
    }

    async processQuery(query) {
      // Check if Gemini API is configured
      if (window.NOHADAYA_AI_CONFIG && window.NOHADAYA_AI_CONFIG.geminiApiKey) {
        try {
          const geminiRes = await this.callGeminiAPI(query);
          if (geminiRes) {
            this.renderBotMessage(geminiRes, [
              { text: '✨ Book Free Trial', action: 'book_trial' },
              { text: '💬 WhatsApp Us', action: 'whatsapp', query: query }
            ], ['💰 Fees', '🕒 Timings', '📍 Location']);
            return;
          }
        } catch (err) {
          console.warn('Gemini API fallback to local NLP:', err);
        }
      }

      // Local NLP matching
      let matched = null;
      for (const intent of INTENT_PATTERNS) {
        for (const pat of intent.patterns) {
          if (pat.test(query)) {
            matched = intent.response();
            break;
          }
        }
        if (matched) break;
      }

      if (!matched) {
        matched = getFallbackResponse(query);
      }

      this.renderBotMessage(matched.text, matched.actions, matched.chips);
    }

    async callGeminiAPI(query) {
      const apiKey = window.NOHADAYA_AI_CONFIG.geminiApiKey;
      const systemPrompt = `You are the friendly, professional AI assistant for NOHADAYA Mind & Motion Studio located in Bagharbari, Guwahati, Assam 781037.
NOHADAYA offers:
1. Yoga & Meditation: ₹500/mo (3 days) or ₹800/mo (5 days). Morning 6:00-7:30 AM, Evening 5:00-6:30 PM.
2. Abacus Mental Math: ₹600/mo for children 5-14 years. NE Green Abacus affiliated.
3. Calligraphy & Handwriting: ₹500/mo for ages 6+ to adults.
Location: H/No. 422, 1st Floor, Roseland Road, Near Satgaon Nowapara Jame Masjid, Bagharbari, Guwahati. Phone: +91 91010 65541.
Keep your response concise, polite, helpful, and encourage booking a free trial class.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser query: ${query}` }] }
            ]
          })
        }
      );
      const data = await response.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text;
    }

    appendMessage(sender, text) {
      const container = document.getElementById('nhChatMessages');
      const bubble = document.createElement('div');
      bubble.className = `nh-msg nh-msg-${sender}`;

      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      bubble.innerHTML = `
        <div class="nh-msg-content">${this.formatMarkdown(text)}</div>
        <div class="nh-msg-time">${timeStr}</div>
      `;
      container.appendChild(bubble);
      this.messages.push({ sender, text });
      this.scrollToBottom();
    }

    renderBotMessage(text, actions = [], chips = []) {
      const container = document.getElementById('nhChatMessages');
      const bubble = document.createElement('div');
      bubble.className = 'nh-msg nh-msg-bot';

      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      let actionsHtml = '';

      if (actions && actions.length > 0) {
        actionsHtml = `<div class="nh-msg-actions">` +
          actions.map((act, idx) => `
            <button class="nh-action-btn" data-act-idx="${idx}">
              ${act.text}
            </button>
          `).join('') +
          `</div>`;
      }

      bubble.innerHTML = `
        <div class="nh-msg-content">${this.formatMarkdown(text)}</div>
        ${actionsHtml}
        <div class="nh-msg-time">${timeStr}</div>
      `;

      container.appendChild(bubble);

      // Attach action listeners
      if (actions && actions.length > 0) {
        const btns = bubble.querySelectorAll('.nh-action-btn');
        btns.forEach((btn) => {
          btn.addEventListener('click', (e) => {
            const idx = parseInt(e.currentTarget.getAttribute('data-act-idx'), 10);
            this.handleActionClick(actions[idx]);
          });
        });
      }

      this.messages.push({ sender: 'bot', text, actions });
      this.renderChips(chips);
      this.scrollToBottom();
    }

    handleActionClick(act) {
      if (act.action === 'book_trial' || act.action.startsWith('book_trial_')) {
        let prog = '';
        if (act.action === 'book_trial_yoga') prog = 'yoga';
        if (act.action === 'book_trial_abacus') prog = 'abacus';
        if (act.action === 'book_trial_calligraphy') prog = 'calligraphy';

        this.triggerTrialModal(prog);
      } else if (act.action === 'whatsapp') {
        const queryText = encodeURIComponent(act.query || 'Hi NOHADAYA, I have a query about your classes.');
        window.open(`https://wa.me/${STUDIO_INFO.whatsapp}?text=${queryText}`, '_blank');
      } else if (act.action === 'call') {
        window.location.href = `tel:${STUDIO_INFO.phone.replace(/\\s+/g, '')}`;
      } else if (act.action === 'link' && act.url) {
        window.open(act.url, '_blank');
      }
    }

    triggerTrialModal(program) {
      // Check if global modal trigger exists on the page
      if (typeof window.openTrialModal === 'function') {
        window.openTrialModal(program);
        this.toggleChat(false);
        return;
      }
      if (typeof window.openModal === 'function') {
        window.openModal(program);
        this.toggleChat(false);
        return;
      }

      // Fallback: direct element lookup
      const modal = document.getElementById('trialModal') || document.getElementById('inquiryModal');
      if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('active');
        if (program) {
          const select = modal.querySelector('select[name="program"], #af-program, #trial-program');
          if (select) select.value = program;
        }
        this.toggleChat(false);
      } else {
        // WhatsApp fallback
        const text = encodeURIComponent(`Hi NOHADAYA, I would like to book a 100% Free Trial Class${program ? ' for ' + program : ''}!`);
        window.open(`https://wa.me/${STUDIO_INFO.whatsapp}?text=${text}`, '_blank');
      }
    }

    renderChips(chips) {
      const container = document.getElementById('nhChipsContainer');
      container.innerHTML = '';
      if (!chips || chips.length === 0) return;

      chips.forEach((chipText) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'nh-chip';
        chip.textContent = chipText;
        chip.addEventListener('click', () => {
          this.handleUserMessage(chipText.replace(/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]\s*/u, ''));
        });
        container.appendChild(chip);
      });
    }

    showTypingIndicator() {
      const container = document.getElementById('nhChatMessages');
      const indicator = document.createElement('div');
      indicator.className = 'nh-msg nh-msg-bot nh-typing-indicator';
      indicator.id = 'nhTypingIndicator';
      indicator.innerHTML = `
        <div class="nh-typing-dots">
          <span></span><span></span><span></span>
        </div>
      `;
      container.appendChild(indicator);
      this.scrollToBottom();
    }

    hideTypingIndicator() {
      const el = document.getElementById('nhTypingIndicator');
      if (el) el.remove();
    }

    scrollToBottom() {
      const body = document.getElementById('nhChatBody');
      if (body) {
        body.scrollTop = body.scrollHeight;
      }
    }

    formatMarkdown(text) {
      if (!text) return '';
      // Escape HTML
      let sanitized = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      // Bold **text**
      sanitized = sanitized.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Newlines to breaks
      sanitized = sanitized.replace(/\n/g, '<br>');
      return sanitized;
    }
  }

  // Auto-initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.nohadayaChatbot = new NohadayaChatbot();
    });
  } else {
    window.nohadayaChatbot = new NohadayaChatbot();
  }
})();