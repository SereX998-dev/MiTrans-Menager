// ==========================
// STORAGE
// ==========================

function readStorageArray(key) {
    try {
        const value = JSON.parse(localStorage.getItem(key));
        return Array.isArray(value) ? value : [];
    } catch (error) {
        console.warn(`Nie udało się odczytać ${key} z localStorage.`, error);
        return [];
    }
}

let cmrDocuments = readStorageArray("cmrDocuments");

// ==========================
// ELEMENTY DOM
// ==========================

const modal = document.getElementById("cmrModal");
const newCMRBtn = document.getElementById("newCMRBtn");
const closeModal = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");
const printCmrBtn = document.getElementById("printCmrBtn");

const form = document.getElementById("cmrForm");

const tableBody =
    document.getElementById("cmrTableBody");

const searchInput =
    document.getElementById("searchInput");

const goodsContainer =
    document.getElementById("goodsContainer");

const addItemBtn =
    document.getElementById("addItemBtn");

const viewModal =
    document.getElementById("viewModal");

const closeViewModal =
    document.getElementById("closeViewModal");

const viewDocContent =
    document.getElementById("viewDocContent");

const viewSender =
    document.getElementById("viewSender");

const viewSenderName =
    document.getElementById("viewSenderName");

const viewReceiver =
    document.getElementById("viewReceiver");

const viewReceiverName =
    document.getElementById("viewReceiverName");

const viewCarrier =
    document.getElementById("viewCarrier");

const viewVehicle =
    document.getElementById("viewVehicle");

const viewDistanceKm =
    document.getElementById("viewDistanceKm");

const viewFuelRefilled =
    document.getElementById("viewFuelRefilled");

const viewOtherCosts =
    document.getElementById("viewOtherCosts");

const viewDate =
    document.getElementById("viewDate");

const viewUnloadingDate =
    document.getElementById("viewUnloadingDate");

const viewLoadingLocation =
    document.getElementById("viewLoadingLocation");

const viewDeliveryLocation =
    document.getElementById("viewDeliveryLocation");

const viewSenderInstructions =
    document.getElementById("viewSenderInstructions");

const viewGoodsList =
    document.getElementById("viewGoodsList");

const viewRoadCardModal =
    document.getElementById("viewRoadCardModal");

const closeViewRoadCardModal =
    document.getElementById("closeViewRoadCardModal");

const viewRoadStart =
    document.getElementById("viewRoadStart");

const viewRoadEnd =
    document.getElementById("viewRoadEnd");

const viewRoadStartDateTime =
    document.getElementById("viewRoadStartDateTime");

const viewRoadEndDateTime =
    document.getElementById("viewRoadEndDateTime");

const viewRoadDriver =
    document.getElementById("viewRoadDriver");

const viewRoadVehicle =
    document.getElementById("viewRoadVehicle");

const viewRoadDistanceKm =
    document.getElementById("viewRoadDistanceKm");

const viewRoadFuelRefilled =
    document.getElementById("viewRoadFuelRefilled");

const viewRoadOtherCosts =
    document.getElementById("viewRoadOtherCosts");

const viewRoadCreatedBy =
    document.getElementById("viewRoadCreatedBy");

const contractorLinks =
    document.querySelectorAll("[data-section]");

const documentsSection =
    document.getElementById("documentsSection");

const roadCardsSection =
    document.getElementById("roadCardsSection");

const contractorsSection =
    document.getElementById("contractorsSection");

const fleetSection =
    document.getElementById("fleetSection");

const truckFleetTableBody =
    document.getElementById("truckFleetTableBody");

const autokarFleetTableBody =
    document.getElementById("autokarFleetTableBody");

const trailerFleetTableBody =
    document.getElementById("trailerFleetTableBody");

const driverForm =
    document.getElementById("driverForm");

const newRoadCardBtn =
    document.getElementById("newRoadCardBtn");

const roadCardModal =
    document.getElementById("roadCardModal");

const closeRoadCardModal =
    document.getElementById("closeRoadCardModal");

const roadCardForm =
    document.getElementById("roadCardForm");

const roadCardFieldsContainer =
    document.getElementById("roadCardFieldsContainer");

const roadCardTabHeader =
    document.getElementById("roadCardTabHeader");

const roadCardTypeButtons =
    document.querySelectorAll('.road-card-type-btn');

const cancelRoadCardBtn =
    document.getElementById("cancelRoadCardBtn");

const roadCardsTableBody =
    document.getElementById("roadCardsTableBody");

const driverSearchInput =
    document.getElementById("driverSearchInput");

const roadCardSearchInput =
    document.getElementById("roadCardSearchInput");

const openDriverModalBtn =
    document.getElementById("openDriverModalBtn");

const driverModal =
    document.getElementById("driverModal");

const closeDriverModal =
    document.getElementById("closeDriverModal");

const addVehicleBtn =
    document.getElementById("addVehicleBtn");

const driverCancelEditBtn =
    document.getElementById("driverCancelEditBtn");

const driverEditInfo =
    document.getElementById("driverEditInfo");

const driverEditName =
    document.getElementById("driverEditName");

const vehicleFieldsContainer =
    document.getElementById("vehicleFieldsContainer");

const trailerFieldsContainer =
    document.getElementById("trailerFieldsContainer");

const addTrailerBtn =
    document.getElementById("addTrailerBtn");

const driverType =
    document.getElementById("driverType");

const trailerSection =
    document.querySelector(".trailer-section");

const logoutBtn =
    document.getElementById("logoutBtn");

