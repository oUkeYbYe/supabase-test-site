import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://zqpggcvrofsvwcdqshjh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxcGdnY3Zyb2ZzdndjZHFzaGpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MTAwNzgsImV4cCI6MjA3MDA4NjA3OH0.Le3pvGyOBMlo2Ti-Pk_Yc4qplDwo9ZtcdfEOKnPFf5s";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function loadPost() {
  let { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("id", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error(error);
    document.getElementById("title").innerText = "Error loading post";
    return;
  }

  document.getElementById("title").innerText = data.title;
  document.getElementById("body").innerText = data.body;
  document.getElementById("image").src = data.image_url;
}

loadPost();
