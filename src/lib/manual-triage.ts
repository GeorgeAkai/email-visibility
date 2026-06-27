type TriageInput = {
  subject: string;
  fromAddress: string;
  fromName: string | null;
  snippet: string;
  bodyPreview: string;
};

type TriageResult = {
  categoryName: string;
  importanceScore: number;
};

// Senders from these domains bypass Phishing/Suspicious classification entirely.
// Their security emails (sign-in alerts, 2FA codes, etc.) are legitimate by design.
const TRUSTED_DOMAINS = new Set([
  "google.com", "gmail.com", "googlemail.com",
  "accounts.google.com", "mail.google.com",
  "github.com", "github.io",
  "microsoft.com", "outlook.com", "hotmail.com", "live.com",
  "apple.com", "icloud.com", "me.com",
  "amazon.com", "amazon.co.uk",
  "paypal.com",
  "linkedin.com",
  "twitter.com", "x.com",
  "facebook.com", "instagram.com", "meta.com",
  "stripe.com",
  "slack.com",
  "zoom.us",
  "dropbox.com",
  "notion.so",
  "shopify.com",
]);

function isTrustedSender(fromAddress: string): boolean {
  const domain = fromAddress.split("@")[1]?.toLowerCase() ?? "";
  for (const trusted of TRUSTED_DOMAINS) {
    if (domain === trusted || domain.endsWith(`.${trusted}`)) return true;
  }
  return false;
}

// Very specific multi-word phrases that real services never use in legitimate email.
// Err heavily on the side of NOT flagging — false positives are worse than false negatives.
const PHISHING_KEYWORDS = [
  "your account has been permanently suspended",
  "your account will be permanently deleted",
  "click here to restore access to your account",
  "confirm your account ownership to avoid suspension",
  "we have limited your account access",
  "your account has been flagged for suspicious activity",
  "verify your paypal account",
  "verify your bank account",
  "your netflix account has been suspended",
  "your amazon account has been locked",
  "dear valued customer, your account",
  "reactivate your account by clicking",
];

const SUSPICIOUS_KEYWORDS = [
  "your account has been accessed from an unknown device",
  "someone attempted to access your account",
  "we detected a login from an unrecognized device",
  "your password was changed without your permission",
  "unauthorized changes were made to your account",
];

// High-urgency legitimate signals (score 5)
const IMPORTANT_URGENT_KEYWORDS = [
  "one-time code", "one time code", "verification code",
  " otp ", "\notp\n", "two-factor", "2fa code",
  "interview invitation", "interview scheduled",
  "job offer", "offer letter",
  "bank alert", "payment alert",
  "overdue invoice", "past due notice",
];

// Standard important signals (score 4)
const IMPORTANT_KEYWORDS = [
  "invoice", "receipt", "order confirmed", "order placed",
  "order shipped", "order delivered", "payment received",
  "payment processed", "subscription charged",
  "bank statement", "account statement",
  "tax return", "tax form", "tax notice",
  "appointment confirmed", "booking confirmed", "reservation confirmed",
  "contract", "legal notice", "signed agreement",
];

// Action-required signals
const TASKS_KEYWORDS = [
  "rsvp", "respond by", "due by", "due date:", "deadline",
  "please complete", "please fill out", "please sign",
  "please submit", "please respond", "please review and sign",
  "action required", "your response is needed",
  "awaiting your response", "your signature is required",
  "form to be completed",
];

// Promotional / bulk / marketing signals (score 1)
const SPAM_KEYWORDS = [
  "unsubscribe", "opt out", "opt-out",
  "limited time offer", "exclusive offer", "special offer",
  "special deal", "earn money", "make money", "work from home",
  "you've been selected", "you have been selected",
  "congratulations, you", "you're a winner", "you won a",
  "promo code", "coupon code", "discount code",
  "free trial", "buy now", "shop now",
  "click here to save", "click here to claim",
  "this email was sent to you because",
  "to stop receiving these emails",
];

const SPAM_SENDER_PREFIXES = [
  "noreply@newsletter.", "marketing@", "promo@",
  "promotions@", "deals@", "offers@", "bulk@",
];

function hit(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((kw) => lower.includes(kw));
}

function preferredCategory(name: string, categories: { name: string }[]): string {
  const match = categories.find((c) => c.name.toLowerCase() === name.toLowerCase());
  if (match) return match.name;
  const benign = categories.find((c) => c.name.toLowerCase() === "benign");
  return benign?.name ?? categories[0]?.name ?? name;
}

export function manualTriage(
  email: TriageInput,
  categories: { name: string }[],
): TriageResult {
  const full = [
    email.subject,
    email.fromName ?? "",
    email.snippet,
    email.bodyPreview,
  ].join(" ");

  const senderLower = email.fromAddress.toLowerCase();
  const trusted = isTrustedSender(email.fromAddress);

  // 1. Phishing and Suspicious — only for untrusted senders
  if (!trusted) {
    if (hit(full, PHISHING_KEYWORDS)) {
      return { categoryName: preferredCategory("Phishing", categories), importanceScore: 5 };
    }
    if (hit(full, SUSPICIOUS_KEYWORDS)) {
      return { categoryName: preferredCategory("Suspicious", categories), importanceScore: 4 };
    }
  }

  // 2. Important — urgent signals first (2FA codes, interviews, bank alerts)
  if (hit(full, IMPORTANT_URGENT_KEYWORDS)) {
    return { categoryName: preferredCategory("Important", categories), importanceScore: 5 };
  }

  // 3. Important — standard signals
  if (hit(full, IMPORTANT_KEYWORDS)) {
    return { categoryName: preferredCategory("Important", categories), importanceScore: 4 };
  }

  // 4. Tasks
  if (hit(full, TASKS_KEYWORDS)) {
    const urgent =
      full.toLowerCase().includes("urgent") ||
      full.toLowerCase().includes("asap") ||
      full.toLowerCase().includes("today");
    return {
      categoryName: preferredCategory("Tasks", categories),
      importanceScore: urgent ? 4 : 3,
    };
  }

  // 5. SPAM — keyword match or known bulk-sender prefix
  const isSpamSender = SPAM_SENDER_PREFIXES.some((p) => senderLower.includes(p));
  if (hit(full, SPAM_KEYWORDS) || isSpamSender) {
    return { categoryName: preferredCategory("SPAM", categories), importanceScore: 1 };
  }

  // 6. Default: Benign
  return { categoryName: preferredCategory("Benign", categories), importanceScore: 2 };
}
