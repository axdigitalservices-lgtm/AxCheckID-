document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const uidInput = document.getElementById('uidInput');
    const loader = document.getElementById('loader');
    const resultSection = document.getElementById('result');
    const errorMsg = document.getElementById('errorMsg');

    // UI elements from index.html
    const pName = document.getElementById('pName');
    const pID = document.getElementById('pID');
    const pLevel = document.getElementById('pLevel');
    const pRegion = document.getElementById('pRegion');
    const pBR = document.getElementById('pBR');
    const pCS = document.getElementById('pCS');
    const pLikes = document.getElementById('pLikes');
    const pCreated = document.getElementById('pCreated');
    const pAvatar = document.getElementById('pAvatar');

    searchBtn.addEventListener('click', async () => {
        const uid = uidInput.value.trim();
        if (!uid || isNaN(uid)) {
            showError('INVALID UID FORMAT. ACCESS DENIED.');
            return;
        }

        fetchSGData(uid);
    });

    // Handle Enter Key
    uidInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchBtn.click();
    });

    async function fetchSGData(uid) {
        errorMsg.style.display = 'none';
        resultSection.style.display = 'none';
        loader.style.display = 'block';
        searchBtn.disabled = true;

        // List of APIs to try specifically for SG region
        const apiList = [
            `https://freefireinfo.in/api/info?uid=${uid}&region=sg`,
            `https://ff-api-five.vercel.app/api/info?uid=${uid}&region=sg`,
            `https://ff-info-api.vercel.app/api/info?uid=${uid}&region=sg`
        ];

        let found = false;

        for (let url of apiList) {
            try {
                // Using AllOrigins Proxy to bypass CORS on GitHub/Local
                const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
                const response = await fetch(proxyUrl);
                
                if (!response.ok) continue;

                const data = await response.json();
                
                if (data.name || data.nickname) {
                    renderData(data);
                    found = true;
                    break;
                }
            } catch (e) {
                console.log("Searching next server...");
            }
        }

        if (!found) {
            showError('PLAYER NOT FOUND IN SG REGION OR SERVERS BUSY.');
        }

        loader.style.display = 'none';
        searchBtn.disabled = false;
    }

    function renderData(data) {
        pName.textContent = data.name || data.nickname || 'Unknown';
        pID.textContent = data.uid || uidInput.value;
        pLevel.textContent = data.level || '--';
        pRegion.textContent = 'SINGAPORE (SG)';
        pBR.textContent = data.br_rank || data.rank || 'N/A';
        pCS.textContent = data.cs_rank || 'N/A';
        pLikes.textContent = data.likes || '0';
        pCreated.textContent = data.created_at || 'PRIVATE';
        
        // Dynamic robot avatar based on name
        pAvatar.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${data.name}&backgroundColor=050507`;
        
        resultSection.style.display = 'block';
    }

    function showError(msg) {
        errorMsg.textContent = msg;
        errorMsg.style.display = 'block';
    }
});