function updateTrailerVisibility() {
    const showTrailer = driverType && (driverType.value === "Ciężarówka" || driverType.value === "Obie");
    if (trailerSection) {
        trailerSection.classList.toggle("hidden", !showTrailer);
    }

    if (!showTrailer && trailerFieldsContainer) {
        trailerFieldsContainer.innerHTML = "";
    }

    if (showTrailer && trailerFieldsContainer) {
        if (trailerFieldsContainer.querySelectorAll(".trailer-card").length === 0) {
            trailerFieldsContainer.appendChild(createTrailerCard());
        }
    }
}

if (driverType) {
    driverType.addEventListener("change", updateTrailerVisibility);
}

const userStatus =
    document.getElementById("userStatus");

const themeSwitch =
    document.getElementById("themeSwitch");

let currentUser = {
    username: "admin",
    role: "admin"
};

let users = readStorageArray("cmrUsers");
if (users.length === 0) {
    users = [{ username: "admin", password: "admin123", role: "admin" }];
}

function saveUsers() {
    localStorage.setItem("cmrUsers", JSON.stringify(users));
}

saveUsers();

const driversTableBody =
    document.getElementById("driversTableBody");

const savedTheme = localStorage.getItem("cmrTheme") || "light";

if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    if (themeSwitch) {
        themeSwitch.checked = true;
    }
}

if (themeSwitch) {
    themeSwitch.addEventListener("change", () => {
        document.body.classList.toggle("dark-theme", themeSwitch.checked);
        localStorage.setItem("cmrTheme", themeSwitch.checked ? "dark" : "light");
    });
}

let drivers = readStorageArray("cmrDrivers");
let roadCards = readStorageArray("roadCards");

let editingDriverIndex = null;

function getVisibleCMRDocuments() {
    if (currentUser && currentUser.role !== "admin") {
        return cmrDocuments.filter(doc => doc.createdBy === currentUser.username);
    }
    return cmrDocuments;
}

function getVisibleRoadCards() {
    if (currentUser && currentUser.role !== "admin") {
        return roadCards.filter(card => card.createdBy === currentUser.username);
    }
    return roadCards;
}

function normalizeExistingData() {
    let updated = false;

    cmrDocuments = cmrDocuments.map(doc => {
        const normalized = { ...doc, createdBy: doc.createdBy || "admin", goods: Array.isArray(doc.goods) ? doc.goods : [] };
        if (JSON.stringify(normalized) !== JSON.stringify(doc)) updated = true;
        return normalized;
    });

    roadCards = roadCards.map(card => {
        const normalized = { ...card, createdBy: card.createdBy || "admin" };
        if (JSON.stringify(normalized) !== JSON.stringify(card)) updated = true;
        return normalized;
    });

    drivers = drivers.map(driver => {
        const normalized = { ...driver, vehicles: Array.isArray(driver.vehicles) ? driver.vehicles : [], trailers: Array.isArray(driver.trailers) ? driver.trailers : [] };
        if (JSON.stringify(normalized) !== JSON.stringify(driver)) updated = true;
        return normalized;
    });

    if (updated) {
        saveStorage();
        saveRoadCards();
    }
}

normalizeExistingData();

// ==========================
// MODAL
// ==========================

function openModal() {
    modal.classList.remove("hidden");
}

function closeModalWindow() {
    modal.classList.add("hidden");
}

if (newCMRBtn) newCMRBtn.addEventListener("click", openModal);

if (closeModal) closeModal.addEventListener("click", closeModalWindow);

if (cancelBtn) cancelBtn.addEventListener("click", closeModalWindow);

if (printCmrBtn) {
    printCmrBtn.addEventListener("click", function () {
        window.print();
    });
}

if (closeViewModal) closeViewModal.addEventListener("click", closeViewModalWindow);

if (closeViewRoadCardModal) {
    closeViewRoadCardModal.addEventListener("click", function () {
        if (viewRoadCardModal) {
            viewRoadCardModal.classList.add("hidden");
        }
    });
}

function showApp(){
    const app = document.querySelector(".app");
    if (app) {
        app.classList.remove("hidden");
    }
}

function showLogin(){
    showApp();
}

function updateInterface() {
    if (!currentUser) {
        return;
    }

    if (userStatus) userStatus.innerText = `Zalogowany: ${currentUser.username} (${currentUser.role})`;

    if (openDriverModalBtn) openDriverModalBtn.classList.toggle("hidden", currentUser.role !== "admin");

    renderDrivers();
    renderTable();
    renderRoadCards();
    updateStats();
}

function openDriverModal() {
    if (driverModal) {
        driverModal.classList.remove("hidden");
    }
}

function closeDriverModalWindow() {
    if (driverModal) {
        driverModal.classList.add("hidden");
    }
    setDriverFormMode(null);
}

contractorLinks.forEach(link => {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        const target = this.getAttribute("data-section");

        contractorLinks.forEach(el =>
            el.classList.toggle("active",
                el.getAttribute("data-section") === target
            )
        );

        documentsSection.classList.toggle("hidden", target !== "documentsSection");
        roadCardsSection.classList.toggle("hidden", target !== "roadCardsSection");
        contractorsSection.classList.toggle("hidden", target !== "contractorsSection");
        fleetSection.classList.toggle("hidden", target !== "fleetSection");
    });
});

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function openViewModal() {
    viewModal.classList.remove("hidden");
}

function closeViewModalWindow() {
    viewModal.classList.add("hidden");
}

