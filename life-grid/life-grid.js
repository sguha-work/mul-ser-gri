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
		common,
		addResourceToPage,
		startInjectingData;

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

	/**
	* @description - This method add resource files to the page
	*/
	addResourceToPage = (function() {
		var head,
			link;
	    head  = document.getElementsByTagName('head')[0];
	    link  = document.createElement('link');
	    link.rel  = 'stylesheet';
	    link.type = 'text/css';
	    link.href = 'life-grid/template/css/style.css';
	    link.media = 'all';
	    head.appendChild(link);
	});	

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
		rowHTML = '<div class="db-table-data"><table role="data-table"><tbody><colgroup><col style="width:20%"><col style="width:30%"><col style="width:30%"><col style="width:20%"></colgroup>';	
		for(rowIndex=0; rowIndex<numberOfRows; rowIndex++) {
			rowHTML += '<tr role="row">';
			for(columnIndex=0; columnIndex<numberOfColumns; columnIndex++) {
				rowHTML += '<td role="cell"><div class="customer-img"><img src="images/rahul.jpg" width="" height="" alt="Rahul Kumar"></div><div class="cusotmer-name">';
			}
			rowHTML += '</tr>';
		}
		rowHTML += '</tbody></table></div>';
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
		headerHTML = '<div class="db-table-header"><table role="table-header"><tbody><colgroup><col style="width:20%"><col style="width:30%"><col style="width:30%"><col style="width:20%"></colgroup><tr>';
		for(var index in headers) {
			headerHTML += '<td><a href="#">' + headers[index] + ' <span class="db-icon db-icon-up"></span></a></td>';
		}
		
		headerHTML += "</tr></tbody></table></div>";
		return headerHTML;	
	});

	/**
	* @description - This function prepare the table caption
	* @return {String} - Caption HTML
	*/
	prepareTableCaption = (function() {
		var captionHTML;
		captionHTML = '<div class="db-table-wrapper"><div class="db-table-caption"><h1 class="table-caption">FusionCharts Data Table</h1><p class="small">Drag a column header and drop it here to group by that column</p></div><div class="db-table-header">';
		return captionHTML;
	});

	/**
	* @description - This function prepare the table footer (search option, pagination)
	* @return {String} - Caption HTML
	*/
	prepareTableFooter = (function() {
		var footerHTML;
		footerHTML = '<div class="db-table-footer"><div class="db-pagination-wrapper"><a href="#" title="Go to the first page" class="page-link page-link-first"><span class="db-icon db-icon-left-arrow-first">Go to the first page</span></a><a href="#" title="Go to the previous page" class="page-link page-link-nav" ><span class="db-icon db-icon-left-arrow-previous">Go to the previous page</span></a><ul class="db-pagination"><li><a href="#" class="page-link">1</a></li><li><a href="#" class="page-link">2</a></li><li><a href="#" class="page-link">3</a></li><li><a href="#" class="page-link">4</a></li><li><span class="page-link-selected">5</span></li><li><a href="#" class="page-link" title="More pages">...</a></li></ul><a href="#" title="Go to the next page" class="page-link page-link-nav" ><span class="db-icon db-icon-left-arrow-next">Go to the next page</span></a><a href="#" title="Go to the last page" class="page-link page-link-last" ><span class="db-icon db-icon-right-arrow-last">Go to the last page</span></a></div><div class="db-search-wrapper"><input type="text" class="search"><input type="submit" value="Search" class="button"></div><div class="db-page-info-wrapper"><span class="db-page-info">91 - 91 of 91 items</span><a href="#" class="page-link"><span class="db-icon db-icon-reload"></span></a></div></div></div>';
		return footerHTML;
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
	* @description - This method start injecting the data inside the grid
	*/
	startInjectingData = (function() {

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
			gridHTML += prepareTableHeader(dataForGrid[0].data.label);	
			gridHTML += prepareRowOfTable(dataForGrid[0].data.value.length, attributes.pagination.dataPerPage);
			gridHTML += prepareTableFooter();
			prepareDOM(gridHTML);
			startAttachingAttribute();
			startBindingEvents();
			startInjectingData();

		} else { // for multiseriese
			gridHTML = "";
			for(dataGridIndex in dataForGrid) {
				gridHTML += prepareTableCaption();
				gridHTML += prepareTableHeader(dataForGrid[dataGridIndex].data.label);	
				gridHTML += prepareRowOfTable(dataForGrid[dataGridIndex].data.value.length, attributes.pagination.dataPerPage);
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
			addResourceToPage();
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