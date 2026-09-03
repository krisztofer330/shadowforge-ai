/* =========================================================
   SHADOWFORGE AI
   Frontend Application
   ========================================================= */

const state = {
    page: "dashboard",
    assetType: "gui",
    prompt: "",
    projectName: "My Roblox Game",
    reference: null,
    generated: false
};


/* ---------------------------------------------------------
   ELEMENTS
--------------------------------------------------------- */

const pages = {
    dashboard: document.getElementById("dashboardPage"),
    generator: document.getElementById("generatorPage"),
    projects: document.getElementById("projectsPage"),
    assets: document.getElementById("assetsPage")
};

const currentPage = document.getElementById("currentPage");
const promptInput = document.getElementById("promptInput");
const projectName = document.getElementById("projectName");
const referenceInput = document.getElementById("referenceInput");
const fileName = document.getElementById("fileName");
const previewArea = document.getElementById("previewArea");
const previewType = document.getElementById("previewType");
const generatingModal = document.getElementById("generatingModal");
const progressBar = document.getElementById("progressBar");
const generationText = document.getElementById("generationText");
const creditCount = document.getElementById("creditCount");


/* ---------------------------------------------------------
   ASSET NAMES
--------------------------------------------------------- */

const assetNames = {
    gui: "Roblox GUI",
    thumbnail: "Game Thumbnail",
    character: "Character Concept",
    "3d": "3D Asset",
    hud: "HUD / Health Bar",
    skill: "Skill UI"
};


/* ---------------------------------------------------------
   NAVIGATION
--------------------------------------------------------- */

