let search_minimized = false;
let search_toggle = "";
let text_select = "";
let id_pop_row = "";
let selected_current = "";
let selected_voyant = "";
let display_voyant = false;
let highlight_curr = "none";
let toggle_button_display = false;

const FolderBase = "../../teiEncode/";
const OptionToFilename = {
  "Search a text to explore": "default_page",
  "Mr. Gilfil's Love Story (1857)": "Mr.Gilfil's Love Story",
  "Janet's Repentance (1857)": "Janet's Repentance",
  "The Sad Fortunes of the Rev. Amos Barton (1857)": "The Sad Fortunes of the Reverend Amos Barton",
  "Adam Bede (1859)": "Adam Bede_refine_v1.1",
  "The Lifted Veil (1859)": "The Lifted Veil",
  "The Mill on the Floss (1860)": "The Mill on the Floss",
  "Silas Marner (1861)": "Silas Marner",
  "Romola (1863)": "Romola_refine_v1",
  "Brother Jacob (1864)": "Brother Jacob_refine_v1",
  "Felix Holt, the Radical (1866)": "Felix Holt, the Radical_refine_v1",
  "Middlemarch (1871-72)": "Middlemarch_refine_v1",
  "Daniel Deronda (1876)": "Daniel_Deronda_refine_v1",
  "Impressions of Theophrastus Such (1879)": "Impressions of Theophrastus Such",
  "All Nonfiction": "nonfiction_v2",
  "The Spanish Gypsy": "The_Spanish_Gypsy",
  "All Poetry Except The Spanish Gypsy": "poetry_allinone",
};

const OptionToVoyant = {
  "Search a text to explore": "",
  "Mr. Gilfil's Love Story (1857)":
    "https://voyant-tools.org/tool/Cirrus/?corpus=a32279787de8e93603097cc4e26271f6&stopList=keywords-2459d9912745179a64508611ee85dd7e&whiteList=",
  "Janet's Repentance (1857)":
    "https://voyant-tools.org/tool/Cirrus/?corpus=477db75674e3ee663b6cea67dc5c5968&stopList=keywords-2459d9912745179a64508611ee85dd7e&whiteList=",
  "The Sad Fortunes of the Rev. Amos Barton (1857)":
    " https://voyant-tools.org/tool/Cirrus/?corpus=8118b293dc884803731f96c4666e7bdb&stopList=keywords-2459d9912745179a64508611ee85dd7e&whiteList=",
  "Adam Bede (1859)":
    "https://voyant-tools.org/tool/Cirrus/?corpus=3cc2427efa1f1eb749aa55b5cfd099d2&stopList=keywords-2459d9912745179a64508611ee85dd7e&whiteList=",
  "The Lifted Veil (1859)":
    "https://voyant-tools.org/tool/Cirrus/?corpus=5118a197e536559b5477e131cd47cfbd&stopList=keywords-2459d9912745179a64508611ee85dd7e&amp;whiteList=",
  "The Mill on the Floss (1860)":
    "https://voyant-tools.org/tool/Cirrus/?corpus=de768516be0c442993cf4dc528d7a517&stopList=keywords-2459d9912745179a64508611ee85dd7e&whiteList=",
  "Silas Marner (1861)":
    "https://voyant-tools.org/tool/Cirrus/?corpus=75848b3395097670c38c731ce60791f6&stopList=keywords-1b19a870ee41122f9003df11a038375d&whiteList=",
  "Romola (1863)":
    "https://voyant-tools.org/tool/Cirrus/?input=https://georgeeliotarchive.org/files/original/3d43f4fe740957af8f44b3cc3c546634.txt&stopList=keywords-2459d9912745179a64508611ee85dd7e&whiteList=",
  "Brother Jacob (1864)":
    "https://voyant-tools.org/tool/Cirrus/?corpus=3a4983c60fa87982a4339a385b3b47a0&stopList=keywords-2459d9912745179a64508611ee85dd7e&whiteList=",
  "Felix Holt, the Radical (1866)":
    "https://voyant-tools.org/tool/Cirrus/?corpus=3ec2ba3d2975f24a51c5c0ac563fe760&stopList=keywords-19ea191a1678afdff2e05f8877e8abb3&whiteList=",
  "Middlemarch (1871-72)":
    "https://voyant-tools.org/tool/Cirrus/?corpus=497f9eaa114f7e284f94edc7083da136&stopList=keywords-19ea191a1678afdff2e05f8877e8abb3&whiteList=",
  "Daniel Deronda (1876)":
    "https://voyant-tools.org/tool/Cirrus/?corpus=a57da0012c1dd1033963f5732904f1f4&stopList=keywords-2459d9912745179a64508611ee85dd7e&whiteList=",
  "Impressions of Theophrastus Such (1879)":
    "https://voyant-tools.org/tool/Cirrus/?input=https://georgeeliotarchive.org/files/original/d828ef209fb49bf45bbb2d24f58e5b74.txt&stopList=keywords-2459d9912745179a64508611ee85dd7e&whiteList=",
  // "All Nonfiction":
  //   "https://voyant-tools.org/?corpus=de5b839103819a2a0bc741013bf2ea6b&view=Cirrus&stopList=keywords-2459d9912745179a64508611ee85dd7e&whiteList=",
  "All Nonfiction":
    "https://voyant-tools.org/?corpus=a70fb8ab1ef7192f57c653e19e75744f&view=Cirrus&stopList=keywords-2459d9912745179a64508611ee85dd7e&whiteList=",
  "The Spanish Gypsy":
    "https://voyant-tools.org/?corpus=0c45473a2790cc5bd6b28df29c43eb0e&view=Cirrus&stopList=keywords-2459d9912745179a64508611ee85dd7e&whiteList=",
  "All Poetry Except The Spanish Gypsy":
    "https://voyant-tools.org/?corpus=542722fd79c7fe6171fbf046d8baa84c&view=Cirrus&stopList=keywords-2459d9912745179a64508611ee85dd7e&whiteList=",
};

