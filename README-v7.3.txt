GRANT INTELLIGENCE™ v7.3 — SUPABASE AUTH + ACCESS MODES
============================================================

WHAT THIS VERSION DOES
----------------------
1. Uses the real Supabase project:
   https://wuagmhkqzrugizbqkrgy.supabase.co

2. Uses the browser-safe Supabase publishable key.
   No secret/service-role key is included.

3. Adds:
   - auth.html — Create Account / Sign In
   - auth-callback.html — Email verification return page
   - Supabase session persistence
   - Secure database access-code redemption
   - GI-TEST-2026 => demo access
   - GI-REALTEST-2026 => realtest access
   - Module 00 saved to Supabase projects
   - Free readiness assessment saved to Supabase after Module 00
   - Module 00 completion stored in module_results
   - Activity log entry
   - Workspace reads the real signed-in account/project

IMPORTANT: DIFY
---------------
This v7.3 build DOES NOT call Dify yet.

Demo mode:
  Supabase = YES
  Real account/project = YES
  Dify = NO
  Sample module content = YES

Real Test mode:
  Supabase = YES
  Real account/project = YES
  Real intake data = YES
  Dify = NOT CONNECTED YET

The next integration will add a secure Supabase Edge Function between
the website and Dify so the Dify API key is never exposed in GitHub.

BEFORE TESTING ACCESS CODES
---------------------------
Run:
  Grant_Intelligence_Supabase_Auth_Patch_v1.1.sql

in Supabase -> SQL Editor -> New query -> Run.

SUPABASE AUTH URL CONFIGURATION
-------------------------------
After uploading this site to GitHub Pages:

Supabase -> Authentication -> URL Configuration

Set Site URL to:
  https://trektek07.github.io/Grant-Intelligence/

Add Redirect URL:
  https://trektek07.github.io/Grant-Intelligence/auth-callback.html

For local testing you may also add:
  http://localhost:8000/auth-callback.html

Do not use file:// for authentication testing. Use GitHub Pages or a local web server.

TEST FLOW
---------
1. Open readiness.html and complete the free assessment.
2. Continue to unlock.
3. If not signed in, the site sends you to auth.html.
4. Create account.
5. Verify email.
6. Return to Grant Intelligence.
7. Enter:
     GI-TEST-2026
   or:
     GI-REALTEST-2026
8. Complete Module 00.
9. Open Workspace.
10. Confirm the project exists in Supabase -> Table Editor -> projects.

SECURITY
--------
Never put these in GitHub:
- Supabase service_role key
- Supabase secret key
- Database password
- Dify API key

The Supabase publishable key IS designed for browser use.
