(() => {
  "use strict";

  const form = document.querySelector("#subnet-form");
  const input = document.querySelector("#cidr-input");
  const error = document.querySelector("#input-error");

  function parseIPv4(text) {
    const parts = text.split(".");
    if (parts.length !== 4) return null;
    const octets = parts.map((part) => {
      if (!/^\d{1,3}$/.test(part)) return NaN;
      return Number(part);
    });
    if (octets.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return null;
    return octets.reduce((value, octet) => value * 256 + octet, 0);
  }

  function formatIPv4(value) {
    const a = Math.floor(value / 16777216);
    const b = Math.floor(value / 65536) % 256;
    const c = Math.floor(value / 256) % 256;
    const d = value % 256;
    return [a, b, c, d].join(".");
  }

  function binaryIPv4(value) {
    return [24, 16, 8, 0].map((shift) => Math.floor(value / (2 ** shift)) % 256)
      .map((octet) => octet.toString(2).padStart(8, "0")).join(".");
  }

  function addressScope(ip) {
    const a = Math.floor(ip / 16777216);
    const b = Math.floor(ip / 65536) % 256;
    const c = Math.floor(ip / 256) % 256;
    if (a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168)) return "Private";
    if (a === 127) return "Loopback";
    if (a === 169 && b === 254) return "Link-local";
    if (a === 100 && b >= 64 && b <= 127) return "Shared address";
    if (a === 192 && b === 0 && c === 2) return "Documentation";
    if (a === 198 && (b === 51 && c === 100 || b === 18 || b === 19)) return "Special-use";
    if (a === 203 && b === 0 && c === 113) return "Documentation";
    if (a >= 224) return "Multicast / reserved";
    return "Public / other";
  }

  function setText(id, value) {
    document.getElementById(id).textContent = value;
  }

  function renderBinary(ip, mask, prefix) {
    const rows = [
      ["IP", ip],
      ["Mask", mask]
    ];
    document.getElementById("binary-grid").innerHTML = rows.map(([label, value]) => {
      const bits = binaryIPv4(value).replaceAll(".", "").split("");
      const colored = bits.map((bit, index) => {
        const cls = index < prefix ? "bit-network" : "bit-host";
        return '<span class="' + cls + '">' + bit + "</span>" + ([7, 15, 23].includes(index) ? "." : "");
      }).join("");
      return '<div class="binary-row"><span>' + label + '</span><code>' + colored + "</code></div>";
    }).join("");
  }

  function calculate(raw) {
    const match = /^\s*(\d{1,3}(?:\.\d{1,3}){3})\s*\/\s*(\d{1,2})\s*$/.exec(raw);
    if (!match) throw new Error("Use the format 192.168.1.10/24.");
    const ip = parseIPv4(match[1]);
    const prefix = Number(match[2]);
    if (ip === null) throw new Error("That IPv4 address is not valid. Each octet must be between 0 and 255.");
    if (prefix < 0 || prefix > 32) throw new Error("The prefix must be between /0 and /32.");

    const blockSize = 2 ** (32 - prefix);
    const network = Math.floor(ip / blockSize) * blockSize;
    const broadcast = network + blockSize - 1;
    const mask = 4294967295 - (blockSize - 1);
    const wildcard = 4294967295 - mask;
    let first = network + 1;
    let last = broadcast - 1;
    let usable = Math.max(blockSize - 2, 0);
    let note = addressScope(ip) + " IPv4 address · Results are calculated in your browser.";

    if (prefix === 31) {
      first = network;
      last = broadcast;
      usable = 2;
      note = "A /31 is commonly used for point-to-point links: both addresses are usable (RFC 3021).";
    } else if (prefix === 32) {
      first = network;
      last = network;
      usable = 1;
      note = "A /32 identifies one individual IPv4 address (a host route).";
    } else if (prefix === 0) {
      note = "A /0 covers the entire IPv4 address space. " + note;
    }

    setText("network-address", formatIPv4(network));
    setText("broadcast-address", formatIPv4(broadcast));
    setText("subnet-mask", formatIPv4(mask));
    setText("wildcard-mask", formatIPv4(wildcard));
    setText("first-host", formatIPv4(first));
    setText("last-host", formatIPv4(last));
    setText("total-addresses", blockSize.toLocaleString("en-US"));
    setText("usable-hosts", usable.toLocaleString("en-US"));
    setText("input-address", formatIPv4(ip));
    setText("prefix-length", prefix + " bits");
    setText("host-bits", (32 - prefix) + " bits");
    setText("address-scope", addressScope(ip));
    setText("prefix-label", "/" + prefix);
    setText("special-note", note);
    renderBinary(ip, mask, prefix);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    try {
      calculate(input.value);
      error.hidden = true;
      error.textContent = "";
    } catch (err) {
      error.textContent = err.message;
      error.hidden = false;
    }
  });

  document.querySelectorAll("[data-example]").forEach((button) => {
    button.addEventListener("click", () => {
      input.value = button.dataset.example;
      form.requestSubmit();
    });
  });

  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const value = document.getElementById(button.dataset.copy).textContent;
      try {
        await navigator.clipboard.writeText(value);
        const previous = button.textContent;
        button.textContent = "Copied!";
        window.setTimeout(() => { button.textContent = previous; }, 1100);
      } catch {
        button.textContent = "Select to copy";
      }
    });
  });

  calculate(input.value);
})();
