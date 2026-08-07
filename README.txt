GRANT INTELLIGENCE™ VERSION 7 — STATIC WEBSITE PROTOTYPE

FILES
index.html       New public SaaS-style landing page
readiness.html   18-question free readiness assessment
readiness.js     Browser-only scoring and retake history
workspace.html   Simulated post-$29 software workspace
workspace.js     Static demo module/report/opportunity interactions
pricing.html     Pricing preview page
about.html       About page
styles.css       Unified Version 7 color system and responsive layout

TEST FLOW
1. Open index.html.
2. Click Discover My Funding Potential.
3. Complete the 18-question assessment.
4. Review the score and recommendations.
5. Click Enter Workspace Demo.
6. Open sample reports, select sample opportunities, and test sample downloads.
7. Return to the assessment and retake it; the prior score is stored locally in the browser.

IMPORTANT
- This prototype does not call Dify.
- It does not use AI credits.
- It does not collect or upload personal data.
- The $29 checkout is not connected yet.
- Opportunity data and paid reports are demonstration data only.

GITHUB PAGES
Upload ALL files to the root of the Grant-Intelligence repository. The site should then be available at:
https://trektek07.github.io/Grant-Intelligence/


VERSION 7.2 TEST ACCESS
------------------------
Test access code: GI-TEST-2026
Flow: Free Assessment -> Continue to Access -> enter code -> Module 00 -> Workspace.
This code is intentionally client-side for development only. Move validation server-side (Supabase) before public launch.
No Dify calls are made by the assessment, access gate, or Module 00 test intake.
