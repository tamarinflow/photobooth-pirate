// ══════════════════════════════════════
// PHOTOBOOTH PIRATE — App Logic
// ══════════════════════════════════════

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // ── Config ──
    const MUTINY_GOAL = 8;
    const MUTINY_TOTAL_CREW = 16;

    // ── State ──
    let currentGuest = null;
    let photoDataUrl = null;

    // Mutiny state (synced via Firebase when available, localStorage fallback)
    var mutinyVoters = [];
    var mutinyLaunched = false;
    var mutinyCount = 0;
    var firebaseReady = false;
    var mutinyDbRef = null;

    // ── Firebase init ──
    function initFirebase() {
        if (typeof FIREBASE_ENABLED === 'undefined' || !FIREBASE_ENABLED) {
            console.log('Firebase disabled, using localStorage fallback');
            loadLocalMutiny();
            return;
        }

        try {
            firebase.initializeApp(FIREBASE_CONFIG);
            firebase.auth().signInAnonymously().then(function () {
                firebaseReady = true;
                mutinyDbRef = firebase.database().ref('mutiny/voters');

                // Listen for real-time changes
                mutinyDbRef.on('value', function (snapshot) {
                    var data = snapshot.val() || {};
                    mutinyVoters = Object.keys(data);
                    mutinyCount = mutinyVoters.length;
                    mutinyLaunched = mutinyCount >= MUTINY_GOAL;

                    // Sync to localStorage as cache
                    localStorage.setItem('pirate_mutiny_voters', JSON.stringify(mutinyVoters));
                    if (mutinyLaunched) localStorage.setItem('pirate_mutiny_launched', 'true');

                    // Re-render UI
                    refreshMutinyUI();
                });
            }).catch(function (err) {
                console.warn('Firebase auth failed, falling back to localStorage:', err);
                loadLocalMutiny();
            });
        } catch (err) {
            console.warn('Firebase init failed, falling back to localStorage:', err);
            loadLocalMutiny();
        }
    }

    function loadLocalMutiny() {
        mutinyVoters = JSON.parse(localStorage.getItem('pirate_mutiny_voters') || '[]');
        mutinyLaunched = localStorage.getItem('pirate_mutiny_launched') === 'true';
        mutinyCount = mutinyVoters.length;
    }

    // ── DOM refs (resolved after DOM ready) ──
    const screenSelect = document.getElementById('screenSelect');
    const screenPhoto = document.getElementById('screenPhoto');
    const guestSelect = document.getElementById('guestSelect');
    const guestPreview = document.getElementById('guestPreview');
    const guestJoke = document.getElementById('guestJoke');
    const btnNext = document.getElementById('btnNext');
    const btnBack = document.getElementById('btnBack');
    const photoName = document.getElementById('photoName');
    const uploadZone = document.getElementById('uploadZone');
    const previewZone = document.getElementById('previewZone');
    const resultZone = document.getElementById('resultZone');
    const photoInput = document.getElementById('photoInput');
    const btnUpload = document.getElementById('btnUpload');
    const originalPhoto = document.getElementById('originalPhoto');
    const btnTransform = document.getElementById('btnTransform');
    const transformText = document.getElementById('transformText');
    const transformLoader = document.getElementById('transformLoader');
    const btnRetake = document.getElementById('btnRetake');
    const resultOriginal = document.getElementById('resultOriginal');
    const resultPirate = document.getElementById('resultPirate');
    const ancestorName = document.getElementById('ancestorName');
    const ancestorDesc = document.getElementById('ancestorDesc');
    const btnDownload = document.getElementById('btnDownload');
    const btnShare = document.getElementById('btnShare');
    const btnNewPhoto = document.getElementById('btnNewPhoto');
    const btnMutiny = document.getElementById('btnMutiny');
    const mutinyLabel = document.getElementById('mutinyLabel');
    const mutinyVotedEl = document.getElementById('mutinyVoted');
    const mutinyOverlay = document.getElementById('mutinyOverlay');
    const mutinyTrophy = document.getElementById('mutinyTrophy');
    const skullRow = document.getElementById('skullRow');
    const skullCounter = document.getElementById('skullCounter');
    const fuseFill = document.getElementById('fuseFill');
    const fuseSpark = document.getElementById('fuseSpark');
    const crewRoster = document.getElementById('crewRoster');
    const btnOverlayClose = document.getElementById('btnOverlayClose');
    const mutinySubtitle = document.getElementById('mutinySubtitle');

    // ── Init ──
    populateGuestSelect();
    initFirebase();
    initMutinyUI();

    // Events
    guestSelect.addEventListener('change', onGuestSelect);
    btnNext.addEventListener('click', goToPhoto);
    btnBack.addEventListener('click', goToSelect);
    btnUpload.addEventListener('click', function (e) { e.stopPropagation(); photoInput.click(); });
    uploadZone.addEventListener('click', function () { photoInput.click(); });
    photoInput.addEventListener('change', onPhotoChosen);
    btnTransform.addEventListener('click', onTransform);
    btnRetake.addEventListener('click', onRetake);
    btnNewPhoto.addEventListener('click', onRetake);
    btnDownload.addEventListener('click', onDownload);
    btnShare.addEventListener('click', onShare);
    btnMutiny.addEventListener('click', onMutiny);
    btnOverlayClose.addEventListener('click', closeMutinyOverlay);

    // Drag & drop
    uploadZone.addEventListener('dragover', function (e) {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });
    uploadZone.addEventListener('dragleave', function () {
        uploadZone.classList.remove('dragover');
    });
    uploadZone.addEventListener('drop', function (e) {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        var file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) handleFile(file);
    });

    // ── Screen navigation ──
    function showScreen(screen) {
        screenSelect.classList.remove('active');
        screenPhoto.classList.remove('active');
        screen.classList.add('active');
        window.scrollTo(0, 0);
    }

    function goToPhoto() {
        if (!currentGuest) return;
        photoName.textContent = currentGuest.name;
        showScreen(screenPhoto);
        // Refresh mutiny state for selected guest
        if (!mutinyLaunched) updateMutinyButton();
    }

    function goToSelect() {
        showScreen(screenSelect);
    }

    // ── Guest selection ──
    function onGuestSelect() {
        var idx = parseInt(guestSelect.value);
        if (isNaN(idx)) return;

        currentGuest = getGuest(idx);
        if (!currentGuest) return;

        guestJoke.textContent = '"' + currentGuest.joke + '"';
        guestPreview.classList.remove('hidden');
        btnNext.disabled = false;

        // Update mutiny button state for this guest
        if (!mutinyLaunched) updateMutinyButton();
    }

    // ── Photo handling ──
    function onPhotoChosen(e) {
        var file = e.target.files[0];
        if (file) handleFile(file);
    }

    function handleFile(file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            photoDataUrl = e.target.result;
            originalPhoto.src = photoDataUrl;
            uploadZone.classList.add('hidden');
            previewZone.classList.remove('hidden');
            resultZone.classList.add('hidden');
        };
        reader.readAsDataURL(file);
    }

    function onRetake() {
        photoDataUrl = null;
        photoInput.value = '';
        uploadZone.classList.remove('hidden');
        previewZone.classList.add('hidden');
        resultZone.classList.add('hidden');
        resetTransformButton();
    }

    // ── Fal AI transformation ──
    async function onTransform() {
        if (!photoDataUrl || !currentGuest) return;

        btnTransform.disabled = true;
        transformText.textContent = 'Transformation en cours...';
        transformLoader.classList.remove('hidden');

        try {
            var pirateImageUrl = await callFalAI(photoDataUrl, currentGuest);
            showResult(pirateImageUrl);
        } catch (err) {
            console.error('Fal AI error:', err);
            showResult(null);
            toast('Transformation IA indisponible. Mode vintage.');
        } finally {
            resetTransformButton();
        }
    }

    async function callFalAI(imageDataUrl, guest) {
        var apiKey = localStorage.getItem('fal_api_key');
        if (!apiKey) {
            throw new Error('Clé API Fal AI manquante');
        }

        var blob = dataUrlToBlob(imageDataUrl);
        var uploadUrl = await uploadToFal(blob, apiKey);

        var response = await fetch('https://queue.fal.run/fal-ai/nano-banana-2/edit', {
            method: 'POST',
            headers: {
                'Authorization': 'Key ' + apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image_urls: [uploadUrl],
                prompt: 'Transform this portrait photo into an 18th century pirate captain oil painting. Keep the person\'s facial features clearly recognizable. Add a weathered pirate tricorn hat, dramatic chiaroscuro lighting, ocean and ship background. The person should look like ' + guest.pirateName + ', a legendary pirate captain. Painterly brushstrokes, rich warm colors, museum-quality portrait.',
                num_images: 1,
                resolution: '1K',
                output_format: 'png',
                safety_tolerance: '4'
            })
        });

        if (!response.ok) {
            var err = await response.json().catch(function () { return {}; });
            throw new Error(err.detail || 'API error: ' + response.status);
        }

        var result = await response.json();

        if (result.request_id) {
            return await pollFalResult(result.request_id, apiKey);
        }

        return (result.images && result.images[0] && result.images[0].url) || (result.image && result.image.url);
    }

    async function uploadToFal(blob, apiKey) {
        var formData = new FormData();
        formData.append('file', blob, 'photo.jpg');

        var resp = await fetch('https://fal.run/fal-ai/workflows/upload', {
            method: 'POST',
            headers: { 'Authorization': 'Key ' + apiKey },
            body: formData
        });

        if (!resp.ok) throw new Error('Upload failed');
        var data = await resp.json();
        return data.url;
    }

    async function pollFalResult(requestId, apiKey) {
        var maxAttempts = 30;
        for (var i = 0; i < maxAttempts; i++) {
            await sleep(2000);

            var resp = await fetch('https://queue.fal.run/fal-ai/nano-banana-2/edit/requests/' + requestId + '/status', {
                headers: { 'Authorization': 'Key ' + apiKey }
            });
            var status = await resp.json();

            if (status.status === 'COMPLETED') {
                var resultResp = await fetch('https://queue.fal.run/fal-ai/nano-banana-2/edit/requests/' + requestId, {
                    headers: { 'Authorization': 'Key ' + apiKey }
                });
                var result = await resultResp.json();
                return (result.images && result.images[0] && result.images[0].url) || (result.image && result.image.url);
            }

            if (status.status === 'FAILED') {
                throw new Error('Transformation failed');
            }

            transformText.textContent = 'Transformation... ' + Math.round((i / maxAttempts) * 100) + '%';
        }

        throw new Error('Timeout');
    }

    function showResult(pirateImageUrl) {
        resultOriginal.src = photoDataUrl;

        if (pirateImageUrl) {
            resultPirate.src = pirateImageUrl;
            resultPirate.style.filter = '';
        } else {
            resultPirate.src = photoDataUrl;
            resultPirate.style.filter = 'sepia(1) contrast(1.2) brightness(0.8)';
        }

        ancestorName.textContent = currentGuest.pirateName;
        ancestorDesc.textContent = currentGuest.ancestorDesc;

        previewZone.classList.add('hidden');
        resultZone.classList.remove('hidden');
    }

    function resetTransformButton() {
        btnTransform.disabled = false;
        transformText.textContent = 'Révéler mon ancêtre pirate';
        transformLoader.classList.add('hidden');
    }

    // ── Download & Share ──
    function onDownload() {
        var img = resultPirate.src;
        if (!img) return;
        var a = document.createElement('a');
        a.href = img;
        a.download = 'pirate-' + currentGuest.name.toLowerCase() + '.jpg';
        a.click();
    }

    function onShare() {
        var text = 'Mon ancêtre pirate : ' + currentGuest.pirateName + ' 🏴‍☠️';
        if (navigator.share) {
            navigator.share({
                title: text,
                text: "J'ai découvert mon ancêtre pirate à l'anniversaire de Nathan !",
                url: window.location.href
            }).catch(function () {});
        } else {
            navigator.clipboard.writeText(text + ' ' + window.location.href)
                .then(function () { toast('Copié !'); });
        }
    }

    // ══════════════════════════════════════
    // MUTINY — Full state machine
    // ══════════════════════════════════════

    function initMutinyUI() {
        // Light up skulls for existing voters
        var skulls = skullRow.querySelectorAll('.skull-lantern');
        for (var i = 0; i < Math.min(mutinyCount, MUTINY_GOAL); i++) {
            skulls[i].classList.add('lit');
        }

        // Update counter and fuse
        updateMutinyProgress();

        // Render crew roster
        renderCrewRoster();

        // Determine current state
        if (mutinyLaunched) {
            showPostLaunchState();
        } else {
            updateMutinyButton();
        }
    }

    // Called by Firebase onValue listener to refresh everything
    var previousMutinyCount = 0;
    var mutinyLaunchTriggered = false;

    function refreshMutinyUI() {
        var skulls = skullRow.querySelectorAll('.skull-lantern');
        for (var i = 0; i < MUTINY_GOAL; i++) {
            if (i < mutinyCount) {
                if (!skulls[i].classList.contains('lit')) {
                    skulls[i].classList.add('igniting');
                    (function (s) {
                        setTimeout(function () {
                            s.classList.add('lit');
                            s.classList.remove('igniting');
                        }, 500);
                    })(skulls[i]);
                }
            } else {
                skulls[i].classList.remove('lit');
            }
        }
        updateMutinyProgress();
        renderCrewRoster();

        // Detect threshold crossing for launch animation
        if (mutinyLaunched && !mutinyLaunchTriggered) {
            mutinyLaunchTriggered = true;
            setTimeout(function () { launchMutiny(); }, 600);
        } else if (mutinyLaunched && mutinyLaunchTriggered) {
            // Already launched, just show trophy state
            if (mutinyOverlay.classList.contains('hidden')) {
                showPostLaunchState();
            }
        } else {
            updateMutinyButton();
        }

        previousMutinyCount = mutinyCount;
    }

    function updateMutinyProgress() {
        var count = Math.min(mutinyCount, MUTINY_GOAL);
        skullCounter.textContent = count + ' / ' + MUTINY_GOAL + ' mutins';

        // Fuse fill percentage
        var pct = (count / MUTINY_GOAL) * 100;
        fuseFill.style.width = pct + '%';
        fuseSpark.style.left = pct + '%';

        if (count > 0 && count < MUTINY_GOAL) {
            fuseSpark.classList.add('active');
        } else {
            fuseSpark.classList.remove('active');
        }
    }

    function updateMutinyButton() {
        if (!currentGuest) {
            mutinyLabel.textContent = 'Choisis ton nom d\'abord';
            btnMutiny.disabled = true;
            btnMutiny.style.opacity = '0.4';
            btnMutiny.classList.remove('hidden');
            mutinyVotedEl.classList.add('hidden');
            return;
        }

        var hasVoted = mutinyVoters.indexOf(currentGuest.name) !== -1;

        if (hasVoted) {
            // Already voted state
            btnMutiny.classList.add('hidden');
            mutinyVotedEl.classList.remove('hidden');
        } else {
            // Can vote
            btnMutiny.classList.remove('hidden');
            btnMutiny.classList.remove('voted');
            btnMutiny.disabled = false;
            btnMutiny.style.opacity = '1';
            mutinyLabel.textContent = 'Rejoindre la mutinerie';
            mutinyVotedEl.classList.add('hidden');
        }
    }

    function renderCrewRoster() {
        while (crewRoster.firstChild) {
            crewRoster.removeChild(crewRoster.firstChild);
        }
        mutinyVoters.forEach(function (name) {
            var tag = document.createElement('span');
            tag.className = 'crew-tag';
            tag.textContent = name;
            crewRoster.appendChild(tag);
        });
    }

    function onMutiny() {
        if (!currentGuest) {
            toast('Choisis ton nom d\'abord !');
            return;
        }

        // Check if already voted
        if (mutinyVoters.indexOf(currentGuest.name) !== -1) {
            return;
        }

        // Check if already launched
        if (mutinyLaunched) return;

        // COMMIT TO MUTINY
        if (firebaseReady && mutinyDbRef) {
            // Write to Firebase (onValue listener will update local state)
            mutinyDbRef.child(currentGuest.name).set(true);
        } else {
            // localStorage fallback
            mutinyVoters.push(currentGuest.name);
            mutinyCount = mutinyVoters.length;
            localStorage.setItem('pirate_mutiny_voters', JSON.stringify(mutinyVoters));
        }

        // Haptic
        if (navigator.vibrate) navigator.vibrate([50, 30, 80]);

        // Ignite the next skull
        var skulls = skullRow.querySelectorAll('.skull-lantern');
        var skullIndex = mutinyCount - 1;
        if (skullIndex < MUTINY_GOAL) {
            var skull = skulls[skullIndex];
            skull.classList.add('igniting');
            setTimeout(function () {
                skull.classList.add('lit');
                skull.classList.remove('igniting');
            }, 500);
        }

        // Button ripple effect
        btnMutiny.classList.remove('rippling');
        void btnMutiny.offsetWidth;
        btnMutiny.classList.add('rippling');

        // Update progress
        updateMutinyProgress();

        // Add to crew roster with animation
        var tag = document.createElement('span');
        tag.className = 'crew-tag';
        tag.textContent = currentGuest.name;
        crewRoster.appendChild(tag);

        // Toasts at milestones
        if (mutinyCount === 3) toast('La revolte gronde...');
        if (mutinyCount === 6) toast('Plus que 2 mutins !');

        // Check for launch (localStorage fallback only; Firebase triggers via onValue)
        if (!firebaseReady) {
            if (mutinyCount >= MUTINY_GOAL) {
                mutinyLaunched = true;
                localStorage.setItem('pirate_mutiny_launched', 'true');
                setTimeout(function () { launchMutiny(); }, 600);
            } else {
                setTimeout(function () {
                    updateMutinyButton();
                }, 400);
            }
        } else {
            // Firebase: onValue will handle UI update, but show voted state locally
            setTimeout(function () {
                updateMutinyButton();
            }, 400);
        }
    }

    function launchMutiny() {
        // Haptic: heavy rumble
        if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);

        // Screen shake
        document.body.classList.add('screen-shake');
        setTimeout(function () { document.body.classList.remove('screen-shake'); }, 500);

        // Spawn particles
        spawnMutinyParticles(40);

        // Show overlay
        mutinyOverlay.classList.remove('hidden');
        mutinyOverlay.classList.add('entering');

        // Hide button area
        btnMutiny.classList.add('hidden');
        mutinyVotedEl.classList.add('hidden');
    }

    function closeMutinyOverlay() {
        mutinyOverlay.classList.add('hidden');
        mutinyOverlay.classList.remove('entering');
        showPostLaunchState();
    }

    function showPostLaunchState() {
        // Hide interactive elements
        btnMutiny.classList.add('hidden');
        mutinyVotedEl.classList.add('hidden');
        mutinySubtitle.textContent = 'L\'equipage s\'est souleve !';

        // Light all skulls
        var skulls = skullRow.querySelectorAll('.skull-lantern');
        for (var i = 0; i < MUTINY_GOAL; i++) {
            skulls[i].classList.add('lit');
        }

        // Full fuse
        fuseFill.style.width = '100%';
        fuseSpark.classList.remove('active');

        // Show trophy
        mutinyTrophy.classList.remove('hidden');

        // Update counter
        skullCounter.textContent = MUTINY_GOAL + ' / ' + MUTINY_GOAL + ' mutins — VICTOIRE';
    }

    function spawnMutinyParticles(count) {
        var colors = ['#d4a017', '#dc2626', '#facc15', '#991b1b', '#fafaf9'];
        for (var i = 0; i < count; i++) {
            var particle = document.createElement('span');
            particle.className = 'mutiny-particle';
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.left = (Math.random() * 100) + 'vw';
            particle.style.top = (40 + Math.random() * 30) + 'vh';
            particle.style.width = (4 + Math.random() * 6) + 'px';
            particle.style.height = particle.style.width;
            particle.style.setProperty('--tx', (Math.random() * 200 - 100) + 'px');
            particle.style.setProperty('--ty', (-80 - Math.random() * 200) + 'px');
            particle.style.setProperty('--dur', (0.8 + Math.random() * 0.8) + 's');
            particle.style.animationDelay = (Math.random() * 0.3) + 's';
            document.body.appendChild(particle);
            setTimeout(function (el) { el.remove(); }.bind(null, particle), 2000);
        }
    }

    // ── Helpers ──
    function toast(message, duration) {
        duration = duration || 3000;
        var el = document.createElement('div');
        el.textContent = message;
        el.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#d4a017;color:#0c0a09;padding:12px 20px;border-radius:10px;font-weight:600;font-size:0.9rem;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,0.5);max-width:90vw;text-align:center';
        document.body.appendChild(el);
        setTimeout(function () {
            el.style.opacity = '0';
            el.style.transition = 'opacity 0.3s';
            setTimeout(function () { el.remove(); }, 300);
        }, duration);
    }

    function dataUrlToBlob(dataUrl) {
        var parts = dataUrl.split(',');
        var mime = parts[0].match(/:(.*?);/)[1];
        var bytes = atob(parts[1]);
        var arr = new Uint8Array(bytes.length);
        for (var i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
        return new Blob([arr], { type: mime });
    }

    function sleep(ms) {
        return new Promise(function (r) { setTimeout(r, ms); });
    }
});
