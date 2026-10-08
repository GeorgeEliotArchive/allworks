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

// Search lifecycle state. A token prevents an older/slow search from overwriting
// a newer one, which is especially important on mobile devices.
let activeSearchRun = 0;
let activeContentLoad = 0;
let activeGroupStats = new Map();

// GitHub Pages repository layout: /index.html + /teiEncode/
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

const OptionToVoyant = {
  "Search a text to explore": "",
  "Mr. Gilfil's Love Story (1857)":
    "https://voyant-tools.org/tool/Cirrus/?corpus=a32279787de8e93603097cc4e26271f6&stopList=keywords-2459d9912745179a64508611ee85dd7e&whiteList=",
  "Janet's Repentance (1857)":
    "https://voyant-tools.org/tool/Cirrus/?corpus=477db75674e3ee663b6cea67dc5c5968&stopList=keywords-2459d9912745179a64508611ee85dd7e&whiteList=",
  "The Sad Fortunes of the Rev. Amos Barton (1857)":
    "https://voyant-tools.org/tool/Cirrus/?corpus=8118b293dc884803731f96c4666e7bdb&stopList=keywords-2459d9912745179a64508611ee85dd7e&whiteList=",
  "Adam Bede (1859)":
    "https://voyant-tools.org/tool/Cirrus/?corpus=3cc2427efa1f1eb749aa55b5cfd099d2&stopList=keywords-2459d9912745179a64508611ee85dd7e&whiteList=",
  "The Lifted Veil (1859)":
    "https://voyant-tools.org/tool/Cirrus/?corpus=5118a197e536559b5477e131cd47cfbd&stopList=keywords-2459d9912745179a64508611ee85dd7e&whiteList=",
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
  "All Fiction":
    "https://voyant-tools.org/?corpus=467f53173e9b97d244b09161b0eb10b4&view=Cirrus&stopList=keywords-2459d9912745179a64508611ee85dd7e&whiteList=",
  // "All Nonfiction":
  //   "https://voyant-tools.org/?corpus=de5b839103819a2a0bc741013bf2ea6b&view=Cirrus&stopList=keywords-2459d9912745179a64508611ee85dd7e&whiteList=",
  "All Nonfiction":
    "https://voyant-tools.org/?corpus=a70fb8ab1ef7192f57c653e19e75744f&view=Cirrus&stopList=keywords-2459d9912745179a64508611ee85dd7e&whiteList=",
  "The Spanish Gypsy (1868)":
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

  displayTagsNew();
}

