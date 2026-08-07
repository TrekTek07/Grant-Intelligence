GRANT INTELLIGENCE™ v7.4 — MODULE 01 SECURE BRIDGE
=========================================================

WHAT IS CONNECTED
-----------------
Website account/project
  -> Supabase
  -> Module 01 page
  -> Supabase Edge Function
  -> Dify Module 01 Workflow
  -> Supabase module_results
  -> Website report viewer

ACCESS BEHAVIOR
---------------
GI-TEST-2026
  Supabase: YES
  Real account/project: YES
  Dify: NO
  Module 01: static sample saved to Supabase

GI-REALTEST-2026
  Supabase: YES
  Real account/project: YES
  Dify: YES, after the Edge Function and Dify key are configured
  Module 01: real Dify output saved to Supabase

Paid
  Same live path as realtest. Payment verification is added later.

IMPORTANT
---------
Do NOT send or put your Dify API key in GitHub.
Store it only as a Supabase Edge Function secret.

STEP 1 — UPLOAD WEBSITE FILES
-----------------------------
Upload the contents of this package to the root of:
https://github.com/trektek07/Grant-Intelligence

This adds:
  module01.html
  module01.js

STEP 2 — GET THE MODULE 01 DIFY API KEY
---------------------------------------
In Dify, open your MODULE 01 Workflow app.

Use its API Access / API Reference area to create or copy the WORKFLOW APP API KEY.

Do not paste that key into ChatGPT.
Do not put it in GitHub.

STEP 3 — CREATE THE SUPABASE SECRET
------------------------------------
In Supabase, use the Edge Functions secrets area (or Supabase CLI) and create:

DIFY_MODULE01_API_KEY = <your Module 01 Dify workflow API key>

Optional:
DIFY_API_BASE = https://api.dify.ai/v1

The bridge defaults inputSource to:
projectProfile

If your Dify INPUT_SOURCE_ROUTER expects a different exact option value, set:

DIFY_MODULE01_INPUT_SOURCE = <exact expected value>

STEP 4 — DEPLOY THE EDGE FUNCTION
---------------------------------
Function folder included in this package:

supabase/functions/run-module01/index.ts

The function name MUST be:
run-module01

If using the Supabase Dashboard's Edge Function editor:
  1. Edge Functions
  2. Create a new function named run-module01
  3. Replace its code with index.ts
  4. Deploy
  5. Add the DIFY_MODULE01_API_KEY secret

If using Supabase CLI:
  supabase functions deploy run-module01
  supabase secrets set DIFY_MODULE01_API_KEY="YOUR_KEY"

STEP 5 — TEST DEMO FIRST
------------------------
1. Sign in with an account that redeemed GI-TEST-2026.
2. Complete Module 00.
3. Open Workspace -> Module 01.
4. Click Run Module 01.
5. Confirm:
   - sample report appears
   - Supabase module_results has module_number = 1
   - NO Dify credits are used

STEP 6 — TEST REALTEST
----------------------
1. Use a separate account (recommended) that redeemed GI-REALTEST-2026.
2. Complete Module 00 with test-but-realistic intake information.
3. Open Module 01.
4. Click Run Module 01.
5. Confirm:
   - status says secure Supabase -> Dify bridge
   - Dify workflow runs
   - report returns to browser
   - module_results row is status=completed
   - report_text and output_data are populated
   - Dify usage reflects the run

MODULE 01 DIFY INPUTS USED
--------------------------
inputSource
opportunityAnalysis
projectProfile

organizationFiles is intentionally NOT sent yet.
The next bridge revision will upload actual project files to Dify and pass them through organizationFiles.

MODULE 01 OUTPUT HANDLING
-------------------------
The bridge preserves every Dify output under:
module_results.output_data.dify_outputs

It chooses report_text from the first useful field among:
organizationIntelligenceReport
organizationReport
organizationInformation
text
or another substantial string output.

This lets us inspect your actual output names after the first live run without losing anything.

NEXT
----
After Module 01 works end-to-end, use the same pattern for Module 02:
Supabase reads Module 01's saved organizationIntelligenceReport
-> Dify Module 02
-> saves grantReadinessReport
-> workspace unlocks Module 03.
