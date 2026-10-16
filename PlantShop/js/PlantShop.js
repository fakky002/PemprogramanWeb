import { StrictMode, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import * as THREE from "three";
import { create } from "zustand";
//#region src/codepen/drei-shim.tsx
function OrbitControls$1({ makeDefault, target, ...options }) {
	const camera = useThree((s) => s.camera);
	const domElement = useThree((s) => s.gl.domElement);
	const set = useThree((s) => s.set);
	const get = useThree((s) => s.get);
	const controls = useMemo(() => new OrbitControls(camera, domElement), [camera, domElement]);
	useEffect(() => () => controls.dispose(), [controls]);
	useEffect(() => {
		Object.assign(controls, options);
		if (target) controls.target.set(target[0], target[1], target[2]);
		controls.update();
	});
	useEffect(() => {
		if (!makeDefault) return;
		const previous = get().controls;
		set({ controls });
		return () => set({ controls: previous });
	}, [
		makeDefault,
		controls,
		get,
		set
	]);
	useFrame(() => {
		controls.update();
	}, -1);
	return null;
}
/** A group that keeps facing the camera. */
function Billboard({ children, ...props }) {
	const ref = useRef(null);
	useFrame((state) => {
		ref.current?.quaternion.copy(state.camera.quaternion);
	});
	return /* @__PURE__ */ jsx("group", {
		ref,
		...props,
		children
	});
}
//#endregion
//#region src/game/species.ts
/**
* The seed catalogue.
*
* Balance intent: each species trades one axis against another so the choice is
* never just "buy the most expensive one I can afford".
*   - marigold / basil: cheap, fast, thin margins. The tutorial crop.
*   - tomato:   solid mid-game earner, moderately thirsty.
*   - lavender: slow but forgiving, good when you want to step away.
*   - aloe:     nearly zero upkeep (thirst 0.008 = ~2 minutes to dry out).
*   - monstera: high value, long commitment.
*   - orchid:   best margin in the game, but drains in ~25s. Demands attention.
*/
var SPECIES = [
	{
		id: "marigold",
		name: "Marigold",
		description: "Cheerful, fast, forgiving. Every shop starts here.",
		form: "flower",
		seedCost: 4,
		sellPrice: 11,
		growthSeconds: 35,
		thirst: .03,
		xp: 4,
		unlockLevel: 1,
		palette: {
			stem: "#4a7c3f",
			leaf: "#6aa84f",
			crown: "#f4a72c"
		}
	},
	{
		id: "basil",
		name: "Basil",
		description: "Kitchen staple. Sells steadily to anyone who cooks.",
		form: "herb",
		seedCost: 7,
		sellPrice: 18,
		growthSeconds: 50,
		thirst: .028,
		xp: 6,
		unlockLevel: 1,
		palette: {
			stem: "#3f6b34",
			leaf: "#7cb342",
			crown: "#9ccc65"
		}
	},
	{
		id: "chamomile",
		name: "Chamomile",
		description: "Tiny daisies, endlessly in demand. Drinks more than it looks like it should.",
		form: "flower",
		seedCost: 9,
		sellPrice: 24,
		growthSeconds: 60,
		thirst: .032,
		xp: 8,
		unlockLevel: 2,
		palette: {
			stem: "#5c8a4a",
			leaf: "#83b35f",
			crown: "#fdf3d0"
		}
	},
	{
		id: "tomato",
		name: "Tomato",
		description: "Heavy feeder, heavy drinker, heavy profits.",
		form: "fruit",
		seedCost: 12,
		sellPrice: 34,
		growthSeconds: 80,
		thirst: .025,
		xp: 12,
		unlockLevel: 2,
		palette: {
			stem: "#4c7a3a",
			leaf: "#6a9e4a",
			crown: "#e04b3a"
		}
	},
	{
		id: "lavender",
		name: "Lavender",
		description: "Slow to mature but barely thirsty. Plant it and go do something else.",
		form: "flower",
		seedCost: 18,
		sellPrice: 48,
		growthSeconds: 100,
		thirst: .018,
		xp: 18,
		unlockLevel: 3,
		palette: {
			stem: "#6b8f5e",
			leaf: "#8fbc8f",
			crown: "#9a7bc8"
		}
	},
	{
		id: "strawberry",
		name: "Strawberry",
		description: "Sweet, popular, and gone the moment you put it out.",
		form: "fruit",
		seedCost: 15,
		sellPrice: 40,
		growthSeconds: 90,
		thirst: .03,
		xp: 15,
		unlockLevel: 3,
		palette: {
			stem: "#4a7a3c",
			leaf: "#68a052",
			crown: "#d8354a"
		}
	},
	{
		id: "aloe",
		name: "Aloe",
		description: "Practically ignores you. Two full minutes before it wants water.",
		form: "succulent",
		seedCost: 26,
		sellPrice: 62,
		growthSeconds: 130,
		thirst: .008,
		xp: 26,
		unlockLevel: 4,
		palette: {
			stem: "#4f8a5b",
			leaf: "#6fbf7a",
			crown: "#7ab88a"
		}
	},
	{
		id: "fern",
		name: "Fern",
		description: "Wants damp air and constant attention. Bone dry in about twenty seconds.",
		form: "fern",
		seedCost: 22,
		sellPrice: 58,
		growthSeconds: 110,
		thirst: .048,
		xp: 20,
		unlockLevel: 4,
		palette: {
			stem: "#3d6b3a",
			leaf: "#4f8a45",
			crown: "#5d9c4e"
		}
	},
	{
		id: "monstera",
		name: "Monstera",
		description: "The houseplant everyone wants. Worth the wait.",
		form: "vine",
		seedCost: 40,
		sellPrice: 105,
		growthSeconds: 170,
		thirst: .022,
		xp: 45,
		unlockLevel: 5,
		palette: {
			stem: "#35603a",
			leaf: "#2f7d4f",
			crown: "#256b41"
		}
	},
	{
		id: "tulip",
		name: "Tulip",
		description: "A tidy cup of colour. Reliable money once you can grow it.",
		form: "bulb",
		seedCost: 34,
		sellPrice: 88,
		growthSeconds: 140,
		thirst: .02,
		xp: 32,
		unlockLevel: 5,
		palette: {
			stem: "#5d8f4f",
			leaf: "#77ab5e",
			crown: "#e0457b"
		}
	},
	{
		id: "bonsai",
		name: "Bonsai",
		description: "Decades of patience, compressed. Barely drinks, and sells for plenty.",
		form: "bonsai",
		seedCost: 55,
		sellPrice: 150,
		growthSeconds: 200,
		thirst: .012,
		xp: 55,
		unlockLevel: 6,
		palette: {
			stem: "#6b4f36",
			leaf: "#3f7a44",
			crown: "#356b3c"
		}
	},
	{
		id: "orchid",
		name: "Orchid",
		description: "Spectacular margins. Dries out in under half a minute. Do not wander off.",
		form: "flower",
		seedCost: 70,
		sellPrice: 190,
		growthSeconds: 220,
		thirst: .04,
		xp: 90,
		unlockLevel: 7,
		palette: {
			stem: "#5c8a63",
			leaf: "#7fae7f",
			crown: "#e668a7"
		}
	},
	{
		id: "bird-of-paradise",
		name: "Bird of Paradise",
		description: "The centrepiece of any shop. Thirsty, slow, and worth every second.",
		form: "bird",
		seedCost: 95,
		sellPrice: 265,
		growthSeconds: 260,
		thirst: .03,
		xp: 110,
		unlockLevel: 9,
		palette: {
			stem: "#4e7f4a",
			leaf: "#63a05a",
			crown: "#f0803a"
		}
	}
];
var BY_ID = new Map(SPECIES.map((s) => [s.id, s]));
/** Throws on unknown id — a bad species id is a bug, not a runtime condition. */
function getSpecies(id) {
	const s = BY_ID.get(id);
	if (!s) throw new Error(`Unknown species: ${id}`);
	return s;
}
var BENCH_TOP_Y = .75;
/** Pot positions across a table. Width is fixed; only depth grows. */
var COLUMNS = [
	-2.4,
	-1.2,
	0,
	1.2,
	2.4
];
/** z of the nearest table. */
var FIRST_TABLE_Z = 1.2;
var TABLE_SPACING = 1.9;
/** Clearance between the outermost tables and the end walls. */
var END_MARGIN = 1.7;
var BENCH_WIDTH = 5.8;
var BENCH_DEPTH = 1.1;
function tableZ(table) {
	return FIRST_TABLE_Z - table * TABLE_SPACING;
}
/** Front wall. Fixed, because tables grow away from the camera. */
function greenhouseFrontZ() {
	return 2.9;
}
function greenhouseBackZ(tables) {
	return tableZ(tables - 1) - END_MARGIN;
}
function greenhouseDepth(tables) {
	return greenhouseFrontZ() - greenhouseBackZ(tables);
}
/** Middle of the building, for aiming the camera. */
function greenhouseCenterZ(tables) {
	return (greenhouseFrontZ() + greenhouseBackZ(tables)) / 2;
}
function potSlot(index) {
	const table = Math.floor(index / 5);
	const column = COLUMNS[index % 5];
	if (column === void 0 || table >= 8) throw new Error(`No pot slot at index ${index}`);
	return {
		x: column,
		y: BENCH_TOP_Y,
		z: tableZ(table)
	};
}
//#endregion
//#region src/game/progression.ts
/**
* The two progression tracks.
*
* **Levels** come from selling and unlock new *species*.
* **Money** buys greenhouse expansions, which unlock *capacity*.
*
* They are deliberately separate: pots used to be handed out on level-up, which
* meant capacity and variety advanced in lockstep and neither felt like a
* decision. Now you choose when to reinvest.
*/
/** Total XP needed to advance *from* `level` to `level + 1`. */
function xpToNextLevel(level) {
	return Math.round(30 * Math.pow(level, 1.5));
}
/** Applies XP and rolls over as many levels as the amount earns. */
function applyXp(level, xp, amount) {
	let nextLevel = level;
	let nextXp = xp + amount;
	let gained = 0;
	while (nextXp >= xpToNextLevel(nextLevel)) {
		nextXp -= xpToNextLevel(nextLevel);
		nextLevel += 1;
		gained += 1;
	}
	return {
		level: nextLevel,
		xp: nextXp,
		gained
	};
}
/**
* Cost of each expansion, in order. Index 0 buys the *second* table, since the
* first comes with the greenhouse.
*
* Costs roughly double each step while a table's earning power only grows
* linearly, so expanding stays a real decision rather than an obvious one.
*/
var EXPANSIONS = [
	{
		table: 2,
		cost: 90,
		level: 2
	},
	{
		table: 3,
		cost: 240,
		level: 3
	},
	{
		table: 4,
		cost: 550,
		level: 4
	},
	{
		table: 5,
		cost: 1100,
		level: 5
	},
	{
		table: 6,
		cost: 2200,
		level: 7
	},
	{
		table: 7,
		cost: 4200,
		level: 9
	},
	{
		table: 8,
		cost: 7800,
		level: 11
	}
];
function potCapacity(tables) {
	return Math.min(8, Math.max(0, tables)) * 5;
}
/** The expansion a player with `tables` benches would buy next, or null if full. */
function nextExpansion(tables) {
	return EXPANSIONS[tables - 1] ?? null;
}
/** Below this moisture, growth starts slowing; at 0 it stops entirely. */
var WILT_THRESHOLD = .25;
/** How long a feed message stays on screen, in sim-seconds. */
var FEED_LIFETIME = 6;
/**
* Selectable speeds. Anything faster than 4x outruns the watering loop — plants
* dry out quicker than you can plausibly click them.
*/
var TIME_SCALES = [
	1,
	2,
	4
];
/** Sale events are dropped after this long; the renderer only needs one frame. */
var SALE_LIFETIME = 2;
var feedCounter = 0;
var saleCounter = 0;
function createWorld() {
	return {
		money: 25,
		xp: 0,
		level: 1,
		seeds: {},
		tables: 1,
		pots: Array.from({ length: 40 }, (_, id) => ({
			id,
			plant: null
		})),
		location: "greenhouse",
		paused: false,
		timeScale: 1,
		elapsed: 0,
		selectedSeed: null,
		feed: [],
		sales: [],
		stats: {
			planted: 0,
			sold: 0,
			earned: 0
		}
	};
}
function unlockedPotCount(world) {
	return potCapacity(world.tables);
}
function isPotUnlocked(world, potId) {
	return potId < unlockedPotCount(world);
}
function seedCount(world, speciesId) {
	return world.seeds[speciesId] ?? 0;
}
/**
* Fraction of full growth speed at a given moisture level.
* Full speed while comfortably watered, tapering linearly to a standstill at 0.
*/
function growthRateAt(moisture) {
	if (moisture <= 0) return 0;
	if (moisture >= .25) return 1;
	return moisture / WILT_THRESHOLD;
}
function isReady(plant) {
	return plant.growth >= 1;
}
function pushFeed(world, text, kind) {
	const entry = {
		id: ++feedCounter,
		text,
		kind,
		at: world.elapsed
	};
	return [...world.feed, entry].slice(-5);
}
/** Adds a message to the on-screen feed without otherwise changing the world. */
function notify(world, text, kind = "info") {
	return {
		...world,
		feed: pushFeed(world, text, kind)
	};
}
/**
* Advances the world by `dt` sim-seconds. Callers are responsible for not
* calling this while paused.
*
* Growth and moisture are integrated with a plain Euler step, which is fine at
* the rates involved; `dt` is clamped by the caller to survive tab-switching.
*/
function tickWorld(world, dt) {
	if (dt <= 0) return world;
	let changed = false;
	const pots = world.pots.map((pot) => {
		const plant = pot.plant;
		if (!plant) return pot;
		const species = getSpecies(plant.speciesId);
		const moisture = Math.max(0, plant.moisture - species.thirst * dt);
		const growth = plant.growth >= 1 ? 1 : Math.min(1, plant.growth + dt / species.growthSeconds * growthRateAt(plant.moisture));
		if (growth === plant.growth && moisture === plant.moisture) return pot;
		changed = true;
		return {
			...pot,
			plant: {
				...plant,
				growth,
				moisture
			}
		};
	});
	const elapsed = world.elapsed + dt;
	const feed = world.feed.filter((f) => elapsed - f.at < FEED_LIFETIME);
	const sales = world.sales.filter((s) => elapsed - s.at < SALE_LIFETIME);
	const listsChanged = feed.length !== world.feed.length || sales.length !== world.sales.length;
	if (!changed && !listsChanged) return {
		...world,
		elapsed
	};
	return {
		...world,
		elapsed,
		pots,
		feed,
		sales
	};
}
function setPaused(world, paused) {
	if (world.paused === paused) return world;
	return {
		...world,
		paused
	};
}
function togglePaused(world) {
	return {
		...world,
		paused: !world.paused
	};
}
/** Ignores speeds that are not on the dial, so a bad save cannot wedge time. */
function setTimeScale(world, timeScale) {
	if (!TIME_SCALES.includes(timeScale)) return world;
	if (world.timeScale === timeScale) return world;
	return {
		...world,
		timeScale,
		paused: false
	};
}
function setLocation(world, location) {
	if (world.location === location) return world;
	return {
		...world,
		location
	};
}
function selectSeed(world, speciesId) {
	const next = world.selectedSeed === speciesId ? null : speciesId;
	if (next !== null && seedCount(world, next) <= 0) return world;
	return {
		...world,
		selectedSeed: next
	};
}
function buySeed(world, speciesId, qty = 1) {
	const species = getSpecies(speciesId);
	if (species.unlockLevel > world.level) return world;
	const cost = species.seedCost * qty;
	if (cost > world.money) return {
		...world,
		feed: pushFeed(world, `Not enough money for ${species.name}`, "bad")
	};
	const seeds = {
		...world.seeds,
		[speciesId]: seedCount(world, speciesId) + qty
	};
	return {
		...world,
		money: world.money - cost,
		seeds,
		selectedSeed: speciesId,
		feed: pushFeed(world, `Bought ${species.name} seed -$${cost}`, "info")
	};
}
/**
* Buys the next bench. Refuses politely (with a message) when the player is
* short of money or level, and silently when the greenhouse is already full.
*/
function buyExpansion(world) {
	const expansion = nextExpansion(world.tables);
	if (!expansion || world.tables >= 8) return world;
	if (world.level < expansion.level) return notify(world, `Table ${expansion.table} needs level ${expansion.level}`, "bad");
	if (world.money < expansion.cost) return notify(world, `Table ${expansion.table} costs $${expansion.cost}`, "bad");
	return notify({
		...world,
		money: world.money - expansion.cost,
		tables: world.tables + 1
	}, `Greenhouse extended — +5 pots`, "good");
}
function plantSeed(world, potId, speciesId) {
	const pot = world.pots[potId];
	if (!pot || pot.plant) return world;
	if (!isPotUnlocked(world, potId)) return world;
	if (seedCount(world, speciesId) <= 0) return world;
	const species = getSpecies(speciesId);
	const remaining = seedCount(world, speciesId) - 1;
	const seeds = { ...world.seeds };
	if (remaining > 0) seeds[speciesId] = remaining;
	else delete seeds[speciesId];
	const pots = [...world.pots];
	pots[potId] = {
		...pot,
		plant: {
			speciesId,
			growth: 0,
			moisture: 1,
			plantedAt: world.elapsed
		}
	};
	const next = {
		...world,
		pots,
		seeds,
		selectedSeed: remaining > 0 ? speciesId : null,
		stats: {
			...world.stats,
			planted: world.stats.planted + 1
		}
	};
	return {
		...next,
		feed: pushFeed(next, `Planted ${species.name}`, "info")
	};
}
function waterPot(world, potId) {
	const pot = world.pots[potId];
	if (!pot?.plant) return world;
	if (pot.plant.moisture >= .999) return world;
	const pots = [...world.pots];
	pots[potId] = {
		...pot,
		plant: {
			...pot.plant,
			moisture: 1
		}
	};
	return {
		...world,
		pots
	};
}
function harvestPot(world, potId) {
	const pot = world.pots[potId];
	if (!pot?.plant || !isReady(pot.plant)) return world;
	const species = getSpecies(pot.plant.speciesId);
	const pots = [...world.pots];
	pots[potId] = {
		...pot,
		plant: null
	};
	const levelled = applyXp(world.level, world.xp, species.xp);
	const sale = {
		id: ++saleCounter,
		potId,
		amount: species.sellPrice,
		at: world.elapsed
	};
	let next = {
		...world,
		pots,
		money: world.money + species.sellPrice,
		xp: levelled.xp,
		level: levelled.level,
		sales: [...world.sales, sale],
		stats: {
			...world.stats,
			sold: world.stats.sold + 1,
			earned: world.stats.earned + species.sellPrice
		}
	};
	next = {
		...next,
		feed: pushFeed(next, `Sold ${species.name} +$${species.sellPrice}`, "good")
	};
	if (levelled.gained > 0) {
		const unlocked = SPECIES.filter((s) => s.unlockLevel > world.level && s.unlockLevel <= levelled.level);
		const suffix = unlocked.length > 0 ? ` — ${unlocked.map((s) => s.name).join(", ")} unlocked!` : "";
		next = {
			...next,
			feed: pushFeed(next, `Level ${levelled.level}!${suffix}`, "good")
		};
	}
	return next;
}
/**
* A single click on a pot, resolved contextually:
*   mature plant -> sell it
*   growing plant -> top up its water
*   empty pot + armed seed -> plant it
*/
function clickPot(world, potId) {
	if (!isPotUnlocked(world, potId)) return world;
	const pot = world.pots[potId];
	if (!pot) return world;
	if (pot.plant) return isReady(pot.plant) ? harvestPot(world, potId) : waterPot(world, potId);
	if (world.selectedSeed) return plantSeed(world, potId, world.selectedSeed);
	return world;
}
//#endregion
//#region src/game/saves.ts
/**
* All persistence lives here. Nothing else in the codebase touches localStorage.
*
* There are two kinds of save:
*   - the **autosave**, written continuously while playing and loaded on boot;
*   - three **manual slots**, written and read only when the player asks.
*
* Every read is defensive. A save is user-modifiable data on disk that may have
* been written by an older version of the game, so a bad one must degrade to
* "no save" rather than throwing on startup.
*/
var AUTOSAVE_KEY = "plant-shop:save";
var slotKey = (slot) => `plant-shop:slot:${slot}`;
/**
* Brings an older save up to the current shape.
*
* Runs on data that may predate a field entirely, so it works off what is
* actually present rather than trusting the merged defaults.
*
* - **Pot array length.** `MAX_POTS` grows when tables are added, and an old
*   save's shorter array would leave holes where new pots should be.
* - **Table count.** Saves written before expansions existed had pots granted by
*   level instead. Those players keep every pot they had: we buy them, for free,
*   however many tables it takes to cover their highest occupied slot.
*/
function migrate(world, raw) {
	const pots = Array.from({ length: 40 }, (_, id) => world.pots[id] ?? {
		id,
		plant: null
	});
	let tables = world.tables;
	if (raw.tables === void 0) {
		const highestUsed = pots.reduce((max, pot, i) => pot.plant ? i : max, -1);
		const needed = Math.ceil((highestUsed + 1) / 5);
		tables = Math.max(1, needed);
	}
	return {
		...world,
		pots,
		tables: Math.min(8, Math.max(1, tables))
	};
}
function read(key) {
	try {
		const raw = localStorage.getItem(key);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (parsed?.version !== 2 || !parsed.world) return null;
		const merged = {
			...createWorld(),
			...parsed.world,
			feed: [],
			sales: [],
			paused: false
		};
		return {
			version: 2,
			savedAt: typeof parsed.savedAt === "number" ? parsed.savedAt : 0,
			world: migrate(merged, parsed.world)
		};
	} catch {
		return null;
	}
}
function write(key, world) {
	try {
		const payload = {
			version: 2,
			savedAt: Date.now(),
			world
		};
		localStorage.setItem(key, JSON.stringify(payload));
		return true;
	} catch {
		return false;
	}
}
function loadAutosave() {
	return read(AUTOSAVE_KEY)?.world ?? createWorld();
}
var autosaveTimer = null;
var pendingWorld = null;
/**
* Debounced to at most once a second, since the sim calls this every tick.
*
* The pending world is *replaced* on every call rather than captured by the
* first one. Capturing would mean a burst of calls all resolve to whichever
* world happened to start the timer — up to a second of play silently lost.
*/
function scheduleAutosave(world) {
	pendingWorld = world;
	if (autosaveTimer !== null) return;
	autosaveTimer = setTimeout(() => {
		autosaveTimer = null;
		if (pendingWorld) write(AUTOSAVE_KEY, pendingWorld);
		pendingWorld = null;
	}, 1e3);
}
function cancelPendingAutosave() {
	if (autosaveTimer !== null) clearTimeout(autosaveTimer);
	autosaveTimer = null;
	pendingWorld = null;
}
/**
* Writes the autosave immediately, dropping anything already queued.
*
* Used after loading a slot and on reset. Going through `scheduleAutosave`
* instead would let an in-flight write from the *previous* game land a moment
* later and quietly overwrite the game you just loaded.
*/
function writeAutosaveNow(world) {
	cancelPendingAutosave();
	write(AUTOSAVE_KEY, world);
}
function clearAutosave() {
	cancelPendingAutosave();
	try {
		localStorage.removeItem(AUTOSAVE_KEY);
	} catch {}
}
function saveToSlot(slot, world) {
	return write(slotKey(slot), world);
}
function loadFromSlot(slot) {
	return read(slotKey(slot))?.world ?? null;
}
function deleteSlot(slot) {
	try {
		localStorage.removeItem(slotKey(slot));
	} catch {}
}
function summariseSlot(slot) {
	const file = read(slotKey(slot));
	if (!file) return null;
	return {
		slot,
		savedAt: file.savedAt,
		level: file.world.level,
		money: file.world.money,
		plants: file.world.pots.filter((p) => p.plant).length
	};
}
function listSlots() {
	return Array.from({ length: 3 }, (_, i) => summariseSlot(i));
}
//#endregion
//#region src/game/store.ts
/**
* The single source of truth for the running game.
*
* Read it two different ways depending on what you are building:
*
*  - **UI (React)**: subscribe with a narrow selector, e.g.
*    `useGame((s) => s.world.money)`. These values change only on discrete
*    events, so the HUD stays quiet during normal play.
*
*  - **3D (useFrame)**: do *not* subscribe. Call `useGame.getState()` inside the
*    frame loop and drive meshes imperatively. Plant growth changes every tick;
*    subscribing to it would re-render the scene graph continuously.
*/
/** Largest step we will ever simulate at once, in seconds. */
var MAX_STEP = .25;
/** Wraps a pure world action so every mutation goes through one place. */
function apply(set, fn) {
	set((s) => {
		const world = fn(s.world);
		if (world === s.world) return {};
		scheduleAutosave(world);
		return { world };
	});
}
var useGame = create((set, get) => ({
	world: loadAutosave(),
	saveRevision: 0,
	advance: (dt) => set((s) => {
		if (s.world.paused) return {};
		const world = tickWorld(s.world, Math.min(dt, MAX_STEP) * s.world.timeScale);
		if (world === s.world) return {};
		scheduleAutosave(world);
		return { world };
	}),
	clickPot: (potId) => apply(set, (w) => clickPot(w, potId)),
	buySeed: (speciesId, qty = 1) => apply(set, (w) => buySeed(w, speciesId, qty)),
	buyExpansion: () => apply(set, (w) => buyExpansion(w)),
	selectSeed: (speciesId) => apply(set, (w) => selectSeed(w, speciesId)),
	setLocation: (location) => apply(set, (w) => setLocation(w, location)),
	togglePaused: () => apply(set, (w) => togglePaused(w)),
	setPaused: (paused) => apply(set, (w) => setPaused(w, paused)),
	setTimeScale: (timeScale) => apply(set, (w) => setTimeScale(w, timeScale)),
	saveToSlot: (slot) => {
		const ok = saveToSlot(slot, get().world);
		set((s) => ({
			saveRevision: s.saveRevision + 1,
			world: notify(s.world, ok ? `Saved to slot ${slot + 1}` : "Could not save — storage unavailable", ok ? "good" : "bad")
		}));
	},
	loadFromSlot: (slot) => {
		const world = loadFromSlot(slot);
		if (!world) {
			set((s) => ({ world: notify(s.world, "That slot is empty", "bad") }));
			return;
		}
		writeAutosaveNow(world);
		set({ world: notify(world, `Loaded slot ${slot + 1}`, "good") });
	},
	deleteSlot: (slot) => {
		deleteSlot(slot);
		set((s) => ({ saveRevision: s.saveRevision + 1 }));
	},
	reset: () => {
		clearAutosave();
		set({ world: createWorld() });
	}
}));
//#endregion
//#region src/util/math.ts
function clamp(v, min, max) {
	return v < min ? min : v > max ? max : v;
}
function lerp(a, b, t) {
	return a + (b - a) * t;
}
/** Maps `v` from the range [a, b] onto [0, 1], clamped at both ends. */
function invLerp(a, b, v) {
	if (a === b) return 0;
	return clamp((v - a) / (b - a), 0, 1);
}
/** Smooth 0..1 ramp with zero slope at both ends. Used to fade parts in without popping. */
function smoothstep(a, b, v) {
	const t = invLerp(a, b, v);
	return t * t * (3 - 2 * t);
}
/** Decelerating ease, so plants shoot up early then settle into their final height. */
function easeOut(t) {
	return 1 - (1 - t) * (1 - t);
}
//#endregion
//#region src/three/plant.tsx
var FORM = {
	flower: {
		height: .95,
		leaves: true,
		leafSize: 1,
		crownScale: 1
	},
	herb: {
		height: .55,
		leaves: true,
		leafSize: 1.3,
		crownScale: .9
	},
	fruit: {
		height: .85,
		leaves: true,
		leafSize: 1.1,
		crownScale: 1
	},
	succulent: {
		height: .3,
		leaves: false,
		leafSize: 1,
		crownScale: 1.35
	},
	vine: {
		height: 1.1,
		leaves: true,
		leafSize: 1.6,
		crownScale: 1.1
	},
	fern: {
		height: .4,
		leaves: false,
		leafSize: 1,
		crownScale: 1.25
	},
	bulb: {
		height: .85,
		leaves: true,
		leafSize: 1.5,
		crownScale: 1
	},
	bonsai: {
		height: .42,
		leaves: false,
		leafSize: 1,
		crownScale: 1.5
	},
	bird: {
		height: 1,
		leaves: true,
		leafSize: 1.7,
		crownScale: 1.2
	}
};
/** Growth value at which each part starts fading in. */
var APPEAR = {
	stem: .05,
	leaf: [
		.12,
		.38,
		.62
	],
	crown: .72
};
/** How much growth a part takes to fade fully in. */
var FADE = .1;
/** Height up the stem at which each leaf pair sits, as a fraction. */
var LEAF_HEIGHT = [
	.32,
	.58,
	.82
];
var NAMES = {
	stem: "stem",
	leaf: (i) => `leaf${i}`,
	crown: "crown"
};
function Crown({ form, color }) {
	const material = /* @__PURE__ */ jsx("meshStandardMaterial", {
		color,
		flatShading: true,
		roughness: .7
	});
	switch (form) {
		case "flower": return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("mesh", {
			castShadow: true,
			children: [/* @__PURE__ */ jsx("icosahedronGeometry", { args: [.1, 0] }), material]
		}), [
			0,
			1,
			2,
			3,
			4
		].map((i) => {
			const a = i / 5 * Math.PI * 2;
			return /* @__PURE__ */ jsxs("mesh", {
				castShadow: true,
				position: [
					Math.cos(a) * .13,
					.01,
					Math.sin(a) * .13
				],
				scale: [
					1,
					.5,
					1
				],
				children: [/* @__PURE__ */ jsx("icosahedronGeometry", { args: [.085, 0] }), material]
			}, i);
		})] });
		case "herb": return /* @__PURE__ */ jsx(Fragment, { children: [
			0,
			1,
			2,
			3,
			4
		].map((i) => {
			const a = i / 5 * Math.PI * 2;
			return /* @__PURE__ */ jsxs("mesh", {
				castShadow: true,
				position: [
					Math.cos(a) * .1,
					.06,
					Math.sin(a) * .1
				],
				rotation: [
					Math.cos(a) * .4,
					0,
					-Math.sin(a) * .4
				],
				children: [/* @__PURE__ */ jsx("coneGeometry", { args: [
					.08,
					.24,
					5
				] }), material]
			}, i);
		}) });
		case "fruit": return /* @__PURE__ */ jsx(Fragment, { children: [
			[
				.12,
				0,
				.05
			],
			[
				-.1,
				-.04,
				-.08
			],
			[
				.01,
				.06,
				.12
			]
		].map((p, i) => /* @__PURE__ */ jsxs("mesh", {
			castShadow: true,
			position: p,
			children: [/* @__PURE__ */ jsx("icosahedronGeometry", { args: [.1, 0] }), material]
		}, i)) });
		case "succulent": return /* @__PURE__ */ jsx(Fragment, { children: [
			0,
			1,
			2,
			3,
			4,
			5
		].map((i) => {
			const a = i / 6 * Math.PI * 2;
			return /* @__PURE__ */ jsxs("mesh", {
				castShadow: true,
				position: [
					Math.cos(a) * .09,
					.14,
					Math.sin(a) * .09
				],
				rotation: [
					Math.cos(a) * .55,
					0,
					-Math.sin(a) * .55
				],
				children: [/* @__PURE__ */ jsx("coneGeometry", { args: [
					.055,
					.42,
					4
				] }), material]
			}, i);
		}) });
		case "vine": return /* @__PURE__ */ jsx(Fragment, { children: [
			0,
			1,
			2
		].map((i) => {
			const a = i / 3 * Math.PI * 2;
			return /* @__PURE__ */ jsxs("mesh", {
				castShadow: true,
				position: [
					Math.cos(a) * .16,
					i * .04,
					Math.sin(a) * .16
				],
				rotation: [
					.3,
					-a,
					0
				],
				children: [/* @__PURE__ */ jsx("boxGeometry", { args: [
					.34,
					.02,
					.26
				] }), material]
			}, i);
		}) });
		case "fern": return /* @__PURE__ */ jsx(Fragment, { children: [
			0,
			1,
			2,
			3,
			4,
			5,
			6
		].map((i) => {
			const a = i / 7 * Math.PI * 2;
			return /* @__PURE__ */ jsxs("mesh", {
				castShadow: true,
				position: [
					Math.cos(a) * .16,
					.12,
					Math.sin(a) * .16
				],
				rotation: [
					Math.cos(a) * .95,
					-a,
					-Math.sin(a) * .95
				],
				scale: [
					1,
					1,
					.35
				],
				children: [/* @__PURE__ */ jsx("coneGeometry", { args: [
					.09,
					.62,
					4
				] }), material]
			}, i);
		}) });
		case "bulb": return /* @__PURE__ */ jsx(Fragment, { children: [
			0,
			1,
			2,
			3,
			4
		].map((i) => {
			const a = i / 5 * Math.PI * 2;
			return /* @__PURE__ */ jsxs("mesh", {
				castShadow: true,
				position: [
					Math.cos(a) * .075,
					.1,
					Math.sin(a) * .075
				],
				rotation: [
					Math.cos(a) * -.35,
					-a,
					Math.sin(a) * .35
				],
				scale: [
					.75,
					1,
					.75
				],
				children: [/* @__PURE__ */ jsx("coneGeometry", { args: [
					.075,
					.26,
					4
				] }), material]
			}, i);
		}) });
		case "bonsai": return /* @__PURE__ */ jsx(Fragment, { children: [
			[
				0,
				.1,
				0,
				.22
			],
			[
				.21,
				-.01,
				.06,
				.15
			],
			[
				-.19,
				.02,
				-.07,
				.16
			],
			[
				.04,
				.18,
				-.16,
				.13
			]
		].map(([dx, dy, dz, r], i) => /* @__PURE__ */ jsxs("mesh", {
			castShadow: true,
			position: [
				dx ?? 0,
				dy ?? 0,
				dz ?? 0
			],
			scale: [
				1,
				.55,
				1
			],
			children: [/* @__PURE__ */ jsx("icosahedronGeometry", { args: [r ?? .16, 0] }), material]
		}, i)) });
		case "bird": return /* @__PURE__ */ jsx(Fragment, { children: [
			0,
			1,
			2
		].map((i) => {
			const a = -.5 + i * .5;
			return /* @__PURE__ */ jsxs("mesh", {
				castShadow: true,
				position: [
					Math.sin(a) * .1,
					.08 + i * .05,
					0
				],
				rotation: [
					0,
					0,
					.5 + a
				],
				scale: [
					1,
					1,
					.3
				],
				children: [/* @__PURE__ */ jsx("coneGeometry", { args: [
					.1,
					.44,
					3
				] }), material]
			}, i);
		}) });
	}
}
function LeafPair({ size, color, twist }) {
	return /* @__PURE__ */ jsx("group", {
		rotation: [
			0,
			twist,
			0
		],
		children: [-1, 1].map((side) => /* @__PURE__ */ jsxs("mesh", {
			castShadow: true,
			position: [
				side * .11 * size,
				0,
				0
			],
			rotation: [
				0,
				0,
				side * -.45
			],
			scale: [
				size,
				size * .35,
				size
			],
			children: [/* @__PURE__ */ jsx("icosahedronGeometry", { args: [.11, 0] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
				color,
				flatShading: true,
				roughness: .8
			})]
		}, side))
	});
}
/**
* A plant's full scene graph, at rest. Position it so its origin sits on the
* soil surface; `updatePlant` handles everything from there.
*/
function PlantMesh({ species }) {
	const profile = FORM[species.form];
	return /* @__PURE__ */ jsxs("group", { children: [
		/* @__PURE__ */ jsx("group", {
			name: NAMES.stem,
			children: /* @__PURE__ */ jsxs("mesh", {
				castShadow: true,
				position: [
					0,
					.5,
					0
				],
				children: [/* @__PURE__ */ jsx("cylinderGeometry", { args: [
					.028,
					.05,
					1,
					6
				] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
					color: species.palette.stem,
					flatShading: true,
					roughness: .85
				})]
			})
		}),
		profile.leaves && LEAF_HEIGHT.map((_, i) => /* @__PURE__ */ jsx("group", {
			name: NAMES.leaf(i),
			children: /* @__PURE__ */ jsx(LeafPair, {
				size: profile.leafSize,
				color: species.palette.leaf,
				twist: i * 1.9
			})
		}, i)),
		/* @__PURE__ */ jsx("group", {
			name: NAMES.crown,
			children: /* @__PURE__ */ jsx(Crown, {
				form: species.form,
				color: species.palette.crown
			})
		})
	] });
}
/** Resolves the named parts once, so the frame loop is not doing name lookups. */
function collectParts(root) {
	return {
		stem: root.getObjectByName(NAMES.stem) ?? null,
		leaves: LEAF_HEIGHT.map((_, i) => root.getObjectByName(NAMES.leaf(i)) ?? null),
		crown: root.getObjectByName(NAMES.crown) ?? null
	};
}
/**
* Drives a plant's visuals from its simulation state.
*
* @param growth   0..1 from the simulation.
* @param moisture 0..1; a parched plant droops and desaturates.
* @param time     Seconds, for the idle sway. Pass a paused-aware clock so the
*                 world visibly stops when the player pauses.
*/
function updatePlant(parts, form, growth, moisture, time, phase) {
	const profile = FORM[form];
	const height = lerp(.1, profile.height, easeOut(clamp(growth, 0, 1)));
	const droop = (1 - smoothstep(0, .35, moisture)) * .28;
	const sway = Math.sin(time * 1.1 + phase) * .025;
	if (parts.stem) {
		const t = smoothstep(APPEAR.stem, APPEAR.stem + FADE, growth);
		parts.stem.visible = t > 0;
		parts.stem.scale.set(1, height * t, 1);
		parts.stem.rotation.z = sway + droop * .5;
	}
	for (let i = 0; i < parts.leaves.length; i++) {
		const leaf = parts.leaves[i];
		if (!leaf) continue;
		const appearAt = APPEAR.leaf[i] ?? 1;
		const t = smoothstep(appearAt, appearAt + FADE, growth);
		leaf.visible = t > 0;
		if (t <= 0) continue;
		leaf.position.y = height * (LEAF_HEIGHT[i] ?? .5);
		leaf.position.x = leaf.position.y * (sway + droop * .5);
		leaf.scale.setScalar(t);
		leaf.rotation.z = -droop;
	}
	if (parts.crown) {
		const t = smoothstep(APPEAR.crown, APPEAR.crown + FADE, growth);
		parts.crown.visible = t > 0;
		if (t > 0) {
			const ready = growth >= 1 ? 1 : 0;
			const bob = ready * Math.sin(time * 2 + phase) * .02;
			parts.crown.position.y = height + .06 + bob;
			parts.crown.position.x = height * (sway + droop * .5);
			parts.crown.scale.setScalar(t * profile.crownScale);
			parts.crown.rotation.y = time * .25 * ready + phase;
			parts.crown.rotation.z = -droop;
		}
	}
}
//#endregion
//#region src/three/PotObject.tsx
/**
* One pot slot in the greenhouse.
*
* Reactive subscriptions are deliberately limited to values that change on
* discrete events (which species is planted, whether the slot is unlocked).
* Growth and moisture are polled imperatively in `useFrame`, so a maturing
* greenhouse costs zero React renders.
*/
var SOIL_DRY = new THREE.Color("#9a8264");
var SOIL_WET = new THREE.Color("#4a3527");
var CLAY = new THREE.Color("#c1714a");
var CLAY_HOVER = new THREE.Color("#e0916a");
var GLOW = new THREE.Color("#ffd166");
/**
* Pot proportions.
*
* The soil is a solid plug filling the shell from just above the base up to
* `SOIL_SURFACE_Y`, leaving a shallow indent below the rim. It has to be solid:
* a thin disc floating mid-pot leaves a visible hollow underneath it.
*/
var RIM_Y = .34;
var SOIL_SURFACE_Y = .28;
var SOIL_HEIGHT = .24000000000000002;
/** How high above the plant's crown the ready-to-sell ring floats. */
var RING_LIFT = .55;
function PotObject({ potId }) {
	const slot = potSlot(potId);
	const speciesId = useGame((s) => s.world.pots[potId]?.plant?.speciesId ?? null);
	const unlocked = useGame((s) => potId < potCapacity(s.world.tables));
	const clickPot = useGame((s) => s.clickPot);
	const [hovered, setHovered] = useState(false);
	const plantRoot = useRef(null);
	const parts = useRef(null);
	const soilMat = useRef(null);
	const droplet = useRef(null);
	const readyRing = useRef(null);
	const potGroup = useRef(null);
	const clayMat = useMemo(() => new THREE.MeshStandardMaterial({
		color: CLAY.clone(),
		flatShading: true,
		roughness: .9,
		side: THREE.DoubleSide
	}), []);
	useEffect(() => () => clayMat.dispose(), [clayMat]);
	useEffect(() => {
		parts.current = plantRoot.current ? collectParts(plantRoot.current) : null;
	}, [speciesId]);
	useEffect(() => {
		if (!hovered) return;
		document.body.style.cursor = "pointer";
		return () => {
			document.body.style.cursor = "auto";
		};
	}, [hovered]);
	useFrame(() => {
		const world = useGame.getState().world;
		const plant = world.pots[potId]?.plant ?? null;
		const time = world.elapsed;
		const phase = potId * 1.7;
		if (soilMat.current) soilMat.current.color.lerpColors(SOIL_DRY, SOIL_WET, plant ? plant.moisture : .15);
		const glow = clamp(1 - (plant ? time - plant.plantedAt : Infinity) / 2, 0, 1);
		const eased = glow * glow;
		clayMat.color.lerpColors(hovered ? CLAY_HOVER : CLAY, GLOW, eased * .75);
		clayMat.emissive.copy(GLOW);
		clayMat.emissiveIntensity = eased * 1.2;
		if (plant && parts.current && speciesId) updatePlant(parts.current, getSpecies(speciesId).form, plant.growth, plant.moisture, time, phase);
		if (droplet.current) {
			const show = !!plant && plant.moisture < .25;
			droplet.current.visible = show;
			if (show) {
				droplet.current.position.y = .95 + Math.sin(time * 3 + phase) * .05;
				const urgency = 1 - plant.moisture / WILT_THRESHOLD;
				droplet.current.scale.setScalar(lerp(.85, 1.2, urgency));
			}
		}
		if (readyRing.current) {
			const show = !!plant && plant.growth >= 1;
			readyRing.current.visible = show;
			if (show) {
				const top = parts.current?.crown?.position.y ?? .8;
				readyRing.current.position.y = top + RING_LIFT + Math.sin(time * 2 + phase) * .04;
				readyRing.current.rotation.y = time * 1.2;
			}
		}
		if (potGroup.current) {
			const target = hovered ? .04 : 0;
			potGroup.current.position.y += (target - potGroup.current.position.y) * .2;
		}
	});
	if (!unlocked) return /* @__PURE__ */ jsxs("mesh", {
		position: [
			slot.x,
			slot.y + .01,
			slot.z
		],
		rotation: [
			-Math.PI / 2,
			0,
			0
		],
		children: [/* @__PURE__ */ jsx("ringGeometry", { args: [
			.16,
			.24,
			12
		] }), /* @__PURE__ */ jsx("meshBasicMaterial", {
			color: "#9fb0a0",
			transparent: true,
			opacity: .35,
			side: THREE.DoubleSide
		})]
	});
	return /* @__PURE__ */ jsx("group", {
		position: [
			slot.x,
			slot.y,
			slot.z
		],
		onClick: (e) => {
			e.stopPropagation();
			clickPot(potId);
		},
		onPointerOver: (e) => {
			e.stopPropagation();
			setHovered(true);
		},
		onPointerOut: () => setHovered(false),
		children: /* @__PURE__ */ jsxs("group", {
			ref: potGroup,
			children: [
				/* @__PURE__ */ jsx("mesh", {
					castShadow: true,
					receiveShadow: true,
					position: [
						0,
						RIM_Y / 2,
						0
					],
					material: clayMat,
					children: /* @__PURE__ */ jsx("cylinderGeometry", { args: [
						.25,
						.19,
						RIM_Y,
						10,
						1,
						true
					] })
				}),
				/* @__PURE__ */ jsxs("mesh", {
					castShadow: true,
					position: [
						0,
						.03,
						0
					],
					children: [/* @__PURE__ */ jsx("cylinderGeometry", { args: [
						.2,
						.19,
						.06,
						10
					] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
						color: "#a85c3a",
						flatShading: true,
						roughness: .9
					})]
				}),
				/* @__PURE__ */ jsx("mesh", {
					castShadow: true,
					position: [
						0,
						RIM_Y,
						0
					],
					rotation: [
						-Math.PI / 2,
						0,
						0
					],
					material: clayMat,
					children: /* @__PURE__ */ jsx("torusGeometry", { args: [
						.245,
						.028,
						6,
						12
					] })
				}),
				/* @__PURE__ */ jsxs("mesh", {
					receiveShadow: true,
					position: [
						0,
						.16,
						0
					],
					children: [/* @__PURE__ */ jsx("cylinderGeometry", { args: [
						.225,
						.19,
						SOIL_HEIGHT,
						10
					] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
						ref: soilMat,
						flatShading: true,
						roughness: 1
					})]
				}),
				/* @__PURE__ */ jsx("group", {
					ref: plantRoot,
					position: [
						0,
						SOIL_SURFACE_Y,
						0
					],
					children: speciesId && /* @__PURE__ */ jsx(PlantMesh, { species: getSpecies(speciesId) })
				}),
				/* @__PURE__ */ jsxs("group", {
					ref: droplet,
					visible: false,
					position: [
						.3,
						.95,
						0
					],
					children: [/* @__PURE__ */ jsxs("mesh", {
						rotation: [
							Math.PI,
							0,
							0
						],
						children: [/* @__PURE__ */ jsx("coneGeometry", { args: [
							.07,
							.13,
							6
						] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
							color: "#4aa3e0",
							flatShading: true,
							emissive: "#1d5f8f"
						})]
					}), /* @__PURE__ */ jsxs("mesh", {
						position: [
							0,
							-.07,
							0
						],
						children: [/* @__PURE__ */ jsx("sphereGeometry", { args: [
							.07,
							8,
							6
						] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
							color: "#4aa3e0",
							flatShading: true,
							emissive: "#1d5f8f"
						})]
					})]
				}),
				/* @__PURE__ */ jsx("group", {
					ref: readyRing,
					visible: false,
					children: /* @__PURE__ */ jsxs("mesh", {
						rotation: [
							-Math.PI / 2,
							0,
							0
						],
						children: [/* @__PURE__ */ jsx("torusGeometry", { args: [
							.17,
							.03,
							6,
							12
						] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
							color: "#f6c445",
							flatShading: true,
							emissive: "#8a6a10",
							emissiveIntensity: .6
						})]
					})
				})
			]
		})
	});
}
//#endregion
//#region src/three/CoinBurst.tsx
/**
* Gold coins that erupt from a pot when its plant is sold.
*
* One InstancedMesh holds every coin in flight, so a busy greenhouse costs a
* single draw call and zero React renders. The system watches `world.sales`
* from inside `useFrame` and remembers which sale ids it has already fired.
*
* Motion runs on *sim* time, not wall time: coins freeze mid-air when the game
* is paused and rain down faster at 4x, which keeps the effect part of the world
* rather than an overlay on top of it.
*/
var MAX_COINS = 320;
/** Coins per sale, scaled by takings so an orchid feels better than a marigold. */
var MIN_PER_SALE = 10;
var MAX_PER_SALE = 34;
var GRAVITY = -7.5;
var LIFETIME = 1.9;
/** Coins vanish once they fall this far below where they spawned. */
var FLOOR_DROP = -1.5;
function makeCoin() {
	return {
		active: false,
		age: 0,
		x: 0,
		y: 0,
		z: 0,
		vx: 0,
		vy: 0,
		vz: 0,
		spin: 0,
		spinSpeed: 0,
		tilt: 0,
		originY: 0
	};
}
function coinCount(amount) {
	return Math.max(MIN_PER_SALE, Math.min(MAX_PER_SALE, Math.round(MIN_PER_SALE + amount / 7)));
}
function CoinBurst() {
	const mesh = useRef(null);
	const coins = useMemo(() => Array.from({ length: MAX_COINS }, makeCoin), []);
	const fired = useRef(/* @__PURE__ */ new Set());
	const cursor = useRef(0);
	/** Previous `world.elapsed`, for deriving a paused-aware delta. */
	const lastElapsed = useRef(null);
	const dummy = useMemo(() => new THREE.Object3D(), []);
	useEffect(() => {
		if (!mesh.current) return;
		dummy.scale.setScalar(0);
		dummy.updateMatrix();
		for (let i = 0; i < MAX_COINS; i++) mesh.current.setMatrixAt(i, dummy.matrix);
		mesh.current.instanceMatrix.needsUpdate = true;
	}, [dummy]);
	function spawn(potId, amount) {
		const slot = potSlot(potId);
		const originY = slot.y + .5;
		const n = coinCount(amount);
		for (let i = 0; i < n; i++) {
			const coin = coins[cursor.current % MAX_COINS];
			cursor.current++;
			if (!coin) continue;
			const angle = Math.random() * Math.PI * 2;
			const spread = .5 + Math.random() * 1.5;
			coin.active = true;
			coin.age = 0;
			coin.x = slot.x + Math.cos(angle) * .08;
			coin.y = originY;
			coin.z = slot.z + Math.sin(angle) * .08;
			coin.originY = originY;
			coin.vx = Math.cos(angle) * spread;
			coin.vz = Math.sin(angle) * spread;
			coin.vy = 2.6 + Math.random() * 2.2;
			coin.spin = Math.random() * Math.PI * 2;
			coin.spinSpeed = (Math.random() - .5) * 18;
			coin.tilt = Math.random() * Math.PI;
		}
	}
	useFrame(() => {
		const instanced = mesh.current;
		if (!instanced) return;
		const world = useGame.getState().world;
		const previous = lastElapsed.current;
		lastElapsed.current = world.elapsed;
		const dt = previous === null ? 0 : Math.max(0, Math.min(.1, world.elapsed - previous));
		for (const sale of world.sales) {
			if (fired.current.has(sale.id)) continue;
			fired.current.add(sale.id);
			spawn(sale.potId, sale.amount);
		}
		if (fired.current.size > 64) {
			const live = new Set(world.sales.map((s) => s.id));
			for (const id of fired.current) if (!live.has(id)) fired.current.delete(id);
		}
		let anyActive = false;
		for (let i = 0; i < MAX_COINS; i++) {
			const coin = coins[i];
			if (!coin) continue;
			if (!coin.active) {
				dummy.scale.setScalar(0);
				dummy.updateMatrix();
				instanced.setMatrixAt(i, dummy.matrix);
				continue;
			}
			anyActive = true;
			coin.age += dt;
			coin.vy += GRAVITY * dt;
			coin.x += coin.vx * dt;
			coin.y += coin.vy * dt;
			coin.z += coin.vz * dt;
			coin.spin += coin.spinSpeed * dt;
			coin.vx *= 1 - 1.5 * dt;
			coin.vz *= 1 - 1.5 * dt;
			if (coin.age > LIFETIME || coin.y - coin.originY < FLOOR_DROP) {
				coin.active = false;
				dummy.scale.setScalar(0);
				dummy.updateMatrix();
				instanced.setMatrixAt(i, dummy.matrix);
				continue;
			}
			const fade = Math.min(1, ((LIFETIME - coin.age) / (LIFETIME * .35)) ** .6);
			dummy.position.set(coin.x, coin.y, coin.z);
			dummy.rotation.set(coin.tilt, coin.spin, coin.spin * .4);
			dummy.scale.setScalar(fade);
			dummy.updateMatrix();
			instanced.setMatrixAt(i, dummy.matrix);
		}
		instanced.instanceMatrix.needsUpdate = true;
		instanced.visible = anyActive;
	});
	return /* @__PURE__ */ jsxs("instancedMesh", {
		ref: mesh,
		args: [
			void 0,
			void 0,
			MAX_COINS
		],
		frustumCulled: false,
		visible: false,
		children: [/* @__PURE__ */ jsx("cylinderGeometry", { args: [
			.075,
			.075,
			.022,
			10
		] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
			color: "#ffcf47",
			emissive: "#a86f0d",
			emissiveIntensity: .55,
			metalness: .65,
			roughness: .28,
			flatShading: true
		})]
	});
}
//#endregion
//#region src/three/ground.ts
/** Deterministic integer hash. Same coordinates, same ground, every load. */
function hash(ix, iz) {
	let h = Math.imul(ix, 374761393) + Math.imul(iz, 668265263);
	h = Math.imul(h ^ h >>> 13, 1274126177);
	return ((h ^ h >>> 16) >>> 0) / 4294967296;
}
/** Smoothly interpolated value noise in 0..1. */
function valueNoise(x, z) {
	const x0 = Math.floor(x);
	const z0 = Math.floor(z);
	const fx = x - x0;
	const fz = z - z0;
	const sx = fx * fx * (3 - 2 * fx);
	const sz = fz * fz * (3 - 2 * fz);
	const n00 = hash(x0, z0);
	const n10 = hash(x0 + 1, z0);
	const n01 = hash(x0, z0 + 1);
	const n11 = hash(x0 + 1, z0 + 1);
	return lerp(lerp(n00, n10, sx), lerp(n01, n11, sx), sz);
}
/** Three octaves: broad rolls, a mid ripple, and a little roughness on top. */
function fbm(x, z) {
	return valueNoise(x * .021, z * .021) * 2.4 + valueNoise(x * .058 + 17.3, z * .058 - 9.1) * .9 + valueNoise(x * .15 - 5.2, z * .15 + 31.7) * .28 - 3.58 / 2;
}
/** 0 inside the pad, easing to 1 once clear of it. */
function padFactor(x, z, pad) {
	const dx = Math.max(pad.minX - x, 0, x - pad.maxX);
	const dz = Math.max(pad.minZ - z, 0, z - pad.maxZ);
	return smoothstep(0, pad.falloff, Math.hypot(dx, dz));
}
function groundHeight(x, z, pad) {
	const h = fbm(x, z);
	return pad ? h * padFactor(x, z, pad) : h;
}
/**
* Height of the *rendered* ground at a point — the value anything standing on
* the terrain must use.
*
* `groundHeight` is the smooth underlying curve, and the mesh only samples it at
* grid corners; between them the surface is a flat triangle. On a rise that
* chord sits well below the curve, so anything placed with `groundHeight` floats
* above the visible ground — with 4-unit facets, by enough to see daylight under
* it. This reproduces the same triangulation Three's PlaneGeometry builds and
* interpolates across the actual face.
*/
function surfaceHeight(x, z, pad) {
	const step = 340 / 84;
	const half = 170;
	const gx = (x + half) / step;
	const gz = (z + half) / step;
	const ix = Math.floor(gx);
	const iz = Math.floor(gz);
	const fx = gx - ix;
	const fz = gz - iz;
	const corner = (i, j) => groundHeight(i * step - half, j * step - half, pad);
	if (fx + fz <= 1) {
		const a = corner(ix, iz);
		const b = corner(ix, iz + 1);
		return a + (corner(ix + 1, iz) - a) * fx + (b - a) * fz;
	}
	const b = corner(ix, iz + 1);
	const c = corner(ix + 1, iz + 1);
	const d = corner(ix + 1, iz);
	return c + (b - c) * (1 - fx) + (d - c) * (1 - fz);
}
/**
* A pad that leaves the rendered ground genuinely flat across all of `area`.
*
* A mesh cell is only flat when *every* one of its corners is, and those corners
* sit up to one grid step outside the area they cover. A pad sized to the
* building itself therefore leaves the ground tilting under its own edges, where
* the floor slab can clip through it. Build pads with this rather than by hand.
*/
function padCovering(area, falloff, margin = .5) {
	const overhang = 340 / 84 + margin;
	return {
		minX: area.minX - overhang,
		maxX: area.maxX + overhang,
		minZ: area.minZ - overhang,
		maxZ: area.maxZ + overhang,
		falloff
	};
}
/** True if the point sits inside the rectangle, with an optional margin. */
function within(x, z, rect, margin = 0) {
	return x > rect.minX - margin && x < rect.maxX + margin && z > rect.minZ - margin && z < rect.maxZ + margin;
}
/** The two ends of the meadow palette. Every facet lands somewhere between. */
var GRASS_DARK = "#5c7a42";
var GRASS_LIGHT = "#97ac66";
/**
* How light a facet's grass is, 0..1.
*
* Two octaves blended *continuously*. Quantising noise into a handful of named
* tones instead produces large flat patches with hard, oddly rectangular
* borders — the ground ends up looking quilted rather than grassy.
*/
function grassBlend(x, z) {
	return valueNoise(x * .045 + 11.3, z * .045 - 4.7) * .62 + valueNoise(x * .13 - 7.1, z * .13 + 3.9) * .38;
}
/**
* Small per-facet variation, -1..1.
*
* Breaks up the smooth noise so neighbouring triangles differ slightly, which
* is what sells the hand-faceted look at close range.
*/
function facetJitter(x, z) {
	return hash(Math.round(x * 3.7), Math.round(z * 3.7)) * 2 - 1;
}
/** Hollows read damper and darker; rises catch more of the low sun. */
function slopeShade(height) {
	return 1 + clamp(height * .06, -.14, .14);
}
//#endregion
//#region src/three/Trees.tsx
/**
* A ring of low-poly trees around the greenhouse.
*
* Positions come from a seeded PRNG rather than `Math.random`, so the treeline
* is identical on every load — a scene that reshuffles itself on refresh reads
* as a bug.
*/
/** Deterministic 32-bit PRNG. Same seed, same forest, every time. */
function mulberry32(seed) {
	let a = seed;
	return () => {
		a = a + 1831565813 | 0;
		let t = Math.imul(a ^ a >>> 15, 1 | a);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
var COUNT = 44;
/** How many small trees form the distant silhouette on the horizon. */
var DISTANT_COUNT = 60;
/** Keep-out box around the greenhouse and its approach. */
var CLEAR_X = 7.5;
var CLEAR_Z = 6.5;
/**
* Open meadow behind the greenhouse.
*
* The default camera looks this way, and without a gap here the near trees fill
* the entire upper frame — you would never see the sunset or the clouds. The
* distant treeline still closes off the horizon, so it reads as a clearing at
* the edge of a wood rather than a hole in the scenery.
*/
var MEADOW_Z = -4;
var MEADOW_HALF_X = 20;
var CANOPY = [
	"#3c5c41",
	"#48704a",
	"#33553b",
	"#527a4c"
];
var CANOPY_WARM = ["#5d7040", "#6a7b46"];
function buildForest() {
	const rand = mulberry32(24301);
	const trees = [];
	let guard = 0;
	while (trees.length < COUNT && guard++ < 2640) {
		const angle = rand() * Math.PI * 2;
		const radius = 12 + Math.sqrt(rand()) * 26;
		const x = Math.cos(angle) * radius;
		const z = Math.sin(angle) * radius;
		if (Math.abs(x) < CLEAR_X && Math.abs(z) < CLEAR_Z) continue;
		if (z < MEADOW_Z && Math.abs(x) < MEADOW_HALF_X) continue;
		trees.push({
			x,
			z,
			scale: .75 + rand() * .9,
			spin: rand() * Math.PI * 2,
			conifer: rand() < .55,
			tone: rand()
		});
	}
	for (let i = 0; i < DISTANT_COUNT; i++) {
		const angle = rand() * Math.PI * 2;
		const radius = 60 + rand() * 35;
		trees.push({
			x: Math.cos(angle) * radius,
			z: Math.sin(angle) * radius,
			scale: .6 + rand() * .6,
			spin: rand() * Math.PI * 2,
			conifer: rand() < .55,
			tone: rand()
		});
	}
	return trees;
}
function Tree({ spec, pad }) {
	const palette = spec.tone > .78 ? CANOPY_WARM : CANOPY;
	const color = palette[Math.floor(spec.tone * palette.length) % palette.length] ?? CANOPY[0];
	return /* @__PURE__ */ jsxs("group", {
		position: [
			spec.x,
			surfaceHeight(spec.x, spec.z, pad) - .08,
			spec.z
		],
		rotation: [
			0,
			spec.spin,
			0
		],
		scale: spec.scale,
		children: [/* @__PURE__ */ jsxs("mesh", {
			position: [
				0,
				1,
				0
			],
			castShadow: true,
			children: [/* @__PURE__ */ jsx("cylinderGeometry", { args: [
				.16,
				.24,
				2,
				6
			] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
				color: "#4a3728",
				flatShading: true,
				roughness: 1
			})]
		}), spec.conifer ? [
			0,
			1,
			2
		].map((i) => /* @__PURE__ */ jsxs("mesh", {
			position: [
				0,
				2 + i * 1.05,
				0
			],
			castShadow: true,
			children: [/* @__PURE__ */ jsx("coneGeometry", { args: [
				1.35 - i * .34,
				1.7,
				6
			] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
				color,
				flatShading: true,
				roughness: 1
			})]
		}, i)) : [
			[
				0,
				2.9,
				0,
				1.5
			],
			[
				.8,
				2.4,
				.3,
				1.05
			],
			[
				-.7,
				2.5,
				-.4,
				1.15
			]
		].map(([dx, dy, dz, r], i) => /* @__PURE__ */ jsxs("mesh", {
			position: [
				dx ?? 0,
				dy ?? 0,
				dz ?? 0
			],
			castShadow: true,
			children: [/* @__PURE__ */ jsx("icosahedronGeometry", { args: [r ?? 1.2, 0] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
				color,
				flatShading: true,
				roughness: 1
			})]
		}, i))]
	});
}
function Trees({ pad = null }) {
	const forest = useMemo(buildForest, []);
	return /* @__PURE__ */ jsx("group", { children: forest.map((spec, i) => /* @__PURE__ */ jsx(Tree, {
		spec,
		pad
	}, i)) });
}
//#endregion
//#region src/three/Terrain.tsx
/**
* Low-poly ground.
*
* Built as one displaced plane, converted to **non-indexed** geometry so each
* triangle owns its three vertices and can be given a single flat colour. That
* faceting is the whole point: an indexed mesh would smear the palette across
* shared vertices and the ground would read as a smooth gradient instead of a
* field of facets, which is the look everything else in the scene uses.
*/
function buildTerrain(pad) {
	const plane = new THREE.PlaneGeometry(340, 340, 84, 84);
	plane.rotateX(-Math.PI / 2);
	const position = plane.attributes.position;
	for (let i = 0; i < position.count; i++) position.setY(i, groundHeight(position.getX(i), position.getZ(i), pad));
	const geometry = plane.toNonIndexed();
	plane.dispose();
	geometry.computeVertexNormals();
	const points = geometry.attributes.position;
	const colors = new Float32Array(points.count * 3);
	const colour = new THREE.Color();
	const dark = new THREE.Color(GRASS_DARK);
	const light = new THREE.Color(GRASS_LIGHT);
	for (let v = 0; v < points.count; v += 3) {
		const cx = (points.getX(v) + points.getX(v + 1) + points.getX(v + 2)) / 3;
		const cy = (points.getY(v) + points.getY(v + 1) + points.getY(v + 2)) / 3;
		const cz = (points.getZ(v) + points.getZ(v + 1) + points.getZ(v + 2)) / 3;
		colour.copy(dark).lerp(light, grassBlend(cx, cz)).multiplyScalar(slopeShade(cy) + facetJitter(cx, cz) * .045);
		for (let k = 0; k < 3; k++) {
			colors[(v + k) * 3] = colour.r;
			colors[(v + k) * 3 + 1] = colour.g;
			colors[(v + k) * 3 + 2] = colour.b;
		}
	}
	geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
	return geometry;
}
function Terrain({ pad = null }) {
	const geometry = useMemo(() => buildTerrain(pad), [pad]);
	useEffect(() => () => geometry.dispose(), [geometry]);
	return /* @__PURE__ */ jsx("mesh", {
		geometry,
		receiveShadow: true,
		children: /* @__PURE__ */ jsx("meshStandardMaterial", {
			vertexColors: true,
			flatShading: true,
			roughness: 1
		})
	});
}
var TUFT_TONES = [
	"#7fa055",
	"#8cae5f",
	"#6f9049",
	"#98b768"
];
var FLOWER_TONES = [
	"#f2e6a0",
	"#f6f2e6",
	"#e8a0c0",
	"#f0c05a"
];
/** How tall a wildflower's stem is at scale 1. */
var FLOWER_STEM = .28;
/**
* Scattered grass tufts and wildflowers, close in where the camera can see
* them. Three InstancedMeshes — blades, stems, blooms — so all of it costs
* three draw calls.
*
* Everything sits on `surfaceHeight`, and skips `exclude` so nothing sprouts
* through the greenhouse floor.
*/
function GroundCover({ pad = null, exclude, radius = 34, tufts = 2400, flowers = 220 }) {
	const { tuftMesh, stemMesh, flowerMesh } = useMemo(() => {
		const matrix = new THREE.Matrix4();
		const colour = new THREE.Color();
		const offset = new THREE.Vector3();
		const rotation = new THREE.Quaternion();
		const euler = new THREE.Euler();
		const size = new THREE.Vector3();
		/**
		* Places `count` instances in clumps, returning how many actually landed.
		*
		* Clumped rather than evenly scattered because grass grows that way — an
		* even spread reads as a regular field of identical spikes.
		*
		* Every mesh in `meshes` receives the same transform, so a plant built from
		* separate parts (a stem and a bloom that need different colours) stays
		* assembled. Only `tinted` gets per-instance colour.
		*/
		function scatter(meshes, tinted, count, seed, tones, lift, scaleRange, perClump, spread) {
			let placed = 0;
			for (let i = 0; placed < count && i < count * 6; i++) {
				const a = valueNoise(i * .37 + seed, i * .11 - seed) * Math.PI * 2;
				const r = Math.sqrt(valueNoise(i * .19 - seed, i * .53 + seed)) * radius;
				const cx = Math.cos(a) * r;
				const cz = Math.sin(a) * r;
				for (let k = 0; k < perClump && placed < count; k++) {
					const j = valueNoise(cx * 6.1 + k * 3.7 + seed, cz * 6.1 - k * 1.9);
					const angle = j * Math.PI * 2 + k * 2.399;
					const x = cx + Math.cos(angle) * (.1 + j * spread);
					const z = cz + Math.sin(angle) * (.1 + j * spread);
					if (exclude && within(x, z, exclude, .4)) continue;
					const scale = scaleRange[0] + j * (scaleRange[1] - scaleRange[0]);
					euler.set((j - .5) * .5, angle * 2, (.5 - j) * .5);
					matrix.compose(offset.set(x, surfaceHeight(x, z, pad) + lift * scale, z), rotation.setFromEuler(euler), size.set(scale, scale, scale));
					for (const mesh of meshes) mesh.setMatrixAt(placed, matrix);
					const tone = tones[Math.floor(j * tones.length) % tones.length] ?? tones[0];
					tinted.setColorAt(placed, colour.set(tone));
					placed++;
				}
			}
			for (const mesh of meshes) {
				mesh.count = placed;
				mesh.instanceMatrix.needsUpdate = true;
				if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
			}
		}
		const blade = new THREE.ConeGeometry(.055, .34, 3);
		const tuftMesh = new THREE.InstancedMesh(blade, new THREE.MeshStandardMaterial({
			flatShading: true,
			roughness: 1
		}), tufts);
		tuftMesh.castShadow = true;
		scatter([tuftMesh], tuftMesh, tufts, 3.7, TUFT_TONES, .15, [.6, 1.25], 6, .55);
		const stem = new THREE.CylinderGeometry(.012, .016, FLOWER_STEM, 4);
		stem.translate(0, FLOWER_STEM / 2, 0);
		const stemMesh = new THREE.InstancedMesh(stem, new THREE.MeshStandardMaterial({
			color: "#6b8f4a",
			flatShading: true,
			roughness: 1
		}), flowers);
		const bloom = new THREE.IcosahedronGeometry(.065, 0);
		bloom.translate(0, .31000000000000005, 0);
		const flowerMesh = new THREE.InstancedMesh(bloom, new THREE.MeshStandardMaterial({
			flatShading: true,
			roughness: .9
		}), flowers);
		scatter([stemMesh, flowerMesh], flowerMesh, flowers, 11.3, FLOWER_TONES, 0, [.8, 1.3], 2, .9);
		return {
			tuftMesh,
			stemMesh,
			flowerMesh
		};
	}, [
		pad,
		exclude,
		radius,
		tufts,
		flowers
	]);
	useEffect(() => () => {
		for (const mesh of [
			tuftMesh,
			stemMesh,
			flowerMesh
		]) {
			mesh.geometry.dispose();
			mesh.material.dispose();
		}
	}, [
		tuftMesh,
		stemMesh,
		flowerMesh
	]);
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx("primitive", { object: tuftMesh }),
		/* @__PURE__ */ jsx("primitive", { object: stemMesh }),
		/* @__PURE__ */ jsx("primitive", { object: flowerMesh })
	] });
}
//#endregion
//#region src/three/Greenhouse.tsx
/**
* The greenhouse shell and furniture. Purely decorative — the only interactive
* objects in here are the pots.
*
* Its length is derived from how many tables the player owns, so buying an
* expansion physically extends the building away from the camera.
*/
var WIDTH = 8;
var WALL_H = 2.6;
var RIDGE_H = 3.7;
var WOOD = "#7d6247";
var WOOD_DARK = "#5e4933";
var HALF_W = WIDTH / 2;
var ROOF_RUN = Math.hypot(HALF_W, 1.1);
var ROOF_ANGLE = Math.atan2(1.1, HALF_W);
/** Roughly how far apart to space glazing bars and rafters along the length. */
var BAR_SPACING = 2;
/** Evenly spaced positions between two ends, excluding the ends themselves. */
function interior(from, to, spacing) {
	const lo = Math.min(from, to);
	const span = Math.abs(to - from);
	const count = Math.max(1, Math.round(span / spacing) - 1);
	const step = span / (count + 1);
	return Array.from({ length: count }, (_, i) => lo + step * (i + 1));
}
var FACE_IDS = [
	"front",
	"back",
	"left",
	"right",
	"roofL",
	"roofR"
];
function buildFaces(frontZ, backZ) {
	const midZ = (frontZ + backZ) / 2;
	const roofY = 6.300000000000001 / 2;
	return {
		front: {
			center: [
				0,
				WALL_H / 2,
				frontZ
			],
			normal: [
				0,
				0,
				1
			],
			roof: false
		},
		back: {
			center: [
				0,
				WALL_H / 2,
				backZ
			],
			normal: [
				0,
				0,
				-1
			],
			roof: false
		},
		left: {
			center: [
				-HALF_W,
				WALL_H / 2,
				midZ
			],
			normal: [
				-1,
				0,
				0
			],
			roof: false
		},
		right: {
			center: [
				HALF_W,
				WALL_H / 2,
				midZ
			],
			normal: [
				1,
				0,
				0
			],
			roof: false
		},
		roofL: {
			center: [
				-HALF_W / 2,
				roofY,
				midZ
			],
			normal: [
				-Math.sin(ROOF_ANGLE),
				Math.cos(ROOF_ANGLE),
				0
			],
			roof: true
		},
		roofR: {
			center: [
				HALF_W / 2,
				roofY,
				midZ
			],
			normal: [
				Math.sin(ROOF_ANGLE),
				Math.cos(ROOF_ANGLE),
				0
			],
			roof: true
		}
	};
}
var GLASS_BASE = .22;
var GLASS_CLEAR = .03;
/** Timber never goes fully clear — the greenhouse should keep its silhouette. */
var WOOD_BASE = 1;
var WOOD_CLEAR = .26;
/** Builds the `userData` payload the fade pass looks for. */
function fades(faces, base = WOOD_BASE, clear = WOOD_CLEAR) {
	return { fade: {
		faces,
		base,
		clear
	} };
}
var glassFade = (faces) => fades(faces, GLASS_BASE, GLASS_CLEAR);
/**
* Fades whichever faces stand between the camera and the plants.
*
* Uses how squarely each face is turned towards the camera rather than raw
* distance: two faces can be near-equidistant when orbiting past a corner, and a
* nearest-wins rule would visibly flicker between them.
*/
function useFaceFade(root, faces, revision) {
	const camera = useThree((s) => s.camera);
	const entries = useRef([]);
	const targets = useRef({
		front: 0,
		back: 0,
		left: 0,
		right: 0,
		roofL: 0,
		roofR: 0
	});
	const toCamera = useMemo(() => new THREE.Vector3(), []);
	const center = useMemo(() => new THREE.Vector3(), []);
	const normal = useMemo(() => new THREE.Vector3(), []);
	useEffect(() => {
		const group = root.current;
		if (!group) return;
		const found = [];
		group.traverse((object) => {
			const mesh = object;
			const tag = mesh.userData?.fade;
			if (!mesh.isMesh || !tag) return;
			const material = mesh.material;
			material.transparent = true;
			found.push({
				mesh,
				material,
				tag
			});
		});
		entries.current = found;
	}, [root, revision]);
	useFrame(() => {
		for (const id of FACE_IDS) {
			const face = faces[id];
			center.set(...face.center);
			normal.set(...face.normal);
			toCamera.copy(camera.position).sub(center).normalize();
			const facing = toCamera.dot(normal);
			targets.current[id] = face.roof ? smoothstep(0, .35, facing) : smoothstep(.1, .8, facing);
		}
		for (const entry of entries.current) {
			let t = 0;
			for (const id of entry.tag.faces) t = Math.max(t, targets.current[id]);
			const target = lerp(entry.tag.base, entry.tag.clear, t);
			const opacity = entry.material.opacity + (target - entry.material.opacity) * .15;
			entry.material.opacity = opacity;
			const solid = opacity > .95;
			entry.material.depthWrite = solid;
			entry.mesh.castShadow = opacity > .55;
		}
	});
}
function Beam({ position, size, rotation, color = WOOD, faces }) {
	return /* @__PURE__ */ jsxs("mesh", {
		position,
		rotation: rotation ?? [
			0,
			0,
			0
		],
		castShadow: true,
		userData: faces ? fades(faces) : {},
		children: [/* @__PURE__ */ jsx("boxGeometry", { args: size }), /* @__PURE__ */ jsx("meshStandardMaterial", {
			color,
			flatShading: true,
			roughness: .9
		})]
	});
}
/** One bench: the physical table an expansion buys. */
function Bench({ z }) {
	const topY = BENCH_TOP_Y - .07;
	const legInset = BENCH_WIDTH / 2 - .35;
	return /* @__PURE__ */ jsxs("group", {
		position: [
			0,
			0,
			z
		],
		children: [
			/* @__PURE__ */ jsxs("mesh", {
				position: [
					0,
					topY,
					0
				],
				castShadow: true,
				receiveShadow: true,
				children: [/* @__PURE__ */ jsx("boxGeometry", { args: [
					BENCH_WIDTH,
					.14,
					BENCH_DEPTH
				] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
					color: WOOD,
					flatShading: true,
					roughness: .95
				})]
			}),
			[-legInset, legInset].map((x) => [-.4, .4].map((dz) => /* @__PURE__ */ jsxs("mesh", {
				position: [
					x,
					(BENCH_TOP_Y - .14) / 2,
					dz
				],
				castShadow: true,
				children: [/* @__PURE__ */ jsx("boxGeometry", { args: [
					.14,
					BENCH_TOP_Y - .14,
					.14
				] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
					color: WOOD_DARK,
					flatShading: true,
					roughness: .95
				})]
			}, `${x}:${dz}`))),
			/* @__PURE__ */ jsxs("mesh", {
				position: [
					0,
					.22,
					0
				],
				receiveShadow: true,
				children: [/* @__PURE__ */ jsx("boxGeometry", { args: [
					BENCH_WIDTH - .2,
					.06,
					BENCH_DEPTH - .35
				] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
					color: WOOD_DARK,
					flatShading: true,
					roughness: .95
				})]
			})
		]
	});
}
function WateringCan({ position }) {
	return /* @__PURE__ */ jsxs("group", {
		position,
		rotation: [
			0,
			.6,
			0
		],
		children: [
			/* @__PURE__ */ jsxs("mesh", {
				castShadow: true,
				children: [/* @__PURE__ */ jsx("cylinderGeometry", { args: [
					.13,
					.15,
					.24,
					8
				] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
					color: "#7fa8b5",
					flatShading: true,
					roughness: .6,
					metalness: .3
				})]
			}),
			/* @__PURE__ */ jsxs("mesh", {
				castShadow: true,
				position: [
					.2,
					.06,
					0
				],
				rotation: [
					0,
					0,
					-.5
				],
				children: [/* @__PURE__ */ jsx("cylinderGeometry", { args: [
					.03,
					.05,
					.32,
					6
				] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
					color: "#7fa8b5",
					flatShading: true,
					roughness: .6,
					metalness: .3
				})]
			}),
			/* @__PURE__ */ jsxs("mesh", {
				castShadow: true,
				position: [
					-.14,
					.14,
					0
				],
				rotation: [
					Math.PI / 2,
					0,
					0
				],
				children: [/* @__PURE__ */ jsx("torusGeometry", { args: [
					.09,
					.02,
					5,
					8,
					Math.PI
				] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
					color: "#7fa8b5",
					flatShading: true,
					roughness: .6,
					metalness: .3
				})]
			})
		]
	});
}
function SoilSack({ position }) {
	return /* @__PURE__ */ jsxs("mesh", {
		position,
		rotation: [
			0,
			.4,
			.1
		],
		castShadow: true,
		receiveShadow: true,
		children: [/* @__PURE__ */ jsx("boxGeometry", { args: [
			.5,
			.34,
			.32
		] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
			color: "#6b5a48",
			flatShading: true,
			roughness: 1
		})]
	});
}
function Greenhouse() {
	const root = useRef(null);
	const tables = useGame((s) => s.world.tables);
	const frontZ = greenhouseFrontZ();
	const backZ = greenhouseBackZ(tables);
	const depth = frontZ - backZ;
	const midZ = (frontZ + backZ) / 2;
	useFaceFade(root, useMemo(() => buildFaces(frontZ, backZ), [frontZ, backZ]), tables);
	const footprint = useMemo(() => ({
		minX: -(WIDTH + 1) / 2,
		maxX: (WIDTH + 1) / 2,
		minZ: backZ - .5,
		maxZ: frontZ + .5
	}), [backZ, frontZ]);
	const pad = useMemo(() => padCovering(footprint, 5), [footprint]);
	const gable = useMemo(() => {
		const shape = new THREE.Shape();
		shape.moveTo(-HALF_W, WALL_H);
		shape.lineTo(HALF_W, WALL_H);
		shape.lineTo(0, RIDGE_H);
		shape.closePath();
		return new THREE.ShapeGeometry(shape);
	}, []);
	const glass = /* @__PURE__ */ jsx("meshStandardMaterial", {
		color: "#c8e6ee",
		transparent: true,
		opacity: GLASS_BASE,
		roughness: .08,
		metalness: 0,
		side: THREE.DoubleSide,
		depthWrite: false
	});
	const wallBars = interior(-HALF_W, HALF_W, BAR_SPACING);
	const lengthBars = interior(backZ, frontZ, BAR_SPACING);
	const rafters = interior(backZ, frontZ, 2.4);
	return /* @__PURE__ */ jsxs("group", {
		ref: root,
		children: [
			/* @__PURE__ */ jsx(Terrain, { pad }),
			/* @__PURE__ */ jsx(GroundCover, {
				pad,
				exclude: footprint
			}),
			/* @__PURE__ */ jsx(Trees, { pad }),
			/* @__PURE__ */ jsxs("mesh", {
				position: [
					0,
					-.06,
					midZ
				],
				receiveShadow: true,
				children: [/* @__PURE__ */ jsx("boxGeometry", { args: [
					WIDTH + 1,
					.2,
					depth + 1
				] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
					color: "#9c9081",
					flatShading: true,
					roughness: 1
				})]
			}),
			[-3.5, 3.5].map((x) => /* @__PURE__ */ jsxs("mesh", {
				position: [
					x,
					.05,
					midZ
				],
				receiveShadow: true,
				children: [/* @__PURE__ */ jsx("boxGeometry", { args: [
					1.1,
					.02,
					depth
				] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
					color: "#b3a795",
					flatShading: true,
					roughness: 1
				})]
			}, x)),
			/* @__PURE__ */ jsxs("mesh", {
				position: [
					0,
					WALL_H / 2,
					frontZ
				],
				userData: glassFade(["front"]),
				children: [/* @__PURE__ */ jsx("planeGeometry", { args: [WIDTH, WALL_H] }), glass]
			}),
			/* @__PURE__ */ jsxs("mesh", {
				position: [
					0,
					WALL_H / 2,
					backZ
				],
				userData: glassFade(["back"]),
				children: [/* @__PURE__ */ jsx("planeGeometry", { args: [WIDTH, WALL_H] }), glass]
			}),
			/* @__PURE__ */ jsxs("mesh", {
				position: [
					-HALF_W,
					WALL_H / 2,
					midZ
				],
				rotation: [
					0,
					Math.PI / 2,
					0
				],
				userData: glassFade(["left"]),
				children: [/* @__PURE__ */ jsx("planeGeometry", { args: [depth, WALL_H] }), glass]
			}),
			/* @__PURE__ */ jsxs("mesh", {
				position: [
					HALF_W,
					WALL_H / 2,
					midZ
				],
				rotation: [
					0,
					Math.PI / 2,
					0
				],
				userData: glassFade(["right"]),
				children: [/* @__PURE__ */ jsx("planeGeometry", { args: [depth, WALL_H] }), glass]
			}),
			/* @__PURE__ */ jsx("mesh", {
				geometry: gable,
				position: [
					0,
					0,
					backZ
				],
				userData: glassFade(["back"]),
				children: glass
			}),
			/* @__PURE__ */ jsx("mesh", {
				geometry: gable,
				position: [
					0,
					0,
					frontZ
				],
				userData: glassFade(["front"]),
				children: glass
			}),
			/* @__PURE__ */ jsxs("mesh", {
				position: [
					-HALF_W / 2,
					6.300000000000001 / 2,
					midZ
				],
				rotation: [
					0,
					0,
					ROOF_ANGLE
				],
				userData: glassFade(["roofL"]),
				children: [/* @__PURE__ */ jsx("boxGeometry", { args: [
					ROOF_RUN,
					.03,
					depth
				] }), glass]
			}),
			/* @__PURE__ */ jsxs("mesh", {
				position: [
					HALF_W / 2,
					6.300000000000001 / 2,
					midZ
				],
				rotation: [
					0,
					0,
					-ROOF_ANGLE
				],
				userData: glassFade(["roofR"]),
				children: [/* @__PURE__ */ jsx("boxGeometry", { args: [
					ROOF_RUN,
					.03,
					depth
				] }), glass]
			}),
			[-HALF_W, HALF_W].map((x) => [backZ, frontZ].map((z) => /* @__PURE__ */ jsx(Beam, {
				position: [
					x,
					WALL_H / 2,
					z
				],
				size: [
					.12,
					WALL_H,
					.12
				],
				faces: [x < 0 ? "left" : "right", z < midZ ? "back" : "front"]
			}, `${x}:${z}`))),
			[backZ, frontZ].map((z) => {
				const face = z < midZ ? "back" : "front";
				return /* @__PURE__ */ jsxs("group", { children: [/* @__PURE__ */ jsx(Beam, {
					position: [
						0,
						WALL_H,
						z
					],
					size: [
						WIDTH + .12,
						.12,
						.12
					],
					faces: [face]
				}), /* @__PURE__ */ jsx(Beam, {
					position: [
						0,
						.06,
						z
					],
					size: [
						WIDTH + .12,
						.12,
						.12
					],
					faces: [face]
				})] }, z);
			}),
			[-HALF_W, HALF_W].map((x) => {
				const face = x < 0 ? "left" : "right";
				return /* @__PURE__ */ jsxs("group", { children: [/* @__PURE__ */ jsx(Beam, {
					position: [
						x,
						WALL_H,
						midZ
					],
					size: [
						.12,
						.12,
						depth
					],
					faces: [face]
				}), /* @__PURE__ */ jsx(Beam, {
					position: [
						x,
						.06,
						midZ
					],
					size: [
						.12,
						.12,
						depth
					],
					faces: [face]
				})] }, x);
			}),
			wallBars.map((x) => [backZ, frontZ].map((z) => /* @__PURE__ */ jsx(Beam, {
				position: [
					x,
					WALL_H / 2,
					z
				],
				size: [
					.07,
					WALL_H,
					.07
				],
				faces: [z < midZ ? "back" : "front"]
			}, `mz${x}:${z}`))),
			lengthBars.map((z) => [-HALF_W, HALF_W].map((x) => /* @__PURE__ */ jsx(Beam, {
				position: [
					x,
					WALL_H / 2,
					z
				],
				size: [
					.07,
					WALL_H,
					.07
				],
				faces: [x < 0 ? "left" : "right"]
			}, `mx${x}:${z}`))),
			/* @__PURE__ */ jsx(Beam, {
				position: [
					0,
					RIDGE_H,
					midZ
				],
				size: [
					.14,
					.14,
					depth + .12
				],
				color: WOOD_DARK,
				faces: ["roofL", "roofR"]
			}),
			[
				backZ + .4,
				...rafters,
				frontZ - .4
			].map((z) => [-1, 1].map((side) => /* @__PURE__ */ jsx(Beam, {
				position: [
					side * HALF_W / 2,
					6.300000000000001 / 2,
					z
				],
				size: [
					ROOF_RUN,
					.08,
					.08
				],
				rotation: [
					0,
					0,
					-side * ROOF_ANGLE
				],
				faces: [side < 0 ? "roofL" : "roofR"]
			}, `${z}:${side}`))),
			Array.from({ length: tables }, (_, i) => /* @__PURE__ */ jsx(Bench, { z: tableZ(i) }, i)),
			/* @__PURE__ */ jsx(WateringCan, { position: [
				3.4,
				.12,
				frontZ - .9
			] }),
			/* @__PURE__ */ jsx(SoilSack, { position: [
				-3.3,
				.17,
				frontZ - .8
			] }),
			/* @__PURE__ */ jsx(SoilSack, { position: [
				-3.2,
				.17,
				frontZ - 1.3
			] }),
			Array.from({ length: 40 }, (_, i) => i < tables * 5 ? /* @__PURE__ */ jsx(PotObject, { potId: i }, i) : null),
			/* @__PURE__ */ jsx(CoinBurst, {})
		]
	});
}
//#endregion
//#region src/three/Market.tsx
/**
* The farmer's market. One crate per species along the stall; clicking a crate
* buys a single seed. The same purchases are available from the side panel in
* `src/ui/MarketPanel.tsx` — the crates are the diegetic version of it.
*/
var STALL_WIDTH = 7.4;
var TABLE_DEPTH = 1.8;
var TABLE_Y = .95;
/** Crates are laid out in two rows; one row of 13 would be unreadably tight. */
var CRATE_ROW_Z = [.45, -.45];
/** The back row stands on a riser so it is not hidden behind the front one. */
var CRATE_ROW_Y = [0, .22];
var RISER_Y = .11;
/** Kept high, and the canopy shallow, so the crates below stay clearly in frame. */
var AWNING_Y = 3;
var AWNING_DEPTH = 2.3;
var STRIPE_A = "#e8ded0";
var STRIPE_B = "#c0503f";
/**
* The paved square, and the levelled ground it sits on.
*
* Stops short of the camera (`maxZ`) on purpose: paving that ran to the bottom
* of the frame left the whole foreground a flat empty tan slab, so the grass is
* brought forward to meet the viewer instead.
*/
var SQUARE = {
	minX: -13,
	maxX: 13,
	minZ: -14,
	maxZ: 5
};
var SQUARE_PAD = padCovering(SQUARE, 8);
var SQUARE_SIZE = [SQUARE.maxX - SQUARE.minX, SQUARE.maxZ - SQUARE.minZ];
var SQUARE_MID_Z = (SQUARE.minZ + SQUARE.maxZ) / 2;
function crateX(index, count) {
	if (count <= 1) return 0;
	return -6.300000000000001 / 2 + 6.300000000000001 / (count - 1) * index;
}
/**
* Splits the catalogue into a front and back row, front row first so the
* earliest (cheapest) seeds are the ones nearest the player.
*/
function crateRows(items) {
	const perRow = Math.ceil(items.length / CRATE_ROW_Z.length);
	return CRATE_ROW_Z.map((_, row) => items.slice(row * perRow, (row + 1) * perRow));
}
function SeedCrate({ species, x, y, z, locked, affordable }) {
	const buySeed = useGame((s) => s.buySeed);
	const [hovered, setHovered] = useState(false);
	const interactive = !locked && affordable;
	useEffect(() => {
		if (!hovered || !interactive) return;
		document.body.style.cursor = "pointer";
		return () => {
			document.body.style.cursor = "auto";
		};
	}, [hovered, interactive]);
	const lift = hovered && interactive ? .06 : 0;
	const tint = locked ? "#6d6a63" : hovered && interactive ? "#a9825a" : "#8d6b47";
	return /* @__PURE__ */ jsxs("group", {
		position: [
			x,
			1.15 + y + lift,
			z
		],
		onClick: (e) => {
			e.stopPropagation();
			if (interactive) buySeed(species.id);
		},
		onPointerOver: (e) => {
			e.stopPropagation();
			setHovered(true);
		},
		onPointerOut: () => setHovered(false),
		children: [
			/* @__PURE__ */ jsxs("mesh", {
				castShadow: true,
				receiveShadow: true,
				children: [/* @__PURE__ */ jsx("boxGeometry", { args: [
					.62,
					.4,
					.62
				] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
					color: tint,
					flatShading: true,
					roughness: .95
				})]
			}),
			/* @__PURE__ */ jsxs("mesh", {
				position: [
					0,
					0,
					.32
				],
				children: [/* @__PURE__ */ jsx("boxGeometry", { args: [
					.64,
					.08,
					.02
				] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
					color: "#6b5236",
					flatShading: true,
					roughness: 1
				})]
			}),
			/* @__PURE__ */ jsxs("mesh", {
				position: [
					0,
					.22,
					0
				],
				castShadow: true,
				children: [/* @__PURE__ */ jsx("icosahedronGeometry", { args: [.22, 0] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
					color: locked ? "#57534d" : species.palette.crown,
					flatShading: true,
					roughness: .8
				})]
			}),
			locked && /* @__PURE__ */ jsxs("group", {
				position: [
					0,
					.55,
					0
				],
				children: [/* @__PURE__ */ jsxs("mesh", { children: [/* @__PURE__ */ jsx("boxGeometry", { args: [
					.16,
					.14,
					.1
				] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
					color: "#3f3d38",
					flatShading: true
				})] }), /* @__PURE__ */ jsxs("mesh", {
					position: [
						0,
						.11,
						0
					],
					rotation: [
						Math.PI / 2,
						0,
						0
					],
					children: [/* @__PURE__ */ jsx("torusGeometry", { args: [
						.06,
						.018,
						5,
						8,
						Math.PI
					] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
						color: "#3f3d38",
						flatShading: true
					})]
				})]
			})
		]
	});
}
function Stall() {
	const stripes = Array.from({ length: 8 }, (_, i) => i);
	const stripeW = 8.200000000000001 / stripes.length;
	return /* @__PURE__ */ jsxs("group", { children: [
		/* @__PURE__ */ jsxs("mesh", {
			position: [
				0,
				TABLE_Y,
				0
			],
			castShadow: true,
			receiveShadow: true,
			children: [/* @__PURE__ */ jsx("boxGeometry", { args: [
				STALL_WIDTH,
				.14,
				TABLE_DEPTH
			] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
				color: "#8a6d4d",
				flatShading: true,
				roughness: .95
			})]
		}),
		/* @__PURE__ */ jsxs("mesh", {
			position: [
				0,
				1.06,
				CRATE_ROW_Z[1] ?? -.45
			],
			castShadow: true,
			receiveShadow: true,
			children: [/* @__PURE__ */ jsx("boxGeometry", { args: [
				7.1000000000000005,
				RISER_Y * 2,
				.75
			] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
				color: "#7a5f42",
				flatShading: true,
				roughness: .95
			})]
		}),
		/* @__PURE__ */ jsxs("mesh", {
			position: [
				0,
				TABLE_Y / 2 - .06,
				TABLE_DEPTH / 2 - .03
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ jsx("boxGeometry", { args: [
				7.2,
				.83,
				.06
			] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
				color: "#5c7350",
				flatShading: true,
				roughness: 1
			})]
		}),
		[-1, 1].map((sx) => [-1, 1].map((sz) => /* @__PURE__ */ jsxs("mesh", {
			position: [
				sx * 7.800000000000001 / 2,
				AWNING_Y / 2,
				sz * .9
			],
			castShadow: true,
			children: [/* @__PURE__ */ jsx("cylinderGeometry", { args: [
				.06,
				.06,
				AWNING_Y,
				6
			] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
				color: "#6b5236",
				flatShading: true,
				roughness: .95
			})]
		}, `${sx}:${sz}`))),
		/* @__PURE__ */ jsx("group", {
			position: [
				0,
				AWNING_Y,
				-.35
			],
			rotation: [
				.24,
				0,
				0
			],
			children: stripes.map((i) => /* @__PURE__ */ jsxs("mesh", {
				position: [
					-8.200000000000001 / 2 + stripeW * (i + .5),
					0,
					0
				],
				castShadow: true,
				children: [/* @__PURE__ */ jsx("boxGeometry", { args: [
					stripeW,
					.07,
					AWNING_DEPTH
				] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
					color: i % 2 === 0 ? STRIPE_A : STRIPE_B,
					flatShading: true,
					roughness: .95
				})]
			}, i))
		})
	] });
}
/** Low-detail stalls behind the player's, purely to give the square some depth. */
function BackdropStalls() {
	return /* @__PURE__ */ jsx("group", { children: [
		{
			x: -9,
			z: -7.5,
			color: "#b4634f"
		},
		{
			x: -1,
			z: -10,
			color: "#5f7f8c"
		},
		{
			x: 8,
			z: -8,
			color: "#8a7a4f"
		}
	].map((s, i) => /* @__PURE__ */ jsxs("group", {
		position: [
			s.x,
			0,
			s.z
		],
		children: [
			/* @__PURE__ */ jsxs("mesh", {
				position: [
					0,
					.9,
					0
				],
				castShadow: true,
				receiveShadow: true,
				children: [/* @__PURE__ */ jsx("boxGeometry", { args: [
					3.4,
					.12,
					1.2
				] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
					color: "#8a6d4d",
					flatShading: true,
					roughness: 1
				})]
			}),
			/* @__PURE__ */ jsxs("mesh", {
				position: [
					0,
					2.1,
					0
				],
				rotation: [
					-.15,
					0,
					0
				],
				castShadow: true,
				children: [/* @__PURE__ */ jsx("boxGeometry", { args: [
					3.8,
					.08,
					1.8
				] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
					color: s.color,
					flatShading: true,
					roughness: 1
				})]
			}),
			[-1.6, 1.6].map((x) => /* @__PURE__ */ jsxs("mesh", {
				position: [
					x,
					1.05,
					0
				],
				castShadow: true,
				children: [/* @__PURE__ */ jsx("cylinderGeometry", { args: [
					.05,
					.05,
					2.1,
					5
				] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
					color: "#6b5236",
					flatShading: true,
					roughness: 1
				})]
			}, x))
		]
	}, i)) });
}
/** Barrels and sacks around the stall, so the square doesn't read as an empty plain. */
function GroundClutter() {
	return /* @__PURE__ */ jsxs("group", { children: [[
		[-5.2, .6],
		[-4.8, 1.4],
		[5.6, .9]
	].map(([x, z], i) => /* @__PURE__ */ jsxs("mesh", {
		position: [
			x ?? 0,
			.32,
			z ?? 0
		],
		castShadow: true,
		receiveShadow: true,
		children: [/* @__PURE__ */ jsx("cylinderGeometry", { args: [
			.32,
			.28,
			.64,
			8
		] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
			color: "#7d5f3f",
			flatShading: true,
			roughness: 1
		})]
	}, `b${i}`)), [[
		-4.3,
		2.2,
		.5
	], [
		5,
		2,
		-.3
	]].map(([x, z, r], i) => /* @__PURE__ */ jsxs("mesh", {
		position: [
			x ?? 0,
			.22,
			z ?? 0
		],
		rotation: [
			0,
			r ?? 0,
			.08
		],
		castShadow: true,
		receiveShadow: true,
		children: [/* @__PURE__ */ jsx("boxGeometry", { args: [
			.55,
			.44,
			.4
		] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
			color: "#a8946f",
			flatShading: true,
			roughness: 1
		})]
	}, `s${i}`))] });
}
function Market() {
	const level = useGame((s) => s.world.level);
	const money = useGame((s) => s.world.money);
	return /* @__PURE__ */ jsxs("group", { children: [
		/* @__PURE__ */ jsx(Terrain, { pad: SQUARE_PAD }),
		/* @__PURE__ */ jsx(GroundCover, {
			pad: SQUARE_PAD,
			exclude: SQUARE,
			radius: 44,
			tufts: 1400,
			flowers: 160
		}),
		/* @__PURE__ */ jsxs("mesh", {
			position: [
				0,
				-.06,
				SQUARE_MID_Z
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ jsx("boxGeometry", { args: [
				SQUARE_SIZE[0],
				.2,
				SQUARE_SIZE[1]
			] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
				color: "#b3a894",
				flatShading: true,
				roughness: 1
			})]
		}),
		/* @__PURE__ */ jsx(Stall, {}),
		/* @__PURE__ */ jsx(GroundClutter, {}),
		/* @__PURE__ */ jsx(BackdropStalls, {}),
		crateRows(SPECIES).map((row, rowIndex) => row.map((species, i) => /* @__PURE__ */ jsx(SeedCrate, {
			species,
			x: crateX(i, row.length),
			y: CRATE_ROW_Y[rowIndex] ?? 0,
			z: CRATE_ROW_Z[rowIndex] ?? 0,
			locked: species.unlockLevel > level,
			affordable: species.seedCost <= money
		}, species.id)))
	] });
}
//#endregion
//#region src/three/Sky.tsx
/**
* Sunset sky: a gradient dome, a low sun, and drifting low-poly clouds.
*
* Shared by both scenes so the greenhouse and the market are the same time of
* day. The gradient is a generated CanvasTexture rather than a custom shader,
* which keeps colour-space and tone-mapping handling on Three's normal path.
*/
/**
* Where the sun *appears*, kept low and only ~20° off straight-back so it sits
* inside the strip of sky visible above the greenhouse.
*/
var SUN_DIRECTION = new THREE.Vector3(-.34, .08, -.93).normalize();
/**
* Where the sun *lights from*. Same azimuth as the disc, so shadows point the
* way you'd expect, but raised — a light this low would leave the greenhouse
* interior unreadably dark.
*/
var KEY_LIGHT_DIRECTION = new THREE.Vector3(-.34, .44, -.83).normalize();
/** Horizon colour. Fog and the canvas clear colour should both use this. */
var HORIZON_COLOR = "#e9a874";
var SKY_RADIUS = 300;
/**
* Vertical gradient stops, as fractions of the dome from top to bottom.
* 0.5 is the horizon, because a sphere's V coordinate is 0.5 at its equator.
*/
var STOPS = [
	[0, "#231d4d"],
	[.22, "#3d2f63"],
	[.36, "#7d4668"],
	[.44, "#c2635f"],
	[.48, "#ef9256"],
	[.5, "#ffd199"],
	[.54, "#b07f5f"],
	[.72, "#5d4634"],
	[1, "#3a2c24"]
];
function useSkyTexture() {
	return useMemo(() => {
		const canvas = document.createElement("canvas");
		canvas.width = 4;
		canvas.height = 512;
		const ctx = canvas.getContext("2d");
		if (ctx) {
			const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
			for (const [at, color] of STOPS) grad.addColorStop(at, color);
			ctx.fillStyle = grad;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		}
		const tex = new THREE.CanvasTexture(canvas);
		tex.colorSpace = THREE.SRGBColorSpace;
		tex.wrapS = THREE.ClampToEdgeWrapping;
		tex.wrapT = THREE.ClampToEdgeWrapping;
		return tex;
	}, []);
}
function SkyDome() {
	const texture = useSkyTexture();
	useEffect(() => () => texture.dispose(), [texture]);
	return /* @__PURE__ */ jsxs("mesh", {
		renderOrder: -1,
		children: [/* @__PURE__ */ jsx("sphereGeometry", { args: [
			SKY_RADIUS,
			32,
			24
		] }), /* @__PURE__ */ jsx("meshBasicMaterial", {
			map: texture,
			side: THREE.BackSide,
			fog: false,
			toneMapped: false,
			depthWrite: false
		})]
	});
}
function Sun() {
	const position = useMemo(() => SUN_DIRECTION.clone().multiplyScalar(SKY_RADIUS * .75), []);
	return /* @__PURE__ */ jsxs(Billboard, {
		position,
		children: [/* @__PURE__ */ jsxs("mesh", { children: [/* @__PURE__ */ jsx("circleGeometry", { args: [22, 32] }), /* @__PURE__ */ jsx("meshBasicMaterial", {
			color: "#ff9d52",
			transparent: true,
			opacity: .28,
			fog: false,
			toneMapped: false,
			depthWrite: false
		})] }), /* @__PURE__ */ jsxs("mesh", {
			position: [
				0,
				0,
				.1
			],
			children: [/* @__PURE__ */ jsx("circleGeometry", { args: [8, 32] }), /* @__PURE__ */ jsx("meshBasicMaterial", {
				color: "#fff0cf",
				fog: false,
				toneMapped: false,
				depthWrite: false
			})]
		})]
	});
}
/**
* Chunky flat-shaded clouds. Each cloud is a few overlapping icosahedra, tinted
* from warm on the sun side to cool away from it.
*/
function Clouds() {
	const group = useRef(null);
	const puffs = useMemo(() => {
		const clouds = [
			{
				x: -88,
				y: 15,
				z: -115,
				scale: 1.5,
				warm: true
			},
			{
				x: -150,
				y: 12,
				z: -95,
				scale: 1.3,
				warm: true
			},
			{
				x: 22,
				y: 14,
				z: -130,
				scale: 1.2,
				warm: false
			},
			{
				x: 68,
				y: 16,
				z: -120,
				scale: 1.7,
				warm: false
			},
			{
				x: 125,
				y: 19,
				z: -140,
				scale: 1.4,
				warm: false
			},
			{
				x: 40,
				y: 24,
				z: -195,
				scale: 2.2,
				warm: true
			}
		];
		const lobes = [
			[
				0,
				0,
				0,
				9,
				1
			],
			[
				11,
				-2.5,
				2,
				7,
				.86
			],
			[
				-10,
				-2,
				-2,
				6.5,
				.91
			],
			[
				4,
				4,
				-1,
				6,
				1.14
			]
		];
		const out = [];
		const color = new THREE.Color();
		for (const c of clouds) for (const [dx, dy, dz, r, shade] of lobes) {
			color.set(c.warm ? "#ffcfa2" : "#d9b3c2").multiplyScalar(shade);
			out.push({
				x: c.x + dx * c.scale,
				y: c.y + dy * c.scale,
				z: c.z + dz * c.scale,
				r: r * c.scale,
				tint: `#${color.getHexString()}`
			});
		}
		return out;
	}, []);
	useFrame(() => {
		if (!group.current) return;
		const t = useGame.getState().world.elapsed;
		group.current.position.x = t * .6 % 400 - 200;
	});
	return /* @__PURE__ */ jsx("group", {
		ref: group,
		children: puffs.map((p, i) => /* @__PURE__ */ jsxs("mesh", {
			position: [
				p.x,
				p.y,
				p.z
			],
			children: [/* @__PURE__ */ jsx("icosahedronGeometry", { args: [p.r, 0] }), /* @__PURE__ */ jsx("meshBasicMaterial", {
				color: p.tint,
				fog: false,
				toneMapped: false
			})]
		}, i))
	});
}
function Sky() {
	return /* @__PURE__ */ jsxs("group", { children: [
		/* @__PURE__ */ jsx(SkyDome, {}),
		/* @__PURE__ */ jsx(Sun, {}),
		/* @__PURE__ */ jsx(Clouds, {})
	] });
}
//#endregion
//#region src/three/GameCanvas.tsx
var MARKET_VIEW = {
	position: [
		1.4,
		4,
		13
	],
	target: [
		1.4,
		1.3,
		0
	]
};
/**
* Framing for a greenhouse with `tables` benches.
*
* The building grows away from the camera as tables are bought, so the view has
* to pull back and re-centre or the far end falls out of frame. The down-angle
* stays shallow either way, to leave a band of sunset above the treeline.
*/
function greenhouseView(tables) {
	const midZ = greenhouseCenterZ(tables);
	const depth = greenhouseDepth(tables);
	const distance = Math.max(10, 6.2 + depth * .8);
	return {
		position: [
			0,
			3.3 + depth * .24,
			midZ + distance
		],
		target: [
			0,
			1.5,
			midZ
		]
	};
}
/**
* Drives the simulation from the render loop.
*
* Deliberately the only place that calls `advance`. `useFrame` gives us the real
* frame delta; the store clamps it so an alt-tabbed tab does not fast-forward.
*/
function Ticker() {
	const advance = useGame((s) => s.advance);
	useFrame((_state, dt) => advance(dt));
	return null;
}
/**
* Snaps the camera to the current scene's framing.
*
* The `camera` prop on <Canvas> only applies at mount, and we keep one Canvas
* alive across scene changes, so the move has to be done by hand.
*/
function CameraRig({ view }) {
	const camera = useThree((s) => s.camera);
	useEffect(() => {
		camera.position.set(...view.position);
		camera.lookAt(...view.target);
		camera.updateProjectionMatrix();
	}, [camera, view]);
	return null;
}
/**
* Sunset lighting.
*
* The key light sits low and behind the greenhouse, matching `SUN_DIRECTION` so
* the visible sun disc and the shadows agree. That backlights the interior, so
* the ambient and the cool fill from the camera side are doing real work here —
* without them the plants read as silhouettes and you cannot tell them apart.
*/
function Lighting() {
	const sun = KEY_LIGHT_DIRECTION.clone().multiplyScalar(26);
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx("hemisphereLight", { args: [
			"#ffc79c",
			"#4a4530",
			1.15
		] }),
		/* @__PURE__ */ jsx("ambientLight", {
			intensity: .62,
			color: "#ffdcbb"
		}),
		/* @__PURE__ */ jsx("directionalLight", {
			castShadow: true,
			position: [
				sun.x,
				sun.y,
				sun.z
			],
			intensity: 3.1,
			color: "#ffb877",
			"shadow-mapSize": [2048, 2048],
			"shadow-bias": -5e-4,
			children: /* @__PURE__ */ jsx("orthographicCamera", {
				attach: "shadow-camera",
				args: [
					-14,
					14,
					14,
					-14,
					.1,
					60
				]
			})
		}),
		/* @__PURE__ */ jsx("directionalLight", {
			position: [
				10,
				6,
				14
			],
			intensity: 1.15,
			color: "#a8bedd"
		})
	] });
}
function GameCanvas() {
	const location = useGame((s) => s.world.location);
	const tables = useGame((s) => s.world.tables);
	const view = useMemo(() => location === "greenhouse" ? greenhouseView(tables) : MARKET_VIEW, [location, tables]);
	return /* @__PURE__ */ jsxs(Canvas, {
		shadows: true,
		dpr: [1, 2],
		camera: {
			position: view.position,
			fov: 45,
			near: .1,
			far: 1e3
		},
		gl: {
			antialias: true,
			toneMapping: THREE.ACESFilmicToneMapping,
			preserveDrawingBuffer: false
		},
		onCreated: (state) => {},
		children: [
			/* @__PURE__ */ jsx("color", {
				attach: "background",
				args: [HORIZON_COLOR]
			}),
			/* @__PURE__ */ jsx("fog", {
				attach: "fog",
				args: [
					HORIZON_COLOR,
					25,
					120
				]
			}),
			/* @__PURE__ */ jsx(Ticker, {}),
			/* @__PURE__ */ jsx(Lighting, {}),
			/* @__PURE__ */ jsx(Sky, {}),
			/* @__PURE__ */ jsxs("group", { children: [
				/* @__PURE__ */ jsx(CameraRig, { view }),
				location === "greenhouse" ? /* @__PURE__ */ jsx(Greenhouse, {}) : /* @__PURE__ */ jsx(Market, {}),
				/* @__PURE__ */ jsx(OrbitControls$1, {
					makeDefault: true,
					target: view.target,
					enablePan: false,
					minDistance: 4,
					maxDistance: Math.max(18, view.position[2] - view.target[2] + 8),
					minPolarAngle: .15,
					maxPolarAngle: Math.PI / 2 - .05,
					enableDamping: true,
					dampingFactor: .08
				})
			] }, location)
		]
	});
}
//#endregion
//#region src/ui/Hud.tsx
/**
* Top bar: money, level, XP progress, time controls.
*
* The controls are icon-only with tooltips rather than labelled buttons — there
* are five of them now, and spelled out they crowded the bar. `data-tip` drives
* a CSS tooltip; `aria-label` carries the same text for screen readers.
*/
/** Icons per speed, so 2x and 4x are distinguishable at a glance. */
var SPEED_ICON = {
	1: "▶",
	2: "▶▶",
	4: "▶▶▶"
};
var SPEED_TIP = {
	1: "Normal speed",
	2: "Double speed",
	4: "Quadruple speed"
};
function IconButton({ icon, tip, hotkey, active, onClick }) {
	const label = hotkey ? `${tip} (${hotkey})` : tip;
	return /* @__PURE__ */ jsx("button", {
		type: "button",
		className: `iconbtn ${active ? "iconbtn--active" : ""}`,
		onClick,
		"data-tip": label,
		"aria-label": label,
		"aria-pressed": active ?? false,
		children: icon
	});
}
function Hud({ onOpenSaves }) {
	const money = useGame((s) => s.world.money);
	const level = useGame((s) => s.world.level);
	const xp = useGame((s) => s.world.xp);
	const tables = useGame((s) => s.world.tables);
	const paused = useGame((s) => s.world.paused);
	const timeScale = useGame((s) => s.world.timeScale);
	const location = useGame((s) => s.world.location);
	const togglePaused = useGame((s) => s.togglePaused);
	const setTimeScale = useGame((s) => s.setTimeScale);
	const setLocation = useGame((s) => s.setLocation);
	const needed = xpToNextLevel(level);
	const pct = Math.min(100, xp / needed * 100);
	return /* @__PURE__ */ jsxs("header", {
		className: "hud",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "hud__stat hud__stat--money",
				children: [/* @__PURE__ */ jsx("span", {
					className: "hud__label",
					children: "Money"
				}), /* @__PURE__ */ jsxs("span", {
					className: "hud__value",
					children: ["$", money]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "hud__stat hud__level",
				children: [
					/* @__PURE__ */ jsxs("span", {
						className: "hud__label",
						children: ["Level ", level]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "xpbar",
						role: "progressbar",
						"aria-valuenow": xp,
						"aria-valuemax": needed,
						children: /* @__PURE__ */ jsx("div", {
							className: "xpbar__fill",
							style: { width: `${pct}%` }
						})
					}),
					/* @__PURE__ */ jsxs("span", {
						className: "hud__sub",
						children: [
							xp,
							" / ",
							needed,
							" xp · ",
							potCapacity(tables),
							" pots"
						]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "hud__actions",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "timectl",
						role: "group",
						"aria-label": "Time controls",
						children: [
							/* @__PURE__ */ jsx(IconButton, {
								icon: paused ? "▶" : "⏸",
								tip: paused ? "Resume" : "Pause",
								hotkey: "Space",
								active: paused,
								onClick: togglePaused
							}),
							/* @__PURE__ */ jsx("span", {
								className: "timectl__divider",
								"aria-hidden": "true"
							}),
							TIME_SCALES.map((scale, i) => /* @__PURE__ */ jsx(IconButton, {
								icon: SPEED_ICON[scale] ?? `${scale}x`,
								tip: SPEED_TIP[scale] ?? `${scale}x speed`,
								hotkey: String(i + 1),
								active: !paused && timeScale === scale,
								onClick: () => setTimeScale(scale)
							}, scale))
						]
					}),
					/* @__PURE__ */ jsx(IconButton, {
						icon: "💾",
						tip: "Save and load",
						onClick: onOpenSaves
					}),
					location === "greenhouse" ? /* @__PURE__ */ jsx("button", {
						type: "button",
						className: "btn btn--primary",
						onClick: () => setLocation("market"),
						children: "Go to Market"
					}) : /* @__PURE__ */ jsx("button", {
						type: "button",
						className: "btn btn--primary",
						onClick: () => setLocation("greenhouse"),
						children: "Back to Greenhouse"
					})
				]
			})
		]
	});
}
//#endregion
//#region src/ui/SaveMenu.tsx
/** Formats a save timestamp as something a person can scan quickly. */
function when(ms) {
	if (!ms) return "unknown time";
	return new Date(ms).toLocaleString(void 0, {
		day: "numeric",
		month: "short",
		hour: "2-digit",
		minute: "2-digit"
	});
}
function SaveMenu({ onClose }) {
	const saveToSlot = useGame((s) => s.saveToSlot);
	const loadFromSlot = useGame((s) => s.loadFromSlot);
	const deleteSlot = useGame((s) => s.deleteSlot);
	const revision = useGame((s) => s.saveRevision);
	const slots = useMemo(() => listSlots(), [revision]);
	const [confirming, setConfirming] = useState(null);
	useEffect(() => {
		function onKey(e) {
			if (e.key === "Escape") onClose();
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose]);
	return /* @__PURE__ */ jsx("div", {
		className: "modal",
		onClick: onClose,
		children: /* @__PURE__ */ jsxs("div", {
			className: "modal__card",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "modal__head",
					children: [/* @__PURE__ */ jsx("h2", { children: "Save & load" }), /* @__PURE__ */ jsx("button", {
						type: "button",
						className: "btn btn--ghost btn--small",
						onClick: onClose,
						children: "Close"
					})]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "modal__note",
					children: "Your shop autosaves as you play. These three slots are manual snapshots you can come back to."
				}),
				/* @__PURE__ */ jsx("ul", {
					className: "slots",
					children: Array.from({ length: 3 }, (_, i) => {
						const summary = slots[i] ?? null;
						const pending = confirming?.slot === i ? confirming.kind : null;
						return /* @__PURE__ */ jsxs("li", {
							className: "slot",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "slot__body",
								children: [/* @__PURE__ */ jsxs("strong", {
									className: "slot__name",
									children: ["Slot ", i + 1]
								}), summary ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("span", {
									className: "slot__stats",
									children: [
										"Level ",
										summary.level,
										" · $",
										summary.money,
										" · ",
										summary.plants,
										" ",
										"planted"
									]
								}), /* @__PURE__ */ jsx("span", {
									className: "slot__time",
									children: when(summary.savedAt)
								})] }) : /* @__PURE__ */ jsx("span", {
									className: "slot__stats slot__stats--empty",
									children: "Empty"
								})]
							}), pending ? /* @__PURE__ */ jsxs("div", {
								className: "slot__actions",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "slot__confirm",
										children: pending === "save" ? "Overwrite?" : "Lose current progress?"
									}),
									/* @__PURE__ */ jsx("button", {
										type: "button",
										className: "btn btn--small btn--warn",
										onClick: () => {
											if (pending === "save") saveToSlot(i);
											else loadFromSlot(i);
											setConfirming(null);
											onClose();
										},
										children: "Yes"
									}),
									/* @__PURE__ */ jsx("button", {
										type: "button",
										className: "btn btn--small btn--ghost",
										onClick: () => setConfirming(null),
										children: "No"
									})
								]
							}) : /* @__PURE__ */ jsxs("div", {
								className: "slot__actions",
								children: [
									/* @__PURE__ */ jsx("button", {
										type: "button",
										className: "btn btn--small btn--primary",
										onClick: () => {
											if (summary) setConfirming({
												slot: i,
												kind: "save"
											});
											else {
												saveToSlot(i);
												onClose();
											}
										},
										children: "Save"
									}),
									/* @__PURE__ */ jsx("button", {
										type: "button",
										className: "btn btn--small",
										disabled: !summary,
										onClick: () => setConfirming({
											slot: i,
											kind: "load"
										}),
										children: "Load"
									}),
									/* @__PURE__ */ jsx("button", {
										type: "button",
										className: "btn btn--small btn--ghost",
										disabled: !summary,
										onClick: () => deleteSlot(i),
										title: "Delete this save",
										children: "✕"
									})
								]
							})]
						}, i);
					})
				})
			]
		})
	});
}
//#endregion
//#region src/ui/SeedTray.tsx
/**
* The seeds in the player's pocket. Selecting one arms it; the next click on an
* empty pot plants it.
*/
function SeedTray() {
	const seeds = useGame((s) => s.world.seeds);
	const selected = useGame((s) => s.world.selectedSeed);
	const selectSeed = useGame((s) => s.selectSeed);
	const setLocation = useGame((s) => s.setLocation);
	const held = Object.entries(seeds).filter(([, n]) => n > 0);
	return /* @__PURE__ */ jsxs("aside", {
		className: "tray",
		children: [
			/* @__PURE__ */ jsx("h2", {
				className: "tray__title",
				children: "Seed pouch"
			}),
			held.length === 0 ? /* @__PURE__ */ jsxs("p", {
				className: "tray__empty",
				children: ["No seeds. Head to the market to buy some.", /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn btn--small",
					onClick: () => setLocation("market"),
					children: "Go to Market"
				})]
			}) : /* @__PURE__ */ jsx("ul", {
				className: "tray__list",
				children: held.map(([id, count]) => {
					const species = getSpecies(id);
					return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("button", {
						type: "button",
						className: `seed ${selected === id ? "seed--selected" : ""}`,
						onClick: () => selectSeed(id),
						title: `${species.name} — sells for $${species.sellPrice}`,
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "seed__dot",
								style: { background: species.palette.crown }
							}),
							/* @__PURE__ */ jsx("span", {
								className: "seed__name",
								children: species.name
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "seed__count",
								children: ["×", count]
							})
						]
					}) }, id);
				})
			}),
			selected && /* @__PURE__ */ jsxs("p", {
				className: "tray__hint",
				children: [
					"Click an empty pot to plant ",
					/* @__PURE__ */ jsx("strong", { children: getSpecies(selected).name }),
					"."
				]
			})
		]
	});
}
//#endregion
//#region src/ui/MarketPanel.tsx
/** The market's price list. Mirrors what clicking the 3D crates does. */
function MarketPanel() {
	const money = useGame((s) => s.world.money);
	const level = useGame((s) => s.world.level);
	const seeds = useGame((s) => s.world.seeds);
	const buySeed = useGame((s) => s.buySeed);
	return /* @__PURE__ */ jsxs("aside", {
		className: "market",
		children: [
			/* @__PURE__ */ jsx("h2", {
				className: "market__title",
				children: "Seed stall"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "market__hint",
				children: "Click a crate, or buy from the list."
			}),
			/* @__PURE__ */ jsx("ul", {
				className: "market__list",
				children: SPECIES.map((s) => {
					const locked = s.unlockLevel > level;
					const tooDear = s.seedCost > money;
					const held = seeds[s.id] ?? 0;
					return /* @__PURE__ */ jsxs("li", {
						className: `offer ${locked ? "offer--locked" : ""}`,
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "offer__dot",
								style: { background: s.palette.crown }
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "offer__body",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "offer__head",
										children: [/* @__PURE__ */ jsx("strong", { children: s.name }), held > 0 && /* @__PURE__ */ jsxs("span", {
											className: "offer__held",
											children: [
												"×",
												held,
												" held"
											]
										})]
									}),
									/* @__PURE__ */ jsx("p", {
										className: "offer__desc",
										children: s.description
									}),
									/* @__PURE__ */ jsxs("p", {
										className: "offer__meta",
										children: [
											"Sells $",
											s.sellPrice,
											" · ",
											s.growthSeconds,
											"s to grow ·",
											" ",
											waterWord(s.thirst)
										]
									})
								]
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								className: "btn btn--buy",
								disabled: locked || tooDear,
								onClick: () => buySeed(s.id),
								title: locked ? `Unlocks at level ${s.unlockLevel}` : `Buy for $${s.seedCost}`,
								children: locked ? `Lv ${s.unlockLevel}` : `$${s.seedCost}`
							})
						]
					}, s.id);
				})
			})
		]
	});
}
/** Turns a thirst rate into something a player can actually reason about. */
function waterWord(thirst) {
	const secondsToDry = Math.round(1 / thirst);
	if (secondsToDry >= 100) return "barely needs water";
	if (secondsToDry >= 45) return "low upkeep";
	if (secondsToDry >= 30) return "water regularly";
	return "very thirsty";
}
//#endregion
//#region src/ui/ExpansionCard.tsx
/** Buying the next bench. Sits under the seed pouch in the greenhouse view. */
function ExpansionCard() {
	const tables = useGame((s) => s.world.tables);
	const money = useGame((s) => s.world.money);
	const level = useGame((s) => s.world.level);
	const buyExpansion = useGame((s) => s.buyExpansion);
	const next = nextExpansion(tables);
	const capacity = potCapacity(tables);
	return /* @__PURE__ */ jsxs("aside", {
		className: "expand",
		children: [
			/* @__PURE__ */ jsx("h2", {
				className: "expand__title",
				children: "Greenhouse"
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "expand__now",
				children: [
					tables,
					" table",
					tables === 1 ? "" : "s",
					" · ",
					capacity,
					" pots"
				]
			}),
			next ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
				className: "expand__row",
				children: [/* @__PURE__ */ jsxs("span", {
					className: "expand__gain",
					children: [
						"+",
						5,
						" pots",
						/* @__PURE__ */ jsxs("span", {
							className: "expand__sub",
							children: ["table ", next.table]
						})
					]
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn btn--buy",
					disabled: level < next.level || money < next.cost,
					onClick: buyExpansion,
					title: level < next.level ? `Unlocks at level ${next.level}` : `Extend the greenhouse for $${next.cost}`,
					children: level < next.level ? `Lv ${next.level}` : `$${next.cost}`
				})]
			}), /* @__PURE__ */ jsx("p", {
				className: "expand__hint",
				children: level < next.level ? `Reach level ${next.level} to build this.` : money < next.cost ? `$${next.cost - money} more to go.` : "The greenhouse extends out into the meadow."
			})] }) : /* @__PURE__ */ jsxs("p", {
				className: "expand__hint",
				children: [
					"Fully built — all ",
					EXPANSIONS.length + 1,
					" tables. Nothing left to add."
				]
			})
		]
	});
}
//#endregion
//#region src/ui/Feed.tsx
/** Transient messages: sales, purchases, level-ups. Entries expire in `world.ts`. */
function Feed() {
	const feed = useGame((s) => s.world.feed);
	return /* @__PURE__ */ jsx("div", {
		className: "feed",
		"aria-live": "polite",
		children: feed.map((entry) => /* @__PURE__ */ jsx("div", {
			className: `feed__item feed__item--${entry.kind}`,
			children: entry.text
		}, entry.id))
	});
}
//#endregion
//#region src/App.tsx
function App() {
	const location = useGame((s) => s.world.location);
	const paused = useGame((s) => s.world.paused);
	const togglePaused = useGame((s) => s.togglePaused);
	const setPaused = useGame((s) => s.setPaused);
	const setTimeScale = useGame((s) => s.setTimeScale);
	const reset = useGame((s) => s.reset);
	const [savesOpen, setSavesOpen] = useState(false);
	useEffect(() => {
		function onKeyDown(e) {
			if (e.repeat) return;
			const target = e.target;
			if (target instanceof Element && target.closest("input, textarea, select, [contenteditable=\"true\"]")) return;
			if (e.code === "Space") {
				e.preventDefault();
				togglePaused();
				return;
			}
			const index = [
				"Digit1",
				"Digit2",
				"Digit3"
			].indexOf(e.code);
			const scale = index >= 0 ? TIME_SCALES[index] : void 0;
			if (scale !== void 0) {
				e.preventDefault();
				setTimeScale(scale);
			}
		}
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [togglePaused, setTimeScale]);
	useEffect(() => {
		function onVisibility() {
			if (document.hidden) setPaused(true);
		}
		document.addEventListener("visibilitychange", onVisibility);
		return () => document.removeEventListener("visibilitychange", onVisibility);
	}, [setPaused]);
	return /* @__PURE__ */ jsxs("div", {
		className: "app",
		children: [
			/* @__PURE__ */ jsx(GameCanvas, {}),
			/* @__PURE__ */ jsxs("div", {
				className: "overlay",
				children: [
					/* @__PURE__ */ jsx(Hud, { onOpenSaves: () => setSavesOpen(true) }),
					/* @__PURE__ */ jsx("div", {
						className: "overlay__side",
						children: location === "greenhouse" ? /* @__PURE__ */ jsxs("div", {
							className: "sidestack",
							children: [/* @__PURE__ */ jsx(SeedTray, {}), /* @__PURE__ */ jsx(ExpansionCard, {})]
						}) : /* @__PURE__ */ jsx(MarketPanel, {})
					}),
					/* @__PURE__ */ jsx(Feed, {}),
					/* @__PURE__ */ jsxs("footer", {
						className: "footer",
						children: [/* @__PURE__ */ jsx("span", { children: "Drag to orbit · scroll to zoom · click a pot to plant, water or sell" }), /* @__PURE__ */ jsx("button", {
							type: "button",
							className: "btn btn--ghost btn--small",
							onClick: () => {
								if (confirm("Start over? This erases your shop.")) reset();
							},
							children: "Reset"
						})]
					})
				]
			}),
			savesOpen && /* @__PURE__ */ jsx(SaveMenu, { onClose: () => setSavesOpen(false) }),
			paused && !savesOpen && /* @__PURE__ */ jsx("div", {
				className: "paused",
				onClick: togglePaused,
				children: /* @__PURE__ */ jsxs("div", {
					className: "paused__card",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "paused__title",
							children: "Paused"
						}),
						/* @__PURE__ */ jsx("span", {
							className: "paused__hint",
							children: "Press Space or click to resume"
						}),
						/* @__PURE__ */ jsx("span", {
							className: "paused__hint",
							children: "1 / 2 / 3 set the speed"
						})
					]
				})
			})
		]
	});
}
//#endregion
//#region src/codepen/main.tsx
/**
* CodePen entry point.
*
* Differs from `src/main.tsx` in two ways:
*  - it does not import the stylesheet, because CodePen keeps CSS in its own
*    pane;
*  - it creates its own mount point if the HTML pane has not provided one, so
*    the pen still runs whatever order CodePen injects the panes in.
*/
var container = document.getElementById("root");
if (!container) {
	container = document.createElement("div");
	container.id = "root";
	document.body.appendChild(container);
}
createRoot(container).render(/* @__PURE__ */ jsx(StrictMode, { children: /* @__PURE__ */ jsx(App, {}) }));
/**
* Nudge react-three-fiber into re-measuring the canvas.
*
* It only starts rendering once it observes a non-zero size, and CodePen runs
* the pen inside an iframe that can be sized *after* this script executes. When
* that happens the initial measurement is zero, no frame is ever drawn, and the
* pen sits blank until the viewer happens to resize the window. A couple of
* synthetic resize events cost nothing and remove that failure entirely.
*/
function remeasure() {
	window.dispatchEvent(new Event("resize"));
}
requestAnimationFrame(remeasure);
setTimeout(remeasure, 300);
window.addEventListener("load", remeasure);
//#endregion
