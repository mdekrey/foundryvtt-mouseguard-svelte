var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// fakecss:D:/FoundryData/Data/systems/mouseguard/module/svelte/MouseGuardActorSheetHeader.esbuild-svelte-fake-css
var require_ = __commonJS({
  "fakecss:D:/FoundryData/Data/systems/mouseguard/module/svelte/MouseGuardActorSheetHeader.esbuild-svelte-fake-css"(exports, module) {
    module.exports = {};
  }
});

// fakecss:D:/FoundryData/Data/systems/mouseguard/module/svelte/MouseGuardActorSheetMouseDetails.esbuild-svelte-fake-css
var require_2 = __commonJS({
  "fakecss:D:/FoundryData/Data/systems/mouseguard/module/svelte/MouseGuardActorSheetMouseDetails.esbuild-svelte-fake-css"(exports, module) {
    module.exports = {};
  }
});

// fakecss:D:/FoundryData/Data/systems/mouseguard/module/svelte/MouseGuardActorSheetMousePortrait.esbuild-svelte-fake-css
var require_3 = __commonJS({
  "fakecss:D:/FoundryData/Data/systems/mouseguard/module/svelte/MouseGuardActorSheetMousePortrait.esbuild-svelte-fake-css"(exports, module) {
    module.exports = {};
  }
});

// fakecss:D:/FoundryData/Data/systems/mouseguard/module/svelte/MouseGuardActorSheetMouseRewards.esbuild-svelte-fake-css
var require_4 = __commonJS({
  "fakecss:D:/FoundryData/Data/systems/mouseguard/module/svelte/MouseGuardActorSheetMouseRewards.esbuild-svelte-fake-css"(exports, module) {
    module.exports = {};
  }
});

// fakecss:D:/FoundryData/Data/systems/mouseguard/module/svelte/MouseGuardActorSheetBase.esbuild-svelte-fake-css
var require_5 = __commonJS({
  "fakecss:D:/FoundryData/Data/systems/mouseguard/module/svelte/MouseGuardActorSheetBase.esbuild-svelte-fake-css"(exports, module) {
    module.exports = {};
  }
});

// module/constants.js
var ATTRIBUTE_TYPES = ["String", "Number", "Boolean", "Formula", "Resource"];

