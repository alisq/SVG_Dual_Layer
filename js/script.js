const caps = ["butt", "round", "square"];
    const joins = ["miter", "round", "bevel"];

    function randomHexColor() {
      const hex = Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, "0");
      return `#${hex}`;
    }

    function randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const applyLayerSettings = (prefix, layerId) => {
      const path = document.querySelector(`#${layerId} path`);
      const strokeWidth = document.getElementById(`w${prefix}`).value;
      const cap = document.getElementById(`cap${prefix}`).value;
      const join = document.getElementById(`join${prefix}`).value;
      const dash = document.getElementById(`dash${prefix}`).checked;
      const dashL = document.getElementById(`dashLength${prefix}`).value;
      const gapL = document.getElementById(`gapLength${prefix}`).value;
      const color = document.getElementById(`color${prefix}`).value;

      path.setAttribute("stroke-width", strokeWidth);
      path.setAttribute("stroke-linecap", cap);
      path.setAttribute("stroke-linejoin", join);
      path.setAttribute("stroke", color);

      if (dash) {
        path.setAttribute("stroke-dasharray", `${dashL},${gapL}`);
      } else {
        path.removeAttribute("stroke-dasharray");
      }
    };

    const addLayerListeners = (prefix, layerId) => {
      document
        .querySelectorAll(`#layer${prefix}-controls input, #layer${prefix}-controls select`)
        .forEach((el) => el.addEventListener("input", () => applyLayerSettings(prefix, layerId)));

      document.getElementById(`dash${prefix}`).addEventListener("change", () => {
        document.getElementById(`dashControls${prefix}`).style.display =
          document.getElementById(`dash${prefix}`).checked ? "block" : "none";
        applyLayerSettings(prefix, layerId);
      });

      // Color sync between text and picker
      document.getElementById(`colorPicker${prefix}`).addEventListener("input", (e) => {
        document.getElementById(`color${prefix}`).value = e.target.value;
        applyLayerSettings(prefix, layerId);
      });

      document.getElementById(`color${prefix}`).addEventListener("input", (e) => {
        document.getElementById(`colorPicker${prefix}`).value = e.target.value;
        applyLayerSettings(prefix, layerId);
      });
    };

    // Randomize one layer's controls and apply
    function randomizeLayer(prefix, layerId) {
      document.getElementById(`w${prefix}`).value = (Math.random() * (40 - 0.5) + 0.5).toFixed(1);
      document.getElementById(`cap${prefix}`).value = caps[randomInt(0, caps.length - 1)];
      document.getElementById(`join${prefix}`).value = joins[randomInt(0, joins.length - 1)];
      const dashOn = Math.random() < 0.5;
      document.getElementById(`dash${prefix}`).checked = dashOn;
      document.getElementById(`dashControls${prefix}`).style.display = dashOn ? "block" : "none";
      document.getElementById(`dashLength${prefix}`).value = randomInt(1, 30);
      document.getElementById(`gapLength${prefix}`).value = randomInt(0, 30);
      const randomColor = randomHexColor();
      document.getElementById(`color${prefix}`).value = randomColor;
      document.getElementById(`colorPicker${prefix}`).value = randomColor;

      applyLayerSettings(prefix, layerId);
    }

    addLayerListeners(1, "layer1");
    addLayerListeners(2, "layer2");

    // Add randomize buttons listeners
    document.querySelectorAll(".randomize-layer").forEach((btn) => {
      btn.addEventListener("click", () => {
        const layer = btn.getAttribute("data-layer");
        randomizeLayer(layer, `layer${layer}`);
      });
    });

    // General randomize both layers
    document.getElementById("randomizeBoth").addEventListener("click", () => {
      randomizeLayer(1, "layer1");
      randomizeLayer(2, "layer2");
    });

    document.getElementById("invert").addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
    });

    document.getElementById("download").addEventListener("click", () => {
      const svg = document.getElementById("logo").outerHTML;
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "barrio5-layers.svg";
      a.click();
      URL.revokeObjectURL(url);
    });

    // Initialize
    applyLayerSettings(1, "layer1");
    applyLayerSettings(2, "layer2");