async function displayTEIContent(filename) {
  const loadId = ++activeContentLoad;
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
    if (loadId !== activeContentLoad) return;

    // Use DOMParser to parse the XML text
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    // Serialize XML DOM to string
    // let frontNode = xmlDoc.getElementsByTagName("front")[0];
    // console.log(frontNode);

    let serializer = new XMLSerializer();
    let serializedXml = serializer.serializeToString(xmlDoc);
    // Escape the XML string

    const display = document.getElementById("xml-display");
    if (loadId !== activeContentLoad) return;
    display.innerHTML = escapeXml(serializedXml);
    annotateCorpusStructure(xmlDoc, display);
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

function annotateCorpusStructure(xmlDoc, displayArea) {
  // HTML fragment parsing treats TEI <head> as the HTML <head> element and can
  // drop that tag. Preserve the work titles from the parsed XML before search.
  const xmlDivs = Array.from(xmlDoc.getElementsByTagNameNS("*", "div")).filter(
    (element) => element.getAttribute("type") === "work",
  );
  const renderedWorks = Array.from(displayArea.querySelectorAll('div[type="work"]'));

  renderedWorks.forEach((work, index) => {
    const xmlWork = xmlDivs[index];
    let title = "";
    if (xmlWork) {
      const head = Array.from(xmlWork.children).find((child) => child.localName === "head");
      title = head ? head.textContent : "";
    }
    work.dataset.searchGroupKey = `fiction-${index}`;
    work.dataset.searchTitle = cleanGroupTitle(title, `Untitled work ${index + 1}`);
  });

  Array.from(displayArea.querySelectorAll("teisubtitle")).forEach((subtitle, index) => {
    subtitle.dataset.searchGroupKey = `nonfiction-${index}`;
    subtitle.dataset.searchTitle = cleanGroupTitle(subtitle.textContent, `Untitled work ${index + 1}`);
  });
}

async function searchAndHighlight(phrase) {
  const runId = ++activeSearchRun;

  if (phrase === "" || isOnlyWhitespace(phrase) === true) {
    hide_search_container();
    return;
  }

  const displayArea = document.getElementsByTagName("text")[0];
  if (!displayArea) return;

  const searchContainer = document.getElementById("search_container");
  const searchInput = document.getElementById("search_input");

  clearSearchHighlights(displayArea);
  search_toggle = "";
  id_pop_row = "";
  search_minimized = false;
  searchContainer.classList.remove("minimized");
  searchContainer.classList.toggle("corpus-search", isCorpusSelection());
  searchContainer.replaceChildren();

  // Paint the panel immediately. On large corpora, building thousands of DOM
  // nodes can take noticeable time on phones; this prevents an apparently
  // empty/frozen result window.
  const panelBody = document.createElement("div");
  panelBody.className = "search-panel-body";
  const loading = document.createElement("div");
  loading.className = "search-loading";
  loading.textContent = "Searching…";
  panelBody.appendChild(loading);
  searchContainer.appendChild(panelBody);
  addSearchPanelHeader(searchContainer, panelBody, "Searching…", searchInput);
  searchContainer.style.display = "block";
  draggable_div(searchContainer);
  clampSearchPanelToViewport(searchContainer);

  // Give the browser a chance to display the loading state before doing the
  // corpus work. Two frames is more reliable in mobile Safari.
  await nextPaint();
  await nextPaint();
  if (runId !== activeSearchRun) return;

  const escapedPhrase = phrase.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  // Preserve the current Text Explorer behavior: a search for "friend"
  // also finds words such as "friendly" and "friendship".
  const regex = new RegExp(`\\b${escapedPhrase}\\w*`, "gi");

  const nodeEntries = collectSearchableTextNodes(displayArea);
  const groupStats = buildGroupStats(nodeEntries);
  const matches = highlightMatches(nodeEntries, groupStats, regex);
  if (runId !== activeSearchRun) return;

  activeGroupStats = groupStats;

  const fragment = document.createDocumentFragment();
  const analytics = buildSearchAnalytics(matches, groupStats, phrase);
  if (analytics) fragment.appendChild(analytics);
  const searchResults = buildSearchResults(matches, groupStats);
  fragment.appendChild(searchResults);

  panelBody.replaceChildren(fragment);
  const resultCount = searchContainer.querySelector(".search-result-count");
  if (resultCount) resultCount.textContent = `${matches.length} results`;

  // Start rendering the first open corpus group after the main panel is on
  // screen. Remaining groups render only when opened.
  if (isCorpusSelection()) {
    requestAnimationFrame(() => {
      const openGroup = searchResults.querySelector(".work-result-group[open]");
      if (openGroup) ensureGroupResultsRendered(openGroup, false);
    });
  }
}

function nextPaint() {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

function isCorpusSelection() {
  return selected_current === "All Fiction" || selected_current === "All Nonfiction";
}

function clearSearchHighlights(displayArea) {
  const highlighted = Array.from(displayArea.querySelectorAll(".highlight"));
  highlighted.forEach((span) => {
    const parent = span.parentNode;
    while (span.firstChild) parent.insertBefore(span.firstChild, span);
    parent.removeChild(span);
  });
  displayArea.normalize();
}

function countWords(text) {
  const words = text.match(/[A-Za-z0-9À-ÖØ-öø-ÿ]+(?:['’\-][A-Za-z0-9À-ÖØ-öø-ÿ]+)*/g);
  return words ? words.length : 0;
}

function directChildHead(workElement) {
  if (!workElement) return null;
  return Array.from(workElement.children).find((child) => child.tagName.toLowerCase() === "head") || null;
}

function cleanGroupTitle(text, fallback) {
  const cleaned = (text || "").replace(/\s+/g, " ").trim();
  return cleaned || fallback;
}

function collectSearchableTextNodes(displayArea) {
  const entries = [];
  const walker = document.createTreeWalker(displayArea, NodeFilter.SHOW_TEXT);
  let currentNonfictionTitle = "";
  let currentNonfictionKey = "";
  let nonfictionIndex = -1;

  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!node.nodeValue || node.nodeValue.trim() === "") continue;

    let groupKey = "single";
    let groupTitle = selected_current || "Selected text";
    let groupElement = displayArea;

    if (selected_current === "All Fiction") {
      const work = node.parentElement ? node.parentElement.closest('div[type="work"]') : null;
      if (!work) continue; // corpus results should be grouped only by actual works
      const head = directChildHead(work);
      groupTitle = cleanGroupTitle(
        work.dataset.searchTitle || (head ? head.textContent : ""),
        "Untitled work",
      );
      groupKey = work.dataset.searchGroupKey || "fiction-unknown";
      groupElement = work;
    } else if (selected_current === "All Nonfiction") {
      const subtitle = node.parentElement ? node.parentElement.closest("teisubtitle") : null;
      if (subtitle && subtitle.dataset.searchGroupKey !== currentNonfictionKey) {
        nonfictionIndex += 1;
        currentNonfictionTitle = cleanGroupTitle(
          subtitle.dataset.searchTitle || subtitle.textContent,
          `Untitled work ${nonfictionIndex + 1}`,
        );
        currentNonfictionKey = subtitle.dataset.searchGroupKey || `nonfiction-${nonfictionIndex}`;
      }
      // Ignore corpus front matter before the first <teiSubTitle>.
      if (!currentNonfictionKey) continue;
      groupKey = currentNonfictionKey;
      groupTitle = currentNonfictionTitle;
      groupElement = subtitle || groupElement;
    }

    entries.push({ node, groupKey, groupTitle, groupElement, wordCount: countWords(node.nodeValue) });
  }

  return entries;
}

function buildGroupStats(entries) {
  const groups = new Map();
  entries.forEach((entry) => {
    if (!groups.has(entry.groupKey)) {
      groups.set(entry.groupKey, {
        key: entry.groupKey,
        title: entry.groupTitle,
        wordCount: 0,
        matches: [],
        runningWords: 0,
      });
    }
    groups.get(entry.groupKey).wordCount += entry.wordCount;
  });
  return groups;
}

// Inline TEI elements that sit inside a paragraph or line. Context snippets
// are allowed to cross these so that a hit inside <quotation> or next to a
// <name> still shows the surrounding words of the paragraph.
const CONTEXT_INLINE_TAGS = new Set([
  "name", "place", "quotation", "em", "hi", "ref", "span", "date", "title", "speaker", "pb", "ptr",
]);
const CONTEXT_WORDS = 5;

// Nearest ancestor that is not an inline element: the paragraph, line, head, etc.
function contextRoot(textNode) {
  let el = textNode.parentElement;
  while (el && el.parentElement && CONTEXT_INLINE_TAGS.has(el.tagName.toLowerCase())) {
    el = el.parentElement;
  }
  return el;
}

// Text of the sibling text nodes before (direction -1) or after (direction 1)
// `textNode` inside `root`, collected until at least `minWords` words are available.
function neighborText(root, textNode, direction, minWords) {
  if (!root) return "";
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  walker.currentNode = textNode;
  let collected = "";
  while (countWords(collected) < minWords) {
    const next = direction < 0 ? walker.previousNode() : walker.nextNode();
    if (!next) break;
    collected = direction < 0 ? next.nodeValue + collected : collected + next.nodeValue;
  }
  return collected;
}

// Up to CONTEXT_WORDS words on each side of a match. Characters attached
// directly to the match (an apostrophe, a comma, a closing quote) are kept
// with it instead of cutting the snippet short.
function buildMatchContext(textNode, text, matchIndex, matchLength) {
  const root = contextRoot(textNode);
  const beforeSource = neighborText(root, textNode, -1, CONTEXT_WORDS + 1) + text.slice(0, matchIndex);
  const afterSource = text.slice(matchIndex + matchLength) + neighborText(root, textNode, 1, CONTEXT_WORDS + 1);
  const beforeRe = new RegExp(`(?:\\S+\\s+){0,${CONTEXT_WORDS}}\\S*$`);
  const afterRe = new RegExp(`^\\S*(?:\\s+\\S+){0,${CONTEXT_WORDS}}`);
  const before = (beforeSource.match(beforeRe)?.[0] || "").replace(/\s+/g, " ").replace(/^ /, "");
  const after = (afterSource.match(afterRe)?.[0] || "").replace(/\s+/g, " ").replace(/ $/, "");
  return { before, after };
}

function highlightMatches(entries, groupStats, regex) {
  const matches = [];
  let counter = 0;

  entries.forEach((entry) => {
    const group = groupStats.get(entry.groupKey);
    const textNode = entry.node;
    const text = textNode.nodeValue;
    const found = Array.from(text.matchAll(regex));

    if (found.length === 0) {
      group.runningWords += entry.wordCount;
      return;
    }

    const fragment = document.createDocumentFragment();
    let lastIndex = 0;

    found.forEach((match) => {
      const matchIndex = match.index;
      const matchedText = match[0];
      const id = `match-${counter}`;
      const popId = `pop-${counter}`;
      counter += 1;

      fragment.appendChild(document.createTextNode(text.slice(lastIndex, matchIndex)));
      const highlight = document.createElement("span");
      highlight.className = "highlight";
      highlight.id = id;
      highlight.textContent = matchedText;
      fragment.appendChild(highlight);

      const { before, after } = buildMatchContext(textNode, text, matchIndex, matchedText.length);
      const wordsBefore = countWords(text.slice(0, matchIndex));
      const absoluteWordPosition = group.runningWords + wordsBefore;
      const relativePosition = group.wordCount > 0 ? absoluteWordPosition / group.wordCount : 0;

      const record = {
        id,
        popId,
        matchedText,
        before,
        after,
        groupKey: entry.groupKey,
        groupTitle: entry.groupTitle,
        relativePosition: Math.max(0, Math.min(1, relativePosition)),
      };
      matches.push(record);
      group.matches.push(record);
      lastIndex = matchIndex + matchedText.length;
    });

    fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
    textNode.parentNode.replaceChild(fragment, textNode);
    group.runningWords += entry.wordCount;
  });

  groupStats.forEach((group) => {
    group.relativeFrequency = group.wordCount > 0 ? (group.matches.length / group.wordCount) * 10000 : 0;
  });

  return matches;
}

function buildSearchAnalytics(matches, groupStats, phrase) {
  if (matches.length === 0) return null;

  const wrapper = document.createElement("div");
  wrapper.className = "search-analytics";

  if (isCorpusSelection()) {
    const frequencyDetails = document.createElement("details");
    frequencyDetails.className = "analytics-section";
    frequencyDetails.open = true;
    const summary = document.createElement("summary");
    summary.textContent = selected_current === "All Fiction" ? "Frequency across books" : "Frequency across works";
    frequencyDetails.appendChild(summary);
    frequencyDetails.appendChild(buildCorpusFrequencyBars(groupStats));
    wrapper.appendChild(frequencyDetails);
  } else {
    const trendDetails = document.createElement("details");
    trendDetails.className = "analytics-section";
    trendDetails.open = true;
    const summary = document.createElement("summary");
    summary.textContent = "Frequency across this work";
    trendDetails.appendChild(summary);
    const onlyGroup = Array.from(groupStats.values())[0];
    if (onlyGroup) trendDetails.appendChild(buildTrendChart(onlyGroup.matches, `Distribution of “${phrase}”`));
    wrapper.appendChild(trendDetails);
  }

  return wrapper;
}

function buildCorpusFrequencyBars(groupStats) {
  const container = document.createElement("div");
  container.className = "frequency-bars";

  const groups = Array.from(groupStats.values()).filter((group) => group.matches.length > 0);
  const maxFrequency = Math.max(...groups.map((group) => group.relativeFrequency), 0.0001);

  const note = document.createElement("div");
  note.className = "analytics-note";
  note.textContent = "Relative frequency: occurrences per 10,000 words. Select a work to open its results.";
  container.appendChild(note);

  groups.forEach((group) => {
    const row = document.createElement("button");
    row.type = "button";
    row.className = "frequency-row";
    row.dataset.groupKey = group.key;

    const label = document.createElement("span");
    label.className = "frequency-label";
    label.textContent = group.title;

    const track = document.createElement("span");
    track.className = "frequency-track";
    const fill = document.createElement("span");
    fill.className = "frequency-fill";
    fill.style.width = `${Math.max(2, (group.relativeFrequency / maxFrequency) * 100)}%`;
    track.appendChild(fill);

    const value = document.createElement("span");
    value.className = "frequency-value";
    value.textContent = `${group.relativeFrequency.toFixed(2)} (${group.matches.length})`;
    value.title = `${group.matches.length} occurrences`;

    row.append(label, track, value);
    row.addEventListener("click", () => openAndScrollToGroup(group.key));
    container.appendChild(row);
  });

  return container;
}

function buildTrendChart(matches, labelText) {
  const chartWrap = document.createElement("div");
  chartWrap.className = "trend-chart-wrap";

  const note = document.createElement("div");
  note.className = "analytics-note";
  note.textContent = "20 equal word segments. Select the trend to jump to the nearest occurrence.";
  chartWrap.appendChild(note);

  if (!matches || matches.length === 0) {
    const empty = document.createElement("div");
    empty.className = "trend-empty";
    empty.textContent = "No occurrences in this work.";
    chartWrap.appendChild(empty);
    return chartWrap;
  }

  const bins = 20;
  const counts = Array(bins).fill(0);
  matches.forEach((match) => {
    const index = Math.min(bins - 1, Math.floor(match.relativePosition * bins));
    counts[index] += 1;
  });
  const max = Math.max(...counts, 1);

  const width = 520;
  const height = 112;
  const top = 10;
  const bottom = 22;
  const plotHeight = height - top - bottom;
  const step = width / (bins - 1);
  const points = counts.map((count, i) => {
    const x = i * step;
    const y = top + plotHeight - (count / max) * plotHeight;
    return `${x},${y}`;
  }).join(" ");

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", labelText);
  svg.classList.add("trend-chart");

  const baseline = document.createElementNS("http://www.w3.org/2000/svg", "line");
  baseline.setAttribute("x1", "0");
  baseline.setAttribute("x2", String(width));
  baseline.setAttribute("y1", String(height - bottom));
  baseline.setAttribute("y2", String(height - bottom));
  baseline.setAttribute("class", "trend-axis");
  svg.appendChild(baseline);

  const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  polyline.setAttribute("points", points);
  polyline.setAttribute("class", "trend-line");
  svg.appendChild(polyline);

  counts.forEach((count, i) => {
    const x = i * step;
    const y = top + plotHeight - (count / max) * plotHeight;
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", String(x));
    circle.setAttribute("cy", String(y));
    circle.setAttribute("r", count > 0 ? "3" : "1.5");
    circle.setAttribute("class", count > 0 ? "trend-point" : "trend-point trend-point-empty");
    svg.appendChild(circle);
  });

  for (let i = 0; i < bins; i += 1) {
    const hit = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    const x = (i / bins) * width;
    hit.setAttribute("x", String(x));
    hit.setAttribute("y", "0");
    hit.setAttribute("width", String(width / bins));
    hit.setAttribute("height", String(height - bottom));
    hit.setAttribute("class", "trend-hit-area");
    hit.setAttribute("tabindex", "0");
    hit.setAttribute("aria-label", `Position ${Math.round(((i + 0.5) / bins) * 100)} percent`);
    const jump = () => jumpToNearestMatch(matches, (i + 0.5) / bins);
    hit.addEventListener("click", jump);
    hit.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") jump();
    });
    svg.appendChild(hit);
  }

  const labels = document.createElement("div");
  labels.className = "trend-labels";
  labels.innerHTML = "<span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>";

  chartWrap.append(svg, labels);
  return chartWrap;
}

function buildSearchResults(matches, groupStats) {
  const searchResults = document.createElement("div");
  searchResults.id = "search_results";
  searchResults.className = "container search-results-list";

  if (matches.length === 0) {
    const empty = document.createElement("div");
    empty.className = "no-search-results";
    empty.textContent = "No results found.";
    searchResults.appendChild(empty);
    return searchResults;
  }

  if (isCorpusSelection()) {
    let openedFirst = false;
    groupStats.forEach((group) => {
      if (group.matches.length === 0) return;
      const details = document.createElement("details");
      details.className = "work-result-group";
      details.dataset.groupKey = group.key;
      if (!openedFirst) {
        details.open = true;
        openedFirst = true;
      }

      const summary = document.createElement("summary");
      summary.className = "work-result-summary";
      summary.textContent = `${group.title} (${group.matches.length})`;
      details.appendChild(summary);

      const trendSection = document.createElement("div");
      trendSection.className = "group-trend-section";
      const trendLabel = document.createElement("div");
      trendLabel.className = "group-trend-label";
      trendLabel.textContent = "Frequency across this work";
      trendSection.appendChild(trendLabel);
      trendSection.appendChild(buildTrendChart(group.matches, `Distribution in ${group.title}`));
      details.appendChild(trendSection);

      // Do not construct hundreds of result rows for every book up front.
      // They are rendered in small batches only when a book is opened.
      const resultList = document.createElement("div");
      resultList.className = "group-result-list";
      resultList.dataset.rendered = "false";
      resultList.dataset.rendering = "false";
      details.appendChild(resultList);

      details.addEventListener("toggle", () => {
        if (details.open) ensureGroupResultsRendered(details, false);
      });

      searchResults.appendChild(details);
    });
  } else {
    // Individual works are smaller; build them in one fragment to minimize
    // layout/reflow work.
    const fragment = document.createDocumentFragment();
    matches.forEach((match) => fragment.appendChild(createSearchResultItem(match)));
    searchResults.appendChild(fragment);
  }

  return searchResults;
}

function ensureGroupResultsRendered(details, immediate = false) {
  if (!details) return;
  const resultList = details.querySelector(".group-result-list");
  if (!resultList || resultList.dataset.rendered === "true") return;

  const group = activeGroupStats.get(details.dataset.groupKey);
  if (!group) return;

  if (immediate) {
    // Cancel any scheduled batch by changing the generation marker.
    const generation = String((Number(resultList.dataset.generation || 0) + 1));
    resultList.dataset.generation = generation;
    const fragment = document.createDocumentFragment();
    group.matches.forEach((match) => fragment.appendChild(createSearchResultItem(match)));
    resultList.replaceChildren(fragment);
    resultList.dataset.rendered = "true";
    resultList.dataset.rendering = "false";
    return;
  }

  if (resultList.dataset.rendering === "true") return;
  resultList.dataset.rendering = "true";
  const generation = String((Number(resultList.dataset.generation || 0) + 1));
  resultList.dataset.generation = generation;

  const status = document.createElement("div");
  status.className = "group-results-loading";
  status.textContent = "Loading results…";
  resultList.replaceChildren(status);

  let index = 0;
  const chunkSize = window.matchMedia("(max-width: 700px)").matches ? 30 : 70;

  function appendChunk() {
    if (resultList.dataset.generation !== generation) return;
    if (index === 0) resultList.replaceChildren();

    const fragment = document.createDocumentFragment();
    const end = Math.min(group.matches.length, index + chunkSize);
    for (; index < end; index += 1) {
      fragment.appendChild(createSearchResultItem(group.matches[index]));
    }
    resultList.appendChild(fragment);

    if (index < group.matches.length) {
      requestAnimationFrame(appendChunk);
    } else {
      resultList.dataset.rendered = "true";
      resultList.dataset.rendering = "false";
    }
  }

  requestAnimationFrame(appendChunk);
}

function createSearchResultItem(match) {
  const resultItem = document.createElement("div");
  resultItem.className = "search-result";
  resultItem.dataset.matchId = match.id;

  const resultText = document.createElement("span");
  resultText.id = match.popId;
  resultText.appendChild(document.createTextNode(match.before));
  const strong = document.createElement("strong");
  strong.textContent = match.matchedText;
  resultText.appendChild(strong);
  resultText.appendChild(document.createTextNode(match.after));
  resultItem.appendChild(resultText);

  resultItem.addEventListener("click", () => jumpToMatch(match));
  return resultItem;
}

function openAndScrollToGroup(groupKey) {
  const details = Array.from(document.querySelectorAll(".work-result-group")).find(
    (item) => item.dataset.groupKey === groupKey,
  );
  if (!details) return;
  details.open = true;
  ensureGroupResultsRendered(details, false);
  const panelBody = details.closest(".search-panel-body");
  if (panelBody) {
    requestAnimationFrame(() => {
      panelBody.scrollTo({ top: Math.max(0, details.offsetTop - 6), behavior: "smooth" });
    });
  }
}

function jumpToNearestMatch(matches, targetPosition) {
  if (!matches || matches.length === 0) return;
  let nearest = matches[0];
  let nearestDistance = Math.abs(nearest.relativePosition - targetPosition);
  matches.forEach((match) => {
    const distance = Math.abs(match.relativePosition - targetPosition);
    if (distance < nearestDistance) {
      nearest = match;
      nearestDistance = distance;
    }
  });

  jumpToMatch(nearest);
}

function focusSearchResult(match) {
  if (!match) return;

  let details = null;
  if (isCorpusSelection()) {
    details = Array.from(document.querySelectorAll(".work-result-group")).find(
      (item) => item.dataset.groupKey === match.groupKey,
    );
    if (details) {
      details.open = true;
      // A graph click may target a row that has not been lazily created yet.
      // Render this one group immediately so navigation never silently fails.
      ensureGroupResultsRendered(details, true);
    }
  }

  document.querySelectorAll(".search-result.is-active-result").forEach((item) => {
    item.classList.remove("is-active-result");
  });

  const resultItem = document.querySelector(`.search-result[data-match-id="${CSS.escape(match.id)}"]`);
  if (!resultItem) return;
  resultItem.classList.add("is-active-result");

  const panelBody = resultItem.closest(".search-panel-body");
  if (panelBody) {
    requestAnimationFrame(() => {
      const itemRect = resultItem.getBoundingClientRect();
      const panelRect = panelBody.getBoundingClientRect();
      const desiredTop =
        panelBody.scrollTop +
        (itemRect.top - panelRect.top) -
        panelRect.height / 2 +
        itemRect.height / 2;
      panelBody.scrollTo({
        top: Math.max(0, desiredTop),
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
    });
  }
}

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function jumpToMatch(match) {
  const displayArea = document.getElementsByTagName("text")[0];
  let target = document.getElementById(match.id);
  if (!target || !displayArea) return;

  // Preserve the existing table-of-contents behavior: when a highlighted
  // match is inside <ref target="#...">, jump to the referenced section.
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

  if (!target.id) target.id = `jump-${match.id}`;
  const targetId = target.id;
  const targetPosition = target.getBoundingClientRect().top;
  const offsetPosition = window.pageYOffset + targetPosition - window.innerHeight / 2;
  window.scrollTo({
    top: offsetPosition,
    behavior: window.matchMedia("(max-width: 700px)").matches || prefersReducedMotion() ? "auto" : "smooth",
  });

  const oldResult = document.getElementById(id_pop_row);
  if (oldResult) oldResult.classList.remove("text-primary");
  const currentResult = document.getElementById(match.popId);
  if (currentResult) currentResult.classList.add("text-primary");
  id_pop_row = match.popId;

  // Keep the floating result list synchronized with jumps from both the
  // result list and the frequency trend chart.
  focusSearchResult(match);

  if (search_toggle !== targetId) {
    if (search_toggle !== "") {
      const oldTarget = document.getElementById(search_toggle);
      if (oldTarget) oldTarget.classList.remove("jump-to");
    }
    search_toggle = targetId;
    target.classList.add("jump-to");
  }
}

function addSearchPanelHeader(docContainer, panelBody, resultCount, docScrollTop) {
  const header = document.createElement("div");
  header.className = "search-panel-header position-sticky top-0";

  const textDisplay = document.createElement("span");
  textDisplay.className = "text-primary fs-6 search-result-count";
  textDisplay.textContent = typeof resultCount === "number" ? `${resultCount} results` : String(resultCount);
  header.appendChild(textDisplay);

  const divButtons = document.createElement("div");
  divButtons.id = "sr_div_buttons";
  divButtons.className = "btn-group";
  divButtons.setAttribute("role", "group");

  const buttonItem = document.createElement("button");
  buttonItem.className = "btn btn-outline-primary btn-sm";
  buttonItem.type = "button";
  buttonItem.textContent = "Min";
  buttonItem.id = "sr_minimize_button";
  buttonItem.addEventListener("click", (event) => {
    event.stopPropagation();
    if (!search_minimized) {
      docContainer.classList.add("minimized");
      panelBody.classList.add("minimized");
      buttonItem.textContent = "Max";
      search_minimized = true;
    } else {
      docContainer.classList.remove("minimized");
      panelBody.classList.remove("minimized");
      buttonItem.textContent = "Min";
      search_minimized = false;
    }
  });

  const buttonScrollTop = document.createElement("button");
  buttonScrollTop.className = "btn btn-outline-success btn-sm";
  buttonScrollTop.type = "button";
  buttonScrollTop.textContent = "Top";
  buttonScrollTop.id = "sr_scroll_top_button";
  buttonScrollTop.addEventListener("click", (event) => {
    event.stopPropagation();
    docScrollTop.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  divButtons.append(buttonItem, buttonScrollTop);
  header.appendChild(divButtons);
  docContainer.insertBefore(header, docContainer.firstChild);
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

function clampSearchPanelToViewport(panel) {
  if (!panel || panel.style.display === "none") return;

  // On phones, CSS owns the position. Clearing old drag coordinates avoids a
  // desktop drag position leaving the panel partly off-screen after rotation.
  if (window.matchMedia("(max-width: 700px)").matches) {
    panel.style.left = "";
    panel.style.top = "";
    return;
  }

  const rect = panel.getBoundingClientRect();
  const margin = 8;
  let left = rect.left;
  let top = rect.top;
  if (rect.right > window.innerWidth - margin) left -= rect.right - (window.innerWidth - margin);
  if (left < margin) left = margin;
  if (rect.bottom > window.innerHeight - margin) top -= rect.bottom - (window.innerHeight - margin);
  if (top < margin) top = margin;
  panel.style.left = `${left}px`;
  panel.style.top = `${top}px`;
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
    // Drag only from the panel header so charts, results, and scrollbars remain interactive.
    if (!e.target.closest(".search-panel-header") || e.target.closest("button")) return;

    elementX = doc_drag.offsetLeft - e.clientX;
    elementY = doc_drag.offsetTop - e.clientY;

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });

  function onMouseUp() {
    // Remove the listeners when mouse button is released
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  }

  // Deliberately do not drag the floating panel with touch. Mobile Safari
  // otherwise has to decide whether a header gesture means drag, scroll, or tap,
  // which can make the panel feel unreliable. Desktop mouse dragging remains.
}


let searchPanelResizeTimer = null;
window.addEventListener("resize", () => {
  clearTimeout(searchPanelResizeTimer);
  searchPanelResizeTimer = setTimeout(() => {
    clampSearchPanelToViewport(document.getElementById("search_container"));
  }, 100);
});

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