// module/helper.js
var EntitySheetHelper = class {
  static getAttributeData(data) {
    for (let attr2 of Object.values(data.data.attributes)) {
      if (attr2.dtype) {
        attr2.isCheckbox = attr2.dtype === "Boolean";
        attr2.isResource = attr2.dtype === "Resource";
        attr2.isFormula = attr2.dtype === "Formula";
      }
    }
    data.data.ungroupedAttributes = {};
    const groups = data.data.groups || {};
    let groupKeys = Object.keys(groups).sort((a, b) => {
      let aSort = groups[a].label ?? a;
      let bSort = groups[b].label ?? b;
      return aSort.localeCompare(bSort);
    });
    for (let key of groupKeys) {
      let group = data.data.attributes[key] || {};
      if (!data.data.groups[key]["attributes"])
        data.data.groups[key]["attributes"] = {};
      Object.keys(group).sort((a, b) => a.localeCompare(b)).forEach((attr2) => {
        if (typeof group[attr2] != "object" || !group[attr2])
          return;
        group[attr2]["isCheckbox"] = group[attr2]["dtype"] === "Boolean";
        group[attr2]["isResource"] = group[attr2]["dtype"] === "Resource";
        group[attr2]["isFormula"] = group[attr2]["dtype"] === "Formula";
        data.data.groups[key]["attributes"][attr2] = group[attr2];
      });
    }
    Object.keys(data.data.attributes).filter((a) => !groupKeys.includes(a)).sort((a, b) => a.localeCompare(b)).forEach((key) => {
      data.data.ungroupedAttributes[key] = data.data.attributes[key];
    });
    if (data.items) {
      data.items.forEach((item2) => {
        for (let [k, v] of Object.entries(item2.data.attributes)) {
          if (!v.dtype) {
            for (let [gk, gv] of Object.entries(v)) {
              if (gv.dtype) {
                if (!gv.label)
                  gv.label = gk;
                if (gv.dtype === "Formula") {
                  gv.isFormula = true;
                } else {
                  gv.isFormula = false;
                }
              }
            }
          } else {
            if (!v.label)
              v.label = k;
            if (v.dtype === "Formula") {
              v.isFormula = true;
            } else {
              v.isFormula = false;
            }
          }
        }
      });
    }
  }
  static onSubmit(event) {
    if (event.currentTarget) {
      if (event.currentTarget.tagName.toLowerCase() === "input" && !event.currentTarget.hasAttribute("name")) {
        return false;
      }
      let attr2 = false;
      const el = event.currentTarget;
      if (el.classList.contains("attribute-key")) {
        let val = el.value;
        let oldVal = el.closest(".attribute").dataset.attribute;
        let attrError = false;
        let groups = document.querySelectorAll(".group-key");
        for (let i = 0; i < groups.length; i++) {
          if (groups[i].value === val) {
            ui.notifications.error(game.i18n.localize("MOUSEGUARD.NotifyAttrDuplicate") + ` (${val})`);
            el.value = oldVal;
            attrError = true;
            break;
          }
        }
        if (!attrError) {
          oldVal = oldVal.includes(".") ? oldVal.split(".")[1] : oldVal;
          attr2 = $(el).attr("name").replace(oldVal, val);
        }
      }
      return attr2 ? attr2 : true;
    }
  }
  static async onClickAttributeControl(event) {
    event.preventDefault();
    const a = event.currentTarget;
    const action = a.dataset.action;
    switch (action) {
      case "create":
        return EntitySheetHelper.createAttribute(event, this);
      case "delete":
        return EntitySheetHelper.deleteAttribute(event, this);
    }
  }
  static async onClickAttributeGroupControl(event) {
    event.preventDefault();
    const a = event.currentTarget;
    const action = a.dataset.action;
    switch (action) {
      case "create-group":
        return EntitySheetHelper.createAttributeGroup(event, this);
      case "delete-group":
        return EntitySheetHelper.deleteAttributeGroup(event, this);
    }
  }
  static onAttributeRoll(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const label = button.closest(".attribute").querySelector(".attribute-label")?.value;
    const chatLabel = label ?? button.parentElement.querySelector(".attribute-key").value;
    const shorthand = game.settings.get("mouseguard", "macroShorthand");
    const rollData = this.actor.getRollData();
    let formula = button.closest(".attribute").querySelector(".attribute-value")?.value;
    if (formula) {
      let replacement = null;
      if (formula.includes("@item.") && this.item) {
        let itemName = this.item.name.slugify({ strict: true });
        replacement = !!shorthand ? `@items.${itemName}.` : `@items.${itemName}.attributes.`;
        formula = formula.replace("@item.", replacement);
      }
      let r = new Roll(formula, rollData);
      return r.toMessage({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: `${chatLabel}`
      });
    }
  }
  static getAttributeHtml(items, index, group = false) {
    let result = '<div style="display: none;">';
    for (let [key, item2] of Object.entries(items)) {
      result = result + `<input type="${item2.type}" name="data.attributes${group ? "." + group : ""}.attr${index}.${key}" value="${item2.value}"/>`;
    }
    return result + "</div>";
  }
  static validateGroup(groupName, document2) {
    let groups = Object.keys(document2.data.data.groups || {});
    let attributes = Object.keys(document2.data.data.attributes).filter((a) => !groups.includes(a));
    if (groups.includes(groupName)) {
      ui.notifications.error(game.i18n.localize("MOUSEGUARD.NotifyGroupDuplicate") + ` (${groupName})`);
      return false;
    }
    if (attributes.includes(groupName)) {
      ui.notifications.error(game.i18n.localize("MOUSEGUARD.NotifyGroupAttrDuplicate") + ` (${groupName})`);
      return false;
    }
    if (groupName.match(/[\s|\.]/i)) {
      ui.notifications.error(game.i18n.localize("MOUSEGUARD.NotifyGroupAlphanumeric"));
      return false;
    }
    return true;
  }
  static async createAttribute(event, app) {
    const a = event.currentTarget;
    const group = a.dataset.group;
    let dtype = a.dataset.dtype;
    const attrs = app.object.data.data.attributes;
    const groups = app.object.data.data.groups;
    const form = app.form;
    let objKeys = Object.keys(attrs).filter((k) => !Object.keys(groups).includes(k));
    let nk = Object.keys(attrs).length + 1;
    let newValue = `attr${nk}`;
    let newKey = document.createElement("div");
    while (objKeys.includes(newValue)) {
      ++nk;
      newValue = `attr${nk}`;
    }
    let htmlItems = {
      key: {
        type: "text",
        value: newValue
      }
    };
    if (group) {
      objKeys = attrs[group] ? Object.keys(attrs[group]) : [];
      nk = objKeys.length + 1;
      newValue = `attr${nk}`;
      while (objKeys.includes(newValue)) {
        ++nk;
        newValue = `attr${nk}`;
      }
      htmlItems.key.value = newValue;
      htmlItems.group = {
        type: "hidden",
        value: group
      };
      htmlItems.dtype = {
        type: "hidden",
        value: dtype
      };
    } else {
      if (!dtype) {
        let lastAttr = document.querySelector(".attributes > .attributes-group .attribute:last-child .attribute-dtype")?.value;
        dtype = lastAttr ? lastAttr : "String";
        htmlItems.dtype = {
          type: "hidden",
          value: dtype
        };
      }
    }
    newKey.innerHTML = EntitySheetHelper.getAttributeHtml(htmlItems, nk, group);
    newKey = newKey.children[0];
    form.appendChild(newKey);
    await app._onSubmit(event);
  }
  static async deleteAttribute(event, app) {
    const a = event.currentTarget;
    const li = a.closest(".attribute");
    if (li) {
      li.parentElement.removeChild(li);
      await app._onSubmit(event);
    }
  }
  static async createAttributeGroup(event, app) {
    const a = event.currentTarget;
    const form = app.form;
    let newValue = $(a).siblings(".group-prefix").val();
    if (newValue.length > 0 && EntitySheetHelper.validateGroup(newValue, app.object)) {
      let newKey = document.createElement("div");
      newKey.innerHTML = `<input type="text" name="data.groups.${newValue}.key" value="${newValue}"/>`;
      newKey = newKey.children[0];
      form.appendChild(newKey);
      await app._onSubmit(event);
    }
  }
  static async deleteAttributeGroup(event, app) {
    const a = event.currentTarget;
    let groupHeader = a.closest(".group-header");
    let groupContainer = groupHeader.closest(".group");
    let group = $(groupHeader).find(".group-key");
    new Dialog({
      title: game.i18n.localize("MOUSEGUARD.DeleteGroup"),
      content: `${game.i18n.localize("MOUSEGUARD.DeleteGroupContent")} <strong>${group.val()}</strong>`,
      buttons: {
        confirm: {
          icon: '<i class="fas fa-trash"></i>',
          label: game.i18n.localize("Yes"),
          callback: async () => {
            groupContainer.parentElement.removeChild(groupContainer);
            await app._onSubmit(event);
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize("No")
        }
      }
    }).render(true);
  }
  static updateAttributes(formData, document2) {
    let groupKeys = [];
    const formAttrs = foundry.utils.expandObject(formData)?.data?.attributes || {};
    const attributes = Object.values(formAttrs).reduce((obj, v) => {
      let attrs = [];
      let group = null;
      if (!v["key"]) {
        attrs = Object.keys(v);
        attrs.forEach((attrKey) => {
          group = v[attrKey]["group"];
          groupKeys.push(group);
          let attr2 = v[attrKey];
          let k = v[attrKey]["key"] ? v[attrKey]["key"].trim() : attrKey.trim();
          if (/[\s\.]/.test(k))
            return ui.notifications.error("Attribute keys may not contain spaces or periods");
          delete attr2["key"];
          if (!obj[group]) {
            obj[group] = {};
          }
          obj[group][k] = attr2;
        });
      } else {
        let k = v["key"].trim();
        if (/[\s\.]/.test(k))
          return ui.notifications.error("Attribute keys may not contain spaces or periods");
        delete v["key"];
        if (!group) {
          obj[k] = v;
        }
      }
      return obj;
    }, {});
    for (let k of Object.keys(document2.data.data.attributes)) {
      if (!attributes.hasOwnProperty(k))
        attributes[`-=${k}`] = null;
    }
    for (let group of groupKeys) {
      if (document2.data.data.attributes[group]) {
        for (let k of Object.keys(document2.data.data.attributes[group])) {
          if (!attributes[group].hasOwnProperty(k))
            attributes[group][`-=${k}`] = null;
        }
      }
    }
    formData = Object.entries(formData).filter((e) => !e[0].startsWith("data.attributes")).reduce((obj, e) => {
      obj[e[0]] = e[1];
      return obj;
    }, { _id: document2.id, "data.attributes": attributes });
    return formData;
  }
  static updateGroups(formData, document2) {
    const formGroups = expandObject(formData).data.groups || {};
    const groups = Object.values(formGroups).reduce((obj, v) => {
      if (Array.isArray(v["key"])) {
        v["key"] = v["key"][0];
      }
      let k = v["key"].trim();
      if (/[\s\.]/.test(k))
        return ui.notifications.error("Group keys may not contain spaces or periods");
      delete v["key"];
      obj[k] = v;
      return obj;
    }, {});
    for (let k of Object.keys(document2.data.data.groups)) {
      if (!groups.hasOwnProperty(k))
        groups[`-=${k}`] = null;
    }
    formData = Object.entries(formData).filter((e) => !e[0].startsWith("data.groups")).reduce((obj, e) => {
      obj[e[0]] = e[1];
      return obj;
    }, { _id: document2.id, "data.groups": groups });
    return formData;
  }
  static async createDialog(data = {}, options = {}) {
    const documentName = this.metadata.name;
    const folders = game.folders.filter((f) => f.data.type === documentName && f.displayed);
    const label = game.i18n.localize(this.metadata.label);
    const title = game.i18n.format("ENTITY.Create", { entity: label });
    const collection = game.collections.get(this.documentName);
    const templates = collection.filter((a) => a.getFlag("mouseguard", "isTemplate"));
    const defaultType = this.metadata.types[0];
    const types = {
      [defaultType]: game.i18n.localize("MOUSEGUARD.NoTemplate")
    };
    for (let a of templates) {
      types[a.id] = a.name;
    }
    const html = await renderTemplate(`templates/sidebar/entity-create.html`, {
      name: data.name || game.i18n.format("ENTITY.New", { entity: label }),
      folder: data.folder,
      folders,
      hasFolders: folders.length > 1,
      type: data.type || templates[0]?.id || "",
      types,
      hasTypes: true
    });
    return Dialog.prompt({
      title,
      content: html,
      label: title,
      callback: (html2) => {
        const form = html2[0].querySelector("form");
        const fd = new FormDataExtended(form);
        let createData = fd.toObject();
        const template = collection.get(form.type.value);
        if (template) {
          createData = foundry.utils.mergeObject(template.toObject(), createData);
          createData.type = template.data.type;
          delete createData.flags.mouseguard.isTemplate;
        }
        createData = foundry.utils.mergeObject(createData, data);
        return this.create(createData, { renderSheet: true });
      },
      rejectClose: false,
      options
    });
  }
};

// module/actor.js
var MouseGuardActor = class extends Actor {
  prepareDerivedData() {
    super.prepareDerivedData();
    this.data.data.groups = this.data.data.groups || {};
    this.data.data.attributes = this.data.data.attributes || {};
  }
  prepareData() {
    super.prepareData();
    const actorData = this.data;
    console.log(actorData);
    if (this.type === "character")
      this._prepareCharacterData(this.data);
  }
  _prepareCharacterData(actorData) {
    const data = actorData;
    console.log(data);
    const ability = [];
    const gear = [];
    const skill = [];
    for (let i of data.items) {
      let item2 = i;
      switch (item2.data.type) {
        case "item":
          gear.push(i);
          break;
        case "ability":
          ability.push(i);
          break;
        case "skill":
          skill.push(i);
          break;
      }
    }
    data.data.abilities = ability;
    data.data.gear = gear;
    data.data.skill = skill;
    const test = this.itemTypes.ability;
    console.log(test);
  }
  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);
    const abilities = [];
    if (data.type === "character" && this.itemTypes.ability.length <= 0) {
      const create_ability = ["MOUSEGUARD.MNature", "MOUSEGUARD.Will", "MOUSEGUARD.Health", "MOUSEGUARD.Resources", "MOUSEGUARD.Circles"];
      for (let i of create_ability) {
        abilities.push({
          name: i,
          type: "ability"
        });
      }
      this.data.update({ items: abilities });
    }
  }
  getRollData() {
    const data = this.toObject(false).data;
    const shorthand = game.settings.get("mouseguard", "macroShorthand");
    const formulaAttributes = [];
    const itemAttributes = [];
    this._applyShorthand(data, formulaAttributes, shorthand);
    this._applyItems(data, itemAttributes, shorthand);
    this._applyItemsFormulaReplacements(data, itemAttributes, shorthand);
    this._applyFormulaReplacements(data, formulaAttributes, shorthand);
    if (!!shorthand) {
      delete data.attributes;
      delete data.attr;
      delete data.abil;
      delete data.groups;
    }
    return data;
  }
  _applyShorthand(data, formulaAttributes, shorthand) {
    for (let [k, v] of Object.entries(data.attributes || {})) {
      if (v.dtype === "Formula")
        formulaAttributes.push(k);
      if (!!shorthand) {
        if (!(k in data)) {
          if (v.dtype) {
            data[k] = v.value;
          } else {
            data[k] = {};
            for (let [gk, gv] of Object.entries(v)) {
              data[k][gk] = gv.value;
              if (gv.dtype === "Formula")
                formulaAttributes.push(`${k}.${gk}`);
            }
          }
        }
      }
    }
  }
  _applyItems(data, itemAttributes, shorthand) {
    data.items = this.items.reduce((obj, item2) => {
      const key = item2.name.slugify({ strict: true });
      const itemData = item2.toObject(false).data;
      for (let [k, v] of Object.entries(itemData.attributes)) {
        if (v.dtype === "Formula")
          itemAttributes.push(`${key}..${k}`);
        if (!!shorthand) {
          if (!(k in itemData)) {
            if (v.dtype) {
              itemData[k] = v.value;
            } else {
              if (!itemData[k])
                itemData[k] = {};
              for (let [gk, gv] of Object.entries(v)) {
                itemData[k][gk] = gv.value;
                if (gv.dtype === "Formula")
                  itemAttributes.push(`${key}..${k}.${gk}`);
              }
            }
          }
        } else {
          if (!v.dtype) {
            if (!itemData[k])
              itemData[k] = {};
            for (let [gk, gv] of Object.entries(v)) {
              itemData[k][gk] = gv.value;
              if (gv.dtype === "Formula")
                itemAttributes.push(`${key}..${k}.${gk}`);
            }
          }
        }
      }
      if (!!shorthand) {
        delete itemData.attributes;
      }
      obj[key] = itemData;
      return obj;
    }, {});
  }
  _applyItemsFormulaReplacements(data, itemAttributes, shorthand) {
    for (let k of itemAttributes) {
      let item2 = null;
      let itemKey = k.split("..");
      item2 = itemKey[0];
      k = itemKey[1];
      let gk = null;
      if (k.includes(".")) {
        let attrKey = k.split(".");
        k = attrKey[0];
        gk = attrKey[1];
      }
      let formula = "";
      if (!!shorthand) {
        if (data.items[item2][k][gk]) {
          formula = data.items[item2][k][gk].replace("@item.", `@items.${item2}.`);
          data.items[item2][k][gk] = Roll.replaceFormulaData(formula, data);
        } else if (data.items[item2][k]) {
          formula = data.items[item2][k].replace("@item.", `@items.${item2}.`);
          data.items[item2][k] = Roll.replaceFormulaData(formula, data);
        }
      } else {
        if (data.items[item2]["attributes"][k][gk]) {
          formula = data.items[item2]["attributes"][k][gk]["value"].replace("@item.", `@items.${item2}.attributes.`);
          data.items[item2]["attributes"][k][gk]["value"] = Roll.replaceFormulaData(formula, data);
        } else if (data.items[item2]["attributes"][k]["value"]) {
          formula = data.items[item2]["attributes"][k]["value"].replace("@item.", `@items.${item2}.attributes.`);
          data.items[item2]["attributes"][k]["value"] = Roll.replaceFormulaData(formula, data);
        }
      }
    }
  }
  _applyFormulaReplacements(data, formulaAttributes, shorthand) {
    for (let k of formulaAttributes) {
      let attr2 = null;
      if (k.includes(".")) {
        let attrKey = k.split(".");
        k = attrKey[0];
        attr2 = attrKey[1];
      }
      if (data.attributes[k]?.value) {
        data.attributes[k].value = Roll.replaceFormulaData(data.attributes[k].value, data);
      } else if (attr2) {
        data.attributes[k][attr2].value = Roll.replaceFormulaData(data.attributes[k][attr2].value, data);
      }
      if (!!shorthand) {
        if (data.attributes[k]?.value) {
          data[k] = data.attributes[k].value;
        } else {
          if (attr2) {
            if (!data[k]) {
              data[k] = {};
            }
            data[k][attr2] = data.attributes[k][attr2].value;
          }
        }
      }
    }
  }
};

