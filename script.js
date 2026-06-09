// --- 1. AMBIL PARAMETER NAMA TAMU DARI URL ---
function dapatkanNamaTamu() {
    const urlParams = new URLSearchParams(window.location.search);
    const namaTamu = urlParams.get('tamu');
    const elemenTamu = document.getElementById('nama-tamu');
    
    if (namaTamu) {
        // Mengganti karakter '+' atau '%20' secara otomatis menjadi spasi biasa
        elemenTamu.textContent = decodeURIComponent(namaTamu);
    } else {
        elemenTamu.textContent = "Tamu Undangan";
    }
}

// --- 2. LOGIKA TOMBOL BUKA UNDANGAN & TRANSISI ---
const btnBuka = document.getElementById('btn-buka');
const coverSection = document.getElementById('cover');
const mainContent = document.getElementById('main-content');

btnBuka.addEventListener('click', () => {
    // Jalankan animasi fade out pada cover
    coverSection.classList.add('fade-out');
    
    // Munculkan konten utama setelah animasi cover berjalan
    mainContent.classList.remove('hidden');
    
    // Cegah scrollbar tersembunyi jika sebelumnya dikunci
    document.body.style.overflowY = "auto";
    
    // Picu inisialisasi scroll animation untuk section pertama
    pemicuScrollAnimation();
});


// --- 3. COUNTDOWN REALTIME TIMEDOWN ---
function hitungMundurHariH() {
    // Set tanggal target pernikahan: 07 Juli 2027 08:00:00 WIB
    const tanggalTarget = new Date("July 7, 2027 08:00:00").getTime();

    const interval = setInterval(() => {
        const sekarang = new Date().getTime();
        const selisihWaktu = tanggalTarget - sekarang;

        // Perhitungan waktu matematika dasar
        const hari = Math.floor(selisihWaktu / (1000 * 60 * 60 * 24));
        const jam = Math.floor((selisihWaktu % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const menit = Math.floor((selisihWaktu % (1000 * 60 * 60)) / (1000 * 60));
        const detik = Math.floor((selisihWaktu % (1000 * 60)) / 1000);

        // Inject data ke element HTML
        document.getElementById('days').textContent = hari < 10 ? '0' + hari : hari;
        document.getElementById('hours').textContent = jam < 10 ? '0' + jam : jam;
        document.getElementById('minutes').textContent = menit < 10 ? '0' + menit : menit;
        document.getElementById('seconds').textContent = detik < 10 ? '0' + detik : detik;

        // Jika hitung mundur selesai
        if (selisihWaktu < 0) {
            clearInterval(interval);
            document.getElementById('days').textContent = "00";
            document.getElementById('hours').textContent = "00";
            document.getElementById('minutes').textContent = "00";
            document.getElementById('seconds').textContent = "00";
        }
    }, 1000);
}


// --- 4. TOMBOL SALIN REKENING ---
function salinRekening() {
    const nomorRekening = document.getElementById('no-rek').innerText;
    
    // Menggunakan Clipboard API modern
    navigator.clipboard.writeText(nomorRekening).then(() => {
        alert("Nomor rekening Bank BRI berhasil disalin ke memori clipboard Anda!");
    }).catch(err => {
        console.error('Gagal menyalin text: ', err);
    });
}


// --- 5. MANAGEMENT FORM RSVP & UCAPAN VIA LOCALSTORAGE ---
const formRsvp = document.getElementById('form-rsvp');
const formUcapan = document.getElementById('form-ucapan');
const containerUcapan = document.getElementById('container-ucapan');

// Memuat data ucapan lama yang ada di localStorage saat web dibuka
function muatUcapan() {
    containerUcapan.innerHTML = '';
    let listUcapan = JSON.parse(localStorage.getItem('undangan_ucapan')) || [];
    
    // Balik urutan agar ucapan terbaru muncul paling atas
    listUcapan.reverse().forEach(item => {
        const div = document.createElement('div');
        div.className = 'ucapan-item';
        div.innerHTML = `<h5>${item.nama}</h5><p>${item.pesan}</p>`;
        containerUcapan.appendChild(div);
    });
}

// Handler Submit Form RSVP
formRsvp.addEventListener('submit', (e) => {
    e.preventDefault();
    const nama = document.getElementById('rsvp-name').value;
    const status = document.getElementById('rsvp-status').value;
    const jumlahTamu = document.getElementById('rsvp-tamu').value;

    const dataRsvp = { nama, status, jumlahTamu };
    
    // Simpan ke localStorage data rsvp terpisah
    let listRsvp = JSON.parse(localStorage.getItem('undangan_rsvp')) || [];
    listRsvp.push(dataRsvp);
    localStorage.setItem('undangan_rsvp', JSON.stringify(listRsvp));

    alert(`Terima kasih ${nama}, konfirmasi RSVP (${status}) Anda telah berhasil disimpan.`);
    formRsvp.reset();
});

// Handler Submit Form Ucapan Doa
formUcapan.addEventListener('submit', (e) => {
    e.preventDefault();
    const nama = document.getElementById('ucapan-nama').value;
    const pesan = document.getElementById('ucapan-pesan').value;

    const dataUcapan = { nama, pesan };
    
    let listUcapan = JSON.parse(localStorage.getItem('undangan_ucapan')) || [];
    listUcapan.push(dataUcapan);
    localStorage.setItem('undangan_ucapan', JSON.stringify(listUcapan));

    alert("Pesan doa restu Anda telah diteruskan ke mempelai!");
    formUcapan.reset();
    muatUcapan(); // Refresh feed tampilan ucapan
});


// --- 6. FLOATING NAVIGATION ACTIVE LINK ON SCROLL ---
const sections = document.querySelectorAll('main section');
const navItems = document.querySelectorAll('.floating-nav .nav-item');

window.addEventListener('scroll', () => {
    let currentSectionId = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        // Memberikan threshold toleransi deteksi scroll 150px
        if (pageYOffset >= (sectionTop - 150)) {
            currentSectionId = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').includes(currentSectionId)) {
            item.classList.add('active');
        }
    });
    
    pemicuScrollAnimation();
});


// --- 7. SCROLL FADE-IN ANIMATION FOR SECTIONS ---
function pemicuScrollAnimation() {
    const elemenFade = document.querySelectorAll('.fade-in-element');
    
    elemenFade.forEach(elemen => {
        const posisiElemen = elemen.getBoundingClientRect().top;
        const tinggiLayar = window.innerHeight;
        
        // Jika posisi elemen sudah masuk batas area pandang layar
        if (posisiElemen < tinggiLayar - 100) {
            elemen.classList.add('appear');
        }
    });
}


// --- 8. INITIAL FUNCTION RUNNING ---
document.addEventListener('DOMContentLoaded', () => {
    // Kunci scroll halaman ketika masih di cover utama
    document.body.style.overflowY = "hidden";
    
    dapatkanNamaTamu();
    hitungMundurHariH();
    muatUcapan();
});