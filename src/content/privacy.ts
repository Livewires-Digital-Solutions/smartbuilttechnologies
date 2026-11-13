import { site } from "./site";

/**
 * The privacy notice. A DRAFT written from what the site actually does today (careers
 * applications, the contact form, the staff sign-in cookie, no analytics). It has not
 * been reviewed by a lawyer, and the retention period and the group-sharing line are
 * proposals. Set `reviewed` to true, and show a date, once it has been checked.
 */
export const privacy = {
  /** Shown as a note at the top of the page while false */
  reviewed: false,
  updated: "2026-11-13",
  updatedLabel: "13 November 2026",
  /** How long a CV is kept after the position it was for has closed */
  cvRetention: "12 months",
  email: site.contact.email,
};

export interface PrivacySection {
  id: string;
  title: string;
  /** Markdown */
  body: string;
}

export const privacySections: PrivacySection[] = [
  {
    id: "who",
    title: "Who we are",
    body: `${site.name} ("we", "us") is the production firm of ${site.group}. We work from our production centre in Chennai, Tamil Nadu, India. We decide why and how the personal data described on this page is used.`,
  },
  {
    id: "collect",
    title: "What we collect, and why",
    body: `**Job applications.** When you apply through the careers page we collect your name, email address, phone number and country, the position, your years of experience, an optional message, and the CV file you upload. We use it to assess your application and to contact you about it. We rely on your consent, which you give by ticking the box on the form.

**Writing to us.** The contact form opens your own email app with the message ready to send, so we receive only what you choose to send by email: usually your name, email address and message. We use it to reply to you.

**Technical data.** Our server records basic request details (IP address, page, time and browser) to keep the site secure and working. The application form also counts requests per IP address to stop abuse; that count is held in memory and is not stored.`,
  },
  {
    id: "cookies",
    title: "Cookies",
    body: `We do not use advertising, tracking or analytics cookies, and we do not load third-party trackers. The only cookie is a sign-in cookie used by our staff in the admin area. Visitors to the public pages never receive it.`,
  },
  {
    id: "sharing",
    title: "Who can see it",
    body: `Your application is seen by the people who handle hiring at ${site.name}. Where a position is based in, or reports to, an office of ${site.group}, the hiring team there may also see it. Our hosting and email providers process data for us only to run the service. We do not sell personal data and we do not use it for advertising.`,
  },
  {
    id: "transfers",
    title: "Where it is kept",
    body: `Applications and CV files are stored on a server we control, and notifications are sent by email. Because we work across India, Saudi Arabia and the UAE, your details may be read by colleagues in those countries. We keep access to the people who need it.`,
  },
  {
    id: "retention",
    title: "How long we keep it",
    body: `We keep an application and its CV for up to ${privacy.cvRetention} after the position is filled or closed, so we can consider you for similar roles, and then delete it. Ask us at any time and we will delete it sooner.`,
  },
  {
    id: "rights",
    title: "Your rights",
    body: `You can ask us to show you the data we hold about you, correct it, delete it, or stop using it, and you can withdraw your consent at any time. These rights come from data protection laws such as India's Digital Personal Data Protection Act, 2023, and the data protection laws of Saudi Arabia and the UAE, depending on where you live. Write to us (see below) and we will answer within 30 days. If you are not satisfied, you may complain to the data protection authority in your country.`,
  },
  {
    id: "security",
    title: "How we protect it",
    body: `The site is served over HTTPS. CV files are kept outside the public web folder and can be downloaded only by signed-in staff. Staff access is protected by a sign-in with a limit on failed attempts. No system is perfectly secure, so please do not send us information you would not want to share.`,
  },
  {
    id: "children",
    title: "Children",
    body: `This site is for businesses and job seekers. It is not meant for anyone under 18, and we do not knowingly collect their data.`,
  },
  {
    id: "links",
    title: "Other sites",
    body: `Some pages link to other sites, such as txgksa.com or map services. We are not responsible for how they handle data; please read their notices.`,
  },
  {
    id: "changes",
    title: "Changes to this page",
    body: `If we change how we use personal data, we will update this page and its date. The date at the top shows when it was last changed.`,
  },
  {
    id: "contact",
    title: "Contact us about your data",
    body: `Email [${privacy.email}](mailto:${privacy.email}) with "Privacy" in the subject, or use the [contact page](/contact). Please tell us the name and email address you used, so we can find your details.`,
  },
];