function populateDropdown() {
  // Array of options to add
  let options = OptionToFilename;

  // Get the select element
  let select = document.getElementById("fiction_list");

  let firstOptionValue;

  for (let x in options) {
    if (options.hasOwnProperty(x)) {
      // let opt = x;
      let el = document.createElement("option");
      el.textContent = x;
      el.value = options[x];
      select.appendChild(el);

      if (!firstOptionValue) {
        firstOptionValue = options[x]; // Set the first option value
      }
    }
  }
  select.addEventListener("change", function () {
    let selectedOption = this.value;
    // console.log("Selected: " + selectedOption);
    selected_current = this.options[this.selectedIndex].text;
    let doc_clear = document.getElementById("xml-display");
    doc_clear.innerHTML = "";
    closeVoyantTool();
    displayTEIContent(selectedOption);
  });

  // Select the first option as default
  select.value = firstOptionValue;

  // Trigger the change event or call the function directly for the first option
  // Method 1: Trigger change event
  let event = new Event("change");
  select.dispatchEvent(event);

  // Or Method 2: Call the function directly
  // displayTEIContent(firstOptionValue);
}

async function displayTEIContent(filename) {
  let relativePath = FolderBase + filename + ".xml";

  try {
    // Fetch the XML file from a relative path
    const response = await fetch(relativePath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    hide_search_container();

    // Get the XML text from the response
    const xmlText = await response.text();

    // Use DOMParser to parse the XML text
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    // Serialize XML DOM to string
    // let frontNode = xmlDoc.getElementsByTagName("front")[0];
    // console.log(frontNode);

    let serializer = new XMLSerializer();
    let serializedXml = serializer.serializeToString(xmlDoc);
    // Escape the XML string

    document.getElementById("xml-display").innerHTML = escapeXml(serializedXml);
  } catch (error) {
    console.error("Error fetching or parsing XML:", error);
  }

  // Add CSS for highlight class
  const style = document.createElement("style");
  style.innerHTML = `
    .highlight_tag {
        background-color: rgba(144, 238, 144, 0.4); /* Light green background with 50% opacity */
    #button-container {
        z-index: 1000; /* Ensure the buttons are always on top */
    }
    .btn-secondary {
        margin-bottom: 10px; /* Adjust margin to ensure the toggle button does not overlap with the buttons */
    }
    .btn-secondary span {
    display: inline-block;
    width: 100%;
    }
    #toggle-button {
      width: 30px;
    }
  `;
  document.head.appendChild(style);
  // highlightTagText("name");
  document.getElementById("xml-display").appendChild(createButtons());

  // reset the highlight button
  highlight_curr = "none";
  toggle_button_display = false;
}

function searchAndHighlight(phrase) {
  if (phrase === "" || isOnlyWhitespace(phrase) === true) {
    hide_search_container();
    return;
  }
  // const displayArea = document.getElementById("xml-display");
  const displayArea = document.getElementsByTagName("text")[0];

  const searchResults = document.getElementById("search_results");
  const searchContainer = document.getElementById("search_container");
  const searchInput = document.getElementById("search_input");

  searchContainer.innerHTML = ""; // Clear previous search results
  searchContainer.classList.remove("minimized");

  searchResults.innerHTML = "";
  searchResults.classList.remove("minimized");

  search_minimized = false;

  // First, remove existing highlights
  const highlighted = Array.from(displayArea.querySelectorAll(".highlight"));
  highlighted.forEach((span) => {
    const parent = span.parentNode;
    while (span.firstChild) {
      parent.insertBefore(span.firstChild, span);
    }
    parent.removeChild(span);
  });

  let counter = 0;
  let innerHTML = displayArea.innerHTML;

  // v1
  // // Escape any special characters in the phrase
  // const escapedPhrase = phrase.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  // // Adding word boundaries to the regex
  // const regex = new RegExp(`((?:\\w+\\W+){0,3}\\w*)?\\b(${escapedPhrase})\\b(\\w*(?:\\W+\\w+){0,3})?`, "gi");

  // v2
  // const escapedPhrase = phrase.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  // const regex = new RegExp(`((?:\\w+\\W+){0,2}\\w*)?\\b(${escapedPhrase})\\b(\\w*(?:\\W+\\w+){0,2})?`, "gi");

  // v3
  const escapedPhrase = phrase.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  const variationPattern = `\\w*`; // This matches "ing" or "s" after the base word.
  const regex = new RegExp(`((?:\\w+\\W+){0,3})?\\b(${escapedPhrase}${variationPattern})((?:\\W+\\w+){0,3})?`, "gi");

  // // v4
  // const escapedPhrase = phrase.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  // console.log(escapedPhrase);
  // const regex = new RegExp(`((?:^|\\w+\\W+){0,3})?(${escapedPhrase})((?:\\W+\\w+){0,3})?`, "gi");

  innerHTML = innerHTML.replace(regex, function (match, p1, p2, p3) {
    // let { p1_revised, p3_revised } = reviseP1P3(p1, p3);
    let p1_revised = revisePhrase(p1);
    let p3_revised = revisePhrase(p3);

    const id = `match-${counter++}`;
    const id_pop = `pop-${counter++}`;
    const resultItem = document.createElement("div");
    resultItem.className = "search-result";
    resultItem.innerHTML = `<span  id="${id_pop}">${p1_revised || ""}<strong>${p2}</strong>${p3_revised || ""}</span>`;
    resultItem.addEventListener("click", () => {
      const target = document.getElementById(id);
      const targetPosition = target.getBoundingClientRect().top;
      const offset = window.pageYOffset + targetPosition - window.innerHeight / 2;
      minimize_pop();
      window.scrollTo(0, offset);

      // highlight the target when scroll to it
      const target_pop_row = document.getElementById(id_pop_row);
      if (target_pop_row) target_pop_row.classList.remove("text-primary");
      const target_pop = document.getElementById(id_pop);
      target_pop.classList.add("text-primary");
      id_pop_row = id_pop;

      // displayArea.scrollTop = targetPosition;

      // highlight the target when scroll to it
      if (search_toggle !== id) {
        if (search_toggle !== "") {
          const old_target = document.getElementById(search_toggle);
          if (old_target) old_target.classList.remove("jump-to");
        }
        search_toggle = id;
        target.classList.add("jump-to");
      }
      // search_results.classList.add("minimized");
    });
    searchResults.appendChild(resultItem);
    return `${p1 || ""}<span class="highlight" id="${id}">${p2}</span>${p3 || ""}`;
  });

  searchContainer.appendChild(searchResults);
  if (searchResults.children.length === 0) {
    search_minimized = true;
  }
  searchContainer.style.display = "block";
  pop_up_interactive(searchContainer, searchResults, searchInput);

  draggable_div(searchContainer);

  displayArea.innerHTML = innerHTML;
}

function pop_up_interactive(doc_container, displayed_results, doc_scroll_top) {
  // Create a container div for text and button
  const container = document.createElement("div");
  container.style.display = "flex";
  // container.style.alignItems = "center";
  container.style.justifyContent = "space-between";
  container.className = "position-sticky position-absolute mt-1 top-0";
  if (displayed_results.offsetWidth < 50) {
    // if the search results are none, set the width to 300px
    container.style.width = 300 + "px";
  } else {
    container.style.width = displayed_results.offsetWidth - 26 + "px";
  }

  // Create a text span or div
  let textDisplay = document.createElement("span");
  textDisplay.className = "start-0 text-primary fs-6";
  textDisplay.textContent = displayed_results.children.length + " results";
  container.appendChild(textDisplay); // Append text to the container

  const divButtons = document.createElement("div");
  divButtons.id = "sr_div_buttons";
  divButtons.className = "btn-group mb-1 ";
  divButtons.setAttribute("role", "group");

  const buttonItem = document.createElement("button");
  buttonItem.className = "btn btn-outline-primary btn-sm top-0";
  buttonItem.setAttribute("type", "button");

  buttonItem.textContent = "Min";
  buttonItem.id = "sr_minimize_button";
  buttonItem.addEventListener("click", () => {
    if (search_minimized === false) {
      doc_container.classList.add("minimized");
      displayed_results.classList.add("minimized");
      buttonItem.textContent = "Max";
      search_minimized = true;
    } else {
      doc_container.classList.remove("minimized");
      displayed_results.classList.remove("minimized");
      buttonItem.textContent = "Min";
      search_minimized = false;
    }
  });

  // Append the container to the target div
  divButtons.appendChild(buttonItem); // Append button to the container

  // add scroll top button
  const buttonScrollTop = document.createElement("button");
  buttonScrollTop.className = "btn btn-outline-success btn-sm top-0";
  buttonScrollTop.setAttribute("type", "button");

  buttonScrollTop.textContent = "Top";
  buttonScrollTop.id = "sr_scroll_top_button";
  buttonScrollTop.addEventListener("click", () => {
    doc_scroll_top.scrollIntoView();
  });

  divButtons.appendChild(buttonScrollTop);

  container.appendChild(divButtons);
  doc_container.insertBefore(container, doc_container.firstChild);
}

function offset(el) {
  const rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft,
  };
}

