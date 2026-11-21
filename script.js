function checkQuiz() {const v = document.querySelector('input[name="quiz"]:checked'); const r = document.getElementById('quizResult'); if (!v) {r.textContent = 'Bạn hãy chọn một đáp án trước nhé.'; return } r.textContent = v.value === 'b' ? 'Chính xác! Văn chương mở rộng sự thấu cảm và giúp ta nhìn đời sống từ nhiều góc độ.' : 'Chưa đúng. Hãy thử nghĩ rộng hơn về những điều ta nhận được khi đọc một tác phẩm.'}
        function speakText() {if (!('speechSynthesis' in window)) {showToast('Trình duyệt chưa hỗ trợ chức năng đọc văn bản.'); return } speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(document.getElementById('audioText').value); u.lang = 'vi-VN'; u.rate = .92; speechSynthesis.speak(u)}
        function showToast(t) {const el = document.getElementById('toast'); el.textContent = t; el.classList.add('show'); clearTimeout(window.toastTimer); window.toastTimer = setTimeout(() => el.classList.remove('show'), 3500)}
        const REFLECTION_API_URL = 'https://script.google.com/macros/s/AKfycbxYMw-AJ3Ec793MU9-_s32kphC5T4VpgEddkcIQKdieCj3-tJwEsdGur-zWnYh3FNqg/exec';
        function submitReflection(e) {
            e.preventDefault();
            const form = e.target, name = document.getElementById('reader').value.trim(), thought = document.getElementById('thought').value.trim(), website = document.getElementById('website').value;
            if (!name || !thought) {showToast('Vui lòng nhập tên và cảm nhận.'); return }
            if (REFLECTION_API_URL.includes('PASTE_YOUR_')) {showToast('Chức năng đang chờ quản trị viên cấu hình kết nối.'); return }
            const params = new URLSearchParams({name, thought, website});
            const btn = form.querySelector('button[type="submit"]'); btn.disabled = true; btn.textContent = 'Đang gửi…';
            fetch(REFLECTION_API_URL, {method: 'POST', mode: 'no-cors', body: params})
                .then(() => {showToast('Cảm ơn ' + name + '! Cảm nhận đã được gửi và đang chờ duyệt.'); form.reset();})
                .catch(() => showToast('Chưa gửi được. Vui lòng thử lại sau.'))
                .finally(() => {btn.disabled = false; btn.textContent = 'Gửi cảm nhận ↗'});
        }
        function loadApprovedReflections() {
            if (REFLECTION_API_URL.includes('PASTE_YOUR_')) return;
            const cb = 'reflectionCallback_' + Date.now();
            window[cb] = data => {
                const root = document.getElementById('approvedReflections');
                if (!root) return;
                root.replaceChildren();
                if (!data.items || !data.items.length) {root.innerHTML = '<p style="color:var(--muted);font-size:13px">Chưa có cảm nhận được công khai.</p>'; return }
                data.items.forEach(item => {const article = document.createElement('article'); article.className = 'approved-item'; const title = document.createElement('strong'); title.textContent = item.name; const body = document.createElement('p'); body.textContent = item.thought; article.append(title, body); root.append(article)});
                delete window[cb]; script.remove();
            };
            const script = document.createElement('script'); script.src = REFLECTION_API_URL + '?callback=' + cb; script.onerror = () => {delete window[cb]}; document.body.append(script);
        }
        loadApprovedReflections();
        document.querySelectorAll('.navlinks a').forEach(a => a.addEventListener('click', () => document.querySelector('.navlinks').classList.remove('open')));
