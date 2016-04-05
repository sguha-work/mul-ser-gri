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
		plotDataOnTable;

	// public properties
	this.initialize; // This function is the constructor of LifeGrid
	this.render; // Render the grid inside container
	this.api; // {Object} holds all the api methods

	attributes = {
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

	/**
	* @description - This function prepare rows for data
	* @param data {Array} - Array of objects, optional, provided only for multiseries
	* @return {Boolean} - The table header html
	*/
	plotDataOnTable = (function(startIndex, endIndex, data) {
		var index,
			rawHTML;
		rawHTML = "";	
		if(typeof data == "undefined") {
			for(index=startIndex; index<=endIndex; index++) {
				rawHTML += "<"
			}
		} else {

		}
	});

	/**
	* @description - This function prepare the table header
	* @param data {Array} - Array of objects, optional, provided only for multiseries
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

	startRenderingTheGrid = (function() {
		var gridHTML,
			dataKeys,
			dataKeyIndex;

		if(Array.isArray(dataForGrid)) {// For single seriese
			gridHTML = "<table>";
			gridHTML += prepareTableHeader(dataForGrid[0].data.label);	console.log(gridHTML);
			gridHTML += plotDataOnTable(0, (attributes.pagination.dataPerPage-1));

		} else { // for multiseriese
			dataKeys = Object.keys(dataForGrid);
			for(dataKeyIndex in dataKeys) {

			}
		}

		
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