// module/item.js
var MouseGuardItem = class extends Item {
  prepareDerivedData() {
    super.prepareDerivedData();
    this.data.data.groups = this.data.data.groups || {};
    this.data.data.attributes = this.data.data.attributes || {};
  }
};

// module/item-sheet.js
var MouseGuardItemSheet = class extends ItemSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["mouseguard", "sheet", "item"],
      template: "systems/mouseguard/templates/item-sheet.html",
      width: 520,
      height: 480,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }],
      scrollY: [".attributes"]
    });
  }
  getData() {
    const context = super.getData();
    EntitySheetHelper.getAttributeData(context.data);
    context.systemData = context.data.data;
    context.dtypes = ATTRIBUTE_TYPES;
    return context;
  }
  activateListeners(html) {
    super.activateListeners(html);
    if (!this.isEditable)
      return;
    html.find(".attributes").on("click", ".attribute-control", EntitySheetHelper.onClickAttributeControl.bind(this));
    html.find(".groups").on("click", ".group-control", EntitySheetHelper.onClickAttributeGroupControl.bind(this));
    html.find(".attributes").on("click", "a.attribute-roll", EntitySheetHelper.onAttributeRoll.bind(this));
    html.find(".attributes a.attribute-roll").each((i, a) => {
      a.setAttribute("draggable", true);
      a.addEventListener("dragstart", (ev) => {
        let dragData = ev.currentTarget.dataset;
        ev.dataTransfer.setData("text/plain", JSON.stringify(dragData));
      }, false);
    });
  }
  _getSubmitData(updateData) {
    let formData = super._getSubmitData(updateData);
    formData = EntitySheetHelper.updateAttributes(formData, this.object);
    formData = EntitySheetHelper.updateGroups(formData, this.object);
    return formData;
  }
};