function showPage(pageName) {

    Object.values(pages).forEach(page => {
        if (page) page.classList.remove("active-page");
    });

    if (pages[pageName]) {
        pages[pageName].classList.add("active-page");
    }

    document.querySelectorAll(".nav-item").forEach(item => {
        item.classList.remove("active");
    });

    const nav = document.querySelector(
        `.nav-item[data-page="${pageName}"]`
    );

    if (nav) {
        nav.classList.add("active");
    }

    state.page = pageName;

    const titles = {
        dashboard: "Dashboard",
        generator: "AI Generator",
        projects: "My Projects",
        assets: "Asset Library"
    };

    currentPage.textContent = titles[pageName] || "Dashboard";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


document.querySelectorAll(".nav-item[data-page]").forEach(button => {

    button.addEventListener("click", () => {

        showPage(button.dataset.page);

    });

});


document.querySelectorAll("[data-page-button]").forEach(button => {

    button.addEventListener("click", () => {

        showPage(button.dataset.pageButton);

    });

});


/* ---------------------------------------------------------
   OPEN GENERATOR
--------------------------------------------------------- */

document.querySelectorAll(".open-generator").forEach(button => {

    button.addEventListener("click", () => {

        showPage("generator");

    });

});


/* ---------------------------------------------------------
   CREATE CARDS
--------------------------------------------------------- */

document.querySelectorAll("[data-open-type]").forEach(card => {

    card.addEventListener("click", () => {

        selectAssetType(card.dataset.openType);

        showPage("generator");

    });

});


document.querySelectorAll(".generator-link").forEach(button => {

    button.addEventListener("click", () => {

        selectAssetType(button.dataset.type);

        showPage("generator");

    });

});


/* ---------------------------------------------------------
   ASSET TYPE
--------------------------------------------------------- */

function selectAssetType(type) {

    if (!assetNames[type]) return;

    state.assetType = type;

    document.querySelectorAll(".type-button").forEach(button => {

        button.classList.remove("selected");

        if (button.dataset.typeSelect === type) {
            button.classList.add("selected");
        }

    });

    previewType.textContent = assetNames[type];

}


document.querySelectorAll("[data-type-select]").forEach(button => {

    button.addEventListener("click", () => {

        selectAssetType(button.dataset.typeSelect);

    });

});


/* ---------------------------------------------------------
   REFERENCE IMAGE
--------------------------------------------------------- */

referenceInput.addEventListener("change", event => {

    const file = event.target.files[0];

    if (!file) return;

    state.reference = file;

    fileName.textContent = file.name;

    const reader = new FileReader();

    reader.onload = e => {

        const old = document.querySelector(".reference-preview");

        if (old) old.remove();

        const image = document.createElement("img");

        image.src = e.target.result;
        image.className = "reference-preview";

        image.style.width = "42px";
        image.style.height = "42px";
        image.style.objectFit = "cover";
        image.style.borderRadius = "8px";
        image.style.marginBottom = "6px";

        document.getElementById("uploadBox").prepend(image);

    };

    reader.readAsDataURL(file);

});


/* ---------------------------------------------------------
   INPUT STATE
--------------------------------------------------------- */

promptInput.addEventListener("input", () => {

    state.prompt = promptInput.value;

});

projectName.addEventListener("input", () => {

    state.projectName = projectName.value;

});


/* ---------------------------------------------------------
   GENERATION
--------------------------------------------------------- */

document
    .getElementById("generateButton")
    .addEventListener("click", generateAsset);


function generateAsset() {

    if (!promptInput.value.trim()) {

        promptInput.focus();

        promptInput.style.borderColor = "#ef4444";

        setTimeout(() => {
            promptInput.style.borderColor = "";
        }, 1200);

        return;

    }

    state.prompt = promptInput.value.trim();
    state.projectName = projectName.value.trim() || "My Roblox Game";

    generatingModal.classList.add("visible");

    progressBar.style.width = "0%";

    let progress = 0;

    const messages = [
        "Analyzing prompt...",
        "Preparing Roblox asset...",
        "Applying visual style...",
        "Building preview...",
        "Finalizing..."
    ];

    let messageIndex = 0;

    const interval = setInterval(() => {

        progress += Math.random() * 17 + 8;

        if (progress > 100) {
            progress = 100;
        }

        progressBar.style.width = progress + "%";

        messageIndex = Math.min(
            messages.length - 1,
            Math.floor(progress / 21)
        );

        generationText.textContent = messages[messageIndex];

        if (progress >= 100) {

            clearInterval(interval);

            setTimeout(() => {

                generatingModal.classList.remove("visible");

                state.generated = true;

                renderPreview();

                updateCredits();

            }, 450);

        }

    }, 220);

}


/* ---------------------------------------------------------
   PREVIEW GENERATOR
--------------------------------------------------------- */

function renderPreview() {

    if (state.assetType === "gui") {
        renderGUIPreview();
        return;
    }

    if (state.assetType === "hud") {
        renderHUDPreview();
        return;
    }

    if (state.assetType === "skill") {
        renderSkillPreview();
        return;
    }

    if (state.assetType === "thumbnail") {
        renderThumbnailPreview();
        return;
    }

    if (state.assetType === "character") {
        renderCharacterPreview();
        return;
    }

    if (state.assetType === "3d") {
        render3DPreview();
        return;
    }

}


/* ---------------------------------------------------------
   GUI
--------------------------------------------------------- */

function renderGUIPreview() {

    previewArea.innerHTML = `

        <div class="generated-ui">

            <div class="generated-ui-header">

                <div class="generated-ui-title">
                    ✦ MAGIC INVENTORY
                </div>

                <div class="generated-ui-close">
                    ×
                </div>

            </div>

            <div class="generated-ui-content">

                <div class="generated-slot">🪄</div>
                <div class="generated-slot">💎</div>
                <div class="generated-slot">🧪</div>

                <div class="generated-slot">⚔️</div>
                <div class="generated-slot">🛡️</div>
                <div class="generated-slot">✨</div>

                <div class="generated-slot">🔮</div>
                <div class="generated-slot">💰</div>
                <div class="generated-slot">🎁</div>

            </div>

        </div>

    `;

}


/* ---------------------------------------------------------
   HUD
--------------------------------------------------------- */

function renderHUDPreview() {

    previewArea.innerHTML = `

        <div style="
            position:absolute;
            left:6%;
            top:7%;
            width:280px;
        ">

            <div style="
                font-size:12px;
                font-weight:800;
                margin-bottom:7px;
            ">
                PLAYER
            </div>

            <div style="
                height:17px;
                border-radius:20px;
                background:#191b27;
                overflow:hidden;
                border:1px solid rgba(255,255,255,.1);
            ">

                <div style="
                    width:78%;
                    height:100%;
                    background:linear-gradient(90deg,#ef4444,#fb7185);
                "></div>

            </div>

            <div style="
                margin-top:8px;
                height:11px;
                border-radius:20px;
                background:#191b27;
                overflow:hidden;
            ">

                <div style="
                    width:55%;
                    height:100%;
                    background:linear-gradient(90deg,#6366f1,#a78bfa);
                "></div>

            </div>

        </div>

    `;

}


/* ---------------------------------------------------------
   SKILL UI
--------------------------------------------------------- */

function renderSkillPreview() {

    previewArea.innerHTML = `

        <div style="
            position:absolute;
            left:50%;
            bottom:9%;
            transform:translateX(-50%);
            display:flex;
            gap:10px;
        ">

            ${["🔥","❄️","⚡","🌑","✨"].map((icon,index) => `

                <div style="
                    width:62px;
                    height:62px;
                    border-radius:13px;
                    border:1px solid rgba(139,92,246,.45);
                    background:linear-gradient(145deg,#18152b,#0e0d18);
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size:25px;
                    position:relative;
                    box-shadow:0 0 25px rgba(139,92,246,.08);
                ">

                    ${icon}

                    <span style="
                        position:absolute;
                        bottom:4px;
                        right:6px;
                        color:#777;
                        font-size:8px;
                    ">
                        ${index + 1}
                    </span>

                </div>

            `).join("")}

        </div>

    `;

}


/* ---------------------------------------------------------
   THUMBNAIL
--------------------------------------------------------- */

function renderThumbnailPreview() {

    previewArea.innerHTML = `

        <div style="
            position:absolute;
            width:75%;
            aspect-ratio:16/9;
            left:50%;
            top:50%;
            transform:translate(-50%,-50%);
            border-radius:14px;
            overflow:hidden;
            background:
                radial-gradient(circle at 75% 25%,rgba(139,92,246,.8),transparent 25%),
                linear-gradient(135deg,#141127,#080812);
            border:1px solid rgba(139,92,246,.45);
            display:flex;
            align-items:center;
            justify-content:center;
            text-align:center;
            box-shadow:0 20px 60px rgba(0,0,0,.4);
        ">

            <div>

                <div style="
                    font-size:42px;
                    margin-bottom:10px;
                ">
                    ✦
                </div>

                <div style="
                    font-size:25px;
                    font-weight:900;
                    letter-spacing:1px;
                ">
                    MAGIC WORLD
                </div>

                <div style="
                    margin-top:7px;
                    color:#a78bfa;
                    font-size:11px;
                    letter-spacing:2px;
                ">
                    BECOME THE STRONGEST
                </div>

            </div>

        </div>

    `;

}


/* ---------------------------------------------------------
   CHARACTER
--------------------------------------------------------- */

function renderCharacterPreview() {

    previewArea.innerHTML = `

        <div style="
            position:absolute;
            left:50%;
            top:50%;
            transform:translate(-50%,-50%);
            text-align:center;
        ">

            <div style="
                width:135px;
                height:200px;
                border-radius:65px 65px 35px 35px;
                background:
                    linear-gradient(180deg,#1b1830,#30245b);
                border:2px solid rgba(167,139,250,.5);
                box-shadow:0 0 60px rgba(139,92,246,.2);
                position:relative;
                margin:auto;
            ">

                <div style="
                    position:absolute;
                    width:76px;
                    height:76px;
                    left:28px;
                    top:-30px;
                    border-radius:50%;
                    background:#d4a47c;
                    border:2px solid rgba(255,255,255,.1);
                "></div>

                <div style="
                    position:absolute;
                    width:20px;
                    height:70px;
                    right:-28px;
                    top:70px;
                    border-radius:10px;
                    background:linear-gradient(#a78bfa,#4f46e5);
                    transform:rotate(-25deg);
                "></div>

            </div>

            <div style="
                margin-top:18px;
                font-size:13px;
                font-weight:800;
            ">
                SHADOW MAGE
            </div>

        </div>

    `;

}


/* ---------------------------------------------------------
   3D
--------------------------------------------------------- */

function render3DPreview() {

    previewArea.innerHTML = `

        <div style="
            position:absolute;
            left:50%;
            top:50%;
            transform:translate(-50%,-50%);
            width:190px;
            height:300px;
            perspective:700px;
        ">

            <div style="
                width:55px;
                height:245px;
                position:absolute;
                left:68px;
                top:25px;
                transform:rotate(-32deg);
                transform-origin:bottom center;
                background:linear-gradient(90deg,#4338ca,#a78bfa,#4338ca);
                border-radius:18px;
                box-shadow:
                    0 0 35px rgba(139,92,246,.45),
                    10px 20px 35px rgba(0,0,0,.5);
            ">

                <div style="
                    position:absolute;
                    bottom:-35px;
                    left:-15px;
                    width:85px;
                    height:35px;
                    border-radius:10px;
                    background:#5b3a2e;
                "></div>

            </div>

            <div style="
                position:absolute;
                bottom:0;
                width:100%;
                text-align:center;
                color:#a78bfa;
                font-size:11px;
                letter-spacing:2px;
            ">
                MAGIC WAND
            </div>

        </div>

    `;

}


/* ---------------------------------------------------------
   CREDITS
--------------------------------------------------------- */

function updateCredits() {

    let credits = Number(creditCount.textContent);

    if (credits > 0) {
        credits -= 1;
    }

    creditCount.textContent = credits;

}


/* ---------------------------------------------------------
   RESET
--------------------------------------------------------- */

document
    .getElementById("resetPreview")
    .addEventListener("click", () => {

        state.generated = false;

        previewArea.innerHTML = `

            <div class="preview-placeholder">

                <div class="preview-spark">✦</div>

                <h3>Your creation appears here</h3>

                <p>
                    Choose an asset type and generate a preview.
                </p>

            </div>

        `;

    });


/* ---------------------------------------------------------
   FULLSCREEN
--------------------------------------------------------- */

document
    .getElementById("fullscreenPreview")
    .addEventListener("click", () => {

        if (previewArea.requestFullscreen) {
            previewArea.requestFullscreen();
        }

    });


/* ---------------------------------------------------------
   PNG EXPORT
--------------------------------------------------------- */

document
    .getElementById("downloadPNG")
    .addEventListener("click", () => {

        if (!state.generated) {

            alert("Először generálj egy assetet.");

            return;

        }

        const canvas = document.createElement("canvas");

        canvas.width = 1200;
        canvas.height = 700;

        const ctx = canvas.getContext("2d");

        const gradient = ctx.createLinearGradient(
            0,
            0,
            1200,
            700
        );

        gradient.addColorStop(0, "#121026");
        gradient.addColorStop(1, "#080812");

        ctx.fillStyle = gradient;
        ctx.fillRect(0,0,1200,700);

        ctx.fillStyle = "#a78bfa";
        ctx.font = "bold 46px Arial";
        ctx.fillText(
            assetNames[state.assetType],
            70,
            100
        );

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 26px Arial";

        ctx.fillText(
            state.projectName,
            70,
            145
        );

        ctx.fillStyle = "#8e94a7";
        ctx.font = "18px Arial";

        const text =
            state.prompt.substring(0, 100);

        ctx.fillText(
            text,
            70,
            190
        );

        ctx.fillStyle = "#8b5cf6";
        ctx.beginPath();
        ctx.arc(600,400,100,0,Math.PI*2);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 70px Arial";
        ctx.textAlign = "center";
        ctx.fillText("✦",600,425);

        const link = document.createElement("a");

        link.download =
            "shadowforge-" +
            state.assetType +
            ".png";

        link.href = canvas.toDataURL("image/png");

        link.click();

    });


/* ---------------------------------------------------------
   JSON EXPORT
--------------------------------------------------------- */

document
    .getElementById("downloadJSON")
    .addEventListener("click", () => {

        if (!state.generated) {

            alert("Először generálj egy assetet.");

            return;

        }

        const project = {

            platform: "ShadowForge AI",

            version: "0.1",

            project: state.projectName,

            asset: {
                type: state.assetType,
                name: assetNames[state.assetType],
                prompt: state.prompt
            },

            reference: state.reference
                ? state.reference.name
                : null,

            createdAt:
                new Date().toISOString()

        };

        const blob = new Blob(
            [JSON.stringify(project,null,4)],
            {
                type: "application/json"
            }
        );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;

        link.download =
            "shadowforge-project.json";

        link.click();

        URL.revokeObjectURL(url);

    });


/* ---------------------------------------------------------
   KEYBOARD SHORTCUT
--------------------------------------------------------- */

document.addEventListener("keydown", event => {

    if (
        (event.ctrlKey || event.metaKey) &&
        event.key === "Enter"
    ) {

        if (state.page === "generator") {
            generateAsset();
        }

    }

});


/* ---------------------------------------------------------
   START
--------------------------------------------------------- */

selectAssetType("gui");
showPage("dashboard");
