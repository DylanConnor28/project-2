import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/rpg-character/rpg-character.js";
import "wired-elements";

export class RpgMe extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "project-2";
  }

  constructor() {
    super();
    this.title = "Design Your Character";
    this.characterSettings = this._defaultCharacterSettings();
    this._applySeedToSettings();
  }

  static get properties() {
    return {
      ...super.properties,
      characterSettings: { type: Object },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          font-family: var(--ddd-font-navigation);
        }
        .container {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          justify-content: center;
          align-items: flex-start;
          padding: 20px;
        }
        .character-preview {
          flex: 1;
          min-width: 300px;
          text-align: center;
          position: relative;
        }
        .character-preview rpg-character {
          height: var(--character-size, 200px);
          width: var(--character-size, 200px);
          transition: height 0.3s ease, width 0.3s ease;
        }
        .seed-display {
          position: absolute;
          top: -50px;
          left: 50%;
          transform: translateX(-50%);
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 5px 10px;
          border-radius: 5px;
          font-size: 0.9rem;
          font-weight: bold;
          pointer-events: none;
        }
        .controls {
          flex: 1;
          min-width: 300px;
          text-align: left;
        }
        wired-input,
        wired-checkbox,
        wired-slider {
          display: block;
          margin-bottom: 15px;
          max-width: 300px;
        }
        label {
          display: block;
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        button {
          margin-top: 10px;
          padding: 10px 20px;
          cursor: pointer;
          background-color: #007bff;
          color: white;
          border: 1px solid #0056b3;
          border-radius: 4px;
          font-size: 16px;
          transition: background-color 0.3s ease, border-color 0.3s ease;
        }
        button:hover {
          background-color: #0056b3;
          border-color: #004085;
        }
        .character-name {
          font-size: 1.5rem;
          margin-bottom: 10px;
        }
        .notification {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background-color: #28a745;
          color: white;
          padding: 10px 15px;
          border-radius: 5px;
          font-size: 14px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          opacity: 0;
          transition: opacity 0.5s ease-in-out;
          z-index: 1000;
        }
        .notification.show {
          opacity: 1;
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="container">
        ${this._renderCharacterPreview()}
        ${this._renderControls()}
      </div>
      ${this._renderNotification()}
    `;
  }

  _defaultCharacterSettings() {
    return {
      seed: "00000000",
      accessories: 0,
      base: 0,  
      face: 0,
      faceitem: 0,
      hair: 0,
      pants: 0,
      shirt: 0,
      skin: 0,
      hatColor: 0,
      hat: "none",
      fire: false,
      walking: false,
      circle: false,
    };
  }

  _renderCharacterPreview() {
    const { seed, name, accessories, base, face, faceitem, hair, pants, shirt, skin, hatColor, fire, walking, circle, size } = this.characterSettings;
    return html`
      <div class="character-preview">
        <div class="seed-display">Seed: ${seed}</div>
        <div class="character-name">${name}</div>
        <rpg-character
          accessories="${accessories}"
          base="${base}"
          face="${face}"
          faceitem="${faceitem}"
          hair="${hair}"
          pants="${pants}"
          shirt="${shirt}"
          skin="${skin}"
          hatColor="${hatColor}"
          .fire="${fire}"
          .walking="${walking}"
          .circle="${circle}"
          style="--character-size: ${size}px; --hat-color: hsl(${hatColor}, 100%, 50%);"
        ></rpg-character>
      </div>
    `;
  }

  _renderControls() {
    return html`
      <div class="controls">
        ${this._renderInputControl("Character Name:", "characterNameInput", "text", "Enter character name", "name")}
        ${this._renderCheckboxControl("Hair:", "hairToggle", "base", 1, 0, "Has Hair")}
        ${this._renderSliderControl("Character Accessories:", "accessories", 0, 9, "accessories")}
        ${this._renderSliderControl("Character Base:", "base", 0, 9, "base")}
        ${this._renderSliderControl("Character Size:", "size", 100, 600, "size")}
        ${this._renderSliderControl("Face:", "face", 0, 5, "face")}
        ${this._renderSliderControl("Face Item:", "faceitem", 0, 9, "faceitem")}
        ${this._renderSliderControl("Hair Style:", "hair", 0, 9, "hair")}
        ${this._renderSliderControl("Pants Style:", "pants", 0, 9, "pants")}
        ${this._renderSliderControl("Shirt Style:", "shirt", 0, 9, "shirt")}
        ${this._renderSliderControl("Skin Tone:", "skin", 0, 9, "skin")}
        ${this._renderSliderControl("Hat Color:", "hatColor", 0, 9, "hatColor")}
        ${this._renderCheckboxControl("On Fire", null, "fire", true, false)}
        ${this._renderCheckboxControl("Walking", null, "walking", true, false)}
        ${this._renderCheckboxControl("Circle", null, "circle", true, false)}
        <button @click="${this._generateShareLink}">Generate Share Link</button>
      </div>
    `;
  }

  _renderNotification() {
    return html`<div id="notification" class="notification"></div>`;
  }

  _renderInputControl(label, id, type, placeholder, key) {
    return html`
      <label for="${id}">${label}</label>
      <wired-input
        id="${id}"
        type="${type}"
        placeholder="${placeholder}"
        @input="${(e) => this._updateSetting(key, e.target.value)}"
      ></wired-input>
    `;
  }

  _renderCheckboxControl(label, id, key, trueValue, falseValue, checkboxLabel = label) {
    return html`
      <label for="${id}">${label}</label>
      <wired-checkbox
        id="${id}"
        ?checked="${this.characterSettings[key] === trueValue}"
        @change="${(e) => this._updateSetting(key, e.target.checked ? trueValue : falseValue)}"
      >${checkboxLabel}</wired-checkbox>
    `;
  }

  _renderSliderControl(label, id, min, max, key) {
    return html`
      <label for="${id}">${label}</label>
      <wired-slider
        id="${id}"
        value="${this.characterSettings[key]}"
        min="${min}"
        max="${max}"
        @change="${(e) => this._updateSetting(key, parseInt(e.detail.value))}"
      ></wired-slider>
    `;
  }

  _applySeedToSettings() {
    const paddedSeed = this.characterSettings.seed.padStart(8, "0").slice(0, 8);
    const values = paddedSeed.split("").map(Number);

    [
      this.characterSettings.accessories,
      this.characterSettings.base,
      this.characterSettings.face,
      this.characterSettings.faceitem,
      this.characterSettings.hair,
      this.characterSettings.pants,
      this.characterSettings.shirt,
      this.characterSettings.skin,
      this.characterSettings.hatColor,
    ] = values;

    this.requestUpdate();
  }

  _generateSeed() {
    const { accessories, base, face, faceitem, hair, pants, shirt, skin, hatColor } = this.characterSettings;
    this.characterSettings.seed = `${accessories}${base}${face}${faceitem}${hair}${pants}${shirt}${skin}${hatColor}`;
  }

  _updateSetting(key, value) {
    this.characterSettings = { ...this.characterSettings, [key]: value };
    this._generateSeed();
    this.requestUpdate();
  }

  _generateShareLink() {
    const baseUrl = window.location.href.split("?")[0];
    const params = new URLSearchParams({ seed: this.characterSettings.seed }).toString();
    const shareLink = `${baseUrl}?${params}`;

    navigator.clipboard.writeText(shareLink).then(
      () => this._showNotification("Link copied!"),
      (err) => this._showNotification(`Error: ${err}`)
    );
  }

  _showNotification(message) {
    const notification = this.shadowRoot.getElementById("notification");
    notification.textContent = message;
    notification.classList.add("show");

    setTimeout(() => {
      notification.classList.remove("show");
    }, 2000);
  }

  connectedCallback() {
    super.connectedCallback();
    const params = new URLSearchParams(window.location.search);

    if (params.has("seed")) {
      this.characterSettings.seed = params.get("seed");
      this._applySeedToSettings();
    }
  }
}

customElements.define(RpgMe.tag, RpgMe);