function viewCMR(id) {
    const doc = cmrDocuments.find(
        item => item.id === id
    );

    if (!doc) {
        return;
    }

    document.getElementById("viewDocumentNumberBadge").innerText = doc.number || "";
    viewSenderName.innerText = doc.senderName || "";
    viewSender.innerText = doc.sender;
    viewReceiverName.innerText = doc.receiverName || "";
    viewReceiver.innerText = doc.receiver;
    viewLoadingLocation.innerText = doc.loadingLocation || "";
    viewDeliveryLocation.innerText = doc.deliveryLocation || "";
    viewCarrier.innerText = doc.carrier;
    viewVehicle.innerText = doc.vehicle;
    viewDistanceKm.innerText = doc.distanceKm || "";
    viewFuelRefilled.innerText = doc.fuelRefilled || "";
    viewOtherCosts.innerText = doc.otherCosts || "";
    viewDate.innerText = doc.date;
    viewUnloadingDate.innerText = doc.unloadingDate || "";
    viewSenderInstructions.innerText = doc.senderInstructions || "";

    const goods = Array.isArray(doc.goods) ? doc.goods : [];

    if (goods.length === 0) {
        viewGoodsList.innerHTML =
            "<p class=\"view-empty\">Brak pozycji towarowych</p>";
    } else {
        viewGoodsList.innerHTML = goods
            .map(item => `
                <div class="view-good-item">
                    <div>
                        <span class="view-label">Nazwa:</span>
                        <span>${escapeHtml(item.name)}</span>
                    </div>
                    <div>
                        <span class="view-label">Numer towaru:</span>
                        <span>${escapeHtml(item.number)}</span>
                    </div>
                    <div>
                        <span class="view-label">Sposób pakowania:</span>
                        <span>${escapeHtml(item.packing)}</span>
                    </div>
                    <div>
                        <span class="view-label">Ilość:</span>
                        <span>${escapeHtml(item.qty)}</span>
                    </div>
                    <div>
                        <span class="view-label">Waga (kg):</span>
                        <span>${escapeHtml(item.weight)}</span>
                    </div>
                    <div>
                        <span class="view-label">Objętość (m³):</span>
                        <span>${escapeHtml(item.volume)}</span>
                    </div>
                </div>
            `)
            .join("");
    }

    openViewModal();
}

function openViewRoadCardModal() {
    if (viewRoadCardModal) {
        viewRoadCardModal.classList.remove("hidden");
    }
}

function viewRoadCard(id) {
    const card = roadCards.find(item => item.id === id);
    if (!card) return;

    document.getElementById("viewRoadNumberBadge").innerText = card.number || "";
    if (viewRoadStart) viewRoadStart.innerText = card.start || "";
    viewRoadEnd.innerText = card.end || "";
    viewRoadStartDateTime.innerText = card.startDateTime || "";
    viewRoadEndDateTime.innerText = card.endDateTime || "";
    viewRoadDriver.innerText = card.driver || "";
    viewRoadVehicle.innerText = card.vehicle || "";
    viewRoadDistanceKm.innerText = card.distanceKm || "";
    viewRoadFuelRefilled.innerText = card.fuelRefilled || "";
    viewRoadOtherCosts.innerText = card.otherCosts || "";
    viewRoadCreatedBy.innerText = card.createdBy || "admin";

    openViewRoadCardModal();
}

// ==========================
// NUMER CMR
// ==========================

function generateCMRNumber() {
    const maxNumber = cmrDocuments.reduce((max, doc) => {
        const match = String(doc.number || "").match(/(\d+)$/);
        return match ? Math.max(max, Number(match[1])) : max;
    }, 0);
    return `CMR-${String(maxNumber + 1).padStart(5, "0")}`;
}

// ==========================
// ZAPIS STORAGE
// ==========================

function saveStorage() {

    localStorage.setItem(
        "cmrDocuments",
        JSON.stringify(cmrDocuments)
    );

}

// ==========================
// POZYCJE TOWAROWE
// ==========================

function addGoodsItem() {

    const item =
        document.createElement("div");

    item.classList.add("goods-item");

    item.innerHTML = `
    
        <div class="grid">

            <div class="form-group">
                <label>Nazwa towaru</label>
                <input type="text" class="goodsName">
            </div>

            <div class="form-group">
                <label>Numer towaru</label>
                <input type="text" class="goodsNumber">
            </div>

            <div class="form-group">
                <label>Sposób pakowania</label>
                <input type="text" class="goodsPacking">
            </div>

            <div class="form-group">
                <label>Ilość</label>
                <input type="number" class="goodsQty">
            </div>

            <div class="form-group">
                <label>Waga (kg)</label>
                <input type="number" class="goodsWeight">
            </div>

            <div class="form-group">
                <label>Objętość (m³)</label>
                <input type="number" class="goodsVolume">
            </div>

        </div>

        <button
            type="button"
            class="btn btn-danger removeGoods">

            Usuń

        </button>
    
    `;

    if (!goodsContainer) return;
    goodsContainer.appendChild(item);

    item
        .querySelector(".removeGoods")
        .addEventListener("click", () => {

            item.remove();

        });

}

if (addItemBtn) addItemBtn.addEventListener("click", addGoodsItem);

// ==========================
// TWORZENIE CMR
// ==========================