// node_modules/svelte/internal/index.mjs
function noop() {
}
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function component_subscribe(component, store, callback) {
  component.$$.on_destroy.push(subscribe(store, callback));
}
var tasks = new Set();
var is_hydrating = false;
function start_hydrating() {
  is_hydrating = true;
}
function end_hydrating() {
  is_hydrating = false;
}
function upper_bound(low, high, key, value) {
  while (low < high) {
    const mid = low + (high - low >> 1);
    if (key(mid) <= value) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return low;
}
function init_hydrate(target) {
  if (target.hydrate_init)
    return;
  target.hydrate_init = true;
  const children2 = target.childNodes;
  const m = new Int32Array(children2.length + 1);
  const p = new Int32Array(children2.length);
  m[0] = -1;
  let longest = 0;
  for (let i = 0; i < children2.length; i++) {
    const current = children2[i].claim_order;
    const seqLen = upper_bound(1, longest + 1, (idx) => children2[m[idx]].claim_order, current) - 1;
    p[i] = m[seqLen] + 1;
    const newLen = seqLen + 1;
    m[newLen] = i;
    longest = Math.max(newLen, longest);
  }
  const lis = [];
  const toMove = [];
  let last = children2.length - 1;
  for (let cur = m[longest] + 1; cur != 0; cur = p[cur - 1]) {
    lis.push(children2[cur - 1]);
    for (; last >= cur; last--) {
      toMove.push(children2[last]);
    }
    last--;
  }
  for (; last >= 0; last--) {
    toMove.push(children2[last]);
  }
  lis.reverse();
  toMove.sort((a, b) => a.claim_order - b.claim_order);
  for (let i = 0, j = 0; i < toMove.length; i++) {
    while (j < lis.length && toMove[i].claim_order >= lis[j].claim_order) {
      j++;
    }
    const anchor = j < lis.length ? lis[j] : null;
    target.insertBefore(toMove[i], anchor);
  }
}
function append(target, node) {
  if (is_hydrating) {
    init_hydrate(target);
    if (target.actual_end_child === void 0 || target.actual_end_child !== null && target.actual_end_child.parentElement !== target) {
      target.actual_end_child = target.firstChild;
    }
    if (node !== target.actual_end_child) {
      target.insertBefore(node, target.actual_end_child);
    } else {
      target.actual_end_child = node.nextSibling;
    }
  } else if (node.parentNode !== target) {
    target.appendChild(node);
  }
}
function insert(target, node, anchor) {
  if (is_hydrating && !anchor) {
    append(target, node);
  } else if (node.parentNode !== target || anchor && node.nextSibling !== anchor) {
    target.insertBefore(node, anchor || null);
  }
}
function detach(node) {
  node.parentNode.removeChild(node);
}
function element(name) {
  return document.createElement(name);
}
function text(data) {
  return document.createTextNode(data);
}
function space() {
  return text(" ");
}
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
  if (value == null)
    node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value)
    node.setAttribute(attribute, value);
}
function children(element2) {
  return Array.from(element2.childNodes);
}
var active_docs = new Set();
var current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}
function getContext(key) {
  return get_current_component().$$.context.get(key);
}
var dirty_components = [];
var binding_callbacks = [];
var render_callbacks = [];
var flush_callbacks = [];
var resolved_promise = Promise.resolve();
var update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
var flushing = false;
var seen_callbacks = new Set();
function flush() {
  if (flushing)
    return;
  flushing = true;
  do {
    for (let i = 0; i < dirty_components.length; i += 1) {
      const component = dirty_components[i];
      set_current_component(component);
      update(component.$$);
    }
    set_current_component(null);
    dirty_components.length = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  flushing = false;
  seen_callbacks.clear();
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
var outroing = new Set();
var outros;
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
function transition_out(block, local, detach2, callback) {
  if (block && block.o) {
    if (outroing.has(block))
      return;
    outroing.add(block);
    outros.c.push(() => {
      outroing.delete(block);
      if (callback) {
        if (detach2)
          block.d(1);
        callback();
      }
    });
    block.o(local);
  }
}
var globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : global;
var boolean_attributes = new Set([
  "allowfullscreen",
  "allowpaymentrequest",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "formnovalidate",
  "hidden",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected"
]);
function create_component(block) {
  block && block.c();
}
function mount_component(component, target, anchor, customElement) {
  const { fragment, on_mount, on_destroy, after_update } = component.$$;
  fragment && fragment.m(target, anchor);
  if (!customElement) {
    add_render_callback(() => {
      const new_on_destroy = on_mount.map(run).filter(is_function);
      if (on_destroy) {
        on_destroy.push(...new_on_destroy);
      } else {
        run_all(new_on_destroy);
      }
      component.$$.on_mount = [];
    });
  }
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}
function init(component, options, instance5, create_fragment5, not_equal, props, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: null,
    props,
    update: noop,
    not_equal,
    bound: blank_object(),
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(parent_component ? parent_component.$$.context : options.context || []),
    callbacks: blank_object(),
    dirty,
    skip_bound: false
  };
  let ready = false;
  $$.ctx = instance5 ? instance5(component, options.props || {}, (i, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
      if (!$$.skip_bound && $$.bound[i])
        $$.bound[i](value);
      if (ready)
        make_dirty(component, i);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment5 ? create_fragment5($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      start_hydrating();
      const nodes = children(options.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      $$.fragment && $$.fragment.c();
    }
    if (options.intro)
      transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor, options.customElement);
    end_hydrating();
    flush();
  }
  set_current_component(parent_component);
}
var SvelteElement;
if (typeof HTMLElement === "function") {
  SvelteElement = class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      const { on_mount } = this.$$;
      this.$$.on_disconnect = on_mount.map(run).filter(is_function);
      for (const key in this.$$.slotted) {
        this.appendChild(this.$$.slotted[key]);
      }
    }
    attributeChangedCallback(attr2, _oldValue, newValue) {
      this[attr2] = newValue;
    }
    disconnectedCallback() {
      run_all(this.$$.on_disconnect);
    }
    $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop;
    }
    $on(type, callback) {
      const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return () => {
        const index = callbacks.indexOf(callback);
        if (index !== -1)
          callbacks.splice(index, 1);
      };
    }
    $set($$props) {
      if (this.$$set && !is_empty($$props)) {
        this.$$.skip_bound = true;
        this.$$set($$props);
        this.$$.skip_bound = false;
      }
    }
  };
}
var SvelteComponent = class {
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }
  $on(type, callback) {
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1)
        callbacks.splice(index, 1);
    };
  }
  $set($$props) {
    if (this.$$set && !is_empty($$props)) {
      this.$$.skip_bound = true;
      this.$$set($$props);
      this.$$.skip_bound = false;
    }
  }
};

