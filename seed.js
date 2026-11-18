// Starter tasks taken from your Task Sheet. Loaded once with the "Load my starter tasks" button.
const t = (title, section, note = "", extra = {}) => ({ title, section, note, priority: false, due: "", done: false, ...extra });

export const SEED = [
  // Do first (highlighted on the sheet)
  t("Suspended account list", "Follow-ups", "Log each account's activity and the reason for suspension", { priority: true }),
  t("Seminars", "Sales", "Get region-wise plans from the respective RMs", { priority: true }),
  t("ERP", "Projects", "Meeting with Sumit sir", { priority: true }),

  t("Sales KRA and plan", "Sales"),
  t("IW prospect software", "Sales"),
  t("AMFI leads", "Sales", "Review mail chains (3+ mails) and Meta ads"),
  t("Sales training", "Sales", "Qualitative vs quantitative"),
  t("Anuj / Vinita", "Projects", "Support dev-issue timelines"),
  t("Website setup", "Projects", "With Praveen sir, for Pradeept's team"),
  t("Empanelled auditors: SEBI submission", "Projects", "Vinita / Sumit / Gauri", { done: true }),
  t("Mobile app: pending tickets and updates", "Projects"),

  t("Average response time and overdue", "Support checks"),
  t("Negative feedback", "Support checks", "Learning curve sheet"),
  t("Canned responses", "Support checks"),
  t("Google reviews", "Support checks"),
  t("End-of-day open tickets", "Support checks", "RM-wise"),
  t("Smartflo", "Support checks", "Monitoring and API"),

  t("Aging bills", "Sales checks"),
  t("RM tracker", "Sales checks"),
  t("Prospect review", "Sales checks", "With Amitabh sir and the sales team"),
  t("Cross-product sales report", "Sales checks"),

  t("Smartflow: answered calls, missed calls, number of agents", "Daily report", "Answered 76, missed 42, call backs 37, agents 6"),
  t("Freshdesk: tickets older than 7 days, first response time, average resolution time", "Daily report", "Older than 7 days: 49, first response time 47m 9s"),
  t("Sales CRM: pending tasks, leads in negotiation for over 7 days", "Daily report", "Pending tasks 134, pending leads 951, added 120, won 1, lost 45"),

  t("Sales CRM leads complete", "Follow-ups", "Full client name, ARN and city updated in every lead"),
  t("IAS: bills pending over 30 days", "Follow-ups", "Talk to Priyanka, the RM and the client: get it paid, noted or removed"),
  t("IAS: mobile app and website status", "Follow-ups", "Why pending for over 30 days?"),
  t("IAS: client records complete", "Follow-ups", "Address, mobile, contact name and PO form present"),
  t("Support: tickets without response for over 24 hrs", "Follow-ups", "Find out why"),
  t("Support: website / app tickets", "Follow-ups", "Support forwards to Sumit or Pradeept and closes; confirm the client is satisfied"),
  t("Support: tickets on hold or waiting for 3rd party / customer", "Follow-ups", "None over 4 days, unless marked Suggestion and the client wants it open"),
  t("Smartflow: monitor missed calls", "Follow-ups", "Praveen can find numbers unanswered in 1 hr; raise an alert to Rajender"),
  t("Mobile apps release", "Follow-ups", "If the trial with 5 apps is OK, release ALL apps within 5 days. Minimum 1 Android and 3 iOS, client-wise alphabetically preferred"),
  t("Cyber insurance?", "Misc"),
  t("SOC2?", "Misc"),
  t("Disability compliance", "Misc", "Next date?"),
  t("QS27000", "Misc", "New certificate received?")
];