if (form) form.addEventListener(
    "submit",
    function (e) {

        e.preventDefault();

        const goods = [];

        document
            .querySelectorAll(".goods-item")
            .forEach(item => {

                goods.push({

                    name:
                        item.querySelector(".goodsName").value,

                    number:
                        item.querySelector(".goodsNumber").value,

                    packing:
                        item.querySelector(".goodsPacking").value,

                    qty:
                        item.querySelector(".goodsQty").value,

                    weight:
                        item.querySelector(".goodsWeight").value,

                    volume:
                        item.querySelector(".goodsVolume").value

                });

            });

        const manualNumber =
            document.getElementById("cmrNumber").value.trim();

        const documentData = {

            id: Date.now(),

            number:
                manualNumber || generateCMRNumber(),

            senderName:
                document.getElementById("senderName").value,

            sender:
                document.getElementById("sender").value,

            receiverName:
                document.getElementById("receiverName").value,

            receiver:
                document.getElementById("receiver").value,

            carrier:
                document.getElementById("carrier").value,

            vehicle:
                document.getElementById("vehicle").value,

            loadingLocation:
                document.getElementById("loadingLocation").value,

            deliveryLocation:
                document.getElementById("deliveryLocation").value,

            date:
                document.getElementById("loadingDate").value,

            unloadingDate:
                document.getElementById("unloadingDate").value,

            distanceKm:
                document.getElementById("distanceKm").value,

            fuelRefilled:
                document.getElementById("fuelRefilled").value,

            otherCosts:
                document.getElementById("otherCosts").value,

            senderInstructions:
                document.getElementById("senderInstructions").value,

            goods,

            createdBy:
                currentUser ? currentUser.username : "admin"

        };

        cmrDocuments.push(
            documentData
        );

        saveStorage();

        renderTable();

        updateStats();

        form.reset();

        goodsContainer.innerHTML = "";

        closeModalWindow();

    }
);

// ==========================
// TABELA
// ==========================

function renderTable() {

    tableBody.innerHTML = "";

    const canDeleteCMR = currentUser && currentUser.role === "admin";
    const visibleDocuments = getVisibleCMRDocuments();

    visibleDocuments.forEach(doc => {

        const row =
            document.createElement("tr");

        const senderLabel = doc.senderName || doc.sender || "";
        const receiverLabel = doc.receiverName || doc.receiver || "";
        const goodsNames = Array.isArray(doc.goods) && doc.goods.length > 0
            ? doc.goods.map(item => item.name || item.number || "").join(", ")
            : "";

        row.innerHTML = `
            <td>${escapeHtml(doc.number)}</td>
            <td>${escapeHtml(senderLabel)}</td>
            <td>${escapeHtml(receiverLabel)}</td>
            <td>${escapeHtml(goodsNames)}</td>
            <td>${escapeHtml(doc.createdBy || "admin")}</td>
            <td>
                <button
                    type="button"
                    class="btn btn-secondary"
                    onclick="viewCMR(${doc.id})">
                    Otwórz
                </button>

                ${canDeleteCMR ? `
                <button
                    type="button"
                    class="btn btn-danger"
                    onclick="deleteCMR(${doc.id})">

                    Usuń

                </button>
                ` : ""}

            </td>

        `;

        tableBody.appendChild(row);

    });

}

// ==========================
// USUWANIE
// ==========================

function deleteCMR(id) {

    if (!currentUser || currentUser.role !== "admin") {
        return;
    }

    if (
        !confirm(
            "Usunąć dokument?"
        )
    ) {
        return;
    }

    cmrDocuments =
        cmrDocuments.filter(
            doc => doc.id !== id
        );

    saveStorage();

    renderTable();

    updateStats();

}

function deleteRoadCard(id) {

    if (!currentUser || currentUser.role !== "admin") {
        return;
    }

    if (!confirm("Usunąć kartę drogową?")) {
        return;
    }

    roadCards = roadCards.filter(card => card.id !== id);

    saveRoadCards();

    renderRoadCards();

    updateStats();

}

// ==========================
// WYSZUKIWARKA
// ==========================

searchInput.addEventListener(
    "keyup",
    function () {

        const value =
            this.value.toLowerCase();

        const rows =
            tableBody.querySelectorAll("tr");

        rows.forEach(row => {

            const text =
                row.innerText.toLowerCase();

            row.style.display =
                text.includes(value)
                    ? ""
                    : "none";

        });

    }
);

// ==========================
// STATYSTYKI
// ==========================

function renderDrivers() {
    driversTableBody.innerHTML = "";

    const canDelete = currentUser && currentUser.role === "admin";

    drivers.forEach((driver, index) => {
        const row = document.createElement("tr");

        const vehicleTypes = Array.from(new Set((Array.isArray(driver.vehicles) ? driver.vehicles : []).map(v => v.type))).join(", ");
        row.innerHTML = `
            <td>${escapeHtml(driver.name)}</td>
            <td>${escapeHtml(driver.type)}</td>
            <td>${escapeHtml(driver.role || "")}</td>
            <td>${escapeHtml(driver.insertType)}</td>
            <td>${escapeHtml(vehicleTypes)}</td>
            <td>
                ${canDelete ? `
                <button type="button" class="btn btn-secondary" onclick="editDriver(${index})">Edytuj</button>
                <button type="button" class="btn btn-danger" onclick="removeDriver(${index})">Usuń</button>
                ` : ""}
            </td>
        `;

        driversTableBody.appendChild(row);
    });

    filterDrivers();
    renderFleet();
    updateStats();
}

function saveDrivers() {
    localStorage.setItem("cmrDrivers", JSON.stringify(drivers));
}

function saveRoadCards() {
    localStorage.setItem("roadCards", JSON.stringify(roadCards));
}

