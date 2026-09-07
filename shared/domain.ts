export type Role = "CITIZEN" | "PARTNER" | "ADMIN";
export type Operator =
  | "EQ"
  | "NEQ"
  | "GT"
  | "GTE"
  | "LT"
  | "LTE"
  | "IN"
  | "NOT_IN"
  | "BETWEEN"
  | "EXISTS";
export interface Rule {
  field: string;
  operator: Operator;
  value: string | number | boolean | (string | number)[];
  message: string;
  messageHi: string;
}
export interface Profile {
  name: string;
  age: number;
  category: string;
  purpose: string;
  annualIncome: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  projectCost: number;
  requestedFinance: number;
  business: string;
  state: string;
  district: string;
  lat: number;
  lng: number;
  consent: boolean;
  documents: string[];
  saved: string[];
}
export interface Scheme {
  _id: string;
  slug: string;
  name: string;
  nameHi: string;
  provider: string;
  enabled: boolean;
  activeVersion: number;
  versionId?: string;
  rate: number;
  maxLoan: number;
  coverage: number;
  tenure: number;
  moratorium: number;
  incomeLimit: number;
  purposes: string[];
  categories: string[];
  states: string[];
  rules: Rule[];
  documents: string[];
  source: string;
  lastVerified: string;
  dataset: string;
  description: string;
}
export interface RuleResult extends Rule {
  actual: unknown;
}
export interface Evaluation {
  eligible: boolean;
  passedRules: RuleResult[];
  failedRules: RuleResult[];
  missingInputs: string[];
}
export interface Partner {
  _id: string;
  name: string;
  type: string;
  address: string;
  state: string;
  lat: number;
  lng: number;
  phone: string;
  schemeIds: string[];
  lastVerified: string;
  dataset: string;
}
export interface Match {
  scheme: Scheme;
  evaluation: Evaluation;
  score: number;
  factors: Record<string, number>;
  finance: ReturnType<typeof emi>;
  loan: number;
  contribution: number;
  partners: Partner[];
}
export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  partnerId?: string;
}
export type Status =
  "CREATED" | "UNDER_REVIEW" | "DOCUMENTS_REQUIRED" | "APPROVED" | "REJECTED";
