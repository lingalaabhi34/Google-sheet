let columns = 26;
let rows = 100;
const headerContainer = document.querySelector(".header");
const serialNumbersContainer = document.querySelector(".serialnumber");
const mainContainer = document.querySelector(".main");
const placeholdername =  document.querySelector("#activecell");
const fontsizeinput = document.querySelector("#fontsize");
const fontfamilyinput =document.querySelector("#fontfamily");
const form = document.querySelector("#form");
const copy = document.querySelector(".copy");
const cut = document.querySelector(".cut");
const paste = document.querySelector(".paste");
cut.addEventListener('click',onCut());
copy.addEventListener("click",onCopy());
paste.addEventListener("click",onPaste());
const defaultproperties = {
    fontFamily: 'sans',
    fontSize: 16,
    color: "#000000",
    textAlign: "left",
    backgroundColor: "#ffffff",
    isBold: false,
    isItalic: false,
    isUnderlined: false,
    value: ''
}

let activeelement = null;

const state ={};


function exportData() {
    let fileData = JSON.stringify(state);
    let blob = new Blob([fileData], { type: "application/json" })
    let url = URL.createObjectURL(blob);
    let link = document.createElement("a");
    link.href = url;
    link.download = "sheet.json";
    link.click();
}

function onCellFocus(event){
    const elementId = event.target.id;
    placeholdername.innerText = elementId;
    activeelement = event.target;
    if(state[elementId]){
        resetoptions(state[elementId]);
    }
    else{
        resetoptions(defaultproperties);
    }
   
}
function resetoptions(optionsState) {
  
    form.fontfamily.value = optionsState.fontFamily;
    form.fontsize.value = optionsState.fontSize;
    form.textalign.value = optionsState.textAlign; 
    form.bold.checked = optionsState.isBold
    form.italic.checked = optionsState.isItalic;
    form.underlined.checked = optionsState.isUnderlined;
    form.textcolor.color = optionsState.color;
    form.bgcolor.value = optionsState.backgroundColor;
}
function onFormChange() {
    if (!activeelement) {
        alert("Please select a cell to make changes");
        form.reset();
        return;
    }
    let currentState = {
        textColor: form.textcolor.value,
        backgroundColor: form.bgcolor.value,
        fontSize: form.fontsize.value,
        fontFamily: form.fontfamily.value,
        isBold: form.bold.checked,
        isItalic: form.italic.checked,
        isUnderlined: form.underlined.checked,
        textAlign: form.textalign.value
    }

    applyStylesToCell(currentState);
    state[activeelement.id] = { ...currentState, value: activeelement.innerText };
}

function onCopy(event) {
    event.preventDefault();
    if (!activeelement) {
        alert("Please select a cell to copy");
        return;
    }
    let copyText = activeelement.innerText;
    let textArea = document.createElement("textarea");
    textArea.value = copyText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("Copy");
    textArea.remove();
}

function onPaste(event) {
    event.preventDefault();
    let pasteText = event.clipboardData.getData("text/plain");
    if (activeelement) {
        activeelement.innerText = pasteText;
        onFormChange();
    }
}

function onCut(event) {
    event.preventDefault();
    if (!activeelement) {
        alert("Please select a cell to cut");
        return;
    }
    let cutText = activeelement.innerText;
    let textArea = document.createElement("textarea");
    textArea.value = cutText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("Cut");
    textArea.remove();
    onFormChange();
}  

function applyStylesToCell(styleObject) {
    activeelement.style.fontSize = `${styleObject.fontSize}px`;
    activeelement.style.fontFamily = styleObject.fontFamily;
    activeelement.style.color = styleObject.textColor;
    activeelement.style.backgroundColor = styleObject.backgroundColor;
    activeelement.style.textAlign = styleObject.textAlign;
    activeelement.style.fontWeight = styleObject.isBold ? "bold" : "normal";
    activeelement.style.fontStyle = styleObject.isItalic ? "italic" : "normal";
    activeelement.style.textDecoration = styleObject.isUnderlined ? "underline" : "none";
}

function createHeaderCells() {
    for (let i = 0; i <= columns; i++) {
        const headerCell = document.createElement("div");
        headerCell.className = "header-cell cell";
        if (i !== 0) {
            headerCell.innerText = String.fromCharCode(64 + i);
        }
        headerContainer.appendChild(headerCell)
    }
}

function createSerialNumberCells() {
    for (let i = 1; i <= rows; i++) {
        const snoCell = document.createElement("div");
        snoCell.innerText = i;
        snoCell.className = "sno-cell cell"
        serialNumbersContainer.appendChild(snoCell);
    }
}

function createRow(rowNumber) {
   
    const row = document.createElement("div");
    row.className = "row";
    for (let i = 1; i <= columns; i++) {
        const cell = document.createElement("div");
        cell.className = "main-cell cell";
        cell.contentEditable = true;
        row.appendChild(cell);
        cell.id = String.fromCharCode(64 + i) + rowNumber;
        cell.addEventListener("focus", onCellFocus);
        cell.addEventListener("input", onFormChange);
    }
    mainContainer.appendChild(row);
}

function buildMainSection() {
    for (let i = 1; i <= rows; i++) {
        createRow(i);
    }
}

createHeaderCells();
createSerialNumberCells();
buildMainSection();