function setDriverFormMode(index) {
    const submitButton = document.getElementById("driverSubmitButton");
    const cancelButton = document.getElementById("driverCancelEditBtn");
    const loginInput = document.getElementById("driverLogin");
    const passwordInput = document.getElementById("driverPassword");

    editingDriverIndex = index;

    if (index === null) {
        submitButton.innerHTML = `<i class="fa-solid fa-user-plus"></i> Dodaj kierowcę`;
        cancelButton.classList.add("hidden");
        driverEditInfo.classList.add("hidden");
        driverEditName.value = "";
        loginInput.required = true;
        passwordInput.required = true;
        document.getElementById("driverForm").reset();
        vehicleFieldsContainer.innerHTML = "";
        if (trailerFieldsContainer) {
            trailerFieldsContainer.innerHTML = "";
        }
        addVehicleFields();
        updateTrailerVisibility();
        return;
    }

    submitButton.innerHTML = `<i class="fa-solid fa-save"></i> Zapisz zmiany`;
    cancelButton.classList.remove("hidden");
    loginInput.required = false;
    passwordInput.required = false;
    driverEditInfo.classList.remove("hidden");
    const driver = drivers[index];
    driverEditName.value = driver ? `${escapeHtml(driver.name)} (${driver.login})` : "";
    updateTrailerVisibility();
}

function updateVehicleCardFields(card) {
    const typeSelect = card.querySelector(".driverVehicleType");
    const type = typeSelect.value;
    const makeGroup = card.querySelector(".field-make");
    const modelGroup = card.querySelector(".field-model");
    const trailerGroup = card.querySelector(".field-trailer-type");

    if (!makeGroup || !modelGroup || !trailerGroup) {
        return;
    }

    if (type === "Naczepa") {
        makeGroup.classList.add("hidden");
        modelGroup.classList.add("hidden");
        trailerGroup.classList.remove("hidden");
        trailerGroup.querySelector("input").required = true;
        makeGroup.querySelector("input").required = false;
        modelGroup.querySelector("input").required = false;
    } else {
        makeGroup.classList.remove("hidden");
        modelGroup.classList.remove("hidden");
        trailerGroup.classList.add("hidden");
        trailerGroup.querySelector("input").required = false;
        makeGroup.querySelector("input").required = type !== "";
        modelGroup.querySelector("input").required = type !== "";
    }
}

function createTrailerCard(trailer = null) {
    const card = document.createElement("div");
    card.className = "trailer-card";

    const plateValue = trailer?.plate || "";
    const trailerTypeValue = trailer?.trailerType || "";

    card.innerHTML = `
        <div class="grid">
            <div class="form-group">
                <label>Nr rejestracyjny naczepy</label>
                <input type="text" class="driverTrailerPlate" placeholder="AB 12345" value="${plateValue}" required>
            </div>
            <div class="form-group">
                <label>Rodzaj naczepy</label>
                <input type="text" class="driverTrailerType" placeholder="Chłodnia" value="${trailerTypeValue}" required>
            </div>
        </div>
        <button type="button" class="btn btn-secondary removeTrailerBtn">Usuń naczepę</button>
    `;

    card.querySelector(".removeTrailerBtn")
        .addEventListener("click", () => {
            card.remove();
        });

    return card;
}

function addTrailerFields() {
    if (trailerFieldsContainer) {
        trailerFieldsContainer.appendChild(createTrailerCard());
    }
}

if (addTrailerBtn) {
    addTrailerBtn.addEventListener("click", addTrailerFields);
}

function createVehicleCard(vehicle = null) {
    const card = document.createElement("div");
    card.className = "vehicle-card";

    const type = vehicle?.type || "";
    const ownerValue = vehicle?.owner || "";
    const plateValue = vehicle?.plate || "";
    const makeValue = vehicle?.make || "";
    const modelValue = vehicle?.model || "";
    const trailerTypeValue = vehicle?.trailerType || "";

    card.innerHTML = `
        <div class="grid">
            <div class="form-group">
                <label>Typ pojazdu</label>
                <select class="driverVehicleType" required>
                    <option value="">Wybierz...</option>
                    <option value="Ciężarówka" ${type === "Ciężarówka" ? "selected" : ""}>Ciężarówka</option>
                    <option value="Autokar" ${type === "Autokar" ? "selected" : ""}>Autokar</option>
                    <option value="Naczepa" ${type === "Naczepa" ? "selected" : ""}>Naczepa</option>
                </select>
            </div>
            <div class="form-group">
                <label>Właściciel</label>
                <input type="text" class="driverVehicleOwner" placeholder="MI-TRANS" value="${ownerValue}" required>
            </div>
            <div class="form-group">
                <label>Nr rejestracyjny</label>
                <input type="text" class="driverVehiclePlate" placeholder="AB 12345" value="${plateValue}" required>
            </div>
            <div class="form-group field-make ${type === "Naczepa" ? "hidden" : ""}">
                <label>Marka</label>
                <input type="text" class="driverVehicleMake" placeholder="Volvo" value="${makeValue}" ${type !== "Naczepa" ? "required" : ""}>
            </div>
            <div class="form-group field-model ${type === "Naczepa" ? "hidden" : ""}">
                <label>Model</label>
                <input type="text" class="driverVehicleModel" placeholder="FH" value="${modelValue}" ${type !== "Naczepa" ? "required" : ""}>
            </div>
            <div class="form-group field-trailer-type ${type === "Naczepa" ? "" : "hidden"}">
                <label>Rodzaj naczepy</label>
                <input type="text" class="driverVehicleTrailerType" placeholder="Chłodnia" value="${trailerTypeValue}" ${type === "Naczepa" ? "required" : ""}>
            </div>
        </div>
        <button type="button" class="btn btn-secondary removeVehicleBtn">Usuń pojazd</button>
    `;

    const typeSelect = card.querySelector(".driverVehicleType");
    typeSelect.addEventListener("change", () => updateVehicleCardFields(card));

    updateVehicleCardFields(card);

    card.querySelector(".removeVehicleBtn")
        .addEventListener("click", () => {
            const cards = vehicleFieldsContainer.querySelectorAll(".vehicle-card");
            if (cards.length <= 1) {
                return;
            }
            card.remove();
        });

    return card;
}

