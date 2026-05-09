document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const uidInput = document.getElementById('uidInput');
    const loader = document.getElementById('loader');
    const resultSection = document.getElementById('result');
    const errorMsg = document.getElementById('errorMsg');

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
            showError('INVALID UID FORMAT.');
            return;
        }
        fetchData(uid);
    });

    // Handle Enter Key
    uidInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchBtn.click();
    });

    async function fetchData(uid) {
        errorMsg.style.display = 'none';
        resultSection.style.display = 'none';
        loader.style.display = 'block';
        searchBtn.disabled = true;

        // SG Region APIs
        const apis = [
            `https://freefireinfo.in/api/info?uid=${uid}&region=sg`,
            `https://ff-api-five.vercel.app/api/info?uid=${uid}&region=sg`
        ];

        let success = false;

        for (let url of apis) {
            try {
                // Using corsproxy.io which is often faster and has better CORS support
                const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
                
                // Set a timeout of 8 seconds per API call
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000);

                const response = await fetch(proxyUrl, { signal: controller.signal });
                clearTimeout(timeoutId);

                if (!response.ok) continue;

                const data = await response.json();
                if (data.name || data.nickname) {
                    renderData(data);
                    success = true;
                    break;
                }
            } catch (e) {
                console.log("Server error, trying next...");
            }
        }

        if (!success) {
            showError('DATABASE OFFLINE. TRY AGAIN LATER OR CHECK UID.');
        }

        loader.style.display = 'none';
        searchBtn.disabled = false;
    }

    function renderData(data) {
        pName.textContent = data.name || data.nickname || 'Unknown';
        pID.textContent = data.uid || uidInput.value;
        pLevel.textContent = data.level || '--';
        pRegion.textContent = 'SINGAPORE (SG)';
        pBR.textContent = data.br_rank || data.rank || '--';
        pCS.textContent = data.cs_rank || '--';
        pLikes.textContent = data.likes || '0';
        pCreated.textContent = data.created_at || 'PRIVATE';
        
        pAvatar.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${data.name}&backgroundColor=050507`;
        
        resultSection.style.display = 'block';
    }

    function showError(msg) {
        errorMsg.textContent = msg;
        errorMsg.style.display = 'block';
    }
});
