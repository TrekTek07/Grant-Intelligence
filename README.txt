GRANT INTELLIGENCE™ — STANDALONE WEBSITE PROTOTYPE

Files:
- index.html        Public-facing standalone Grant Intelligence landing page
- workspace.html    Interactive workspace/dashboard prototype
- styles.css        Complete responsive styling
- app.js            Prototype interactions for modules, opportunity selection, and project modal

This prototype is intentionally separate from The Buck Starts Here website.
It contains no Dify API key and no backend/database integration yet.

To preview locally:
Open index.html in a browser, or upload the entire folder to GitHub Pages.

Suggested next integration phase:
1. Persistent database/client project records
2. Secure serverless API for Dify workflow calls
3. Map Modules 01–07 inputs/outputs
4. Save report text + generated PDF/DOCX file references
5. Replace prototype opportunity data with Module 04 output

PAID EXPERIENCE DEMO
- readiness.html now shows "Preview the $29 Experience" after the assessment results.
- demo.html is the guided post-$29 simulation.
- demo.js uses sample data only and does not call Dify.
- The latest free-assessment score is saved in browser localStorage only so the demo can display it.