function editDriver(index) {
    const driver = drivers[index];
    if (!driver) {
        return;
    }

    document.getElementById("driverName").value = driver.name;
    document.getElementById("driverType").value = driver.type;
    document.getElementById("driverRole").value = driver.role || "";
    document.getElementById("driverLogin").value = driver.login;
    document.getElementById("driverPassword").value = "";

    document.querySelectorAll(".driverInsertType").forEach(input => {
        const insertTypes = (driver.insertType || "").split(", ").filter(Boolean);
        input.checked = insertTypes.includes(input.value);
    });

    if (trailerFieldsContainer) {
        trailerFieldsContainer.innerHTML = "";

        const savedTrailers = driver.trailers?.length ? driver.trailers :
            driver.trailer ? [driver.trailer] : [];

        if (savedTrailers.length > 0) {
            savedTrailers.forEach(trailer => {
                trailerFieldsContainer.appendChild(createTrailerCard(trailer));
            });
        }
    }

    vehicleFieldsContainer.innerHTML = "";
    (Array.isArray(driver.vehicles) ? driver.vehicles : []).forEach(vehicle => {
        vehicleFieldsContainer.appendChild(createVehicleCard(vehicle));
    });

    if (driverType) {
        const showTrailer = driverType.value === "Ciężarówka" || driverType.value === "Obie";
        if (trailerSection) {
            trailerSection.classList.toggle("hidden", !showTrailer);
        }
        if (showTrailer && trailerFieldsContainer && trailerFieldsContainer.querySelectorAll(".trailer-card").length === 0) {
            trailerFieldsContainer.appendChild(createTrailerCard());
        }
        if (!showTrailer && trailerFieldsContainer) {
            trailerFieldsContainer.innerHTML = "";
        }
    }

    setDriverFormMode(index);
    openDriverModal();
}

function removeDriver(index) {
    const removedDriver = drivers.splice(index, 1)[0];
    if (removedDriver && removedDriver.login) {
        users = users.filter(user => user.username !== removedDriver.login);
        saveUsers();
    }
    saveDrivers();
    renderDrivers();
}

function addVehicleFields() {
    vehicleFieldsContainer.appendChild(createVehicleCard());
}

if (addVehicleBtn) {
    addVehicleBtn.addEventListener("click", addVehicleFields);
}

if (openDriverModalBtn) {
    openDriverModalBtn.addEventListener("click", () => {
        setDriverFormMode(null);
        openDriverModal();
    });
}

if (newRoadCardBtn) {
    newRoadCardBtn.addEventListener("click", () => {
        if (roadCardForm) {
            roadCardForm.reset();
        }
        // reset selection buttons and hide fields/tab
        if (roadCardTypeButtons && roadCardTypeButtons.length) {
            roadCardTypeButtons.forEach(b => b.classList.remove('selected'));
        }
        if (roadCardTabHeader) {
            roadCardTabHeader.classList.add('hidden');
            roadCardTabHeader.innerHTML = '';
        }
        updateRoadCardFieldsVisibility();
        if (roadCardModal) {
            roadCardModal.classList.remove("hidden");
        }
    });
}

function updateRoadCardFieldsVisibility() {
    const selectedBtn = document.querySelector('.road-card-type-btn.selected');
    const container = roadCardFieldsContainer;
    if (!container) return;

    if (!selectedBtn) {
        container.innerHTML = '';
        container.classList.add('hidden');
        if (roadCardTabHeader) roadCardTabHeader.classList.add('hidden');
        return;
    }

    // choose pane id based on selection
    const paneId = selectedBtn.dataset.type === 'Ciężarówka' ? 'roadCardPaneTruck' : 'roadCardPaneBus';
    const pane = document.getElementById(paneId);
    if (pane) {
        container.innerHTML = '';
        const clone = pane.cloneNode(true);
        clone.id = '';
        clone.classList.remove('hidden');
        clone.classList.add('active');
        clone.querySelectorAll('input, textarea, select').forEach(field => { field.disabled = false; });
        container.appendChild(clone);
        container.classList.remove('hidden');
        if (roadCardTabHeader) roadCardTabHeader.classList.remove('hidden');
    }
}

if (roadCardTypeButtons && roadCardTypeButtons.length) {
    roadCardTypeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // mark selected
            roadCardTypeButtons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            // set aria state
            roadCardTypeButtons.forEach(b => b.setAttribute('aria-pressed', b.classList.contains('selected')));
            // update tab header
            if (roadCardTabHeader) {
                roadCardTabHeader.innerHTML = `<div class="tab">${btn.dataset.type}</div>`;
                roadCardTabHeader.classList.remove('hidden');
            }
            updateRoadCardFieldsVisibility();
        });
    });
}

if (closeRoadCardModal) {
    closeRoadCardModal.addEventListener("click", () => {
        if (roadCardModal) {
            roadCardModal.classList.add("hidden");
        }
    });
}

if (cancelRoadCardBtn) {
    cancelRoadCardBtn.addEventListener("click", () => {
        if (roadCardModal) {
            roadCardModal.classList.add("hidden");
        }
    });
}

