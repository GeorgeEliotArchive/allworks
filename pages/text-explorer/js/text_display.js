let search_minimized = false;
let search_toggle = "";
let text_select = "";
let id_pop_row = "";
let selected_current = "";
let selected_voyant = "";
let display_voyant = false;
let highlight_curr = "none";
let toggle_button_display = false;
let isTagListVisible = false; // Track the visibility state

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
  "All Fiction": "all_fictions_simple",
  "All Nonfiction": "nonfiction_v2",
  "The Spanish Gypsy (1868)": "The_Spanish_Gypsy",
  "All Poetry Except The Spanish Gypsy": "poetry_allinone",
};

const VOYANT_BASE = "https://voyant.fishee.org";
const OptionToVoyant = {
  "Search a text to explore": "",
  "Mr. Gilfil's Love Story (1857)":
    VOYANT_BASE + "/tool/Cirrus/?corpus=8ac0432296676f93e04e27fa311572d6&stopList=keywords-2459d9912745179a64508611ee85dd7e&whiteList=",
  "Janet's Repentance (1857)":
    VOYANT_BASE + "/tool/Cirrus/?corpus=0575656ba58f8fd6b94ccd50304d78a4&stopList=keywords-2459d9912745179a64508611ee85dd7e&whiteList=",
  "The Sad Fortunes of the Rev. Amos Barton (1857)":
    VOYANT_BASE + "/tool/Cirrus/?corpus=6bbe068d2ed887ac563ae9f9ce59e1e4&stopList=keywords-2459d9912745179a64508611ee85dd7e&whiteList=",
  "Adam Bede (1859)":
    VOYANT_BASE + "/tool/Cirrus/?corpus=5d06f504b20a8eef95d5c7666fcefa53&stopList=keywords-2459d9912745179a64508611ee85dd7e&whiteList=",
  "The Lifted Veil (1859)":
    VOYANT_BASE + "/tool/Cirrus/?corpus=492ae05a96f04b0e07b89140ec73678b&stopList=keywords-2459d9912745179a64508611ee85dd7e&whiteList=",
  "The Mill on the Floss (1860)":
    VOYANT_BASE + "/tool/Cirrus/?corpus=41371bc0e28d8cf1f675f47e9a5c6a0f&stopList=keywords-2459d9912745179a64508611ee85dd7e&whiteList=",
  "Silas Marner (1861)":
    VOYANT_BASE + "/tool/Cirrus/?corpus=abed769f964856ae953d168bdc594d58&stopList=keywords-2459d9912745179a64508611ee85dd7e&whiteList=",
  "Romola (1863)":
    VOYANT_BASE + "/tool/Cirrus/?corpus=d393dc2327f985bdc75ebe948b3809e8&stopList=keywords-2459d9912745179a64508611ee85dd7e&whiteList=",
  "Brother Jacob (1864)":
    VOYANT_BASE + "/tool/Cirrus/?corpus=71182174980d4bea97f433e13b05bc9d&stopList=keywords-2459d9912745179a64508611ee85dd7e&whiteList=",
  "Felix Holt, the Radical (1866)":
    VOYANT_BASE + "/tool/Cirrus/?corpus=48a28aea0c8a3ca30612acedbea2ab4b&stopList=keywords-2459d9912745179a64508611ee85dd7e&whiteList=",
  "Middlemarch (1871-72)":
    VOYANT_BASE + "/tool/Cirrus/?corpus=e66ca6ddfdfb5b6bdb1247553c0b91b6&stopList=keywords-2459d9912745179a64508611ee85dd7e&whiteList=",
  "Daniel Deronda (1876)":
    VOYANT_BASE + "/tool/Cirrus/?corpus=df845f097563eb333ace24e514a236b7&stopList=keywords-2459d9912745179a64508611ee85dd7e&whiteList=",
  "Impressions of Theophrastus Such (1879)":
    VOYANT_BASE + "/tool/Cirrus/?corpus=3eaffbc5b9ac83885210753c563801b2&stopList=keywords-2459d9912745179a64508611ee85dd7e&whiteList=",
  "All Fiction":
    VOYANT_BASE + "/tool/Cirrus/?corpus=989b84c85a4a52a0261ed896533852c0&stopList=keywords-2459d9912745179a64508611ee85dd7e&whiteList=",
  "All Nonfiction":
    VOYANT_BASE + "/tool/Cirrus/?corpus=3f4878c8f2cfc3aa951349b2c3203818&stopList=keywords-2459d9912745179a64508611ee85dd7e&whiteList=",
  "The Spanish Gypsy (1868)":
    VOYANT_BASE + "/tool/Cirrus/?corpus=e559c2d715a542f35bccef547f247f80&stopList=keywords-2459d9912745179a64508611ee85dd7e&whiteList=",
  "All Poetry Except The Spanish Gypsy":
    VOYANT_BASE + "/tool/Cirrus/?corpus=e0e71c4d489d423374d9779d254daa91&stopList=keywords-2459d9912745179a64508611ee85dd7e&whiteList=",
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

  displayTagsNew();
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
  // const style = document.createElement("style");
  // style.innerHTML = `
  //   .highlight_tag {
  //       background-color: rgba(144, 238, 144, 0.4); /* Light green background with 50% opacity */
  //   #button-container {
  //       z-index: 1000; /* Ensure the buttons are always on top */
  //   }
  //   .btn-secondary {
  //       margin-bottom: 10px; /* Adjust margin to ensure the toggle button does not overlap with the buttons */
  //   }
  //   .btn-secondary span {
  //   display: inline-block;
  //   width: 100%;
  //   }
  //   #toggle-button {
  //     width: 30px;
  //   }
  // `;
  // document.head.appendChild(style);
  // highlightTagText("name");
  // document.getElementById("xml-display").appendChild(createButtons());

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
  //merge adjacent text nodes created by the previous search
  displayArea.normalize();
  let counter = 0;
  
  // v1
  // // Escape any special characters in the phrase
  // const escapedPhrase = phrase.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  // // Adding word boundaries to the regex
  // const regex = new RegExp(`((?:\\w+\\W+){0,3}\\w*)?\\b(${escapedPhrase})\\b(\\w*(?:\\W+\\w+){0,3})?`, "gi");

  // v2
  // const escapedPhrase = phrase.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  // const regex = new RegExp(`((?:\\w+\\W+){0,2}\\w*)?\\b(${escapedPhrase})\\b(\\w*(?:\\W+\\w+){0,2})?`, "gi");

  const escapedPhrase = phrase.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  const regex = new RegExp(`\\b${escapedPhrase}\\w*`, "gi");

  // // v4
  // const escapedPhrase = phrase.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  // console.log(escapedPhrase);
  // const regex = new RegExp(`((?:^|\\w+\\W+){0,3})?(${escapedPhrase})((?:\\W+\\w+){0,3})?`, "gi");

  // Search only rendered text. Searching innerHTML also matches XML element names,
  // so a query such as "Epilogue" incorrectly finds the <epilogue> tag.
  const walker = document.createTreeWalker(displayArea, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  textNodes.forEach((textNode) => {
    const text = textNode.nodeValue;
    const matches = Array.from(text.matchAll(regex));
    if (matches.length === 0) return;

    const fragment = document.createDocumentFragment();
    let lastIndex = 0;

    matches.forEach((match) => {
      const matchIndex = match.index;
      const matchedText = match[0];
      const id = `match-${counter}`;
      const id_pop = `pop-${counter}`;
      counter += 1;

      fragment.appendChild(document.createTextNode(text.slice(lastIndex, matchIndex)));
      const highlight = document.createElement("span");
      highlight.className = "highlight";
      highlight.id = id;
      highlight.textContent = matchedText;
      fragment.appendChild(highlight);

      const before = text.slice(0, matchIndex).match(/(?:\S+\s+){0,3}$/)?.[0] || "";
      const after = text.slice(matchIndex + matchedText.length).match(/^(?:\s+\S+){0,3}/)?.[0] || "";
      const resultItem = document.createElement("div");
      resultItem.className = "search-result";
      const resultText = document.createElement("span");
      resultText.id = id_pop;
      resultText.appendChild(document.createTextNode(before));
      const strong = document.createElement("strong");
      strong.textContent = matchedText;
      resultText.appendChild(strong);
      resultText.appendChild(document.createTextNode(after));
      resultItem.appendChild(resultText);
      resultItem.addEventListener("click", () => {
        let target = document.getElementById(id);

        // Table-of-contents entries link to semantic sections such as
        // <epilogue> or <div xml:id="finale">. Jump to that section instead
        // of stopping at the entry in the contents.
        const reference = target.closest("ref[target]");
        if (reference) {
          const referenceTarget = reference.getAttribute("target");
          if (referenceTarget && referenceTarget.startsWith("#")) {
            const targetName = referenceTarget.slice(1);
            const xmlIdTarget = Array.from(displayArea.querySelectorAll("[xml\\:id]")).find(
              (element) => element.getAttribute("xml:id") === targetName,
            );
            const tagTarget = displayArea.getElementsByTagName(targetName)[0];
            target = xmlIdTarget || tagTarget || target;
          }
        }

        if (!target.id) target.id = `jump-${id}`;
        const targetId = target.id;
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
        if (search_toggle !== targetId) {
          if (search_toggle !== "") {
            const old_target = document.getElementById(search_toggle);
            if (old_target) old_target.classList.remove("jump-to");
          }
          search_toggle = targetId;
          target.classList.add("jump-to");
        }
        // search_results.classList.add("minimized");
      });
      searchResults.appendChild(resultItem);
      lastIndex = matchIndex + matchedText.length;
    });

    fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
    textNode.parentNode.replaceChild(fragment, textNode);
  });

  searchContainer.appendChild(searchResults);
  if (searchResults.children.length === 0) {
    search_minimized = true;
  }
  searchContainer.style.display = "block";
  pop_up_interactive(searchContainer, searchResults, searchInput);

  draggable_div(searchContainer);
}

function pop_up_interactive(doc_container, displayed_results, doc_scroll_top) {
  // Create a container div for text and button
  const container = document.createElement("div");
  container.style.display = "flex";
  // container.style.alignItems = "center";
  container.style.justifyContent = "space-between";
  container.className = "position-sticky mt-1 top-0";
  container.style.width = "100%";

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
  //prevent duplicate event binding
  if (doc_drag.dataset.draggableInitialized === "true") {
    return;
  }
  doc_drag.dataset.draggableInitialized = "true";

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

  //mobile device suport
  doc_drag.addEventListener("touchstart", function (e) {
    // when using finger on mobile devices
    if (
      e.target.closest("#search_results") ||
      e.target.closest("button") ||
      e.target.closest("input") ||
      e.target.closest("select")
    ) {
      return;
    }
    if(e.touches.length !== 1) {
      return;
    }
    const touch = e.touches[0];
    elementX = doc_drag.offsetLeft - touch.clientX;
    elementY = doc_drag.offsetTop - touch.clientY;

    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onTouchEnd);
    document.addEventListener("touchcancel", onTouchEnd);
  },
  { passive: true }
);
function onTouchMove(e) {
  if (e.touches.length !== 1) {
    return;
  }
  e.preventDefault();
  const touch = e.touches[0];
  doc_drag.style.left = touch.clientX + elementX + "px";
  doc_drag.style.top = touch.clientY + elementY + "px";
}
function onTouchEnd() {
  document.removeEventListener("touchmove", onTouchMove);
  document.removeEventListener("touchend", onTouchEnd);
  document.removeEventListener("touchcancel", onTouchEnd);
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
  // console.log("Highlighting tag:", tag, "current:", highlight_curr);
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

  removeHighlightTagText();
  highlight_curr = tag;

  const displayArea = document.getElementsByTagName("text")[0];
  if (!displayArea) {
    console.error("Display area not found");
    return;
  }

  let content = displayArea.innerHTML;
  const tagRegex = new RegExp(`<${tag}>(.*?)</${tag}>`, "g");
  const highlightedContent = content.replace(
    tagRegex,
    `<span class="highlight_tag_${tag}" data-tag="${tag}">$1</span>`
  );

  displayArea.innerHTML = highlightedContent;

  // activeButton(tag);
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
  const highlightTagRegex = new RegExp(
    `<span class="highlight_tag_${highlight_curr}" data-tag="${highlight_curr}">(.*?)</span>`,
    "g"
  );
  const unhighlightedContent = content.replace(highlightTagRegex, `<${highlight_curr}>$1</${highlight_curr}>`);

  displayArea.innerHTML = unhighlightedContent;
  // highlight_curr = "none";
  // activeButton(highlight_curr);
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

function displayTagsNew() {
  const toggleButton = document.querySelector(".toggle-button");
  const tagList = document.querySelector(".tag-list");
  const arrowIcon = document.querySelector(".arrow-icon");

  tagList.classList.add("d-none"); // Hide the tag list initially

  toggleButton.addEventListener("click", () => {
    isTagListVisible = !isTagListVisible;
    // tagList.style.display = isTagListVisible ? "flex" : "none";
    if (isTagListVisible) {
      tagList.classList.remove("d-none");
    } else {
      tagList.classList.add("d-none");
    }
    // console.log("Tag list visibility:", isTagListVisible);

    arrowIcon.classList.toggle("bi-chevron-left", isTagListVisible);
    arrowIcon.classList.toggle("bi-chevron-right", !isTagListVisible);
  });

  const tagItems = document.querySelectorAll(".tag-item");
  tagItems.forEach((tag) => {
    tag.addEventListener("click", () => {
      // Your tag click handling logic here
      // console.log(`Clicked on: ${tag.textContent}`);
      if (tag.textContent === "Clear") {
        highlightTagText("none");
      } else if (tag.textContent === "Back") {
        // console.log("go back to the top.");
        scroll_to_top_tag();
      } else {
        highlightTagText(tag.textContent.toLowerCase());
      }
    });
  });
}

function scroll_to_top_tag() {
  const searchInput = document.getElementById("search_input");
  searchInput.scrollIntoView();
}
