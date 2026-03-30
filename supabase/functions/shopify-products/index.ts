import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!,
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Check admin role
    const { data: roleData } = await createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    ).from("user_roles").select("role").eq("user_id", user.id).single();

    if (roleData?.role !== "admin") {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const shopifyToken = Deno.env.get("SHOPIFY_ACCESS_TOKEN")!;
    const shopifyDomain = "creative-web-studio-mytu3.myshopify.com";
    const apiVersion = "2025-07";
    const baseUrl = `https://${shopifyDomain}/admin/api/${apiVersion}`;

    const { action, ...payload } = await req.json();

    let result;

    switch (action) {
      case "create": {
        const res = await fetch(`${baseUrl}/products.json`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": shopifyToken },
          body: JSON.stringify({ product: payload.product }),
        });
        result = await res.json();
        break;
      }
      case "update": {
        const res = await fetch(`${baseUrl}/products/${payload.product_id}.json`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": shopifyToken },
          body: JSON.stringify({ product: payload.product }),
        });
        result = await res.json();
        break;
      }
      case "delete": {
        const res = await fetch(`${baseUrl}/products/${payload.product_id}.json`, {
          method: "DELETE",
          headers: { "X-Shopify-Access-Token": shopifyToken },
        });
        result = res.ok ? { success: true } : { error: "Failed to delete" };
        break;
      }
      default:
        return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
