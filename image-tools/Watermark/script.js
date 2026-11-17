
document.addEventListener("DOMContentLoaded", () => {
    const $ = (id) => document.getElementById(id);

    const canvasElement = $("editorCanvas");
    const viewport = $("canvasViewport");
    const wrapper = $("canvasWrapper");

    if (!window.fabric || !canvasElement) {
        $("statusMessage").textContent =
            "Fabric.js yüklenemedi. İnternet bağlantını kontrol et.";
        return;
    }

    const canvas = new fabric.Canvas(canvasElement, {
        preserveObjectStacking: true,
        selection: true,
        backgroundColor: "#ffffff"
    });

    function applySelectionStyle(object) {
    object.set({
        borderColor: "#55c2ff",
        borderScaleFactor: 2,
        cornerColor: "#55c2ff",
        cornerStrokeColor: "#ffffff",
        cornerStyle: "circle",
        cornerSize: 14,
        transparentCorners: false,
        padding: 8,
        rotatingPointOffset: 35,
        lockUniScaling: true,
        hasControls: true,
        hasBorders: true
    });
}
    // Köşelerden boyutlandırırken oranı koru
    canvas.uniformScaling = true;

    fabric.FabricObject.customProperties = [
        "watermarkName",
        "watermarkType",
        "isBaseImage",
        "locked"
    ];

    let baseImage = null;
    let originalWidth = 0;
    let originalHeight = 0;
    let baseCanvasWidth = 0;
    let baseCanvasHeight = 0;
    let zoom = 1;

    let history = [];
    let historyIndex = -1;
    let historyTimer = null;
    let restoringHistory = false;

    let currentLanguage = document.documentElement.lang || "tr";

    const text = {
        tr: {
            title: "Filigran Ekleme",
            subtitle: "Görsellerine yazı ve logo ekle. Nesnelerini özgürce düzenle. İşlemler cihazında yapılır.",
            home: "Ana sayfa",
            footer: "EBTools · Ücretsiz çevrimiçi araçlar",
            upload: "Önce bir görsel yüklemelisin.",
            textName: "Yazı",
            logoName: "Logo",
            selected: "Seçili Nesne",
            document: "Belge Ayarları",
            selectObject: "Düzenlemek için çalışma alanındaki bir nesneyi seç.",
            emptyLayers: "Henüz katman yok.",
            imageLoaded: "Görsel yüklendi.",
            confirmReplace: "Mevcut görsel ve üzerindeki çalışmalar silinecek. Yeni görsel yüklemek istiyor musun?",
            replaceCancelled: "Görsel değiştirme iptal edildi.",
            exported: "Görsel dışa aktarıldı.",
            deleted: "Nesne silindi.",
            locked: "Nesne kilitlendi.",
            unlocked: "Nesne kilidi açıldı.",
            noObject: "Önce bir nesne seç.",
            imageError: "Görsel yüklenemedi.",
            textPlaceholder: "Filigran yazısı",
            newText: "Yeni yazı",
            newLogo: "Yeni logo",
            layer: "Katman",
            visible: "Görünür",
            hidden: "Gizli",
            lock: "Kilitle",
            unlock: "Kilidi aç"
        },
        en: {
            title: "Watermark",
            subtitle: "Add text and logos to your images. Arrange objects freely. Everything happens on your device.",
            home: "Home",
            footer: "EBTools · Free online tools",
            upload: "Upload an image first.",
            textName: "Text",
            logoName: "Logo",
            selected: "Selected Object",
            document: "Document Settings",
            selectObject: "Select an object on the workspace to edit it.",
            emptyLayers: "No layers yet.",
            imageLoaded: "Image loaded.",
            confirmReplace: "The current image and all its edits will be lost. Do you want to load a new image?",
            replaceCancelled: "Image replacement cancelled.",
            exported: "Image exported.",
            deleted: "Object deleted.",
            locked: "Object locked.",
            unlocked: "Object unlocked.",
            noObject: "Select an object first.",
            imageError: "Could not load the image.",
            textPlaceholder: "Watermark text",
            newText: "New text",
            newLogo: "New logo",
            layer: "Layer",
            visible: "Visible",
            hidden: "Hidden",
            lock: "Lock",
            unlock: "Unlock"
        }
    };

    function tr(key) {
        return text[currentLanguage][key] || key;
    }

    function setStatus(message) {
        $("statusMessage").textContent = message;
    }

    // --------------------------------------------------
    // LANGUAGE
    // --------------------------------------------------

    function setLanguage(language) {
        currentLanguage = language;
        document.documentElement.lang = language;

        try {
            localStorage.setItem("ebToolsLanguage", language);
        } catch (error) {}

        document.title = language === "tr"
            ? "EBTools - Filigran Ekleme"
            : "EBTools - Watermark";

        $("pageTitle").textContent = tr("title");
        $("subtitle").textContent = tr("subtitle");
        $("backLink").textContent = tr("home");
        $("footerText").textContent = tr("footer");

        $("noSelection").querySelector("h3").textContent = tr("document");
        $("noSelection").querySelectorAll("p").forEach((p) => {
            p.textContent = tr("selectObject");
        });

        $("emptyLayers").querySelectorAll("span").forEach((span) => {
            span.textContent = tr("emptyLayers");
        });

        updateLayers();
        updateLockButton();
    }

    $("trButton").addEventListener("click", () => setLanguage("tr"));
    $("enButton").addEventListener("click", () => setLanguage("en"));

    // --------------------------------------------------
    // CANVAS HELPERS
    // --------------------------------------------------

    function hasImage() {
        return Boolean(baseImage);
    }

    function getObjects() {
        return canvas.getObjects().filter((obj) => obj !== baseImage);
    }

    function getSelected() {
        return canvas.getActiveObject();
    }

    function requireImage() {
        if (hasImage()) return true;

        setStatus(tr("upload"));
        return false;
    }

    function fitDimensions(width, height) {
        const availableWidth = Math.max(300, viewport.clientWidth - 40);
        const availableHeight = Math.max(250, viewport.clientHeight - 40);

        const scale = Math.min(
            availableWidth / width,
            availableHeight / height,
            1
        );

        return {
            width: Math.max(1, Math.round(width * scale)),
            height: Math.max(1, Math.round(height * scale))
        };
    }

    function updateDimensionLabel() {
        if (!hasImage()) return;

        $("canvasDimensions").textContent =
            `${originalWidth} × ${originalHeight}`;
    }

    function updateZoomLabel() {
        const value = Math.round(zoom * 100);

        $("zoomLabel").textContent = `${value}%`;
        $("zoomValue").textContent = `${value}%`;
    }

    function applyZoom() {
        if (!hasImage()) return;

        canvas.setZoom(zoom);
        canvas.setDimensions({
            width: Math.round(baseCanvasWidth * zoom),
            height: Math.round(baseCanvasHeight * zoom)
        });

        updateZoomLabel();
        canvas.requestRenderAll();
    }

    function fitCanvas() {
        if (!hasImage()) return;

        const dimensions = fitDimensions(originalWidth, originalHeight);

        baseCanvasWidth = dimensions.width;
        baseCanvasHeight = dimensions.height;
        zoom = 1;

        canvas.setDimensions({
            width: baseCanvasWidth,
            height: baseCanvasHeight
        });

        // Arka plan görselinin ekrandaki boyutunu güncelle.
        const scaleX = baseCanvasWidth / originalWidth;
        const scaleY = baseCanvasHeight / originalHeight;

        baseImage.set({
            left: 0,
            top: 0,
            scaleX,
            scaleY
        });

        baseImage.setCoords();

        applyZoom();
        updateDimensionLabel();
    }

    // --------------------------------------------------
    // HISTORY
    // --------------------------------------------------

    function saveHistory() {
        if (restoringHistory || !hasImage()) return;

        clearTimeout(historyTimer);

        historyTimer = setTimeout(() => {
            const state = JSON.stringify(
                canvas.toJSON([
                    "watermarkName",
                    "watermarkType",
                    "isBaseImage",
                    "locked"
                ])
            );

            if (history[historyIndex] === state) return;

            history = history.slice(0, historyIndex + 1);
            history.push(state);

            if (history.length > 40) {
                history.shift();
            }

            historyIndex = history.length - 1;
            updateHistoryButtons();
        }, 250);
    }

    function updateHistoryButtons() {
        $("undoButton").disabled = historyIndex <= 0;
        $("redoButton").disabled = historyIndex >= history.length - 1;
    }

    async function restoreHistory(index) {
        if (index < 0 || index >= history.length) return;

        restoringHistory = true;
        canvas.discardActiveObject();

        try {
            await canvas.loadFromJSON(history[index]);
          canvas.getObjects().forEach((object) => {
    if (object !== baseImage && !object.isBaseImage) {
        applySelectionStyle(object);
    }
});
            baseImage = canvas.getObjects().find(
                (obj) => obj.isBaseImage
            ) || null;

            historyIndex = index;

            if (hasImage()) {
                applyZoom();
            }

            updateProperties();
            updateLayers();
            updateHistoryButtons();
            canvas.requestRenderAll();
        } catch (error) {
            console.error("History error:", error);
        }

        restoringHistory = false;
    }

    $("undoButton").addEventListener("click", () => {
        restoreHistory(historyIndex - 1);
    });

    $("redoButton").addEventListener("click", () => {
        restoreHistory(historyIndex + 1);
    });

    
    // --------------------------------------------------
    // IMAGE UPLOAD AND DRAG & DROP
    // --------------------------------------------------

    function openImagePicker() {
        $("imageInput").click();
    }

    $("uploadImageButton").addEventListener("click", openImagePicker);
    $("placeholderUploadButton").addEventListener("click", openImagePicker);
$("addLogoButton").addEventListener("click", () => {
    if (!requireImage()) return;
    $("logoInput").click();
});
    async function loadBaseImage(file) {
    if (!file || !file.type.startsWith("image/")) {
        setStatus(tr("imageError"));
        return false;
    }

    if (hasImage()) {
        if (!confirm(tr("confirmReplace"))) {
            setStatus(tr("replaceCancelled"));
            return false;
        }
    }

    const url = URL.createObjectURL(file);

        try {
            const image = await fabric.Image.fromURL(url);

            originalWidth = image.width;
            originalHeight = image.height;

            const dimensions = fitDimensions(originalWidth, originalHeight);

            baseCanvasWidth = dimensions.width;
            baseCanvasHeight = dimensions.height;
            zoom = 1;

            canvas.clear();
            baseImage = null;
            canvas.backgroundColor = "#ffffff";

            canvas.setDimensions({
                width: baseCanvasWidth,
                height: baseCanvasHeight
            });

            image.set({
                left: 0,
                top: 0,
                scaleX: baseCanvasWidth / originalWidth,
                scaleY: baseCanvasHeight / originalHeight,
                selectable: false,
                evented: false,
                hasControls: false,
                hasBorders: false,
                isBaseImage: true,
                watermarkType: "base"
            });

            baseImage = image;
            canvas.add(baseImage);
            canvas.sendObjectToBack(baseImage);

            $("canvasPlaceholder").style.display = "none";

            canvas.discardActiveObject();
            canvas.requestRenderAll();

            history = [];
            historyIndex = -1;
            saveHistory();

            updateProperties();
            updateLayers();
            updateHistoryButtons();
            updateDimensionLabel();
            updateZoomLabel();

            setStatus(tr("imageLoaded"));
            return true;
        } catch (error) {
            console.error(error);
            setStatus(tr("imageError"));
            return false;
        }
    }

    async function addLogoFile(file) {
        if (!file || !file.type.startsWith("image/")) {
            setStatus(tr("imageError"));
            return;
        }

        if (!requireImage()) return;

        const url = URL.createObjectURL(file);

        try {
            const image = await fabric.Image.fromURL(url);

            const maxSize = Math.min(
                baseCanvasWidth,
                baseCanvasHeight
            ) * 0.3;

            const scale = Math.min(
                maxSize / image.width,
                maxSize / image.height,
                1
            );

            image.set({
                left: baseCanvasWidth / 2,
                top: baseCanvasHeight / 2,
                originX: "center",
                originY: "center",
                scaleX: scale,
                scaleY: scale,
                opacity: 1,
                watermarkName: tr("newLogo"),
                watermarkType: "image"
            });
          applySelectionStyle(image);
            canvas.add(image);
            canvas.setActiveObject(image);
            canvas.requestRenderAll();

            updateProperties();
            updateLayers();
            saveHistory();
        } catch (error) {
            console.error(error);
            setStatus(tr("imageError"));
        }
    }

    $("imageInput").addEventListener("change", async (event) => {
        const file = event.target.files[0];
        if (file) await loadBaseImage(file);
        event.target.value = "";
    });

    $("logoInput").addEventListener("change", async (event) => {
        const file = event.target.files[0];
        if (file) await addLogoFile(file);
        event.target.value = "";
    });

    // Çalışma alanına sürükleyip bırakma
    ["dragenter", "dragover"].forEach((eventName) => {
        viewport.addEventListener(eventName, (event) => {
            event.preventDefault();
            event.stopPropagation();
            viewport.classList.add("drag-over");
        });
    });

    ["dragleave", "dragend"].forEach((eventName) => {
        viewport.addEventListener(eventName, (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (
                eventName === "dragend" ||
                !viewport.contains(event.relatedTarget)
            ) {
                viewport.classList.remove("drag-over");
            }
        });
    });

    viewport.addEventListener("drop", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        viewport.classList.remove("drag-over");

        const files = Array.from(event.dataTransfer.files)
            .filter((file) => file.type.startsWith("image/"));

        if (files.length === 0) return;

        let startIndex = 0;

        if (!hasImage()) {
    const loaded = await loadBaseImage(files[0]);

    if (!loaded) return;

    startIndex = 1;
}

        for (let i = startIndex; i < files.length; i++) {
            await addLogoFile(files[i]);
        }
    });


    // --------------------------------------------------
    // ADD TEXT
    // --------------------------------------------------

    $("addTextButton").addEventListener("click", () => {
        if (!requireImage()) return;

        const object = new fabric.IText(tr("textPlaceholder"), {
            left: baseCanvasWidth / 2,
            top: baseCanvasHeight / 2,
            originX: "center",
            originY: "center",
            fontFamily: "Arial",
            fontSize: Math.max(20, Math.round(baseCanvasWidth * 0.05)),
            fill: "#ffffff",
            stroke: "rgba(0,0,0,0.35)",
            strokeWidth: 0.5,
            fontWeight: "normal",
            fontStyle: "normal",
            opacity: 1,
            watermarkName: tr("newText"),
            watermarkType: "text"
        });
      applySelectionStyle(object);
        canvas.add(object);
        canvas.setActiveObject(object);
        canvas.requestRenderAll();

        updateProperties();
        updateLayers();
        saveHistory();
    });

    
    // --------------------------------------------------
    // OBJECT SELECTION AND PROPERTIES
    // --------------------------------------------------

    function updateProperties() {
        const object = getSelected();

        const isValid = object && object !== baseImage;

        $("noSelection").hidden = Boolean(isValid);
        $("objectProperties").hidden = !isValid;

        if (!isValid) return;

        $("objectName").value = object.watermarkName || "";

        const isText = object.watermarkType === "text";

        $("textProperties").hidden = !isText;

        if (isText) {
            $("objectText").value = object.text || "";
            $("fontFamily").value = object.fontFamily || "Arial";
            $("fontSize").value = Math.round(object.fontSize || 48);
            $("fontColor").value = object.fill || "#ffffff";
            $("fontBold").checked = object.fontWeight === "bold";
            $("fontItalic").checked = object.fontStyle === "italic";
        }

        $("objectOpacity").value = Math.round((object.opacity ?? 1) * 100);
        $("opacityValue").textContent = `${$("objectOpacity").value}%`;

        $("objectRotation").value = Math.round(object.angle || 0);
        $("rotationValue").textContent = `${Math.round(object.angle || 0)}°`;

        $("objectX").value = Math.round(object.left || 0);
        $("objectY").value = Math.round(object.top || 0);
        $("objectWidth").value = Math.round(object.getScaledWidth());
        $("objectHeight").value = Math.round(object.getScaledHeight());

        updateLockButton();
    }

    function updateLockButton() {
        const object = getSelected();
        if (!object || object === baseImage) return;

        $("lockButton").textContent = object.locked
            ? tr("unlock")
            : tr("lock");
    }

    canvas.on("selection:created", () => {
        updateProperties();
        updateLayers();
    });

    canvas.on("selection:updated", () => {
        updateProperties();
        updateLayers();
    });

    canvas.on("selection:cleared", () => {
        updateProperties();
        updateLayers();
    });

    canvas.on("object:modified", () => {
        updateProperties();
        updateLayers();
        saveHistory();
    });

    canvas.on("object:moving", updateProperties);
    canvas.on("object:scaling", updateProperties);
    canvas.on("object:rotating", updateProperties);

    canvas.on("text:changed", () => {
        updateProperties();
        saveHistory();
    });

    // --------------------------------------------------
    // PROPERTY INPUTS
    // --------------------------------------------------

    function updateSelectedObject(callback) {
        const object = getSelected();

        if (!object || object === baseImage || object.locked) return;

        callback(object);
        object.setCoords();

        canvas.requestRenderAll();
        updateProperties();
        updateLayers();
        saveHistory();
    }

    $("objectName").addEventListener("input", (event) => {
        updateSelectedObject((object) => {
            object.watermarkName = event.target.value;
        });
        updateLayers();
    });

    $("objectText").addEventListener("input", (event) => {
        updateSelectedObject((object) => {
            object.set("text", event.target.value);
        });
    });

    $("fontFamily").addEventListener("change", (event) => {
        updateSelectedObject((object) => {
            object.set("fontFamily", event.target.value);
        });
    });

    $("fontSize").addEventListener("input", (event) => {
        const value = Math.max(1, Math.min(500, Number(event.target.value) || 1));

        updateSelectedObject((object) => {
            object.set("fontSize", value);
        });
    });

    $("fontColor").addEventListener("input", (event) => {
        updateSelectedObject((object) => {
            object.set("fill", event.target.value);
        });
    });

    $("fontBold").addEventListener("change", (event) => {
        updateSelectedObject((object) => {
            object.set("fontWeight", event.target.checked ? "bold" : "normal");
        });
    });

    $("fontItalic").addEventListener("change", (event) => {
        updateSelectedObject((object) => {
            object.set("fontStyle", event.target.checked ? "italic" : "normal");
        });
    });

    $("objectOpacity").addEventListener("input", (event) => {
        const value = Number(event.target.value);

        $("opacityValue").textContent = `${value}%`;

        updateSelectedObject((object) => {
            object.set("opacity", value / 100);
        });
    });

    $("objectRotation").addEventListener("input", (event) => {
        const value = Number(event.target.value);

        $("rotationValue").textContent = `${value}°`;

        updateSelectedObject((object) => {
            object.rotate(value);
        });
    });

    $("objectX").addEventListener("change", (event) => {
        updateSelectedObject((object) => {
            object.set("left", Number(event.target.value) || 0);
        });
    });

    $("objectY").addEventListener("change", (event) => {
        updateSelectedObject((object) => {
            object.set("top", Number(event.target.value) || 0);
        });
    });

    $("objectWidth").addEventListener("change", (event) => {
        const object = getSelected();
        if (!object || object === baseImage || object.locked) return;

        const value = Math.max(1, Number(event.target.value) || 1);
        const currentWidth = object.width || 1;

        object.set("scaleX", value / currentWidth);
        object.setCoords();

        canvas.requestRenderAll();
        updateProperties();
        saveHistory();
    });

    $("objectHeight").addEventListener("change", (event) => {
        const object = getSelected();
        if (!object || object === baseImage || object.locked) return;

        const value = Math.max(1, Number(event.target.value) || 1);
        const currentHeight = object.height || 1;

        object.set("scaleY", value / currentHeight);
        object.setCoords();

        canvas.requestRenderAll();
        updateProperties();
        saveHistory();
    });

    // --------------------------------------------------
    // DUPLICATE / DELETE / LOCK
    // --------------------------------------------------

    $("duplicateButton").addEventListener("click", async () => {
        const object = getSelected();

        if (!object || object === baseImage) {
            setStatus(tr("noObject"));
            return;
        }

        const clone = await object.clone([
            "watermarkName",
            "watermarkType",
            "locked"
        ]);

        clone.set({
            left: object.left + 20,
            top: object.top + 20,
            watermarkName: `${object.watermarkName || tr("layer")} copy`,
            locked: false,
            selectable: true,
            evented: true
        });
       applySelectionStyle(clone);
        canvas.add(clone);
        canvas.setActiveObject(clone);
        canvas.requestRenderAll();

        updateProperties();
        updateLayers();
        saveHistory();
    });

    $("deleteButton").addEventListener("click", () => {
        const object = getSelected();

        if (!object || object === baseImage) {
            setStatus(tr("noObject"));
            return;
        }

        canvas.remove(object);
        canvas.discardActiveObject();
        canvas.requestRenderAll();

        updateProperties();
        updateLayers();
        saveHistory();

        setStatus(tr("deleted"));
    });

    $("lockButton").addEventListener("click", () => {
        const object = getSelected();

        if (!object || object === baseImage) return;

        object.locked = !object.locked;

        object.set({
            selectable: !object.locked,
            evented: !object.locked,
            lockMovementX: object.locked,
            lockMovementY: object.locked,
            lockScalingX: object.locked,
            lockScalingY: object.locked,
            lockRotation: object.locked,
            hasControls: !object.locked
        });

        canvas.discardActiveObject();
        canvas.setActiveObject(object);
        canvas.requestRenderAll();

        updateProperties();
        updateLayers();
        updateLockButton();
        saveHistory();

        setStatus(object.locked ? tr("locked") : tr("unlocked"));
    });

    // --------------------------------------------------
    // LAYERS
    // --------------------------------------------------

    function updateLayers() {
        const list = $("layerList");
        const objects = getObjects().slice().reverse();

        list.innerHTML = "";
        $("layerCount").textContent = objects.length;

        if (objects.length === 0) {
            const empty = document.createElement("p");
            empty.id = "emptyLayers";
            empty.textContent = tr("emptyLayers");
            list.appendChild(empty);
            return;
        }

        objects.forEach((object) => {
            const item = document.createElement("div");
            item.className = "layer-item";

            if (object === getSelected()) {
                item.classList.add("active");
            }

            const name = document.createElement("button");
            name.type = "button";
            name.className = "layer-item-name";
            name.textContent = object.watermarkName || tr("layer");
            name.title = name.textContent;

            name.addEventListener("click", () => {
                if (object.locked) {
                    canvas.discardActiveObject();
                } else {
                    canvas.setActiveObject(object);
                }

                canvas.requestRenderAll();
                updateProperties();
                updateLayers();
            });

            const visibility = document.createElement("button");
            visibility.type = "button";
            visibility.className = "layer-action";
            visibility.textContent = object.visible === false ? "◌" : "◉";
            visibility.title = object.visible === false ? tr("hidden") : tr("visible");

            visibility.addEventListener("click", () => {
                object.set("visible", object.visible === false);
                canvas.requestRenderAll();
                updateLayers();
                saveHistory();
            });

            const lock = document.createElement("button");
            lock.type = "button";
            lock.className = "layer-action";
            lock.textContent = object.locked ? "🔒" : "🔓";
            lock.title = object.locked ? tr("unlock") : tr("lock");

            lock.addEventListener("click", () => {
                object.locked = !object.locked;

                object.set({
                    selectable: !object.locked,
                    evented: !object.locked,
                    lockMovementX: object.locked,
                    lockMovementY: object.locked,
                    lockScalingX: object.locked,
                    lockScalingY: object.locked,
                    lockRotation: object.locked,
                    hasControls: !object.locked
                });

                if (object === getSelected()) {
                    canvas.discardActiveObject();
                }

                canvas.requestRenderAll();
                updateProperties();
                updateLayers();
                saveHistory();
            });

            item.append(name, visibility, lock);
            list.appendChild(item);
        });
    }

    // Katmanlar / özellikler sekmeleri
    document.querySelectorAll(".sidebar-tab").forEach((button) => {
        button.addEventListener("click", () => {
            document.querySelectorAll(".sidebar-tab").forEach((tab) => {
                tab.classList.remove("active");
            });

            document.querySelectorAll(".sidebar-content").forEach((panel) => {
                panel.classList.remove("active");
            });

            button.classList.add("active");
            $(button.dataset.tab).classList.add("active");
        });
    });

    
    // --------------------------------------------------
    // LAYER ORDER
    // --------------------------------------------------

    function changeLayerOrder(direction) {
        const object = getSelected();

        if (!object || object === baseImage) return;

        if (direction === "front") {
            canvas.bringObjectForward(object);
        } else {
            canvas.sendObjectBackwards(object);
        }

        // Ana görsel daima en altta kalmalı.
        if (baseImage) {
            canvas.sendObjectToBack(baseImage);
        }

        canvas.requestRenderAll();
        updateLayers();
        saveHistory();
    }

    $("layerUpButton").addEventListener("click", () => {
        changeLayerOrder("front");
    });

    $("layerDownButton").addEventListener("click", () => {
        changeLayerOrder("back");
    });

    // --------------------------------------------------
    // DELETE KEY
    // --------------------------------------------------

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Delete") return;

        const target = event.target;

        // Yazı yazarken veya form alanındayken silme yapma.
        if (
            target.matches("input, textarea, select") ||
            target.isContentEditable
        ) {
            return;
        }

        const active = getSelected();

        // Canvas üzerindeki yazı düzenleniyorsa müdahale etme.
        if (active && active.isEditing) return;

        const objects = canvas.getActiveObjects().filter(
            (object) => object !== baseImage
        );

        if (objects.length === 0) return;

        event.preventDefault();

        canvas.remove(...objects);
        canvas.discardActiveObject();
        canvas.requestRenderAll();

        updateProperties();
        updateLayers();
        saveHistory();
    });

    // --------------------------------------------------
    // ZOOM
    // --------------------------------------------------

    $("zoomInButton").addEventListener("click", () => {
        if (!hasImage()) return;
        zoom = Math.min(zoom + 0.1, 2);
        applyZoom();
    });

    $("zoomOutButton").addEventListener("click", () => {
        if (!hasImage()) return;
        zoom = Math.max(zoom - 0.1, 0.2);
        applyZoom();
    });

    $("fitButton").addEventListener("click", fitCanvas);

    // --------------------------------------------------
    // EXPORT
    // --------------------------------------------------

    $("exportQuality").addEventListener("input", (event) => {
        $("exportQualityValue").textContent = `${event.target.value}%`;
    });

    $("exportButton").addEventListener("click", () => {
        if (!requireImage()) return;

        const format = $("exportFormat").value;
        const quality = Number($("exportQuality").value) / 100;

        const previousZoom = zoom;

        // Dışa aktarma öncesinde görüntüyü temel çalışma boyutuna al.
        canvas.setZoom(1);
        canvas.setDimensions({
            width: baseCanvasWidth,
            height: baseCanvasHeight
        });

        canvas.discardActiveObject();
        canvas.requestRenderAll();

        try {
            const multiplier = originalWidth / baseCanvasWidth;

            const dataURL = canvas.toDataURL({
                format,
                quality,
                multiplier
            });

            const link = document.createElement("a");
            link.href = dataURL;
            link.download = `ebtools-watermark.${format === "jpeg" ? "jpg" : format}`;
            document.body.appendChild(link);
            link.click();
            link.remove();

            setStatus(tr("exported"));
        } catch (error) {
            console.error("Export error:", error);
            setStatus("Export error");
        }

        zoom = previousZoom;
        applyZoom();
        updateProperties();
    });

    // --------------------------------------------------
    // INITIAL SETUP
    // --------------------------------------------------

    setLanguage(currentLanguage);
    updateProperties();
    updateLayers();
    updateHistoryButtons();
    updateZoomLabel();
});
