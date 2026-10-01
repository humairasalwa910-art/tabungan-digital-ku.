// Mengambil data transaksi dari localStorage
let transaksi = JSON.parse(localStorage.getItem("transaksi")) || [];


// Elemen HTML
const formTransaksi = document.getElementById("formTransaksi");
const jenisInput = document.getElementById("jenis");
const jumlahInput = document.getElementById("jumlah");
const keteranganInput = document.getElementById("keterangan");

const saldoElement = document.getElementById("saldo");
const totalSetoranElement = document.getElementById("totalSetoran");
const totalPenarikanElement = document.getElementById("totalPenarikan");
const riwayatElement = document.getElementById("riwayat");


// Format angka menjadi Rupiah
function formatRupiah(angka) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(angka);
}


// Menyimpan transaksi ke localStorage
function simpanData() {
    localStorage.setItem("transaksi", JSON.stringify(transaksi));
}


// Menampilkan data
function tampilkanData() {
    let totalSetoran = 0;
    let totalPenarikan = 0;

    riwayatElement.innerHTML = "";

    if (transaksi.length === 0) {
        riwayatElement.innerHTML =
            '<p class="empty">Belum ada transaksi.</p>';
    }

    transaksi.forEach((item, index) => {

        if (item.jenis === "setoran") {
            totalSetoran += item.jumlah;
        } else {
            totalPenarikan += item.jumlah;
        }

        const transaksiElement = document.createElement("div");

        transaksiElement.classList.add("transaksi");

        transaksiElement.innerHTML = `
            <div class="transaksi-info">
                <h4>${item.keterangan}</h4>
                <small>${item.tanggal}</small>
            </div>

            <div>
                <span class="nominal ${item.jenis}">
                    ${item.jenis === "setoran" ? "+" : "-"}
                    ${formatRupiah(item.jumlah)}
                </span>

                <button
                    class="btn-hapus"
                    onclick="hapusTransaksi(${index})"
                >
                    Hapus
                </button>
            </div>
        `;

        riwayatElement.appendChild(transaksiElement);
    });


    // Menghitung saldo
    const saldo = totalSetoran - totalPenarikan;


    // Menampilkan hasil
    saldoElement.textContent = formatRupiah(saldo);
    totalSetoranElement.textContent = formatRupiah(totalSetoran);
    totalPenarikanElement.textContent = formatRupiah(totalPenarikan);
}


// Menambahkan transaksi
formTransaksi.addEventListener("submit", function(event) {

    event.preventDefault();

    const jenis = jenisInput.value;
    const jumlah = Number(jumlahInput.value);
    const keterangan =
        keteranganInput.value.trim() || "Transaksi";

    // Validasi jumlah
    if (jumlah <= 0) {
        alert("Jumlah harus lebih dari 0.");
        return;
    }


    // Cek saldo untuk penarikan
    const saldoSekarang = transaksi.reduce((total, item) => {
        if (item.jenis === "setoran") {
            return total + item.jumlah;
        } else {
            return total - item.jumlah;
        }
    }, 0);


    if (jenis === "penarikan" && jumlah > saldoSekarang) {
        alert("Saldo tidak mencukupi untuk melakukan penarikan.");
        return;
    }


    // Membuat data transaksi
    const dataBaru = {
        jenis: jenis,
        jumlah: jumlah,
        keterangan: keterangan,
        tanggal: new Date().toLocaleString("id-ID")
    };


    // Menambahkan ke array
    transaksi.push(dataBaru);


    // Simpan data
    simpanData();


    // Tampilkan ulang
    tampilkanData();


    // Reset form
    formTransaksi.reset();
});


// Menghapus transaksi
function hapusTransaksi(index) {

    const konfirmasi = confirm(
        "Apakah Anda yakin ingin menghapus transaksi ini?"
    );

    if (konfirmasi) {
        transaksi.splice(index, 1);

        simpanData();

        tampilkanData();
    }
}


// Tampilkan data ketika halaman dibuka
tampilkanData();