function draggable_div(doc_drag) {
  // Variables to hold mouse x and y position
  let mouseX = 0,
    mouseY = 0,
    elementX = 0,
    elementY = 0;

  function onMouseMove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    doc_drag.style.left = mouseX + elementX + "px";
    doc_drag.style.top = mouseY + elementY + "px";
  }

  doc_drag.addEventListener("mousedown", function (e) {
    // When the mouse button is pressed down, update the initial position
    elementX = doc_drag.offsetLeft - e.clientX;
    elementY = doc_drag.offsetTop - e.clientY;

    // Attach the listeners to `document`
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });

  function onMouseUp() {
    // Remove the listeners when mouse button is released
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  }
}

function xmlToHtml(xmlNode) {
  let html = "";

  // Iterate over XML nodes and build HTML
  xmlNode.childNodes.forEach(function (node) {
    switch (node.nodeType) {
      case Node.ELEMENT_NODE: // Element
        html += "<div><strong>" + node.nodeName + ":</strong>";
        html += xmlToHtml(node); // Recursive call for child nodes
        html += "</div>";
        break;
      case Node.TEXT_NODE: // Text
        if (node.textContent.trim() !== "") {
          html += " " + node.textContent;
        }
        break;
    }
  });

  return html;
}

function escapeXml(xmlString) {
  // Escape special characters, <q>'s, and </q>'s
  return xmlString.replace(/<q>/gi, "").replace(/<\/q>/gi, "");
}

