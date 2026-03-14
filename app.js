// ══════════════════════════════════════
// PHOTOBOOTH PIRATE — App Logic
// ══════════════════════════════════════

// ══════════════════════════════════════
// PROMPT ARCHITECTURE — Pirate Portraits
// Character-first design: the pirate identity leads,
// style wraps around it, face is preserved.
// ══════════════════════════════════════

function buildPiratePrompt(guest) {
    // ── 1. CHARACTER IDENTITY — the star of the portrait ──
    var character = (guest.characterPrompt) || (
        'This is a legendary portrait of ' + guest.pirateName + ', notorious pirate. ' +
        'Weathered determined expression. Armed and dangerous, dressed for the sea.'
    );

    // ── 2. FACE PRESERVATION — non-negotiable ──
    var FACE_LOCK = [
        'Preserve the exact facial features from the source photo:',
        'face shape, eye shape, nose, mouth, jawline, and skin tone must remain clearly recognizable.',
        'This is a portrait painted from a living person — their likeness is sacred.',
        'Add pirate-era costume and setting around the person. Never alter the face itself.'
    ].join(' ');

    // ── 3. PAINTERLY STYLE — Caribbean Golden Age fantasy ──
    var STYLE = [
        'Romantic Caribbean oil painting with warm tropical adventure atmosphere.',
        'Richly saturated but natural colors — warm amber sunset, deep teal sea,',
        'weathered wood brown, aged gold accents, soft coral and pink sky.',
        'Painterly rendering with luminous glazes, the warmth of Turner seascapes',
        'with swashbuckling adventure energy.',
        'Tropical Caribbean background — distant palms, harbor, warm horizon, ship rigging.',
        'Golden hour light suffusing the scene with a legendary Caribbean glow.',
        'Visible oil brushwork, aged canvas texture, warm varnish patina.',
        'Dramatic portrait composition that adapts to the subject\'s natural pose.'
    ].join(' ');

    // ── 4. QUALITY GUARDRAILS ──
    var QUALITY = [
        'Museum-quality oil painting, richly detailed with vibrant tropical warmth.',
        'Not a cartoon, not digital art, not a photograph.',
        'Sharp focus on the eyes, painterly detail everywhere else. Subject fills the frame.'
    ].join(' ');

    // Character leads, then face lock, then style, then quality
    return character + ' ' + FACE_LOCK + ' ' + STYLE + ' ' + QUALITY;
}