export interface Application {
  _id: string;
  reference: string;
  citizenId: string;
  partnerId: string;
  schemeId: string;
  schemeName: string;
  partnerName: string;
  version: number;
  status: Status;
  profile: Profile;
  history: { status: Status; at: string; remark: string }[];
  documentRequests: string[];
  createdAt: string;
}
export const documentLabels: Record<string, [string, string]> = {
  identity: ["Identity proof", "पहचान प्रमाण"],
  income: ["Income certificate", "आय प्रमाण पत्र"],
  category: ["Category certificate", "श्रेणी प्रमाण पत्र"],
  bank: ["Bank details", "बैंक विवरण"],
  address: ["Address proof", "पते का प्रमाण"],
  project: ["Project report", "परियोजना रिपोर्ट"],
};
export const goldenProfile: Profile = {
  name: "Ananya",
  age: 28,
  category: "SC",
  purpose: "Start a business",
  annualIncome: 300000,
  monthlyIncome: 35000,
  monthlyExpenses: 15000,
  projectCost: 500000,
  requestedFinance: 450000,
  business: "Tailoring & apparel",
  state: "Delhi",
  district: "New Delhi",
  lat: 28.6139,
  lng: 77.209,
  consent: false,
  documents: ["identity", "income", "category", "bank", "address"],
  saved: [],
};
export function evaluate(
  profile: Record<string, unknown>,
  rules: Rule[],
): Evaluation {
  const passedRules: RuleResult[] = [],
    failedRules: RuleResult[] = [],
    missingInputs: string[] = [];
  for (const rule of rules) {
    const actual = profile[rule.field];
    const exists = actual !== undefined && actual !== null && actual !== "";
    if (!exists && rule.operator !== "EXISTS") {
      missingInputs.push(rule.field);
      continue;
    }
    const value = rule.value;
    let pass = false;
    switch (rule.operator) {
      case "EQ":
        pass = actual === value;
        break;
      case "NEQ":
        pass = actual !== value;
        break;
      case "EXISTS":
        pass = exists === Boolean(value);
        break;
      case "GT":
        pass = typeof actual === "number" && actual > Number(value);
        break;
      case "GTE":
        pass = typeof actual === "number" && actual >= Number(value);
        break;
      case "LT":
        pass = typeof actual === "number" && actual < Number(value);
        break;
      case "LTE":
        pass = typeof actual === "number" && actual <= Number(value);
        break;
      case "IN":
        pass = Array.isArray(value) && value.some((v) => v === actual);
        break;
      case "NOT_IN":
        pass = Array.isArray(value) && !value.some((v) => v === actual);
        break;
      case "BETWEEN":
        pass =
          typeof actual === "number" &&
          Array.isArray(value) &&
          actual >= Number(value[0]) &&
          actual <= Number(value[1]);
    }
    (pass ? passedRules : failedRules).push({ ...rule, actual });
  }
  return {
    eligible: failedRules.length === 0 && missingInputs.length === 0,
    passedRules,
    failedRules,
    missingInputs: [...new Set(missingInputs)],
  };
}
export function emi(
  principal: number,
  annualRate: number,
  months: number,
  moratorium = 0,
) {
  if (
    !Number.isFinite(principal) ||
    principal < 0 ||
    !Number.isFinite(annualRate) ||
    annualRate < 0 ||
    annualRate > 100 ||
    !Number.isInteger(months) ||
    months < 1 ||
    months > 600 ||
    !Number.isInteger(moratorium) ||
    moratorium < 0 ||
    moratorium > 60
  )
    throw new Error("Enter a valid amount, interest rate and repayment term.");
  const r = annualRate / 1200;
  const capitalizedPrincipal = principal * (1 + r) ** moratorium;
  const monthly =
    r === 0
      ? capitalizedPrincipal / months
      : (capitalizedPrincipal * r) / (1 - (1 + r) ** -months);
  const totalRepayment = monthly * months;
  return {
    monthly,
    totalRepayment,
    totalInterest: totalRepayment - principal,
    principal,
    capitalizedPrincipal,
    months,
    moratorium,
    annualRate,
  };
}
export function distance(
  lat: number,
  lng: number,
  p: Pick<Partner, "lat" | "lng">,
) {
  const rad = Math.PI / 180;
  const a =
    Math.sin(((p.lat - lat) * rad) / 2) ** 2 +
    Math.cos(lat * rad) *
      Math.cos(p.lat * rad) *
      Math.sin(((p.lng - lng) * rad) / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
export function matchSchemes(
  profile: Profile,
  schemes: Scheme[],
  partners: Partner[],
): Match[] {
  return schemes
    .filter((s) => s.enabled)
    .map((scheme) => {
      const evaluation = evaluate({ ...profile }, scheme.rules);
      const loan = Math.min(
        profile.requestedFinance,
        scheme.maxLoan,
        (profile.projectCost * scheme.coverage) / 100,
      );
      const finance = emi(loan, scheme.rate, scheme.tenure, scheme.moratorium);
      const available = partners
        .filter(
          (p) => p.state === profile.state && p.schemeIds.includes(scheme._id),
        )
        .sort(
          (a, b) =>
            distance(profile.lat, profile.lng, a) -
            distance(profile.lat, profile.lng, b),
        );
      const disposable = Math.max(
        0,
        profile.monthlyIncome - profile.monthlyExpenses,
      );
      const factors = {
        "Financing fit": Math.min(
          100,
          (loan / Math.max(1, profile.requestedFinance)) * 100,
        ),
        Affordability:
          disposable === 0
            ? 0
            : Math.max(
                0,
                Math.min(100, (1 - finance.monthly / disposable) * 100),
              ),
        Coverage: Math.min(
          100,
          (loan / Math.max(1, profile.projectCost)) * 100,
        ),
        "Document readiness":
          (scheme.documents.filter((d) => profile.documents.includes(d))
            .length /
            Math.max(1, scheme.documents.length)) *
          100,
        "Nearby support": available.length
          ? Math.max(
              0,
              100 - distance(profile.lat, profile.lng, available[0]) * 2,
            )
          : 0,
      };
      const score = Math.round(
        factors["Financing fit"] * 0.3 +
          factors.Affordability * 0.25 +
          factors.Coverage * 0.2 +
          factors["Document readiness"] * 0.15 +
          factors["Nearby support"] * 0.1,
      );
      return {
        scheme,
        evaluation,
        loan,
        finance,
        contribution: profile.projectCost - loan,
        factors,
        score,
        partners: available,
      };
    })
    .sort(
      (a, b) =>
        Number(b.evaluation.eligible) - Number(a.evaluation.eligible) ||
        b.score - a.score,
    );
}
export function rankEligible(matches: Match[]) {
  return matches
    .filter((m) => m.evaluation.eligible)
    .sort((a, b) => b.score - a.score);
}
export const transitions: Record<Status, Status[]> = {
  CREATED: ["UNDER_REVIEW"],
  UNDER_REVIEW: ["DOCUMENTS_REQUIRED", "APPROVED", "REJECTED"],
  DOCUMENTS_REQUIRED: ["UNDER_REVIEW"],
  APPROVED: [],
  REJECTED: [],
};
export function canTransition(from: Status, to: Status) {
  return transitions[from]?.includes(to) ?? false;
}
export const money = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