if (closeDriverModal) {
    closeDriverModal.addEventListener("click", closeDriverModalWindow);
}

if (driverCancelEditBtn) {
    driverCancelEditBtn.addEventListener("click", () => setDriverFormMode(null));
}

if (driverForm) {
    driverForm.addEventListener("submit", function (e) {
        e.preventDefault();

        if (!currentUser || currentUser.role !== "admin") {
            return;
        }

        const selectedInsert = Array.from(
            document.querySelectorAll(".driverInsertType:checked")
        ).map(input => input.value);

        const login = document.getElementById("driverLogin").value.trim();
        const password = document.getElementById("driverPassword").value;

        if (editingDriverIndex === null) {
            if (!login || !password) {
                alert("Podaj login i hasło dla kierowcy.");
                return;
            }

            if (users.some(user => user.username === login)) {
                alert("Ten login jest już zajęty. Wybierz inny login.");
                return;
            }
        }

        if (editingDriverIndex !== null) {
            const existingDriver = drivers[editingDriverIndex];
            if (login && login !== existingDriver.login && users.some(user => user.username === login)) {
                alert("Ten login jest już zajęty. Wybierz inny login.");
                return;
            }
        }

        const vehicleCards = Array.from(
            document.querySelectorAll(".vehicle-card:not(.trailer-card)")
        );

        const vehicles = vehicleCards.map(card => {
            const type = card.querySelector(".driverVehicleType").value;
            const owner = card.querySelector(".driverVehicleOwner").value.trim();
            const plate = card.querySelector(".driverVehiclePlate").value.trim();

            if (type === "Naczepa") {
                const trailerType = card.querySelector(".driverVehicleTrailerType").value.trim();
                return { type, owner, plate, trailerType };
            }

            const make = card.querySelector(".driverVehicleMake").value.trim();
            const model = card.querySelector(".driverVehicleModel").value.trim();
            return { type, owner, plate, make, model };
        });

        const trailerCards = trailerFieldsContainer
            ? Array.from(trailerFieldsContainer.querySelectorAll(".trailer-card"))
            : [];

        const trailers = trailerCards.map(card => {
            return {
                plate: card.querySelector(".driverTrailerPlate").value.trim(),
                trailerType: card.querySelector(".driverTrailerType").value.trim()
            };
        }).filter(trailer => trailer.plate || trailer.trailerType);

        if (vehicles.some(v => {
            if (!v.type || !v.owner || !v.plate) {
                return true;
            }
            if (v.type === "Naczepa") {
                return !v.trailerType;
            }
            return !v.make || !v.model;
        })) {
            alert("Uzupełnij wszystkie dane pojazdów.");
            return;
        }

        if (driverType.value === "Ciężarówka" || driverType.value === "Obie") {
            if (trailerCards.length === 0) {
                alert("Dodaj przynajmniej jedną naczepę.");
                return;
            }
            if (trailers.some(t => !t.plate || !t.trailerType)) {
                alert("Uzupełnij wszystkie dane naczepy.");
                return;
            }
        }

        const driverData = {
            name: document.getElementById("driverName").value.trim(),
            type: document.getElementById("driverType").value,
            role: document.getElementById("driverRole").value,
            insertType: selectedInsert.join(", "),
            trailers: trailers.length ? trailers : null,
            vehicles,
            login: login || drivers[editingDriverIndex]?.login,
            password: password || drivers[editingDriverIndex]?.password
        };

        if (editingDriverIndex === null) {
            drivers.push(driverData);
            users.push({ username: login, password, role: "driver" });
            alert(`Kierowca dodany. Login: ${login}, Hasło: ${password}`);
        } else {
            const oldDriver = drivers[editingDriverIndex];

            const user = users.find(u => u.username === oldDriver.login);
            if (user) {
                if (login && login !== oldDriver.login) {
                    user.username = login;
                }
                if (password) {
                    user.password = password;
                }
            }

            drivers[editingDriverIndex] = driverData;
            alert(`Dane kierowcy zostały zaktualizowane.`);
        }

        saveDrivers();
        saveUsers();
        renderDrivers();

        setDriverFormMode(null);
        closeDriverModalWindow();
    });
}

if (roadCardForm) {
    roadCardForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const container = document.getElementById('roadCardFieldsContainer');
        const activePane = container ? container.querySelector('.road-card-pane.active') || container.firstElementChild : null;
        const selectedBtn = document.querySelector('.road-card-type-btn.selected');
        const type = selectedBtn ? selectedBtn.dataset.type : "";

        const getField = (name) => {
            const el = activePane ? activePane.querySelector(`[name="${name}"]`) : null;
            return el ? el.value : "";
        };

        const start = getField('roadStart').trim();
        const end = getField('roadEnd').trim();
        const startDateTime = getField('roadStartDateTime');
        const endDateTime = getField('roadEndDateTime');
        const driver = getField('roadDriver').trim();
        const vehicle = getField('roadVehicle').trim();
        const distanceKm = getField('roadDistanceKm');
        const fuelRefilled = getField('roadFuelRefilled').trim();
        const otherCosts = getField('roadOtherCosts').trim();
        const number = getField('roadCardNumber').trim();

        if (!selectedBtn || !start || !end || !startDateTime || !endDateTime || !driver || !vehicle || !number) {
            alert("Wybierz rodzaj pojazdu i wypełnij wszystkie wymagane pola karty drogowej.");
            return;
        }

        roadCards.push({
            id: Date.now(),
            number,
            type,
            start,
            end,
            startDateTime,
            endDateTime,
            distanceKm,
            fuelRefilled,
            otherCosts,
            driver,
            vehicle,
            createdBy: currentUser ? currentUser.username : "admin"
        });

        saveRoadCards();
        renderRoadCards();
        updateStats();

        if (roadCardModal) {
            roadCardModal.classList.add("hidden");
        }
    });
}

