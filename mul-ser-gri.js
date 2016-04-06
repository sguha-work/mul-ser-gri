"use strict"
var LifeGrid = (function() {
	// private properties
	var attributes, //{Object} holds all the setting attributes of grid
		checkArgumentsForError, //{Function} check wheather provided arguments are alright or not
		apiMethods, // {Object} holds all the API methods mainly getter setter methods for all attributes
		startRenderingTheGrid,
		dataForGrid,
		gridId,
		gridContainer,
		prepareTableHeader,
		prepareRowOfTable,
		prepareDOM,
		startAttachingAttribute,
		startBindingEvents,
		prepareTableCaption,
		prepareTableFooter,
		userGivenAttributes,
		common;

	// public properties
	this.initialize; // This function is the constructor of LifeGrid
	this.render; // Render the grid inside container
	this.api; // {Object} holds all the api methods

	attributes = {
		style: {
			border: "solid", // {String}, border of the table
			borderWidth: 0, // {Number}, width of the border
			borderColor: "" //{String}, color code of the border
		},
		caption: {
			captionColor: [], // Color of the caption
			captionFillColor: [], // Background color of caption holding DOM
			captionFont: "", // Font of caption
			captionFontSize: "", // Font size of caption
			captionFontStyle: "", // Font style of caption Bold/Italics/Underline
			captionHoverColor: [], // Color of the caption when mouse hoover occures
			captionHoverFillColor: [], // Color of the caption background when mouse hoover occurs

			subCaptionColor: [],
			subCaptionFillColor: [],
			subCaptionFont: "",
			subCaptionFontSize: "",
			subCaptionFontStyle: "",
			subCaptionHoverColor: [],
			subClaptionHoverFillColor: []
		},

		heading: {
			headingColor: [], // colors of the heading, will be repeted
			headingFillColor: [], // background colors of heading, will be repeted
			headingFont: "", // heading font
			headingFontSize: "", // heading font size
			headingFontStyle: "" // heading font style Bold/Italics/Underline
		},

		pagination: {
			dataPerPage: 20
		}

	}

	// common is the core object holding basic functionalities
	common = {};
	
	/**
	* @description - Merge the properties of two object
	* @param object1 {Object} - First and parent object
	* @param object2 {Object} - Second and child object
	* @return {Object} - The final object injected properties of child to parent
	*/
	common.mergeObject = (function(object1, object2) {
		var object1Keys,
			globalAttributeKeyIndex,
			childAttributeKeys,
			childAttributeKeyIndex;
		
		object1Keys = Object.keys(object1);
		for(globalAttributeKeyIndex in object1Keys) {
			childAttributeKeys = Object.keys(object1[object1Keys[globalAttributeKeyIndex]]);
			for(childAttributeKeyIndex in childAttributeKeys) {
				if(typeof object2[object1Keys[globalAttributeKeyIndex]] != "undefined" && typeof object2[object1Keys[globalAttributeKeyIndex]][childAttributeKeys[childAttributeKeyIndex]] != "undefined") {
					if(typeof object2[object1Keys[globalAttributeKeyIndex]][childAttributeKeys[childAttributeKeyIndex]] == typeof object1[object1Keys[globalAttributeKeyIndex]][childAttributeKeys[childAttributeKeyIndex]]) {
						object1[object1Keys[globalAttributeKeyIndex]][childAttributeKeys[childAttributeKeyIndex]] = object2[object1Keys[globalAttributeKeyIndex]][childAttributeKeys[childAttributeKeyIndex]];
					} else {
						// the data provided as attribute value is not valid
					}
				}
			}
		}
		return object1;
	});

	/**
	* @description - This function prepare rows for data
	* @param numberOfRows {Number} - Number of rows
	* @param numberOfColoumns {Number} - Number of columns
	* @return {Boolean} - The table row html
	*/
	prepareRowOfTable = (function(numberOfRows, numberOfColumns) {
		var rowIndex,
			rowHTML,
			columnIndex;
		rowHTML = "";	
		for(rowIndex=0; rowIndex<numberOfRows; rowIndex++) {
			rowHTML += "<tr>";
			for(columnIndex=0; columnIndex<numberOfColumns; columnIndex++) {
				rowHTML += "<td></td>";
			}
			rowHTML += "</tr>";
		}
		return rowHTML; 
	});

	/**
	* @description - This function prepare the table header
	* @param headers {Array} - Array of Strings
	* @return {Boolean} - The table header html
	*/
	prepareTableHeader = (function(headers) {
		var index, 
			headerHTML;
		headerHTML = "<tr>";
		for(var index in headers) {
			headerHTML += "<th>" + headers[index] + "</th>";
		}
		
		headerHTML += "</tr>";
		return headerHTML;	
	});

	/**
	* @description - This function prepare the table caption
	* @return {String} - Caption HTML
	*/
	prepareTableCaption = (function() {
		return "";
	});

	/**
	* @description - This function prepare the table footer (search option, pagination)
	* @return {String} - Caption HTML
	*/
	prepareTableFooter = (function() {
		return "";
	});


	/**
	* @description - This function prepare the dom element from html string and attach it with page hiddenly
	* @param gridHTML {String} - The html string
	*/
	prepareDOM = (function(gridHTML) {
		if(document.getElementById(gridContainer)) {
			document.getElementById(gridContainer).innerHTML = gridHTML;
		} else if(document.getElementsByClassName(gridContainer)) {
			document.getElementsByClassName(gridContainer)[0].innerHTML = gridHTML;
		}
	});

	/**
	* @description - Begins attaching attribute (both default and user given) to the grid
	*/
	startAttachingAttribute = (function() {
		
		// merging user given attributes to main attribute
		attributes = common.mergeObject(attributes, userGivenAttributes);
		console.log(attributes);
	});

	/**
	* @description - Begins binding various predefined events to the grid
	*/
	startBindingEvents = (function() {

	});

	/**
	* @description - From this function the rendering begins
	*/
	startRenderingTheGrid = (function() {
		var gridHTML,
			dataKeys,
			dataKeyIndex,
			dataGridIndex;

		if(Array.isArray(dataForGrid) && dataForGrid.length == 1) {// For single seriese
			gridHTML = prepareTableCaption();
			gridHTML += "<table style='display:none'>";
			gridHTML += prepareTableHeader(dataForGrid[0].data.label);	
			gridHTML += prepareRowOfTable(dataForGrid[0].data.value.length, attributes.pagination.dataPerPage);
			gridHTML += "</table>";
			gridHTML += prepareTableFooter();
			prepareDOM(gridHTML);
			startAttachingAttribute();
			startBindingEvents();
			

		} else { // for multiseriese
			gridHTML = "";
			for(dataGridIndex in dataForGrid) {
				gridHTML += prepareTableCaption();
				gridHTML += "<table style='display:none'>";	
				gridHTML += prepareTableHeader(dataForGrid[dataGridIndex].data.label);	
				gridHTML += prepareRowOfTable(dataForGrid[dataGridIndex].data.value.length, attributes.pagination.dataPerPage);
				gridHTML += "</table>";
				gridHTML += prepareTableFooter();
			}
			prepareDOM(gridHTML);
			startAttachingAttribute();
			startBindingEvents();
		}

		console.log(gridHTML);
	});

	/**
	* @description - Check all the provided arguments to initialize the grid are alright or not
	* @param values {Array} - The argument values
	* @return {Boolean} - true/false
	*/
	checkArgumentsForError = (function(values) {
		return true;
	});

	/**
	* @description - This function is the constructor of LifeGrid
	* @param gridId {String} - The unique id of grid
	* @param containerId {String} - The container DOM id where the grid is going to be populated
	* @param attributes {Object} - The attributes object, defines all settings
	* @param data {Object/Array} - The data which is going to be displayed in grid
	* @return {Number} - The number of effected rows
	*/
	this.initialize = (function(values) {
		if(checkArgumentsForError(values)) {
			gridId = values[0]; 
			gridContainer = values[1]; 
			userGivenAttributes = values[2];
			dataForGrid = values[3];
			return true;
		}
		return false;
	})(arguments);

	/**
	* @description - Render the grid inside container
	*/
	this.render = (function() {
		startRenderingTheGrid();
	});
}),
LG = LifeGrid;