function revisePhrase(phrase) {
  let p_revised = "";

  if (phrase !== undefined) {
    p_revised = phrase.replace(/<p\s*$/, "");
  }

  return p_revised;
}

function minimize_pop() {
  const buttonItem = document.getElementById("sr_minimize_button");
  const doc_container = document.getElementById("search_container");
  const displayed_results = document.getElementById("search_results");
  if (search_minimized === false) {
    doc_container.classList.add("minimized");
    displayed_results.classList.add("minimized");
    buttonItem.textContent = "Max";
    search_minimized = true;
  }
}

function hide_search_container() {
  const searchContainer = document.getElementById("search_container");
  if (searchContainer !== null) {
    // searchContainer.innerHTML = "";
    searchContainer.style.display = "none";
  }
}

function initVoyantTool() {
  selected_voyant = "";
  display_voyant = false;
  changeVoyantToolButton("Voyant Tools");
}
// Function to insert the Voyant tool
function insertVoyantTool(url) {
  let iframe = document.createElement("iframe");
  iframe.setAttribute("src", url);
  iframe.setAttribute("width", "100%");
  iframe.setAttribute("height", "600");
  iframe.setAttribute("id", "voyantIframe"); // Set an ID for the iframe

  let container = document.getElementById("voyant-tool-display");
  container.appendChild(iframe);
  changeVoyantToolButton("Close Voyant");
}

