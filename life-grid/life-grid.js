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
		gridOperations,
		prepareGridContainerDOM,
		injectDataFromDataForGrid, // {Function} inject data to the grid
		addResourceToPage,
		startInjectingData,
		startIndexOfDisplayedData; //{Array} holds the start index of every grid's dislayed data

	// public properties
	this.initialize; // This function is the constructor of LifeGrid
	this.render; // Render the grid inside container
	this.api; // {Object} holds all the api methods

	attributes = {
		isAnimate: true,
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
			subCaptionHoverFillColor: []
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

	// gridOperations holds the functionality like search sort pagination on the grid
	gridOperations = {};

	/**
	* @description - This function prepare rows for data
	* @param searchText {String} - The text which will be searched
	* @param dataGridIndex {Number} - The 0 based index of grid
	* @param searchEntireData {Boolean} - If set then entire data will be searched rather than the displayed data
	* @return {Boolean} - The table row html
	*/
	gridOperations.searchGrid = (function(searchText, dataGridIndex, searchEntireData) {
		var flag;
		if(!searchEntireData) { // search only the displayed gridl
			if(searchText === "") {
				jQuery("table[data-grid-index='" + dataGridIndex + "'] tr", gridContainer).show();	
			}
			jQuery("table[data-grid-index='" + dataGridIndex + "'] tr", gridContainer).each(function() {
				jQuery("td", this).each(function(){
					if(jQuery.trim(jQuery(this).text()).indexOf(searchText) === -1) {
						if(attributes.isAnimate) {
							jQuery(this).parent().animate({"opacity": "0"}, 1000);
						} else {
							jQuery(this).parent().css({
								"opacity": "0"
							});
						}
					} else {
						jQuery(this).parent().css({
							"opacity": "1"
						});
					}
				});
			});
		}	
	});

	/**
	* @description - This function prepare rows for data
	* @param numberOfRows {Number} - Number of rows
	* @param numberOfColoumns {Number} - Number of columns
	* @param dataGridIndex {Number} - 0 based index of the grid
	* @return {Boolean} - The table row html
	*/
	prepareRowOfTable = (function(numberOfRows, numberOfColumns, dataGridIndex) {
		var rowIndex,
			rowHTML,
			columnIndex;
		rowHTML = '<div class="db-table-data"><table data-grid-index="' + dataGridIndex + '" class="data-table" role="data-table"><tbody><colgroup><col style="width:20%"><col style="width:30%"><col style="width:30%"><col style="width:20%"></colgroup>';	
		for(rowIndex=0; rowIndex<numberOfRows; rowIndex++) {
			rowHTML += '<tr role="row">';
			for(columnIndex=0; columnIndex<numberOfColumns; columnIndex++) {
				rowHTML += '<td role="cell"><div class="cell-data"></div></td>';
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
			headerHTML += '<td><a class="header" href="#">' + headers[index] + ' <span class="db-icon db-icon-up"></span></a></td>';
		}
		
		headerHTML += "</tr></tbody></table></div>";
		return headerHTML;	
	});

	/**
	* @description - This function prepare the table caption
	* @return {String} - Caption HTML
	*/
	prepareTableCaption = (function(dataGridIndex) {
		var captionHTML;
		captionHTML = '<div class="db-table-wrapper">';
		if(typeof dataForGrid[dataGridIndex].caption != "undefined") {
			captionHTML += '<div class="db-table-caption"><h1 class="table-caption">'+dataForGrid[dataGridIndex].caption+'</h1>';
		}
		if(typeof dataForGrid[dataGridIndex].subCaption != "undefined") {
			captionHTML += '<p class="small">' + dataForGrid[dataGridIndex].subCaption + '</p>';
		}
		captionHTML += '</div><div class="db-table-header">';
		return captionHTML;
	});

	/**
	* @description - This function prepare the table footer (search option, pagination)
	* @param gridIndex {Number} - The index of the grid, always 0 for Single seriese
	* @return {String} - Caption HTML
	*/
	prepareTableFooter = (function(gridIndex) {
		var footerHTML,
			totalNumberOfData,
			totalNumberOfPages,
			pageNumberHTML,
			pageIndex,
			dataStartIndex,
			dataEndIndex,
			firstIndexOfDisplayedData,
			lastIndexOfDisplayedData;

		// pagination calculation
		totalNumberOfData = dataForGrid[gridIndex].data.value.length;
		totalNumberOfPages = (totalNumberOfData<attributes.pagination.dataPerPage)?1:((totalNumberOfData % attributes.pagination.dataPerPage)?(Math.floor((totalNumberOfData / attributes.pagination.dataPerPage))+1):(Math.floor((totalNumberOfData / attributes.pagination.dataPerPage))));
		pageNumberHTML = "";							
		
		for(pageIndex=1; pageIndex<=totalNumberOfPages; pageIndex++) {
			dataStartIndex = ((pageIndex-1)*attributes.pagination.dataPerPage);
			dataEndIndex = dataStartIndex +  attributes.pagination.dataPerPage -1;
			if(pageIndex <= 5) {
				pageNumberHTML += '<li><a data-page-index="'+pageIndex+'" data-start-index="' + dataStartIndex + '" data-end-index="' + dataEndIndex + '" href="#page='+pageIndex+'" class="page-link">' + pageIndex + '</a></li>';
			} else {
				if(pageIndex == 6) {
					pageNumberHTML += '<li><aclass="page-link"  title="More pages">......</a></li>';					
				}
				pageNumberHTML += '<li style="display:none"><a data-page-index="'+pageIndex+'" data-start-index="' + dataStartIndex + '" data-end-index="' + dataEndIndex + '" href="#page='+pageIndex+'" class="page-link">' + pageIndex + '</a></li>';				
			}
		}

		// page info calculation
		if(totalNumberOfData < attributes.pagination.dataPerPage) {
			firstIndexOfDisplayedData = 1;
			lastIndexOfDisplayedData = totalNumberOfData;
		} else {
			firstIndexOfDisplayedData = "";
			lastIndexOfDisplayedData = "";
		}

		footerHTML = '<div class="db-table-footer"><div class="db-pagination-wrapper"><a href="#" title="Go to the first page" class="page-link page-link-first"><span class="db-icon db-icon-left-arrow-first">Go to the first page</span></a><a href="#" title="Go to the previous page" class="page-link page-link-nav" ><span class="db-icon db-icon-left-arrow-previous">Go to the previous page</span></a><ul class="db-pagination">' + pageNumberHTML + '</ul><a href="#" title="Go to the next page" class="page-link page-link-nav" ><span class="db-icon db-icon-left-arrow-next">Go to the next page</span></a><a href="#" title="Go to the last page" class="page-link page-link-last" ><span class="db-icon db-icon-right-arrow-last">Go to the last page</span></a></div><div class="db-search-wrapper"><input type="checkbox"><label> Search entire data </label><input type="text" class="search"><input data-grid-index="' + gridIndex + '" type="submit" value="Search" class="button"></div><div class="db-page-info-wrapper"><span class="db-page-info"><label>' + firstIndexOfDisplayedData + '</label> - <label>' + lastIndexOfDisplayedData + '</label> of ' + totalNumberOfData + ' items</span><a href="#" class="page-link"><span class="db-icon db-icon-reload"></span></a></div></div></div>';
		return footerHTML;
	});


	/**
	* @description - This function prepare the dom element from html string and attach it with page hiddenly
	* @param gridHTML {String} - The html string
	*/
	prepareDOM = (function(gridHTML) {
		gridContainer.innerHTML = gridHTML;
	});

	/**
	* @description - Begins attaching attribute (both default and user given) to the grid
	*/
	startAttachingAttribute = (function() {
		// merging user given attributes to main attribute
		attributes = common.mergeObject(attributes, userGivenAttributes);
		
	});

	/**
	* @description - Begins binding various predefined events to the grid
	*/
	startBindingEvents = (function() {
		// Attaching search event
		jQuery("input[value='Search']",gridContainer).on('click', function() {
			if(jQuery(this).prev().prev().prev().is(":checked")) {
				gridOperations.searchGrid(jQuery.trim(jQuery(this).prev().val()), parseInt(jQuery(this).attr('data-grid-index')), 1);
			} else {
				gridOperations.searchGrid(jQuery.trim(jQuery(this).prev().val()), parseInt(jQuery(this).attr('data-grid-index')), 0);	
			}
		});
		jQuery("input[value='Search']",gridContainer).prev().on('change', function() {console.log("x");
			if(jQuery(this).prev().prev().is(":checked")) {
				gridOperations.searchGrid(jQuery.trim(jQuery(this).val()), parseInt(jQuery(this).next().attr('data-grid-index')), 1);
			} else {
				gridOperations.searchGrid(jQuery.trim(jQuery(this).val()), parseInt(jQuery(this).next().attr('data-grid-index')), 0);	
			}
		})


	});

	/**
	* @description - This method inject data into grid
	* @param startIndex {Number} - 0 based start index of data
	* @param endIndex {Number} - 0 based end index of data
	* @param dataGridIndex {Number} - 0 based end index of dataGrid, always 0 for single seriese
	*/
	injectDataFromDataForGrid = (function(startIndex, endIndex, dataGridIndex) {
		var dataIndex, 
			isId,
			tableDOM,
			setDataToCell;

		setDataToCell = (function(tableDOM, dataGridIndex) {
			var dataRowIndex,
				tr,
				dataIndex,
				dataHTML;
			for(dataRowIndex in dataForGrid[dataGridIndex].data.value) {
				tr = jQuery("tr",tableDOM).eq(dataRowIndex);
				for(dataIndex in dataForGrid[dataGridIndex].data.value[dataRowIndex]) {
					dataHTML = "";
					if(typeof dataForGrid[dataGridIndex].data.value[dataRowIndex][dataIndex] == "object") {
						if(typeof dataForGrid[dataGridIndex].data.value[dataRowIndex][dataIndex]["image"] != "undefined") {
							dataHTML += '<div class="customer-img"><img src="' + dataForGrid[dataGridIndex].data.value[dataRowIndex][dataIndex]["image"] + '" width="" height="" alt="Indranil"></div>';
						}
						if(typeof dataForGrid[dataGridIndex].data.value[dataRowIndex][dataIndex]["text"] != "undefined") {
							dataHTML += '<div class="customer-text">' + dataForGrid[dataGridIndex].data.value[dataRowIndex][dataIndex]["text"] + '</div>';
						}
						
					} else {
						dataHTML += '<div class="customer-text">' + dataForGrid[dataGridIndex].data.value[dataRowIndex][dataIndex] + '</div>';
					}
					jQuery("div.cell-data", tr).eq(dataIndex).html(dataHTML);
				}
			}
		});	

		tableDOM = jQuery("table.data-table", gridContainer).eq(dataGridIndex);
		
		if(attributes.isAnimate) {
			jQuery("div.cell-data", tableDOM).hide(1000, function() {
				jQuery("div.cell-data", tableDOM).css({
					"display": "block",
					"visibility": "hidden"
				});
				setDataToCell(tableDOM, dataGridIndex);
				jQuery("div.cell-data", tableDOM).css({
					"visibility": "visible"
				});
			});
		} else {
			setDataToCell(tableDOM, dataGridIndex);
		}

		
	});

	/**
	* @description - This method start injecting the data inside the grid
	* @param startIndex {Number} - 0 based start index
	* @param endIndex {Number} - 0 based end index
	* @param dataGridIndex {Number} - 0 based end index of dataGrid, always 0 for single seriese
	*/
	startInjectingData = (function(startIndex, endIndex, dataGridIndex) {
		startIndexOfDisplayedData = startIndex;
		injectDataFromDataForGrid(startIndex, endIndex, dataGridIndex);
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
			gridHTML = prepareTableCaption(0);
			gridHTML += prepareTableHeader(dataForGrid[0].data.label);	
			gridHTML += prepareRowOfTable(dataForGrid[0].data.value.length, dataForGrid[0].data.value[0].length, 0);
			gridHTML += prepareTableFooter(0);
			prepareDOM(gridHTML);
			startAttachingAttribute();
			startBindingEvents();
			startInjectingData(0, (attributes.pagination.dataPerPage-1), 0);

		} else { // for multiseriese
			gridHTML = "";
			for(dataGridIndex in dataForGrid) {
				gridHTML += prepareTableCaption(dataGridIndex);
				gridHTML += prepareTableHeader(dataForGrid[dataGridIndex].data.label);	
				gridHTML += prepareRowOfTable(dataForGrid[dataGridIndex].data.value.length, dataForGrid[dataGridIndex].data.value[0].length, dataGridIndex);
				gridHTML += prepareTableFooter(dataGridIndex);
			}
			prepareDOM(gridHTML);
			startAttachingAttribute();
			startBindingEvents();
			for(dataGridIndex in dataForGrid) {
				startInjectingData(0, (attributes.pagination.dataPerPage-1), dataGridIndex);
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
	* @description - Prepare the grid container DOM from identity
	* @param containerText {String} - The identity of the DOM element
	* @return {Object} - DOM object javascript
	*/
	prepareGridContainerDOM = (function(containerText) {
		if(document.getElementById(containerText)) {
			return document.getElementById(containerText);
		} else if(document.getElementsByClassName(containerText)[0]){
			return document.getElementsByClassName(containerText)[0];
		} else {
			return document.querySelector(containerText)[0];
		}
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
			gridContainer = prepareGridContainerDOM(values[1]); 
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