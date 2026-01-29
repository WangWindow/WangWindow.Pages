import {
	AUTO_MODE,
	DARK_MODE,
	DEFAULT_THEME,
	LIGHT_MODE,
} from "@constants/constants.ts";
import { expressiveCodeConfig } from "@/config";
import type { LIGHT_DARK_MODE } from "@/types/config";

function isBrowserEnv(): boolean {
	return typeof window !== "undefined" && typeof document !== "undefined";
}

function getSafeLocalStorage(): Storage | undefined {
	if (typeof localStorage === "undefined") {
		return undefined;
	}
	if (typeof localStorage.getItem !== "function") {
		return undefined;
	}
	return localStorage;
}

export function getDefaultHue(): number {
	const fallback = "250";
	if (!isBrowserEnv()) {
		return Number.parseInt(fallback, 10);
	}
	const configCarrier = document.getElementById("config-carrier");
	return Number.parseInt(configCarrier?.dataset.hue || fallback, 10);
}

export function getHue(): number {
	const storage = getSafeLocalStorage();
	const stored = storage?.getItem("hue");
	return stored ? Number.parseInt(stored, 10) : getDefaultHue();
}

export function setHue(hue: number): void {
	const storage = getSafeLocalStorage();
	storage?.setItem("hue", String(hue));
	if (!isBrowserEnv()) {
		return;
	}
	const r = document.querySelector(":root") as HTMLElement;
	if (!r) {
		return;
	}
	r.style.setProperty("--hue", String(hue));
}

export function applyThemeToDocument(theme: LIGHT_DARK_MODE) {
	if (!isBrowserEnv()) {
		return;
	}
	switch (theme) {
		case LIGHT_MODE:
			document.documentElement.classList.remove("dark");
			break;
		case DARK_MODE:
			document.documentElement.classList.add("dark");
			break;
		case AUTO_MODE:
			if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
			break;
	}

	// Set the theme for Expressive Code
	document.documentElement.setAttribute(
		"data-theme",
		expressiveCodeConfig.theme,
	);
}

export function setTheme(theme: LIGHT_DARK_MODE): void {
	const storage = getSafeLocalStorage();
	storage?.setItem("theme", theme);
	applyThemeToDocument(theme);
}

export function getStoredTheme(): LIGHT_DARK_MODE {
	const storage = getSafeLocalStorage();
	return (storage?.getItem("theme") as LIGHT_DARK_MODE) || DEFAULT_THEME;
}