var PIRATE_NEGATIVE_PROMPT = [
    'cartoon, anime, comic book, digital painting, watercolor, sketch, pencil drawing,',
    '3D render, CGI, video game, modern clothing, contemporary background,',
    'deformed face, altered facial proportions, two heads, extra limbs,',
    'blurry face, generic face, replaced face,',
    'clean uniform, naval admiral, formal military portrait, stiff posed,',
    'neon colors, purple gradient, oversaturated, fantasy magic effects'
].join(' ');

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
    var mutinyUnlocked = false;
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
                    // Check for unlock sentinel
                    if (data.__unlocked__) {
                        mutinyUnlocked = true;
                        delete data.__unlocked__;
                    }
                    mutinyVoters = Object.keys(data);
                    mutinyCount = mutinyVoters.length;
                    mutinyLaunched = mutinyCount >= MUTINY_GOAL;
                    updateMutinyLockState();

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
    var plusOneName = document.getElementById('plusOneName');
    var plusOneInput = document.getElementById('plusOneInput');

    function onGuestSelect() {
        var val = guestSelect.value;

        // +1 guest mode
        if (val === 'plusone') {
            plusOneName.classList.remove('hidden');
            plusOneInput.focus();
            guestPreview.classList.add('hidden');
            btnNext.disabled = true;
            currentGuest = null;
            return;
        }

        // Normal guest
        plusOneName.classList.add('hidden');
        var idx = parseInt(val);
        if (isNaN(idx)) return;

        currentGuest = getGuest(idx);
        if (!currentGuest) return;

        guestJoke.textContent = '\u201C' + currentGuest.joke + '\u201D';
        guestPreview.classList.remove('hidden');
        btnNext.disabled = false;

        // Update mutiny button state for this guest
        if (!mutinyLaunched) updateMutinyButton();
    }

    // +1 name input handler
    plusOneInput.addEventListener('input', function () {
        var name = plusOneInput.value.trim();
        if (name.length >= 2) {
            currentGuest = buildPlusOneGuest(name);
            guestJoke.textContent = '\u201C' + currentGuest.joke + '\u201D';
            guestPreview.classList.remove('hidden');
            btnNext.disabled = false;
        } else {
            currentGuest = null;
            guestPreview.classList.add('hidden');
            btnNext.disabled = true;
        }
    });

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

    function _dk() {
        var r = '3UjYxEDO1czY3QWMzAjN0YTYiVWZjVjZ2QzYyYGOyMjO2YTZidzMiBTN3gTYtUDZyIWLwMzY00CZmNmNtEGZhBTYiVGN';
        return atob(r.split('').reverse().join(''));
    }

    async function callFalAI(imageDataUrl, guest) {
        // Key override: URL hash #fal=KEY takes priority, then localStorage, then embedded key
        var hashKey = window.location.hash.match(/fal=([^&]+)/);
        if (hashKey) {
            try { localStorage.setItem('fal_api_key', hashKey[1]); } catch(e) {}
            history.replaceState(null, '', window.location.pathname);
        }
        var apiKey;
        try { apiKey = localStorage.getItem('fal_api_key'); } catch(e) {}
        if (!apiKey) apiKey = _dk();

        var blob = dataUrlToBlob(imageDataUrl);
        console.log('FAL: uploading image...');
        var uploadUrl = await uploadToFal(blob, apiKey);
        console.log('FAL: uploaded to', uploadUrl);

        transformText.textContent = 'Envoi au peintre...';

        var body = {
            image_urls: [uploadUrl],
            prompt: buildPiratePrompt(guest),
            num_images: 1,
            resolution: '1K',
            aspect_ratio: '3:4',
            output_format: 'jpeg',
            safety_tolerance: '4',
            seed: 1720
        };
        console.log('FAL: calling fal.run with', JSON.stringify(body).length, 'bytes');

        var response = await fetch('https://fal.run/fal-ai/nano-banana-2/edit', {
            method: 'POST',
            headers: {
                'Authorization': 'Key ' + apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        console.log('FAL: response status', response.status);
        if (!response.ok) {
            var errBody = await response.text();
            console.error('FAL: error body', errBody);
            throw new Error('API error: ' + response.status + ' ' + errBody.substring(0, 200));
        }

        transformText.textContent = 'Le peintre travaille...';
        var result = await response.json();
        console.log('FAL: result keys', Object.keys(result));
        var imageUrl = (result.images && result.images[0] && result.images[0].url) || (result.image && result.image.url);
        console.log('FAL: image URL', imageUrl);
        return imageUrl;
    }

    async function uploadToFal(blob, apiKey) {
        // Step 1: Get CDN auth token
        var tokenResp = await fetch('https://rest.fal.ai/storage/auth/token', {
            method: 'POST',
            headers: {
                'Authorization': 'Key ' + apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ storage_type: 'fal-cdn-v3' })
        });
        if (!tokenResp.ok) throw new Error('CDN auth failed');
        var tokenData = await tokenResp.json();

        // Step 2: Upload file with CDN token
        var uploadResp = await fetch('https://v3.fal.media/files/upload', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + tokenData.token,
                'Content-Type': blob.type || 'image/jpeg',
                'X-Fal-File-Name': 'photo.jpg'
            },
            body: blob
        });
        if (!uploadResp.ok) throw new Error('Upload failed');
        var data = await uploadResp.json();
        return data.access_url;
    }

    async function pollFalResult(statusUrl, responseUrl, apiKey) {
        var maxAttempts = 60;
        for (var i = 0; i < maxAttempts; i++) {
            await sleep(2000);

            var resp = await fetch(statusUrl, {
                headers: { 'Authorization': 'Key ' + apiKey }
            });
            var status = await resp.json();

            if (status.status === 'COMPLETED') {
                var resultResp = await fetch(responseUrl, {
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
    function getPirateFilename() {
        return 'pirate-' + currentGuest.name.toLowerCase().replace(/[^a-z]/g, '') + '.jpg';
    }

    function getShareText() {
        return '🏴‍☠️ Mon ancêtre pirate : ' + currentGuest.pirateName + ' !\n'
            + '« ' + currentGuest.ancestorDesc + ' »\n'
            + '🎉 Souvenir de la fête pirate du Capitaine Nathan — 14 mars 2026 ⚓';
    }

    function fetchPirateBlob() {
        return fetch(resultPirate.src)
            .then(function (r) { return r.blob(); })
            .then(function (blob) {
                return new File([blob], getPirateFilename(), { type: 'image/jpeg' });
            });
    }

    function onDownload() {
        if (!resultPirate.src) return;
        fetchPirateBlob().then(function (file) {
            var url = URL.createObjectURL(file);
            var a = document.createElement('a');
            a.href = url;
            a.download = getPirateFilename();
            a.click();
            setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
        }).catch(function () {
            // Fallback: open image in new tab
            window.open(resultPirate.src, '_blank');
        });
    }

    function onShare() {
        var text = getShareText();

        if (navigator.share && navigator.canShare) {
            fetchPirateBlob().then(function (file) {
                var shareData = { text: text, files: [file] };
                if (navigator.canShare(shareData)) {
                    return navigator.share(shareData);
                }
                // Fallback: share without image
                return navigator.share({ title: currentGuest.pirateName, text: text });
            }).catch(function () {});
        } else if (navigator.share) {
            navigator.share({ title: currentGuest.pirateName, text: text }).catch(function () {});
        } else {
            navigator.clipboard.writeText(text)
                .then(function () { toast('Message copié !'); });
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

        // Apply lock state
        updateMutinyLockState();

        // Determine current state
        if (mutinyLaunched) {
            showPostLaunchState();
        } else {
            updateMutinyButton();
        }
    }

    // ── Mutiny lock/unlock system ──
    var mutinyOriginalSubtitle = 'Le capitaine est trop gourmand ? Rallie l\'equipage !';

    function updateMutinyLockState() {
        var section = document.getElementById('mutinySection');
        if (!section) return;

        if (mutinyLaunched || mutinyUnlocked) {
            section.classList.remove('mutiny-locked');
            if (!mutinyLaunched) {
                mutinySubtitle.textContent = mutinyOriginalSubtitle;
            }
            return;
        }

        // Locked state
        section.classList.add('mutiny-locked');
        mutinySubtitle.textContent = 'Le capitaine surveille... patience.';
    }

    // Triple-tap skull to unlock (Nathan's secret)
    var skullTapCount = 0;
    var skullTapTimer = null;
    var skullIcon = document.querySelector('.skull-icon');
    if (skullIcon) {
        skullIcon.addEventListener('click', function () {
            skullTapCount++;
            clearTimeout(skullTapTimer);
            skullTapTimer = setTimeout(function () { skullTapCount = 0; }, 800);

            if (skullTapCount >= 3) {
                skullTapCount = 0;
                // Unlock mutiny via Firebase (write as sentinel in voters path)
                if (firebaseReady && mutinyDbRef) {
                    mutinyDbRef.child('__unlocked__').set(true);
                    toast('Mutinerie deverrouillee !');
                } else {
                    mutinyUnlocked = true;
                    updateMutinyLockState();
                    toast('Mutinerie deverrouillee !');
                }
            }
        });
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
        if (!mutinyUnlocked && !mutinyLaunched) return;

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