// node_modules/svelte/store/index.mjs
var subscriber_queue = [];
function writable(value, start = noop) {
  let stop;
  const subscribers = [];
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (let i = 0; i < subscribers.length; i += 1) {
          const s = subscribers[i];
          s[1]();
          subscriber_queue.push(s, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update2(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.push(subscriber);
    if (subscribers.length === 1) {
      stop = start(set) || noop;
    }
    run2(value);
    return () => {
      const index = subscribers.indexOf(subscriber);
      if (index !== -1) {
        subscribers.splice(index, 1);
      }
      if (subscribers.length === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update: update2, subscribe: subscribe2 };
}

// module/svelte/MouseGuardActorSheetHeader.svelte
require_();

// module/svelte/MouseGuardActorSheetMouseDetails.svelte
function create_fragment(ctx) {
  let largecard;
  let div;
  let h1;
  let t1;
  let input0;
  let input0_value_value;
  let t2;
  let ul;
  let lineitem0;
  let label0;
  let t5;
  let input1;
  let input1_value_value;
  let t6;
  let lineitem1;
  let label1;
  let t9;
  let input2;
  let input2_value_value;
  let input2_placeholder_value;
  let t10;
  let lineitem2;
  let label2;
  let t13;
  let input3;
  let input3_value_value;
  let input3_placeholder_value;
  let t14;
  let lineitem3;
  let label3;
  let t17;
  let input4;
  let input4_value_value;
  let input4_placeholder_value;
  let t18;
  let lineitem4;
  let label4;
  let t21;
  let input5;
  let input5_value_value;
  let input5_placeholder_value;
  let t22;
  let lineitem5;
  let label5;
  let t25;
  let input6;
  let input6_value_value;
  let input6_placeholder_value;
  let t26;
  let lineitem6;
  let label6;
  let t29;
  let input7;
  let input7_value_value;
  let input7_placeholder_value;
  let t30;
  let lineitem7;
  let label7;
  let t33;
  let input8;
  let input8_value_value;
  let input8_placeholder_value;
  let t34;
  let lineitem8;
  let label8;
  let t37;
  let input9;
  let input9_value_value;
  let input9_placeholder_value;
  let t38;
  let lineitem9;
  let label9;
  let t41;
  let input10;
  let input10_value_value;
  let input10_placeholder_value;
  return {
    c() {
      largecard = element("largecard");
      div = element("div");
      h1 = element("h1");
      h1.textContent = "Name";
      t1 = space();
      input0 = element("input");
      t2 = space();
      ul = element("ul");
      lineitem0 = element("lineitem");
      label0 = element("label");
      label0.textContent = `${game.i18n.localize("MOUSEGUARD.Age")}:`;
      t5 = space();
      input1 = element("input");
      t6 = space();
      lineitem1 = element("lineitem");
      label1 = element("label");
      label1.textContent = `${game.i18n.localize("MOUSEGUARD.Parents")}:`;
      t9 = space();
      input2 = element("input");
      t10 = space();
      lineitem2 = element("lineitem");
      label2 = element("label");
      label2.textContent = `${game.i18n.localize("MOUSEGUARD.Home")}:`;
      t13 = space();
      input3 = element("input");
      t14 = space();
      lineitem3 = element("lineitem");
      label3 = element("label");
      label3.textContent = `${game.i18n.localize("MOUSEGUARD.Senior")}:`;
      t17 = space();
      input4 = element("input");
      t18 = space();
      lineitem4 = element("lineitem");
      label4 = element("label");
      label4.textContent = `${game.i18n.localize("MOUSEGUARD.Fur")}:`;
      t21 = space();
      input5 = element("input");
      t22 = space();
      lineitem5 = element("lineitem");
      label5 = element("label");
      label5.textContent = `${game.i18n.localize("MOUSEGUARD.Mentor")}:`;
      t25 = space();
      input6 = element("input");
      t26 = space();
      lineitem6 = element("lineitem");
      label6 = element("label");
      label6.textContent = `${game.i18n.localize("MOUSEGUARD.Cloak")}:`;
      t29 = space();
      input7 = element("input");
      t30 = space();
      lineitem7 = element("lineitem");
      label7 = element("label");
      label7.textContent = `${game.i18n.localize("MOUSEGUARD.Friend")}:`;
      t33 = space();
      input8 = element("input");
      t34 = space();
      lineitem8 = element("lineitem");
      label8 = element("label");
      label8.textContent = `${game.i18n.localize("MOUSEGUARD.GuardRank")}:`;
      t37 = space();
      input9 = element("input");
      t38 = space();
      lineitem9 = element("lineitem");
      label9 = element("label");
      label9.textContent = `${game.i18n.localize("MOUSEGUARD.Enemy")}:`;
      t41 = space();
      input10 = element("input");
      attr(input0, "name", "name");
      attr(input0, "type", "text");
      input0.value = input0_value_value = ctx[0].name;
      attr(input0, "placeholder", "Name");
      attr(input0, "class", "svelte-19tsv6u");
      attr(div, "class", "namebox svelte-19tsv6u");
      attr(label0, "class", "svelte-19tsv6u");
      attr(input1, "name", "data.details.age");
      attr(input1, "type", "number");
      input1.value = input1_value_value = ctx[0].data.details.age;
      attr(input1, "placeholder", "0");
      attr(input1, "class", "svelte-19tsv6u");
      attr(lineitem0, "class", "svelte-19tsv6u");
      attr(label1, "class", "svelte-19tsv6u");
      attr(input2, "name", "data.details.parents");
      attr(input2, "type", "text");
      input2.value = input2_value_value = ctx[0].data.details.parents;
      attr(input2, "placeholder", input2_placeholder_value = game.i18n.localize("MOUSEGUARD.Parents"));
      attr(input2, "class", "svelte-19tsv6u");
      attr(lineitem1, "class", "svelte-19tsv6u");
      attr(label2, "class", "svelte-19tsv6u");
      attr(input3, "name", "data.details.home");
      attr(input3, "type", "text");
      input3.value = input3_value_value = ctx[0].data.details.home;
      attr(input3, "placeholder", input3_placeholder_value = game.i18n.localize("MOUSEGUARD.Home"));
      attr(input3, "class", "svelte-19tsv6u");
      attr(lineitem2, "class", "svelte-19tsv6u");
      attr(label3, "class", "svelte-19tsv6u");
      attr(input4, "name", "data.details.senior_artisan");
      attr(input4, "type", "text");
      input4.value = input4_value_value = ctx[0].data.details.senior_artisan;
      attr(input4, "placeholder", input4_placeholder_value = game.i18n.localize("MOUSEGUARD.Senior"));
      attr(input4, "class", "svelte-19tsv6u");
      attr(lineitem3, "class", "svelte-19tsv6u");
      attr(label4, "class", "svelte-19tsv6u");
      attr(input5, "name", "data.details.fur_color");
      attr(input5, "type", "text");
      input5.value = input5_value_value = ctx[0].data.details.fur_color;
      attr(input5, "placeholder", input5_placeholder_value = game.i18n.localize("MOUSEGUARD.Fur"));
      attr(input5, "class", "svelte-19tsv6u");
      attr(lineitem4, "class", "svelte-19tsv6u");
      attr(label5, "class", "svelte-19tsv6u");
      attr(input6, "name", "data.details.mentor");
      attr(input6, "type", "text");
      input6.value = input6_value_value = ctx[0].data.details.mentor;
      attr(input6, "placeholder", input6_placeholder_value = game.i18n.localize("MOUSEGUARD.Mentor"));
      attr(input6, "class", "svelte-19tsv6u");
      attr(lineitem5, "class", "svelte-19tsv6u");
      attr(label6, "class", "svelte-19tsv6u");
      attr(input7, "name", "data.details.cloak_color");
      attr(input7, "type", "text");
      input7.value = input7_value_value = ctx[0].data.details.cloak_color;
      attr(input7, "placeholder", input7_placeholder_value = game.i18n.localize("MOUSEGUARD.Cloak"));
      attr(input7, "class", "svelte-19tsv6u");
      attr(lineitem6, "class", "svelte-19tsv6u");
      attr(label7, "class", "svelte-19tsv6u");
      attr(input8, "name", "data.details.friend");
      attr(input8, "type", "text");
      input8.value = input8_value_value = ctx[0].data.details.friend;
      attr(input8, "placeholder", input8_placeholder_value = game.i18n.localize("MOUSEGUARD.Friend"));
      attr(input8, "class", "svelte-19tsv6u");
      attr(lineitem7, "class", "svelte-19tsv6u");
      attr(label8, "class", "svelte-19tsv6u");
      attr(input9, "name", "data.details.guard_rank");
      attr(input9, "type", "text");
      input9.value = input9_value_value = ctx[0].data.details.guard_rank;
      attr(input9, "placeholder", input9_placeholder_value = game.i18n.localize("MOUSEGUARD.GuardRank"));
      attr(input9, "class", "svelte-19tsv6u");
      attr(lineitem8, "class", "svelte-19tsv6u");
      attr(label9, "class", "svelte-19tsv6u");
      attr(input10, "name", "data.details.enemy");
      attr(input10, "type", "text");
      input10.value = input10_value_value = ctx[0].data.details.enemy;
      attr(input10, "placeholder", input10_placeholder_value = game.i18n.localize("MOUSEGUARD.Enemy"));
      attr(input10, "class", "svelte-19tsv6u");
      attr(lineitem9, "class", "svelte-19tsv6u");
      attr(largecard, "class", "svelte-19tsv6u");
    },
    m(target, anchor) {
      insert(target, largecard, anchor);
      append(largecard, div);
      append(div, h1);
      append(div, t1);
      append(div, input0);
      append(largecard, t2);
      append(largecard, ul);
      append(ul, lineitem0);
      append(lineitem0, label0);
      append(lineitem0, t5);
      append(lineitem0, input1);
      append(ul, t6);
      append(ul, lineitem1);
      append(lineitem1, label1);
      append(lineitem1, t9);
      append(lineitem1, input2);
      append(ul, t10);
      append(ul, lineitem2);
      append(lineitem2, label2);
      append(lineitem2, t13);
      append(lineitem2, input3);
      append(ul, t14);
      append(ul, lineitem3);
      append(lineitem3, label3);
      append(lineitem3, t17);
      append(lineitem3, input4);
      append(ul, t18);
      append(ul, lineitem4);
      append(lineitem4, label4);
      append(lineitem4, t21);
      append(lineitem4, input5);
      append(ul, t22);
      append(ul, lineitem5);
      append(lineitem5, label5);
      append(lineitem5, t25);
      append(lineitem5, input6);
      append(ul, t26);
      append(ul, lineitem6);
      append(lineitem6, label6);
      append(lineitem6, t29);
      append(lineitem6, input7);
      append(ul, t30);
      append(ul, lineitem7);
      append(lineitem7, label7);
      append(lineitem7, t33);
      append(lineitem7, input8);
      append(ul, t34);
      append(ul, lineitem8);
      append(lineitem8, label8);
      append(lineitem8, t37);
      append(lineitem8, input9);
      append(ul, t38);
      append(ul, lineitem9);
      append(lineitem9, label9);
      append(lineitem9, t41);
      append(lineitem9, input10);
    },
    p(ctx2, [dirty]) {
      if (dirty & 1 && input0_value_value !== (input0_value_value = ctx2[0].name) && input0.value !== input0_value_value) {
        input0.value = input0_value_value;
      }
      if (dirty & 1 && input1_value_value !== (input1_value_value = ctx2[0].data.details.age)) {
        input1.value = input1_value_value;
      }
      if (dirty & 1 && input2_value_value !== (input2_value_value = ctx2[0].data.details.parents) && input2.value !== input2_value_value) {
        input2.value = input2_value_value;
      }
      if (dirty & 1 && input3_value_value !== (input3_value_value = ctx2[0].data.details.home) && input3.value !== input3_value_value) {
        input3.value = input3_value_value;
      }
      if (dirty & 1 && input4_value_value !== (input4_value_value = ctx2[0].data.details.senior_artisan) && input4.value !== input4_value_value) {
        input4.value = input4_value_value;
      }
      if (dirty & 1 && input5_value_value !== (input5_value_value = ctx2[0].data.details.fur_color) && input5.value !== input5_value_value) {
        input5.value = input5_value_value;
      }
      if (dirty & 1 && input6_value_value !== (input6_value_value = ctx2[0].data.details.mentor) && input6.value !== input6_value_value) {
        input6.value = input6_value_value;
      }
      if (dirty & 1 && input7_value_value !== (input7_value_value = ctx2[0].data.details.cloak_color) && input7.value !== input7_value_value) {
        input7.value = input7_value_value;
      }
      if (dirty & 1 && input8_value_value !== (input8_value_value = ctx2[0].data.details.friend) && input8.value !== input8_value_value) {
        input8.value = input8_value_value;
      }
      if (dirty & 1 && input9_value_value !== (input9_value_value = ctx2[0].data.details.guard_rank) && input9.value !== input9_value_value) {
        input9.value = input9_value_value;
      }
      if (dirty & 1 && input10_value_value !== (input10_value_value = ctx2[0].data.details.enemy) && input10.value !== input10_value_value) {
        input10.value = input10_value_value;
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(largecard);
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let $sheetData;
  let sheetData = getContext("sheetStore");
  component_subscribe($$self, sheetData, (value) => $$invalidate(2, $sheetData = value));
  let { actor, sheet } = $sheetData;
  let data;
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 4) {
      $:
        $$invalidate(0, data = $sheetData.data);
    }
  };
  return [data, sheetData, $sheetData];
}
var MouseGuardActorSheetMouseDetails = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, {});
  }
};
var MouseGuardActorSheetMouseDetails_default = MouseGuardActorSheetMouseDetails;
require_2();

// module/svelte/MouseGuardActorSheetMousePortrait.svelte
function create_fragment2(ctx) {
  let smallcard;
  let img;
  let img_src_value;
  let img_title_value;
  let mounted;
  let dispose;
  return {
    c() {
      smallcard = element("smallcard");
      img = element("img");
      attr(img, "class", "profile-img");
      if (img.src !== (img_src_value = ctx[0].img))
        attr(img, "src", img_src_value);
      attr(img, "data-edit", "img");
      attr(img, "title", img_title_value = ctx[0].name);
      attr(img, "height", "125");
      attr(img, "width", "125");
      attr(smallcard, "class", "svelte-18525n1");
    },
    m(target, anchor) {
      insert(target, smallcard, anchor);
      append(smallcard, img);
      if (!mounted) {
        dispose = listen(img, "click", ctx[2]);
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & 1 && img.src !== (img_src_value = ctx2[0].img)) {
        attr(img, "src", img_src_value);
      }
      if (dirty & 1 && img_title_value !== (img_title_value = ctx2[0].name)) {
        attr(img, "title", img_title_value);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(smallcard);
      mounted = false;
      dispose();
    }
  };
}
function instance2($$self, $$props, $$invalidate) {
  let $sheetData;
  let sheetData = getContext("sheetStore");
  component_subscribe($$self, sheetData, (value) => $$invalidate(3, $sheetData = value));
  let { actor, sheet } = $sheetData;
  let data;
  const filePicker = (event) => {
    const attr2 = event.currentTarget.dataset.edit;
    const current = getProperty(data, attr2);
    const fp = new FilePicker({
      type: "image",
      current,
      callback: (path) => {
        actor.update({ [attr2]: path });
      },
      top: sheet.position.top + 40,
      left: sheet.position.left + 10
    });
    return fp.browse();
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 8) {
      $:
        $$invalidate(0, data = $sheetData.data);
    }
  };
  return [data, sheetData, filePicker, $sheetData];
}
var MouseGuardActorSheetMousePortrait = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance2, create_fragment2, safe_not_equal, {});
  }
};
var MouseGuardActorSheetMousePortrait_default = MouseGuardActorSheetMousePortrait;
require_3();

