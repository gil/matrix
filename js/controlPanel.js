import makeConfig from "./config.js";
import colorToRGB from "./colorToRGB.js";

const versionNames = [
  "classic",
  "3d",
  "megacity",
  "operator",
  "nightmare",
  "paradise",
  "resurrections",
  "trinity",
  "morpheus",
  "bugs",
  "palimpsest",
  "twilight",
  "holoplay",
  "neomatrixology",
];

const fontNames = [
  "matrixcode",
  "resurrections",
  "megacity",
  "gothic",
  "coptic",
  "huberfishA",
  "huberfishD",
  "gtarg_tenretniolleh",
  "gtarg_alientext",
  "neomatrixology",
];

const effectNames = [
  "palette",
  "plain",
  "none",
  "pride",
  "trans",
  "stripes",
  "image",
  "mirror",
];

// Each field maps a URL param (`param`) to how it's edited and how its initial
// value is read back from the resolved config (`get`).
const schema = [
  {
    group: "Preset",
    fields: [
      {
        param: "version",
        label: "Version",
        type: "select",
        options: versionNames,
        get: (_, p) => p.version ?? "classic",
      },
      {
        param: "font",
        label: "Font",
        type: "select",
        options: fontNames,
        get: (c) => c.font,
      },
      {
        param: "effect",
        label: "Effect",
        type: "select",
        options: effectNames,
        get: (c) => c.effect,
      },
    ],
  },
  {
    group: "Grid & shape",
    fields: [
      {
        param: "numColumns",
        label: "Columns",
        type: "range",
        min: 4,
        max: 200,
        step: 1,
        get: (c) => c.numColumns,
      },
      {
        param: "slant",
        label: "Slant (deg)",
        type: "range",
        min: -90,
        max: 90,
        step: 1,
        get: (c) => Math.round((c.slant * 180) / Math.PI),
      },
      {
        param: "raindropLength",
        label: "Raindrop length",
        type: "range",
        min: 0,
        max: 3,
        step: 0.05,
        get: (c) => c.raindropLength,
      },
      {
        param: "density",
        label: "Density (3D)",
        type: "range",
        min: 0.1,
        max: 3,
        step: 0.05,
        get: (c) => c.density,
      },
    ],
  },
  {
    group: "Glyphs",
    fields: [
      {
        param: "glyphFlip",
        label: "Flip glyphs",
        type: "checkbox",
        get: (c) => c.glyphFlip,
      },
      {
        param: "glyphRotation",
        label: "Rotation (deg)",
        type: "range",
        min: 0,
        max: 360,
        step: 90,
        get: (c) => c.glyphRotation,
      },
    ],
  },
  {
    group: "Motion",
    fields: [
      {
        param: "animationSpeed",
        label: "Animation speed",
        type: "range",
        min: 0,
        max: 3,
        step: 0.05,
        get: (c) => c.animationSpeed,
      },
      {
        param: "fallSpeed",
        label: "Fall speed",
        type: "range",
        min: -2,
        max: 2,
        step: 0.05,
        get: (c) => c.fallSpeed,
      },
      {
        param: "cycleSpeed",
        label: "Cycle speed",
        type: "range",
        min: 0,
        max: 0.5,
        step: 0.005,
        get: (c) => c.cycleSpeed,
      },
      {
        param: "forwardSpeed",
        label: "Forward speed (3D)",
        type: "range",
        min: 0,
        max: 2,
        step: 0.05,
        get: (c) => c.forwardSpeed,
      },
      {
        param: "fps",
        label: "FPS",
        type: "range",
        min: 1,
        max: 60,
        step: 1,
        get: (c) => c.fps,
      },
    ],
  },
  {
    group: "Depth",
    fields: [
      {
        param: "volumetric",
        label: "Volumetric (3D)",
        type: "checkbox",
        get: (c) => c.volumetric,
      },
    ],
  },
  {
    group: "Bloom & render",
    fields: [
      {
        param: "bloomSize",
        label: "Bloom size",
        type: "range",
        min: 0,
        max: 1,
        step: 0.01,
        get: (c) => c.bloomSize,
      },
      {
        param: "bloomStrength",
        label: "Bloom strength",
        type: "range",
        min: 0,
        max: 1,
        step: 0.01,
        get: (c) => c.bloomStrength,
      },
      {
        param: "ditherMagnitude",
        label: "Dither",
        type: "range",
        min: 0,
        max: 1,
        step: 0.01,
        get: (c) => c.ditherMagnitude,
      },
      {
        param: "resolution",
        label: "Resolution",
        type: "range",
        min: 0.1,
        max: 2,
        step: 0.05,
        get: (c) => c.resolution,
      },
    ],
  },
  {
    group: "Color",
    fields: [
      {
        param: "cursorIntensity",
        label: "Cursor intensity",
        type: "range",
        min: 0,
        max: 5,
        step: 0.1,
        get: (c) => c.cursorIntensity,
      },
      {
        param: "glyphIntensity",
        label: "Glyph intensity",
        type: "range",
        min: 0,
        max: 5,
        step: 0.1,
        get: (c) => c.glyphIntensity ?? 1,
      },
      {
        param: "backgroundRGB",
        label: "Background",
        type: "color",
        get: (c) => c.backgroundColor,
      },
      {
        param: "cursorRGB",
        label: "Cursor",
        type: "color",
        get: (c) => c.cursorColor,
      },
      {
        param: "glintRGB",
        label: "Glint",
        type: "color",
        get: (c) => c.glintColor,
      },
      {
        param: "palette",
        label: "Palette (R,G,B,%…)",
        type: "text",
        get: (_, p) => p.palette ?? "",
      },
      {
        param: "stripeColors",
        label: "Stripes (R,G,B…)",
        type: "text",
        get: (_, p) => p.stripeColors ?? "",
      },
    ],
  },
  {
    group: "Misc",
    fields: [
      {
        param: "url",
        label: "Image URL",
        type: "text",
        get: (_, p) => p.url ?? "",
      },
      {
        param: "camera",
        label: "Use camera",
        type: "checkbox",
        get: (c) => c.useCamera,
      },
      {
        param: "skipIntro",
        label: "Skip intro",
        type: "checkbox",
        get: (c) => c.skipIntro,
      },
      {
        param: "renderer",
        label: "Renderer",
        type: "select",
        options: ["regl", "webgpu"],
        get: (c) => c.renderer,
      },
    ],
  },
];

