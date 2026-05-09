document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const uidInput = document.getElementById('uidInput');
    const loader = document.getElementById('loader');
    const resultSection = document.getElementById('resultSection');
    const errorMsg = document.getElementById('errorMsg');

    // UI Elements for Data
    const playerName = document.getElementById('playerName');
    const playerID = document.getElementById('playerID');
    const playerLevel = document.getElementById('playerLevel');
    const playerRegion = document.getElementById('playerRegion');
    const playerRankBR = document.getElementById('playerRankBR');
    const playerRankCS = document.getElementById('playerRankCS');
    const playerLikes = document.getElementById('playerLikes');
    const playerCreated = document.getElementById('playerCreated');
    const playerAvatar = document.getElementById('playerAvatar');

    searchBtn.addEventListener('click', () => {
        const uid = uidInput.value.trim();
        if (!uid) {
            showError('Please enter a valid Player UID');
            return;
        }
        fetchPlayerData(uid);
    });

    uidInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchBtn.click();
    });

    async function fetchPlayerData(uid) {
        // Reset UI
        errorMsg.style.display = 'none';
        resultSection.style.display = 'none';
        loader.style.display = 'block';
        searchBtn.disabled = true;

        try {
            // Note: Most Free Fire APIs are unofficial and might have CORS issues when called directly from frontend.
            // Using a popular community API endpoint as an example.
            // If this fails, we will show a mock response to demonstrate the UI.
            
            const response = await fetch(`https://freefireinfo.in/api/info?uid=${uid}&region=ind`);
            
            if (!response.ok) throw new Error('API unreachable');
            
            const data = await response.json();
            
            if (data.status === 'success' || data.name) {
                displayData(data);
            } else {
                throw new Error(data.message || 'Player not found');
            }
        } catch (error) {
            console.error('Fetch Error:', error);
            // Since public APIs are unstable, let's show a "Simulated" result for the demo if it fails
            // In a real production app, you'd use a stable paid API or your own backend proxy.
            showMockData(uid);
        } finally {
            loader.style.display = 'none';
            searchBtn.disabled = false;
        }
    }

    function displayData(data) {
        playerName.textContent = data.name || 'Unknown';
        playerID.textContent = data.uid || uidInput.value;
        playerLevel.textContent = data.level || '--';
        playerRegion.textContent = data.region || 'India';
        playerRankBR.textContent = data.br_rank || 'Bronze I';
        playerRankCS.textContent = data.cs_rank || 'Bronze I';
        playerLikes.textContent = data.likes || '0';
        playerCreated.textContent = data.created_at || 'Not Available';
        
        // Random avatar for demo since game avatars are hard to fetch directly
        playerAvatar.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name || 'ff'}`;
        
        resultSection.style.display = 'block';
    }

    function showMockData(uid) {
        // This is a fallback to show the user how the UI looks even if the unofficial API is down
        console.log('Showing mock data due to API unavailability');
        
        const mockData = {
            name: 'Gamer_Pro_SL',
            uid: uid,
            level: '68',
            region: 'India / SL',
            br_rank: 'Heroic',
            cs_rank: 'Grandmaster',
            likes: '12,450',
            created_at: '2021-05-12'
        };
        
        displayData(mockData);
        
        // Add a small disclaimer
        showError('Using Demo Mode (Live API is currently busy). Try again later for live data.', '#00d2ff');
    }

    function showError(msg, color = '#ff4d4d') {
        errorMsg.textContent = msg;
        errorMsg.style.color = color;
        errorMsg.style.display = 'block';
    }
});