// Function to remove the Voyant tool
function closeVoyantTool() {
  let iframe = document.getElementById("voyantIframe");
  if (iframe) {
    iframe.remove(); // Remove the iframe
  }
  initVoyantTool();
}

function displayVoyantTool() {
  if (display_voyant === false || selected_voyant !== selected_current) {
    const url = OptionToVoyant[selected_current];
    if (url === "") {
      initVoyantTool();
      return;
    }
    insertVoyantTool(url);
    display_voyant = true;
    selected_voyant = selected_current;
  } else {
    closeVoyantTool();
    display_voyant = false;
  }

  // document.getElementById("button-voyant").addEventListener("click", closeVoyantTool);
  const voyantTool = document.getElementById("voyant-tool-display");
  voyantTool.style.display = "block";
}

function changeVoyantToolButton(value) {
  const voyantToolButton = document.getElementById("button-voyant");
  voyantToolButton.textContent = value;
}

function isOnlyWhitespace(str) {
  return /^\s*$/.test(str);
}

function switchHighlight() {
  displayTEIContent(selectedOption);
}

// function for highlighting the text by tag like <name>, <place>, <date>, etc.
function highlightTagText(tag) {
  console.log("Highlighting tag:", tag, "current:", highlight_curr);
  if (highlight_curr === tag) {
    return;
  }
  if (tag === "none") {
    removeHighlightTagText();
    deactiveButton(highlight_curr);
    highlight_curr = "none";
    activeButton(highlight_curr);
    return;
  }

  if (highlight_curr !== "none") {
    removeHighlightTagText();
  }

  deactiveButton(highlight_curr);

  // removeHighlightTagText();
  highlight_curr = tag;

  const displayArea = document.getElementsByTagName("text")[0];
  if (!displayArea) {
    console.error("Display area not found");
    return;
  }

  let content = displayArea.innerHTML;
  const tagRegex = new RegExp(`<${tag}>(.*?)</${tag}>`, "g");
  const highlightedContent = content.replace(tagRegex, `<span class="highlight_tag" data-tag="${tag}">$1</span>`);

  displayArea.innerHTML = highlightedContent;

  activeButton(tag);
}

