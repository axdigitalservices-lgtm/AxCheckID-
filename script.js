document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const uidInput = document.getElementById('uidInput');
    const loader = document.getElementById('loader');
    const resultSection = document.getElementById('result');
    const errorMsg = document.getElementById('errorMsg');

    // UI elements
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

        fetchData(uid);
    });

    async function fetchData(uid) {
        // UI Reset
        errorMsg.style.display = 'none';
        resultSection.style.display = 'none';
        loader.style.display = 'block';
        searchBtn.disabled = true;

        // We use a CORS proxy to bypass browser restrictions when calling 3rd party APIs from a browser
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        const targetApi = `https://freefireinfo.in/api/info?uid=${uid}&region=ind`;
        
        try {
            const response = await fetch(proxyUrl + encodeURIComponent(targetApi));
            
            if (!response.ok) throw new Error('CONNECTION LOST');
            
            const data = await response.json();
            
            if (data.name) {
                renderData(data);
            } else {
                throw new Error('PLAYER NOT FOUND IN DATABASE');
            }
        } catch (error) {
            console.error(error);
            showError(error.message === 'PLAYER NOT FOUND IN DATABASE' ? error.message : 'SERVER OFFLINE. TRY LATER.');
        } finally {
            loader.style.display = 'none';
            searchBtn.disabled = false;
        }
    }

    function renderData(data) {
        pName.textContent = data.name;
        pID.textContent = data.uid;
        pLevel.textContent = data.level || '--';
        pRegion.textContent = data.region || 'INDIA';
        pBR.textContent = data.br_rank || 'UNKNOWN';
        pCS.textContent = data.cs_rank || 'UNKNOWN';
        pLikes.textContent = data.likes || '0';
        pCreated.textContent = data.created_at || 'PRIVATE';
        
        // Use a high-quality robot avatar based on name
        pAvatar.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${data.name}&backgroundColor=050507`;
        
        resultSection.style.display = 'block';
    }

    function showError(msg) {
        errorMsg.textContent = msg;
        errorMsg.style.display = 'block';
    }
});
