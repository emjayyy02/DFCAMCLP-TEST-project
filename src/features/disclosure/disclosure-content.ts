export const disclosureVersion = "fd7-v1";
export const acknowledgementKey = "dfcamclp.demoDisclosure.ackVersion";
export const disclosureParagraphs = [
  "This is an independent educational and portfolio side project. It is not affiliated with, commissioned by, operated by, or endorsed by DFCAMCLP. Its name, seal, and campus references are used only to demonstrate the concept.",
  "People, accounts, grades, schedules, applications, documents, tickets, and operational records shown are fictional or sample data. No displayed workflow represents an official institutional transaction or policy unless explicitly sourced.",
  "Use fictional details only. Do not enter real student, employee, or institutional information. Demo actions may simulate workflows without performing real school actions.",
  "Some local changes reset on reload or when you leave their workspace. Account photo and bio reset on reload or sign-out. Sign-in uses the project server; the Privacy & Data Notice explains what is stored.",
];
export const informationPages = [
  {
    route: "disclaimer",
    title: "Project Disclaimer",
    intro: "The purpose and limits of this independent portal concept.",
    sections: [
      {
        heading: "Independent concept",
        paragraphs: [
          "This is an independent educational and portfolio side project. It is not affiliated with, commissioned by, operated by, or endorsed by Dr. Filemon C. Aguilar Memorial College of Las Piñas (DFCAMCLP).",
        ],
      },
      {
        heading: "Institutional references",
        paragraphs: [
          "The DFCAMCLP name, supplied seal, campus references, and campus photograph demonstrate the concept's setting. Their appearance does not imply approval or transfer ownership of institutional material to the project author. Institutional facts follow the project's sourced reference notes; unknown policies remain labeled as assumptions. This is not a claim of permission or a rights determination.",
        ],
      },
      {
        heading: "Fictional records and sample workflows",
        paragraphs: [
          "People, accounts, grades, schedules, applications, documents, tickets, and operational records shown are fictional or sample content. No displayed workflow represents an official institutional transaction or policy unless explicitly sourced. Sourced context does not make a simulated action official.",
        ],
      },
      {
        heading: "No official services",
        paragraphs: [
          "Demo actions do not submit real applications, book school appointments, deliver recovery messages, release grades, issue certificates, grant institutional access, or update DFCAMCLP records. Sample documents are not valid for official use. Use official institutional channels for real school matters.",
        ],
      },
      {
        heading: "Portfolio purpose",
        paragraphs: [
          "The project illustrates interface and software-development decisions. Use fictional details only; do not enter real student, employee, or institutional information. Read the Demo Terms of Use, Privacy & Data Notice, and Acceptable Use for the demo's boundaries.",
        ],
      },
    ],
  },
  {
    route: "terms",
    title: "Demo Terms of Use",
    intro: "How to explore this educational demonstration.",
    sections: [
      {
        heading: "Purpose and permitted testing",
        paragraphs: [
          "You may browse the concept, use designated fictional demo accounts when available, and try the interface's sample workflows and normal navigation. Treat results as demonstrations, not school services or institutional decisions.",
        ],
      },
      {
        heading: "Use fictional details",
        paragraphs: [
          "Do not submit real confidential, personal, student, employee, or institutional data, or reuse a personal or school password. Account-entry and recovery previews do not create accounts or deliver messages. Real demo sign-in is different: credentials are processed by the project server as described in the Privacy & Data Notice.",
        ],
      },
      {
        heading: "Testing limits",
        paragraphs: [
          "Do not attempt unauthorized access, bypass access controls, abuse shared accounts, automate bulk sign-ins or requests, or use the project to disrupt other visitors. Normal manual exploration of allowed routes and sample controls is permitted. No credential attacks or data extraction through unprovided access.",
        ],
      },
      {
        heading: "Availability and accuracy",
        paragraphs: [
          "The demo may change, become unavailable, or reset. It does not guarantee continuous availability, complete or current institutional information, or accuracy for real school decisions. Workflow rules marked V1 ASSUMPTION are project assumptions. Use official channels to verify real requirements and transactions.",
        ],
      },
      {
        heading: "Demo accounts and local changes",
        paragraphs: [
          "Demo accounts represent fictional roles, not individual institutional identities. Access remains limited by the server's assigned memberships and permissions. Local workflow edits and personal photo/bio changes have the reset behavior described in Privacy; acknowledgement does not save them. Follow Acceptable Use when using a shared account.",
        ],
      },
    ],
  },
  {
    route: "privacy",
    title: "Privacy & Data Notice",
    intro:
      "What this demo sends to the project server and what stays temporarily in your browser.",
    sections: [
      {
        heading: "Sample school content",
        paragraphs: [
          "Displayed school people and operational records are fictional/sample content. School workflow edits run in temporary browser memory and are not submitted as institutional transactions. This does not mean that the project's sign-in system is simulated.",
        ],
      },
      {
        heading: "Sign-in and sessions",
        paragraphs: [
          "Signing in sends the demo email, password, and selected portal to the project server. Better Auth verifies credentials using the project's authentication database. Successful permitted sign-in uses a browser session cookie and a database-backed session. The project stores demo account identity and access information, authentication credential records, and session identifiers, expiry and timestamps. The session schema also supports IP address and browser user-agent information; the current inspection does not establish which of those optional fields are populated for every request.",
          "Sessions are configured with a seven-day expiry and a daily refresh interval. That is an authentication setting, not a promise to delete database records after seven days. Reloading a page may reset demo work while leaving a valid sign-in session intact. Sign out uses the real authentication service. Choosing a portal or acknowledging this notice does not grant access.",
        ],
      },
      {
        heading: "Temporary workflow and form information",
        paragraphs: [
          "Applicant drafts/checklists/scenarios, Student requests, Academic attendance/grade drafts and submissions, Records processing, and Operations updates use browser memory scoped to their current workspace. They reset on reload, a new tab, or when that workspace's provider is removed, such as leaving its portal. Entry-preview name/email/program and recovery-preview email stay in that page's memory; those previews do not perform account lookup, registration or email delivery. Use fictional details only.",
        ],
      },
      {
        heading: "Photo and bio",
        paragraphs: [
          "Selected JPEG, PNG, or WebP images up to 2 MB are decoded locally for staged preview. They are not uploaded by the current photo controls or saved to persistent browser storage. Browser object URLs are released when replaced, discarded, or their owning state is cleared. Account photo and optional plain-text bio (up to 240 characters) stay in this tab across ordinary client navigation and authorized portal switching. They clear on reload, arrival at sign-in, sign-out intent, or account identity change. A sample Applicant/Student profile photo is separate from the signed-in account and clears when its portal workspace is removed. Do not choose images or write text containing real confidential information.",
        ],
      },
      {
        heading: "Disclosure acknowledgement",
        paragraphs: [
          "After you choose “I understand — Enter demo”, the browser stores only the current disclosure version in first-party localStorage. It is not sent as a backend acceptance record and is not attached to an account. Clearing that item, using another browser profile/origin, or a material version change makes the disclosure appear again. If storage is unavailable, the choice lasts only for the current visit. It does not persist photos, bio, workflow edits, or authentication.",
        ],
      },
      {
        heading: "Links, history, clipboard and print",
        paragraphs: [
          "Some selected records, views, searches, filters, sorting and dates appear in URLs and may remain in browser history independently of temporary workflow state. Do not put real confidential information into these controls. Printing or saving sample previews creates files/output under your control; sample markings remain. Copying the developer route map writes to your clipboard only when you activate that control.",
        ],
      },
      {
        heading: "What is not established",
        paragraphs: [
          "No application analytics integration was identified in the inspected source. Hosting, proxy and infrastructure logging practices have not been verified by this notice. No claims are made here about data selling, transport or database encryption, blanket absence of tracking, database deletion schedules, or lawyer-reviewed compliance. Browser-memory reset and session expiry are distinct from server-data deletion. Public-hosting changes require this notice to be checked against the actual deployed configuration before making additional claims.",
        ],
      },
    ],
  },
  {
    route: "acceptable-use",
    title: "Acceptable Use",
    intro: "Keep exploration within the portfolio demo.",
    sections: [
      {
        heading: "Use the demo responsibly",
        items: [
          "Use the project for educational demonstration and permitted interface testing.",
          "Enter fictional details only. Do not provide real confidential, student, employee, or institutional information or real personal/school credentials.",
          "Do not attempt unauthorized access, bypass permissions, attack credentials, or disrupt the service through abusive automation.",
          "Do not abuse shared demo accounts or try to use them for real school transactions.",
          "Do not represent this independent project or its sample documents as official DFCAMCLP software, services, records, or policy.",
        ],
        paragraphs: [
          "Normal manual browsing and permitted sample actions are welcome. Access controls still apply to every protected destination. For real institutional matters, use official channels.",
        ],
      },
    ],
  },
] as const;
export const legalLinks = informationPages.map(({ route, title }) => ({
  href: "/" + route,
  title,
}));
export function isInformationRoute(path: string | null) {
  return legalLinks.some((link) => link.href === path);
}