// module/svelte/MouseGuardActorSheetMouseRewards.svelte
function create_fragment3(ctx) {
  let largecard;
  let h1;
  let t1;
  let left;
  let fatebox;
  let label0;
  let t3;
  let input0;
  let input0_value_value;
  let t4;
  let personabox;
  let label1;
  let t6;
  let input1;
  let input1_value_value;
  let t7;
  let right;
  let beliefbox;
  let label2;
  let t9;
  let label3;
  let raw0_value = game.i18n.localize("MOUSEGUARD.BeliefSub") + "";
  let t10;
  let input2;
  let input2_value_value;
  let input2_placeholder_value;
  let t11;
  let instinctbox;
  let label4;
  let t13;
  let label5;
  let raw1_value = game.i18n.localize("MOUSEGUARD.InstinctSub") + "";
  let t14;
  let input3;
  let input3_value_value;
  let input3_placeholder_value;
  let t15;
  let goalbox;
  let label6;
  let t17;
  let label7;
  let raw2_value = game.i18n.localize("MOUSEGUARD.GoalSub") + "";
  let t18;
  let input4;
  let input4_value_value;
  let input4_placeholder_value;
  return {
    c() {
      largecard = element("largecard");
      h1 = element("h1");
      h1.textContent = "Rewards";
      t1 = space();
      left = element("left");
      fatebox = element("fatebox");
      label0 = element("label");
      label0.textContent = `${game.i18n.localize("MOUSEGUARD.Fate")}`;
      t3 = space();
      input0 = element("input");
      t4 = space();
      personabox = element("personabox");
      label1 = element("label");
      label1.textContent = `${game.i18n.localize("MOUSEGUARD.Persona")}`;
      t6 = space();
      input1 = element("input");
      t7 = space();
      right = element("right");
      beliefbox = element("beliefbox");
      label2 = element("label");
      label2.textContent = `${game.i18n.localize("MOUSEGUARD.Belief")}`;
      t9 = space();
      label3 = element("label");
      t10 = space();
      input2 = element("input");
      t11 = space();
      instinctbox = element("instinctbox");
      label4 = element("label");
      label4.textContent = `${game.i18n.localize("MOUSEGUARD.Instinct")}`;
      t13 = space();
      label5 = element("label");
      t14 = space();
      input3 = element("input");
      t15 = space();
      goalbox = element("goalbox");
      label6 = element("label");
      label6.textContent = `${game.i18n.localize("MOUSEGUARD.Goal")}`;
      t17 = space();
      label7 = element("label");
      t18 = space();
      input4 = element("input");
      attr(h1, "class", "svelte-7ea9mt");
      attr(label0, "class", "header svelte-7ea9mt");
      attr(input0, "name", "data.rewards.fate");
      attr(input0, "type", "number");
      input0.value = input0_value_value = ctx[0].data.rewards.fate;
      attr(input0, "placeholder", "0");
      attr(input0, "class", "svelte-7ea9mt");
      attr(fatebox, "class", "svelte-7ea9mt");
      attr(label1, "class", "header svelte-7ea9mt");
      attr(input1, "name", "data.rewards.persona");
      attr(input1, "type", "number");
      input1.value = input1_value_value = ctx[0].data.rewards.persona;
      attr(input1, "placeholder", "0");
      attr(input1, "class", "svelte-7ea9mt");
      attr(personabox, "class", "svelte-7ea9mt");
      attr(left, "class", "left svelte-7ea9mt");
      attr(label2, "class", "svelte-7ea9mt");
      attr(label3, "class", "svelte-7ea9mt");
      attr(input2, "name", "data.rewards.belief");
      attr(input2, "type", "text");
      input2.value = input2_value_value = ctx[0].data.rewards.belief;
      attr(input2, "placeholder", input2_placeholder_value = game.i18n.localize("MOUSEGUARD.Belief"));
      attr(input2, "class", "svelte-7ea9mt");
      attr(beliefbox, "class", "svelte-7ea9mt");
      attr(label4, "class", "svelte-7ea9mt");
      attr(label5, "class", "svelte-7ea9mt");
      attr(input3, "name", "data.rewards.instinct");
      attr(input3, "type", "text");
      input3.value = input3_value_value = ctx[0].data.rewards.instinct;
      attr(input3, "placeholder", input3_placeholder_value = game.i18n.localize("MOUSEGUARD.Instinct"));
      attr(input3, "class", "svelte-7ea9mt");
      attr(label6, "class", "svelte-7ea9mt");
      attr(label7, "class", "svelte-7ea9mt");
      attr(input4, "name", "data.rewards.goal");
      attr(input4, "type", "text");
      input4.value = input4_value_value = ctx[0].data.rewards.goal;
      attr(input4, "placeholder", input4_placeholder_value = game.i18n.localize("MOUSEGUARD.Goal"));
      attr(input4, "class", "svelte-7ea9mt");
      attr(right, "class", "right svelte-7ea9mt");
      attr(largecard, "class", "svelte-7ea9mt");
    },
    m(target, anchor) {
      insert(target, largecard, anchor);
      append(largecard, h1);
      append(largecard, t1);
      append(largecard, left);
      append(left, fatebox);
      append(fatebox, label0);
      append(fatebox, t3);
      append(fatebox, input0);
      append(left, t4);
      append(left, personabox);
      append(personabox, label1);
      append(personabox, t6);
      append(personabox, input1);
      append(largecard, t7);
      append(largecard, right);
      append(right, beliefbox);
      append(beliefbox, label2);
      append(beliefbox, t9);
      append(beliefbox, label3);
      label3.innerHTML = raw0_value;
      append(beliefbox, t10);
      append(beliefbox, input2);
      append(right, t11);
      append(right, instinctbox);
      append(instinctbox, label4);
      append(instinctbox, t13);
      append(instinctbox, label5);
      label5.innerHTML = raw1_value;
      append(instinctbox, t14);
      append(instinctbox, input3);
      append(right, t15);
      append(right, goalbox);
      append(goalbox, label6);
      append(goalbox, t17);
      append(goalbox, label7);
      label7.innerHTML = raw2_value;
      append(goalbox, t18);
      append(goalbox, input4);
    },
    p(ctx2, [dirty]) {
      if (dirty & 1 && input0_value_value !== (input0_value_value = ctx2[0].data.rewards.fate)) {
        input0.value = input0_value_value;
      }
      if (dirty & 1 && input1_value_value !== (input1_value_value = ctx2[0].data.rewards.persona)) {
        input1.value = input1_value_value;
      }
      if (dirty & 1 && input2_value_value !== (input2_value_value = ctx2[0].data.rewards.belief) && input2.value !== input2_value_value) {
        input2.value = input2_value_value;
      }
      if (dirty & 1 && input3_value_value !== (input3_value_value = ctx2[0].data.rewards.instinct) && input3.value !== input3_value_value) {
        input3.value = input3_value_value;
      }
      if (dirty & 1 && input4_value_value !== (input4_value_value = ctx2[0].data.rewards.goal) && input4.value !== input4_value_value) {
        input4.value = input4_value_value;
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(largecard);
    }
  };
}
function instance3($$self, $$props, $$invalidate) {
  let $sheetData;
  let sheetData = getContext("sheetStore");
  component_subscribe($$self, sheetData, (value) => $$invalidate(2, $sheetData = value));
  let { actor, sheet } = $sheetData;
  let data;
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 4) {
      $:
        $$invalidate(0, data = $sheetData.data);
    }
  };
  return [data, sheetData, $sheetData];
}
var MouseGuardActorSheetMouseRewards = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance3, create_fragment3, safe_not_equal, {});
  }
};
var MouseGuardActorSheetMouseRewards_default = MouseGuardActorSheetMouseRewards;
require_4();