const toHex = (n) =>
  Math.round(Math.max(0, Math.min(1, n)) * 255)
    .toString(16)
    .padStart(2, "0");
const colorToHex = (color) => {
  const [r, g, b] = colorToRGB(color);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};
const hexToRGBParam = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b].map((n) => Math.round(n * 1000) / 1000).join(",");
};

const styles = `
	#mtx-panel-toggle {
		position: fixed; top: 12px; right: 12px; z-index: 10000;
		width: 40px; height: 40px; border-radius: 50%;
		background: rgba(0,20,0,0.6); border: 1px solid #0f0;
		color: #0f0; font: 22px/40px monospace; text-align: center;
		cursor: pointer; user-select: none; padding: 0;
		text-shadow: 0 0 6px #0f0; transition: background 0.2s, opacity 0.2s;
		display: none;
	}
	#mtx-panel-toggle.visible { display: block; }
	#mtx-panel-toggle:hover { background: rgba(0,60,0,0.8); }
	#mtx-panel {
		position: fixed; top: 0; right: 0; z-index: 9999;
		width: 320px; max-width: 90vw; height: 100vh;
		box-sizing: border-box; overflow-y: auto;
		background: rgba(0,8,0,0.92); border-left: 1px solid #0f0;
		color: #b6ffb6; font: 12px/1.4 monospace;
		padding: 56px 16px 24px; backdrop-filter: blur(2px);
		transform: translateX(100%); transition: transform 0.25s ease;
	}
	#mtx-panel.open { transform: translateX(0); }
	#mtx-panel h3 {
		margin: 18px 0 6px; color: #0f0; font-size: 11px;
		text-transform: uppercase; letter-spacing: 1px;
		border-bottom: 1px solid #063; padding-bottom: 3px;
	}
	#mtx-panel .row { margin: 8px 0; }
	#mtx-panel label { display: block; margin-bottom: 2px; color: #8f8; }
	#mtx-panel label .val { float: right; color: #0f0; }
	#mtx-panel input[type=range] { width: 100%; accent-color: #0f0; }
	#mtx-panel select, #mtx-panel input[type=text] {
		width: 100%; box-sizing: border-box; background: #001400;
		color: #b6ffb6; border: 1px solid #063; padding: 4px; font: 12px monospace;
	}
	#mtx-panel input[type=color] { width: 100%; height: 26px; background: none; border: 1px solid #063; }
	#mtx-panel input[type=checkbox] { accent-color: #0f0; }
	#mtx-panel .actions { display: flex; gap: 8px; margin-top: 18px; }
	#mtx-panel .actions button {
		flex: 1; background: #002a00; color: #0f0; border: 1px solid #0f0;
		padding: 8px; cursor: pointer; font: 11px monospace; text-transform: uppercase;
	}
	#mtx-panel .actions button:hover { background: #004400; }
`;

