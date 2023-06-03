/**
 * @fileOverview  Defines utility procedures/functions   
 * @author Gerd Wagner
 */
/**
* Verifies if a value represents an integer
* @param {string} x
* @return {boolean}
*/
function isNonEmptyString(x) {
  return typeof(x) === "string" && x.trim() !== "";
}

/**
 * Checks if a given value is a positive integer.
 * @param {*} value - The value to be checked.
 * @returns {boolean} Returns true if the value is a positive integer, otherwise false.
 */
function isPositiveInteger(value) {
  console.log(value);
  return Number.isInteger(parseInt(value)) && value > 0;
}



/**
 * * Create a choice control (radio button or checkbox) element
 *
 * @param {string} t  The type of choice control ("radio" or "checkbox")
 * @param {string} n  The name of the choice control input element
 * @param {string} v  The value of the choice control input element
 * @param {string} lbl  The label text of the choice control
 * @return {object}
 */
function createLabeledChoiceControl( t,n,v,lbl) {
  var ccEl = document.createElement("input"),
      lblEl = document.createElement("label");
  ccEl.type = t;
  ccEl.name = n;
  ccEl.value = v;
  lblEl.appendChild( ccEl);
  lblEl.appendChild( document.createTextNode( lbl));
  return lblEl;
}

/**
 * Create a choice widget in a given fieldset element.
 * A choice element is either an HTML radio button or an HTML checkbox.
 * @method
 */
function createChoiceWidget( containerEl, fld, values,
                             choiceWidgetType, choiceItems, isMandatory) {
  const choiceControls = containerEl.querySelectorAll("label");
  // remove old content
  for (const j of choiceControls.keys()) {
    containerEl.removeChild( choiceControls[j]);
  }
  if (!containerEl.hasAttribute("data-bind")) {
    containerEl.setAttribute("data-bind", fld);
  }
  // for a mandatory radio button group initialze to first value
  if (choiceWidgetType === "radio" && isMandatory && values.length === 0) {
    values[0] = 1;
  }
  if (values.length >= 1) {
    if (choiceWidgetType === "radio") {
      containerEl.setAttribute("data-value", values[0]);
    } else {  // checkboxes
      containerEl.setAttribute("data-value", "["+ values.join() +"]");
    }
  }
  for (const j of choiceItems.keys()) {
    // button values = 1..n
    const el = createLabeledChoiceControl( choiceWidgetType, fld,
        j+1, choiceItems[j]);
    // mark the radio button or checkbox as selected/checked
    if (values.includes(j+1)) el.firstElementChild.checked = true;
    containerEl.appendChild( el);
    el.firstElementChild.addEventListener("click", function (e) {
      const btnEl = e.target;
      if (choiceWidgetType === "radio") {
        if (containerEl.getAttribute("data-value") !== btnEl.value) {
          containerEl.setAttribute("data-value", btnEl.value);
        } else if (!isMandatory) {
          // turn off radio button
          btnEl.checked = false;
          containerEl.setAttribute("data-value", "");
        }
      } else {  // checkbox
        let values = JSON.parse( containerEl.getAttribute("data-value")) || [];
        let i = values.indexOf( parseInt( btnEl.value));
        if (i > -1) {
          values.splice(i, 1);  // delete from value list
        } else {  // add to value list
          values.push( btnEl.value);
        }
        containerEl.setAttribute("data-value", "["+ values.join() +"]");
      }
    });
  }
  return containerEl;
}

/**
 * Checks if a string is longer than 120 characters.
 *
 * @param {string} inputString - The string to be checked.
 * @return {boolean} - Returns true if the string is longer than 120 characters, otherwise false.
 */
function isStringLengthGreaterThan120(inputString) {
  // Check if the length of the input string is greater than 120
  if (inputString.length > 120) {
    // If the length is greater than 120, return true
    return true;
  } else {
    // Otherwise, return false
    return false;
  }
}

/**
* Verifies if a value represents an integer or integer string
* @param {string} x
* @return {boolean}
*/
function isIntegerOrIntegerString(x) {
  return typeof(x) === "number" && Number.isInteger(x) ||
      typeof(x) === "string" && x.search(/^-?[0-9]+$/) === 0;
}
/**
* Creates a typed "data clone" of an object
* @param {object} obj
*/
function cloneObject(obj) {
  var clone = Object.create( Object.getPrototypeOf(obj));
  for (var p in obj) {
    if (obj.hasOwnProperty(p) && typeof obj[p] != "object") {
      clone[p] = obj[p];
    }
  }
  return clone;
}

/**
 * Create a DOM option element
 *
 * @param {string} val
 * @param {string} txt
 * @param {string} classValues [optional]
 *
 * @return {object}
 */
function createOption( val, txt, classValues) {
  var el = document.createElement("option");
  el.value = val;
  el.text = txt || val;
  if (classValues) el.className = classValues;
  return el;
}

/**
 * Fill a select element with option elements created from a
 * map of objects
 *
 * @param {object} selectEl  A select(ion list) element
 * @param {object|array} selectionRange  A map of objects or an array list
 * @param {object} optPar [optional]  An optional parameter record including
 *     optPar.displayProp and optPar.selection
 */
function fillSelectWithOptions( selectEl, selectionRange, optPar) {
  // create option elements from object property values
  const options = Array.isArray( selectionRange) ? selectionRange :
      Object.keys( selectionRange);
  // delete old contents
  selectEl.innerHTML = "";
  // create "no selection yet" entry
  if (!selectEl.multiple) {
    selectEl.add(createOption(""," --- "));
  }
  for (const i of options.keys()) {
    let optionEl=null;
    if (Array.isArray( selectionRange)) {
      optionEl = createOption( i+1, options[i]);
      if (selectEl.multiple && optPar && optPar.selection &&
          optPar.selection.includes(i+1)) {
        // flag the option element with this value as selected
        optionEl.selected = true;
      }
    } else {
      const key = options[i];
      const obj = selectionRange[key];
      if (optPar && optPar.displayProp) {
        optionEl = createOption( key, obj[optPar.displayProp]);
      } else optionEl = createOption( key);
      // if invoked with a selection argument, flag the selected options
      if (selectEl.multiple && optPar && optPar.selection &&
          optPar.selection[key]) {
        // flag the option element with this value as selected
        optionEl.selected = true;
      }
    }
    selectEl.add( optionEl);
  }
}




export { isNonEmptyString, isStringLengthGreaterThan120, isIntegerOrIntegerString,
  cloneObject, fillSelectWithOptions, isPositiveInteger, createChoiceWidget, createOption };