// module/svelte/MouseGuardActorSheetBase.svelte
function create_fragment4(ctx) {
  let content;
  let div;
  let left;
  let mouseguardactorsheetmousedetails;
  let t0;
  let mouseguardactorsheetmouserewards;
  let t1;
  let right;
  let mouseguardactorsheetportrait;
  let current;
  mouseguardactorsheetmousedetails = new MouseGuardActorSheetMouseDetails_default({});
  mouseguardactorsheetmouserewards = new MouseGuardActorSheetMouseRewards_default({});
  mouseguardactorsheetportrait = new MouseGuardActorSheetMousePortrait_default({});
  return {
    c() {
      content = element("content");
      div = element("div");
      left = element("left");
      create_component(mouseguardactorsheetmousedetails.$$.fragment);
      t0 = space();
      create_component(mouseguardactorsheetmouserewards.$$.fragment);
      t1 = space();
      right = element("right");
      create_component(mouseguardactorsheetportrait.$$.fragment);
      attr(left, "class", "left svelte-5yrtdo");
      attr(right, "class", "right svelte-5yrtdo");
      attr(div, "class", "wrapper svelte-5yrtdo");
      attr(content, "class", "svelte-5yrtdo");
    },
    m(target, anchor) {
      insert(target, content, anchor);
      append(content, div);
      append(div, left);
      mount_component(mouseguardactorsheetmousedetails, left, null);
      append(left, t0);
      mount_component(mouseguardactorsheetmouserewards, left, null);
      append(div, t1);
      append(div, right);
      mount_component(mouseguardactorsheetportrait, right, null);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(mouseguardactorsheetmousedetails.$$.fragment, local);
      transition_in(mouseguardactorsheetmouserewards.$$.fragment, local);
      transition_in(mouseguardactorsheetportrait.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(mouseguardactorsheetmousedetails.$$.fragment, local);
      transition_out(mouseguardactorsheetmouserewards.$$.fragment, local);
      transition_out(mouseguardactorsheetportrait.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(content);
      destroy_component(mouseguardactorsheetmousedetails);
      destroy_component(mouseguardactorsheetmouserewards);
      destroy_component(mouseguardactorsheetportrait);
    }
  };
}
function instance4($$self, $$props, $$invalidate) {
  let $dataStore, $$unsubscribe_dataStore = noop, $$subscribe_dataStore = () => ($$unsubscribe_dataStore(), $$unsubscribe_dataStore = subscribe(dataStore, ($$value) => $$invalidate(1, $dataStore = $$value)), dataStore);
  $$self.$$.on_destroy.push(() => $$unsubscribe_dataStore());
  let { dataStore } = $$props;
  $$subscribe_dataStore();
  setContext("sheetStore", dataStore);
  let { actor, data, sheet } = $dataStore;
  $$self.$$set = ($$props2) => {
    if ("dataStore" in $$props2)
      $$subscribe_dataStore($$invalidate(0, dataStore = $$props2.dataStore));
  };
  return [dataStore];
}
var MouseGuardActorSheetBase = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance4, create_fragment4, safe_not_equal, { dataStore: 0 });
  }
};
var MouseGuardActorSheetBase_default = MouseGuardActorSheetBase;
require_5();

