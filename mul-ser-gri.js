"use strict"
var LifeGrid = (function() {
	// private properties
	var attributes, //{Object} holds all the setting attributes of grid
		checkArgumentsForError, //{Function} check wheather provided arguments are alright or not
		apiMethods; // {Object} holds all the API methods mainly getter setter methods for all attributes
	// public properties
	this.initialize; // This function is the constructor of LifeGrid
	this.render; // Render the grid inside container
	this.api; // {Object} holds all the api methods

	attributes = {
		caption: {
			captionText: "",// The text of the caption
			captionColor: "", // Color of the caption
			captionFilleColor: "", // Background color of caption holding DOM
			captionFont: "", // Font of caption
			captionFontSize: "", // Font size of caption
			captionFontStyle: "", // Font style of caption Bold/Italics/Underline
			captionHoverColor: "", // Color of the caption when mouse hoover occures
			captionHoverFillColor: "", // Color of the caption background when mouse hoover occurs

			subCaptionText: "",
			subCaptionColor: "",
			subCaptionFilleColor: "",
			subCaptionFont: "",
			subCaptionFontSize: "",
			subCaptionFontStyle: ""
			subCaptionHoverColor: "",
			subClaptionHoverFillColor: "",
		},

		heading: {
			headingColor: [], // colors of the heading, will be repeted
			headingFillColor: [], // background colors of heading, will be repeted
			headingFont: "", // heading font
			headingFontSize: "", // heading font size
			headingFontStyle: "" // heading font style Bold/Italics/Underline
		}
	}

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
			return true;
		}
		return false;
	})(arguments);

	/**
	* @description - Render the grid inside container
	*/
	this.render = (function() {

	});
}),
LG = LifeGrid;