// Grant Intelligence™ — Supabase Edge Function: run-module01
// Secure bridge: Browser -> Supabase -> Dify Module 01 -> Supabase
//
// Required Supabase secret:
//   DIFY_MODULE01_API_KEY
//
// Optional secrets:
//   DIFY_API_BASE=https://api.dify.ai/v1
//   DIFY_MODULE01_INPUT_SOURCE=projectProfile
//
// DO NOT put the Dify API key in GitHub/browser JavaScript.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "POST required" }, 405);

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return jsonResponse({ error: "Missing Authorization header" }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const difyKey = Deno.env.get("DIFY_MODULE01_API_KEY");
    const difyBase = Deno.env.get("DIFY_API_BASE") || "https://api.dify.ai/v1";
    const inputSource = Deno.env.get("DIFY_MODULE01_INPUT_SOURCE") || "projectProfile";

    if (!difyKey) {
      return jsonResponse({
        error: "DIFY_MODULE01_API_KEY is not configured in Supabase Edge Function secrets."
      }, 500);
    }

    // User-scoped client: all database access remains subject to RLS.
    const supabase = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      return jsonResponse({ error: "Invalid Supabase session." }, 401);
    }
    const user = userData.user;

    const { project_id } = await req.json();
    if (!project_id) return jsonResponse({ error: "project_id is required." }, 400);

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("access_level,account_status")
      .eq("id", user.id)
      .single();

    if (profileError) throw profileError;
    if (profile.account_status !== "active") {
      return jsonResponse({ error: "Account is not active." }, 403);
    }

    if (profile.access_level === "demo") {
      return jsonResponse({
        mode: "demo",
        called_dify: false,
        message: "Demo mode does not call Dify."
      });
    }

    if (!["realtest", "paid", "admin"].includes(profile.access_level)) {
      return jsonResponse({ error: "This account is not authorized to run live AI analysis." }, 403);
    }

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", project_id)
      .eq("user_id", user.id)
      .single();

    if (projectError) throw projectError;

    const { data: module00 } = await supabase
      .from("module_results")
      .select("output_data,report_text")
      .eq("project_id", project_id)
      .eq("module_number", 0)
      .maybeSingle();

    // Build a plain-text Module 00 profile for Dify's projectProfile START input.
    // This intentionally uses only data already supplied by this user.
    const projectProfile = [
      "# GRANT INTELLIGENCE™",
      "## Module 00 – Client Intake / Preliminary Project Profile",
      "",
      `Project Name: ${project.project_name || "Not Found"}`,
      `Organization Name: ${project.organization_name || "Not Found"}`,
      `Project Stage: ${project.project_stage || "Not Found"}`,
      `Project Description: ${project.project_description || "Not Found"}`,
      `Mission Statement: ${project.mission_statement || "Not Found"}`,
      `Primary Goal: ${project.primary_goal || "Not Found"}`,
      `Service Area: ${project.service_area || "Not Found"}`,
      `Target Population: ${project.target_population || "Not Found"}`,
      `Grant Readiness Score: ${project.readiness_score ?? "Not Found"}`,
      "",
      "Module 00 Stored Output:",
      JSON.stringify(module00?.output_data || {}, null, 2),
    ].join("\n");

    // Mark the module as running before the external call.
    const { error: runningError } = await supabase
      .from("module_results")
      .upsert({
        user_id: user.id,
        project_id,
        module_number: 1,
        module_name: "Organization Intelligence",
        status: "running",
        started_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: "project_id,module_number" });
    if (runningError) throw runningError;

    const payload = {
      inputs: {
        inputSource,
        opportunityAnalysis: "",
        projectProfile,
        // organizationFiles is intentionally omitted until the real upload bridge is connected.
      },
      response_mode: "blocking",
      user: user.id,
    };

    const difyResponse = await fetch(`${difyBase}/workflows/run`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${difyKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const difyJson = await difyResponse.json().catch(() => ({}));

    if (!difyResponse.ok) {
      await supabase
        .from("module_results")
        .update({
          status: "failed",
          output_data: { dify_error: difyJson },
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("project_id", project_id)
        .eq("module_number", 1);

      return jsonResponse({
        error: "Dify Module 01 request failed.",
        dify_status: difyResponse.status,
        dify: difyJson,
      }, 502);
    }

    const runData = difyJson?.data || {};
    const outputs = runData?.outputs || {};

    // Your Module 01 output screenshot shows three organization outputs.
    // Keep every output verbatim and select the intelligence report for report_text when present.
    const reportText =
      outputs.organizationIntelligenceReport ||
      outputs.organizationReport ||
      outputs.organizationInformation ||
      outputs.text ||
      Object.values(outputs).find((v) => typeof v === "string" && v.length > 100) ||
      JSON.stringify(outputs, null, 2);

    const totalTokens =
      runData?.total_tokens ??
      difyJson?.metadata?.usage?.total_tokens ??
      null;

    const { data: saved, error: saveError } = await supabase
      .from("module_results")
      .upsert({
        user_id: user.id,
        project_id,
        module_number: 1,
        module_name: "Organization Intelligence",
        status: "completed",
        report_text: String(reportText || ""),
        output_data: {
          dify_outputs: outputs,
          dify_status: runData?.status || null,
          input_source: inputSource,
        },
        dify_run_id: difyJson?.workflow_run_id || runData?.id || null,
        total_tokens: totalTokens,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: "project_id,module_number" })
      .select("*")
      .single();

    if (saveError) throw saveError;

    await supabase
      .from("projects")
      .update({ current_module: 1, updated_at: new Date().toISOString() })
      .eq("id", project_id)
      .eq("user_id", user.id);

    await supabase.from("activity_log").insert({
      user_id: user.id,
      project_id,
      event_type: "module01_completed",
      event_data: {
        dify_run_id: saved?.dify_run_id || null,
        access_level: profile.access_level,
      },
    });

    return jsonResponse({
      success: true,
      mode: profile.access_level,
      called_dify: true,
      project_id,
      module_result: saved,
      outputs,
    });
  } catch (error) {
    console.error(error);
    return jsonResponse({ error: error?.message || String(error) }, 500);
  }
});