// Function to remove highlight from specified tag
function removeHighlightTagText() {
  if (highlight_curr === "none") {
    return;
  }
  // deactiveButton(highlight_curr);
  const displayArea = document.getElementsByTagName("text")[0];
  if (!displayArea) {
    console.error("Display area not found");
    return;
  }

  let content = displayArea.innerHTML;
  const highlightTagRegex = new RegExp(`<span class="highlight_tag" data-tag="${highlight_curr}">(.*?)</span>`, "g");
  const unhighlightedContent = content.replace(highlightTagRegex, `<${highlight_curr}>$1</${highlight_curr}>`);

  displayArea.innerHTML = unhighlightedContent;
  // highlight_curr = "none";
  // activeButton(highlight_curr);
}

// Function to create and add buttons dynamically using Bootstrap 5.3
function createButtons() {
  const buttonContainer = document.createElement("div");
  buttonContainer.id = "button-container";
  buttonContainer.className = "position-fixed top-0 end-0 p-3";

  const toggleButton = initToggleButton();

  const buttonGroupContainer = document.createElement("div");
  buttonGroupContainer.className = "btn-group-vertical collapse top-2 end-0";
  buttonGroupContainer.setAttribute("role", "group");
  buttonGroupContainer.id = "tag-buttons";

  const buttons = [
    { label: "Hide", id: "btn_hide", action: () => displayToggleButton() },
    { label: "No-highlight", id: "btn_none", action: () => highlightTagText("none") },
    { label: "Name", id: "btn_name", action: () => highlightTagText("name") },
    { label: "Place", id: "btn_place", action: () => highlightTagText("place") },
    { label: "Quotation", id: "btn_quotation", action: () => highlightTagText("quotation") },
  ];

  buttons.forEach((button) => {
    const btn = document.createElement("button");

    if (button.label === "Hide") {
      btn.className = "btn btn-outline-secondary";
    } else if (button.label === "No-highlight") {
      btn.className = "btn btn-outline-primary active";
    } else {
      btn.className = "btn btn-outline-primary";
    }
    btn.innerText = button.label;
    btn.id = button.id;
    btn.onclick = button.action;
    buttonGroupContainer.appendChild(btn);
  });

  buttonContainer.appendChild(toggleButton);
  buttonContainer.appendChild(buttonGroupContainer);
  return buttonContainer;
}

function activeButton(tag) {
  const btn = document.getElementById(`btn_${tag}`);
  if (btn) {
    btn.classList.add("active");
  }
}

function deactiveButton(tag) {
  const btn = document.getElementById(`btn_${tag}`);
  if (btn) {
    btn.classList.remove("active");
  }
}

function initToggleButton() {
  toggle_button_display = false;
  const toggleButton = document.createElement("button");
  toggleButton.className = "btn btn-outline-secondary mb-2";
  // toggleButton.setAttribute("data-bs-toggle", "collapse");
  // toggleButton.setAttribute("data-bs-target", "#tag-buttons");
  // toggleButton.setAttribute("aria-expanded", "false");
  // toggleButton.setAttribute("aria-controls", "tag-buttons");
  toggleButton.innerHTML = "<span>&#9662;</span>"; // Down arrow icon
  toggleButton.style.maxWidth = "40px"; // Set max width to 30px
  toggleButton.id = "toggle-button";
  toggleButton.onclick = toggleButtonStat;
  return toggleButton;
}

function toggleButtonStat() {
  const buttonGroup = document.getElementById("tag-buttons");
  const buttonToggle = document.getElementById("toggle-button");

  if (toggle_button_display === false) {
    // buttonToggle.innerHTML = "<span>&#9652;</span>"; // Up arrow icon
    buttonToggle.classList.add("d-none");
    buttonGroup.classList.add("display");
    buttonGroup.classList.remove("collapse");
    toggle_button_display = true;
  } else {
    buttonToggle.innerHTML = "<span>&#9662;</span>"; // Down arrow icon
    buttonToggle.classList.remove("d-none");
    buttonGroup.classList.remove("display");
    buttonGroup.classList.add("collapse");
    toggle_button_display = false;
  }
}

function displayToggleButton() {
  // const buttonToggle = document.getElementById("toggle-button");
  // buttonToggle.classList.remove("d-none");
  toggle_button_display = true;
  toggleButtonStat();
}
