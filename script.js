import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = "https://zqpggcvrofsvwcdqshjh.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxcGdnY3Zyb2ZzdndjZHFzaGpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MTAwNzgsImV4cCI6MjA3MDA4NjA3OH0.Le3pvGyOBMlo2Ti-Pk_Yc4qplDwo9ZtcdfEOKnPFf5s";
const supabase = createClient(supabaseUrl, supabaseKey);

const grid = document.getElementById("items-grid");

// Load items from Supabase
async function loadItems() {
  const { data: items, error } = await supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading items:", error);
    return;
  }

  grid.innerHTML = "";

  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "item";

    const collabText = Array.isArray(item.collaboration)
      ? item.collaboration.join(", ")
      : item.collaboration || "";

    const tagList = item.tags ? [item.tags] : [];
    div.dataset.tags = tagList.join(",");

    div.innerHTML = `
      <img src="${item.image_url || ""}" alt="">
      <div class="title">${item.text || ""}</div>
      <div class="price">${collabText}</div>
      <div class="tags">
        ${tagList.map(tag => `<span class="tag">${tag}</span>`).join("")}
      </div>
    `;

    grid.appendChild(div);
  });

  setupTagFiltering();
  setupOverlay();
}

// Tag filtering
function setupTagFiltering() {
  const items = document.querySelectorAll(".item");
  const tags = document.querySelectorAll(".tag");

  if (!document.getElementById("show-all")) {
    const showAllBtn = document.createElement("button");
    showAllBtn.id = "show-all";
    showAllBtn.textContent = "Show Everything";
    document.body.appendChild(showAllBtn);

    showAllBtn.addEventListener("click", () => {
      items.forEach(item => (item.style.display = ""));
    });
  }

  tags.forEach(tag => {
    tag.addEventListener("click", () => {
      const selectedTag = tag.textContent.trim().toLowerCase();

      items.forEach(item => {
        const itemTags = item.dataset.tags
          ? item.dataset.tags.split(",").map(t => t.trim().toLowerCase())
          : [];

        item.style.display = itemTags.includes(selectedTag) ? "" : "none";
      });
    });
  });
}

// Overlay (click image to enlarge)
function setupOverlay() {
  if (document.querySelector(".overlay")) return;

  const overlay = document.createElement("div");
  overlay.classList.add("overlay");
  overlay.innerHTML = `<span class="close-btn">&times;</span><img src="">`;
  document.body.appendChild(overlay);

  const overlayImg = overlay.querySelector("img");
  const closeBtn = overlay.querySelector(".close-btn");

  document.querySelectorAll(".item img").forEach(img => {
    img.addEventListener("click", () => {
      overlay.style.display = "flex";
      overlayImg.src = img.src;
    });
  });

  closeBtn.addEventListener("click", () => {
    overlay.style.display = "none";
  });

  overlay.addEventListener("click", e => {
    if (e.target === overlay) overlay.style.display = "none";
  });
}

// Initialize
loadItems();
