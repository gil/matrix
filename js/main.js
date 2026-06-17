import makeConfig from "./config.js";
import makeControlPanel from "./controlPanel.js";

document.addEventListener("touchmove", (e) => e.preventDefault(), {
	passive: false,
});

const supportsWebGPU = async () => {
	return window.GPUQueue != null && navigator.gpu != null && navigator.gpu.getPreferredCanvasFormat != null;
};

const isRunningSwiftShader = () => {
	const gl = document.createElement("canvas").getContext("webgl");
	const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
	const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
	return renderer.toLowerCase().includes("swiftshader");
};

document.body.onload = async () => {
	let canvas = null;
	let teardown = null;

	// (Re)build the entire effect from a map of URL-style string params.
	// The pipeline bakes config into GPU uniforms at construction time, so
	// changing any option means tearing down the old renderer and making a new one.
	const run = async (params) => {
		if (teardown != null) {
			teardown();
			teardown = null;
		}
		if (canvas != null) {
			canvas.remove();
		}

		canvas = document.createElement("canvas");
		document.body.insertBefore(canvas, document.body.firstChild);

		const config = makeConfig(params);
		const useWebGPU = (await supportsWebGPU()) && ["webgpu"].includes(config.renderer?.toLowerCase());
		const solution = await import(`./${useWebGPU ? "webgpu" : "regl"}/main.js`);
		teardown = await solution.default(canvas, config);
	};

	const urlParams = new URLSearchParams(window.location.search);
	const initialParams = Object.fromEntries(urlParams.entries());

	const startSwiftShaderNotice = (params) => {
		const notice = document.createElement("notice");
		notice.innerHTML = `<div class="notice">
		<p>Wake up, Neo... you've got hardware acceleration disabled.</p>
		<p>This project will still run, incredibly, but at a noticeably low framerate.</p>
		<button class="blue pill">Plug me in</button>
		<a class="red pill" target="_blank" href="https://www.google.com/search?q=chrome+enable+hardware+acceleration">Free me</a>
		`;
		document.body.appendChild(notice);
		document.querySelector(".blue.pill").addEventListener("click", async () => {
			notice.remove();
			params.suppressWarnings = "true";
			await launch(params);
		});
	};

	const launch = async (params) => {
		await run(params);

		// The control panel mutates `params`, updates the URL, and asks for a rebuild.
		makeControlPanel({
			params,
			rebuild: () => run(params),
			canvas: () => canvas,
		});
	};

	if (isRunningSwiftShader() && initialParams.suppressWarnings == null) {
		startSwiftShaderNotice(initialParams);
	} else {
		await launch(initialParams);
	}
};
