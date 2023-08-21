#! /usr/bin/env node
import EventEmitter from "events";
import { createRequire } from "module";
import fetchEventData from "./fetchEvent.js";
import { getUserInput } from "./inputs.js";
import boxen from "boxen";
import { IUserInput, IWarframeEvents, Language } from "./types.js";
import logCurrentEventStatus from "./logData.js";

const require = createRequire(import.meta.url);
const warframeEvents = require("./app-queries/events.json");
const queryLanguages = require("./app-queries/languages.json");
const event = new EventEmitter();
const warframeAPI = `https://api.warframestat.us/pc/`; //path parameters+language

event.on(
  "start",
  async (
    warframeEvents: Array<IWarframeEvents>,
    queryLanguages: Array<Language>
  ) => {
    console.log(
      boxen("Warframe Event Status CLI", {
        title: "Fdiaz",
        titleAlignment: "center",
        padding: { top: 4, bottom: 4, left: 2, right: 2 },
        borderStyle: "round",
      })
    );
    const input = await getUserInput(warframeEvents, queryLanguages);
    console.log(input);
    event.emit("fetch", warframeAPI, input);
  }
);
event.emit("start", warframeEvents, queryLanguages);

event.on("fetch", async (api: string, input: IUserInput) => {
  const data = await fetchEventData(api, input);
  const displayLog = await logCurrentEventStatus(data, warframeEvents);
});