export default ({ params, rebuild, canvas }) => {
  const styleTag = document.createElement("style");
  styleTag.textContent = styles;
  document.head.appendChild(styleTag);

  const toggle = document.createElement("button");
  toggle.id = "mtx-panel-toggle";
  toggle.textContent = "✕";
  toggle.title = "Close controls";
  document.body.appendChild(toggle);

  const panel = document.createElement("div");
  panel.id = "mtx-panel";
  document.body.appendChild(panel);

  const setPanelOpen = (open) => {
    panel.classList.toggle("open", open);
    toggle.classList.toggle("visible", open); // close button only shows while open
  };
  toggle.addEventListener("click", () => setPanelOpen(false));
  // Click the animation itself to reveal the controls.
  const onCanvasClick = (e) => {
    if (e.detail > 1) return; // ignore double-clicks (fullscreen)
    if (!panel.classList.contains("open")) setPanelOpen(true);
  };
  const bindCanvas = () => canvas()?.addEventListener("click", onCanvasClick);
  bindCanvas();

  let debounceTimer = null;
  const apply = (immediate) => {
    const url = "?" + new URLSearchParams(params).toString();
    history.replaceState({}, "", url);
    clearTimeout(debounceTimer);
    const fire = async () => {
      await rebuild();
      bindCanvas(); // the canvas element is recreated on every rebuild
    };
    if (immediate) fire();
    else debounceTimer = setTimeout(fire, 200);
  };

  const setParam = (param, value, defaultValue) => {
    if (value === "" || value == null || value === defaultValue) {
      delete params[param];
    } else {
      params[param] = String(value);
    }
  };

  const render = () => {
    const config = makeConfig(params);
    panel.innerHTML = "";

    const title = document.createElement("h2");
    title.textContent = "Matrix controls";
    title.style.cssText =
      "color:#0f0;font-size:14px;margin:0 0 4px;text-shadow:0 0 6px #0f0;";
    panel.appendChild(title);

    for (const { group, fields } of schema) {
      const h = document.createElement("h3");
      h.textContent = group;
      panel.appendChild(h);

      for (const field of fields) {
        const row = document.createElement("div");
        row.className = "row";
        const value = field.get(config, params);

        if (field.type === "checkbox") {
          const label = document.createElement("label");
          const input = document.createElement("input");
          input.type = "checkbox";
          input.checked = !!value;
          input.style.marginRight = "6px";
          input.addEventListener("change", () => {
            setParam(field.param, input.checked ? "true" : "false");
            apply(true);
          });
          label.appendChild(input);
          label.appendChild(document.createTextNode(field.label));
          row.appendChild(label);
        } else if (field.type === "select") {
          const label = document.createElement("label");
          label.textContent = field.label;
          const select = document.createElement("select");
          for (const opt of field.options) {
            const o = document.createElement("option");
            o.value = opt;
            o.textContent = opt;
            if (opt === value) o.selected = true;
            select.appendChild(o);
          }
          select.addEventListener("change", () => {
            setParam(field.param, select.value);
            apply(true);
            render();
          });
          row.appendChild(label);
          row.appendChild(select);
        } else if (field.type === "color") {
          const label = document.createElement("label");
          label.textContent = field.label;
          const input = document.createElement("input");
          input.type = "color";
          input.value = colorToHex(value);
          input.addEventListener("input", () => {
            setParam(field.param, hexToRGBParam(input.value));
            apply(false);
          });
          row.appendChild(label);
          row.appendChild(input);
        } else if (field.type === "text") {
          const label = document.createElement("label");
          label.textContent = field.label;
          const input = document.createElement("input");
          input.type = "text";
          input.value = value;
          input.addEventListener("change", () => {
            setParam(field.param, input.value);
            apply(true);
          });
          row.appendChild(label);
          row.appendChild(input);
        } else if (field.type === "range") {
          const label = document.createElement("label");
          const valSpan = document.createElement("span");
          valSpan.className = "val";
          valSpan.textContent = value;
          label.textContent = field.label;
          label.appendChild(valSpan);
          const input = document.createElement("input");
          input.type = "range";
          input.min = field.min;
          input.max = field.max;
          input.step = field.step;
          input.value = value;
          input.addEventListener("input", () => {
            valSpan.textContent = input.value;
            setParam(field.param, input.value);
            apply(false);
          });
          row.appendChild(label);
          row.appendChild(input);
        }

        panel.appendChild(row);
      }
    }

    const actions = document.createElement("div");
    actions.className = "actions";

    const copyBtn = document.createElement("button");
    copyBtn.textContent = "Copy URL";
    copyBtn.addEventListener("click", () => {
      navigator.clipboard?.writeText(window.location.href);
      copyBtn.textContent = "Copied!";
      setTimeout(() => (copyBtn.textContent = "Copy URL"), 1200);
    });

    const resetBtn = document.createElement("button");
    resetBtn.textContent = "Reset";
    resetBtn.addEventListener("click", () => {
      for (const key of Object.keys(params)) delete params[key];
      apply(true);
      render();
    });

    actions.appendChild(copyBtn);
    actions.appendChild(resetBtn);
    panel.appendChild(actions);
  };

  render();
};