function filterDrivers() {
    if (!driverSearchInput) {
        return;
    }

    const value = driverSearchInput.value.toLowerCase();

    driversTableBody.querySelectorAll("tr").forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display =
            value.length === 0 || text.includes(value)
                ? ""
                : "none";
    });
}

function renderFleet() {
    if (truckFleetTableBody) {
        truckFleetTableBody.innerHTML = "";
    }
    if (autokarFleetTableBody) {
        autokarFleetTableBody.innerHTML = "";
    }
    if (trailerFleetTableBody) {
        trailerFleetTableBody.innerHTML = "";
    }

    const createRow = (item, ownerName, isTrailer = false) => {
        const row = document.createElement("tr");
        if (isTrailer || item.type === "Naczepa") {
            row.innerHTML = `
                <td>${item.owner || ownerName || ""}</td>
                <td>${item.plate || ""}</td>
                <td>${item.trailerType || item.type || ""}</td>
            `;
        } else {
            row.innerHTML = `
                <td>${item.owner || ownerName || ""}</td>
                <td>${item.plate || ""}</td>
                <td>${item.make || ""}</td>
                <td>${item.model || ""}</td>
            `;
        }
        return row;
    };

    drivers.forEach(driver => {
        (driver.vehicles || []).forEach(vehicle => {
            if (vehicle.type === "Ciężarówka" && truckFleetTableBody) {
                truckFleetTableBody.appendChild(createRow(vehicle, driver.name));
            }
            if (vehicle.type === "Autokar" && autokarFleetTableBody) {
                autokarFleetTableBody.appendChild(createRow(vehicle, driver.name));
            }
            if (vehicle.type === "Naczepa" && trailerFleetTableBody) {
                trailerFleetTableBody.appendChild(createRow(vehicle, driver.name, true));
            }
        });

        const trailers = driver.trailers || (driver.trailer ? [driver.trailer] : []);
        trailers.forEach(trailer => {
            if (trailerFleetTableBody) {
                trailerFleetTableBody.appendChild(createRow(trailer, driver.name, true));
            }
        });
    });
}

function renderRoadCards() {
    if (!roadCardsTableBody) {
        return;
    }

    roadCardsTableBody.innerHTML = "";

    const visibleCards = getVisibleRoadCards();
    const canDelete = currentUser && currentUser.role === "admin";

    visibleCards.forEach(card => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${escapeHtml(card.number)}</td>
            <td>${escapeHtml(card.driver)}</td>
            <td>${escapeHtml(card.distanceKm || "")}</td>
            <td>${escapeHtml(card.type || card.vehicle || "")}</td>
            <td>
                <button type="button" class="btn btn-secondary" onclick="viewRoadCard(${card.id})">Otwórz</button>
                ${canDelete ? `<button type="button" class="btn btn-danger" onclick="deleteRoadCard(${card.id})">Usuń</button>` : ""}
            </td>
        `;
        roadCardsTableBody.appendChild(row);
    });

    if (roadCardSearchInput && roadCardSearchInput.value.trim().length > 0) {
        filterRoadCards();
    }
}

function filterRoadCards() {
    if (!roadCardSearchInput) {
        return;
    }

    const value = roadCardSearchInput.value.toLowerCase();

    roadCardsTableBody.querySelectorAll("tr").forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display =
            value.length === 0 || text.includes(value)
                ? ""
                : "none";
    });
}

if (driverSearchInput) {
    driverSearchInput.addEventListener("keyup", filterDrivers);
}

if (roadCardSearchInput) {
    roadCardSearchInput.addEventListener("keyup", filterRoadCards);
}

function updateStats() {

    const visibleDocuments = getVisibleCMRDocuments();
    const visibleRoadCards = getVisibleRoadCards();

    document.getElementById(
        "cmrCount"
    ).innerText =
        visibleDocuments.length;

    let totalWeight = 0;

    visibleDocuments.forEach(doc => {
        (Array.isArray(doc.goods) ? doc.goods : []).forEach(item => {
            totalWeight += Number(item.weight || 0);
        });
    });

    const roadCardCount = visibleRoadCards.length;

    document.getElementById(
        "roadCardCount"
    ).innerText =
        roadCardCount;

    const clients =
        new Set();

    const vehicles =
        new Set();

    visibleDocuments.forEach(doc => {

        clients.add(
            doc.receiver
        );

        vehicles.add(
            doc.vehicle
        );

    });

    const truckCount = drivers.reduce((count, driver) => {
        return count + (Array.isArray(driver.vehicles) ? driver.vehicles : []).filter(v => v.type === "Ciężarówka").length;
    }, 0);

    const autokarCount = drivers.reduce((count, driver) => {
        return count + (Array.isArray(driver.vehicles) ? driver.vehicles : []).filter(v => v.type === "Autokar").length;
    }, 0);

    document.getElementById(
        "driverCount"
    ).innerText =
        drivers.length;

    document.getElementById(
        "truckCount"
    ).innerText =
        truckCount;

    document.getElementById(
        "autokarCount"
    ).innerText =
        autokarCount;

}

// ==========================
// START
// ==========================

updateInterface();
setDriverFormMode(null);
if (goodsContainer && goodsContainer.children.length === 0) addGoodsItem();