// module/actor-sheet.js
var MouseGuardActorSheet = class extends ActorSheet {
  app = null;
  dataStore = null;
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["mouseguard", "sheet", "actor"],
      template: "systems/mouseguard/templates/actor-sheetv2.html",
      width: 850,
      height: 600,
      tabs: [],
      dragDrop: []
    });
  }
  getData() {
    const context = super.getData();
    EntitySheetHelper.getAttributeData(context.data);
    context.shorthand = !!game.settings.get("mouseguard", "macroShorthand");
    context.systemData = context.data.data;
    context.dtypes = ATTRIBUTE_TYPES;
    context.sheet = this;
    return context;
  }
  activateListeners(html) {
    super.activateListeners(html);
    if (!this.isEditable)
      return;
    html.find(".attributes").on("click", ".attribute-control", EntitySheetHelper.onClickAttributeControl.bind(this));
    html.find(".groups").on("click", ".group-control", EntitySheetHelper.onClickAttributeGroupControl.bind(this));
    html.find(".attributes").on("click", "a.attribute-roll", EntitySheetHelper.onAttributeRoll.bind(this));
    html.find(".item-control").click(this._onItemControl.bind(this));
    html.find(".items .rollable").on("click", this._onItemRoll.bind(this));
    html.find(".attributes a.attribute-roll").each((i, a) => {
      a.setAttribute("draggable", true);
      a.addEventListener("dragstart", (ev) => {
        let dragData = ev.currentTarget.dataset;
        ev.dataTransfer.setData("text/plain", JSON.stringify(dragData));
      }, false);
    });
  }
  _onItemControl(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const li = button.closest(".item");
    const item2 = this.actor.items.get(li?.dataset.itemId);
    switch (button.dataset.action) {
      case "create":
        const cls = getDocumentClass("Item");
        return cls.create({ name: game.i18n.localize("MOUSEGUARD.ItemNew"), type: "item" }, { parent: this.actor });
      case "edit":
        return item2.sheet.render(true);
      case "delete":
        return item2.delete();
    }
  }
  _onItemRoll(event) {
    let button = $(event.currentTarget);
    const li = button.parents(".item");
    const item2 = this.actor.items.get(li.data("itemId"));
    let r = new Roll(button.data("roll"), this.actor.getRollData());
    return r.toMessage({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: `<h2>${item2.name}</h2><h3>${button.text()}</h3>`
    });
  }
  _getSubmitData(updateData) {
    let formData = super._getSubmitData(updateData);
    formData = EntitySheetHelper.updateAttributes(formData, this.object);
    formData = EntitySheetHelper.updateGroups(formData, this.object);
    return formData;
  }
  render(force = false, options = {}) {
    let sheetData = this.getData();
    if (this.app !== null) {
      let states = Application.RENDER_STATES;
      if (this._state == states.RENDERING || this._state == states.RENDERED) {
        this.dataStore?.set(sheetData);
        return;
      }
    }
    this._render(force, options).catch((err) => {
      err.message = `An error occurred while rendering ${this.constructor.name} ${this.appId}: ${err.message}`;
      console.error(err);
      this._state = Application.RENDER_STATES.ERROR;
    }).then((rendered) => {
      this.dataStore = writable(sheetData);
      this.app = new MouseGuardActorSheetBase_default({
        target: this.element.find("form").get(0),
        props: {
          dataStore: this.dataStore
        }
      });
    });
    options.editable = options.editable ?? this.object.isOwner;
    this.object.apps[this.appId] = this;
    return this;
  }
  close(options = {}) {
    if (this.app != null) {
      this.app.$destroy();
      this.app = null;
      this.dataStore = null;
    }
    return super.close(options);
  }
};

// module/templates.js
var preloadHandlebarsTemplates = async function() {
  const templatePaths = [
    "systems/mouseguard/templates/parts/sheet-attributes.html",
    "systems/mouseguard/templates/parts/sheet-groups.html"
  ];
  return loadTemplates(templatePaths);
};

// module/macro.js
async function createMouseGuardMacro(data, slot) {
  const command = `const roll = new Roll("${data.roll}", actor ? actor.getRollData() : {});
  roll.toMessage({speaker, flavor: "${data.label}"});`;
  let macro = game.macros.entities.find((m) => m.name === item.label && m.command === command);
  if (!macro) {
    macro = await Macro.create({
      name: data.label,
      type: "script",
      command,
      flags: { "mouseguard.attrMacro": true }
    });
  }
  game.user.assignHotbarMacro(macro, slot);
  return false;
}

// module/mousedie.js
var MouseDie = class extends Die {
  constructor(termData) {
    termData.faces = 6;
    super(termData);
  }
  getResultLabel(result) {
    return {
      "1": '<img src="systems/mouseguard/assets/dice/snake.png" />',
      "2": '<img src="systems/mouseguard/assets/dice/snake.png" />',
      "3": '<img src="systems/mouseguard/assets/dice/snake.png" />',
      "4": '<img src="systems/mouseguard/assets/dice/sword.png" />',
      "5": '<img src="systems/mouseguard/assets/dice/sword.png" />',
      "6": '<img src="systems/mouseguard/assets/dice/axe.png" />'
    }[result.result];
  }
};
__publicField(MouseDie, "DENOMINATION", "m");

// module/mouseguard.js
Hooks.once("init", async function() {
  console.log(`Initializing MouseGuard MouseGuard System`);
  CONFIG.Combat.initiative = {
    formula: "1d20",
    decimals: 2
  };
  game.mouseguard = {
    MouseGuardActor,
    createMouseGuardMacro
  };
  CONFIG.Actor.documentClass = MouseGuardActor;
  CONFIG.Item.documentClass = MouseGuardItem;
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("mouseguard", MouseGuardActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("mouseguard", MouseGuardItemSheet, { makeDefault: true });
  game.settings.register("mouseguard", "macroShorthand", {
    name: "SETTINGS.MouseGuardMacroShorthandN",
    hint: "SETTINGS.MouseGuardMacroShorthandL",
    scope: "world",
    type: Boolean,
    default: true,
    config: true
  });
  game.settings.register("mouseguard", "initFormula", {
    name: "SETTINGS.MouseGuardInitFormulaN",
    hint: "SETTINGS.MouseGuardInitFormulaL",
    scope: "world",
    type: String,
    default: "1d20",
    config: true,
    onChange: (formula) => _simpleUpdateInit(formula, true)
  });
  const initFormula = game.settings.get("mouseguard", "initFormula");
  _simpleUpdateInit(initFormula);
  function _simpleUpdateInit(formula, notify = false) {
    const isValid = Roll.validate(formula);
    if (!isValid) {
      if (notify)
        ui.notifications.error(`${game.i18n.localize("MOUSEGUARD.NotifyInitFormulaInvalid")}: ${formula}`);
      return;
    }
    CONFIG.Combat.initiative.formula = formula;
  }
  Handlebars.registerHelper("slugify", function(value) {
    return value.slugify({ strict: true });
  });
  await preloadHandlebarsTemplates();
});
Hooks.on("hotbarDrop", (bar, data, slot) => createMouseGuardMacro(data, slot));
Hooks.once("init", async function() {
  CONFIG.Dice.terms["m"] = MouseDie;
});
Hooks.once("diceSoNiceReady", (dice3d) => {
  let dicetheme = "mouseguard";
  if (!dicetheme || dicetheme == "mouseguard") {
    dice3d.addSystem({ id: "mouseguard", name: "Mouse Guard" }, true);
    dice3d.addDicePreset({
      type: "dm",
      labels: [
        "systems/mouseguard/assets/dice/snake.png",
        "systems/mouseguard/assets/dice/snake.png",
        "systems/mouseguard/assets/dice/snake.png",
        "systems/mouseguard/assets/dice/sword.png",
        "systems/mouseguard/assets/dice/sword.png",
        "systems/mouseguard/assets/dice/axe.png"
      ],
      colorset: "white-m",
      system: "mouseguard"
    }, "d6");
  }
  dice3d.addColorset({
    name: "white-mg",
    description: "Mouse Guard white",
    category: "Colors",
    foreground: "#000000",
    background: "#ffffff"
  });
});
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
//# sourceMappingURL=mouseguard.js.map
