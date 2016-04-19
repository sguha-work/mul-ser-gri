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
		startAttachingInitialAttributes,
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
		startIndexOfDisplayedData, //{Array} holds the start index of every grid's dislayed data
		endIndexOfDisplayedData, //{Array} holds the end index of every grid's dislayed data
		setDataToCell,
		dataToDOM,// {Object} holds the methods to convert data to DOM
		attributeMethods, // {Object holds the methods to set or get attribute}
		startAttachingOtherAttributes;

	// public properties
	this.initialize; // This function is the constructor of LifeGrid
	this.render; // Render the grid inside container
	this.setGridStyle; // This function set the grid style
	this.getGridStyle;// This function returns the present style object of the grid

	attributes = {
		isAnimate: true,
		style: {
			border: "solid", // {String}, border of the table
			borderWidth: 0, // {Number}, width of the border
			borderColor: "" //{String}, color code of the border
		},
		caption: {
			captionColor: ["A77B6D"], // Color of the caption
			captionFillColor: ["2B2243"], // Background color of caption holding DOM
			captionFont: "sans-serif", // Font of caption
			captionFontSize: "20px", // Font size of caption
			captionFontStyle: "normal", // Font style of caption Bold/Italics/Underline
			captionHoverColor: [], // Color of the caption when mouse hoover occures
			captionHoverFillColor: [], // Color of the caption background when mouse hoover occurs

			subCaptionColor: ["A77B6D"],
			subCaptionFillColor: ["2B2243"],
			subCaptionFont: "sans-serif",
			subCaptionFontSize: "11px",
			subCaptionFontStyle: "normal",
			subCaptionHoverColor: [],
			subCaptionHoverFillColor: []
		},

		heading: {
			headingColor: ["757578"], // colors of the heading, will be repeted
			headingFillColor: ["EDEDED"], // background colors of heading, will be repeted
			headingFont: "sans-serif", // heading font
			headingFontSize: "15px", // heading font size
			headingFontStyle: "normal" // heading font style Bold/Italics
		},

		pagination: {
			dataPerPage: 20
		}

	};

	attributeMethods = {
		setStyle: function(styleObject) {
			attributes.style = styleObject; 
			jQuery("table[data-grid-index]", gridContainer).css(attributes.style);
		},

		getStyle: function() {
			return attributes.style;
		},

		setCpationStyle: function(captionStyleObject) {
			var colorIndex;
			colorIndex = 0;
			attributes.caption = captionStyleObject;
			if(typeof attributes.caption.captionColor !== "undefined") {
				jQuery(".table-caption", gridContainer).each(function() {
					if(typeof attributes.caption.captionColor[colorIndex] === "undefined") {
						colorIndex = 0;
					}
					jQuery(this).css({
						"color": attributes.caption.captionColor[colorIndex]
					});
					colorIndex += 1;
				});
			}

			colorIndex = 0;
			if(typeof attributes.caption.captionFillColor !== "undefined") {
				jQuery(".table-caption", gridContainer).each(function() {
					if(typeof attributes.caption.captionColor[colorIndex] === "undefined") {
						colorIndex = 0;
					}
					jQuery(this).css({
						"background-color": attributes.caption.captionColor[colorIndex]
					});
					colorIndex += 1;
				});		
			}			
		}
	};

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

	// This object holds the methods which converts data to DOM
	dataToDOM = {};

	/**
	* @description - Prepare text to displayble DOM
	* @param data {Object/String} - The data which is going to be displayed
	* @returns {String} - The data encapsulated in HTML
	*/
	dataToDOM.prepareText = (function(data) {
		var html;
		html = '<div class="customer-text">' + data + '</div>';
		return html;
	});

	/**
	* @description - Prepare image to displayble DOM
	* @param data {Object/String} - The data which is going to be displayed
	* @returns {String} - The data encapsulated in HTML
	*/
	dataToDOM.prepareImage = (function(data) {
		var dataHTML;
		dataHTML = "";
		dataHTML = '<div class="customer-img"><img src="' + data + '" width="" height="" alt=""></div>';
		return dataHTML;
	});

	/**
	* @description - Prepare object to displayble DOM
	* @param data {Object/String} - The data which is going to be displayed
	* @returns {String} - The data encapsulated in HTML
	*/
	dataToDOM.prepareObject = (function(data) {
		var dataHTML;
		dataHTML = "";
		if(typeof data["image"] != "undefined") {
			dataHTML += dataToDOM.prepareImage(data["image"]);
		}
		if(typeof data["text"] != "undefined") {
			dataHTML += dataToDOM.prepareText(data["text"]);
		}
		return dataHTML;
	});

	// gridOperations holds the functionality like search sort pagination on the grid
	gridOperations = {};

	/**
	* @description - This function make all the row opacity 1
	* @param gridIndex {Number} - 0 based index of grid
	*/
	gridOperations.showAllRow = (function(gridIndex) {
		jQuery("table[data-grid-index='"+gridIndex+"'] tr", gridContainer).css({
			"opacity": "1"
		});
	});

	/**
	* @description - This function prepare rows for data
	* @param searchText {String} - The text which will be searched
	* @param dataGridIndex {Number} - The 0 based index of grid
	* @param searchEntireData {Boolean} - If set then entire data will be searched rather than the displayed data
	*/
	gridOperations.searchGrid = (function(searchText, dataGridIndex, searchEntireData) {
		var dataFoundFlag;
		if(!searchEntireData) { // search only the displayed gridl
			if(searchText === "") {
				jQuery("table[data-grid-index='" + dataGridIndex + "'] tr", gridContainer).css({
					"opacity": "1"
				});	
			}
			jQuery("table[data-grid-index='" + dataGridIndex + "'] tr", gridContainer).each(function() {
				dataFoundFlag = 0;
				jQuery("td", this).each(function(){
					if(jQuery.trim(jQuery(this).text()).toLowerCase().indexOf(jQuery.trim(searchText).toLowerCase()) != -1) {
						dataFoundFlag = 1;	
						return false;
					}
				});
				if(dataFoundFlag) {
					jQuery(this).css({
						"opacity": "1"
					});
				} else {
					jQuery(this).css({
						"opacity": "0"
					});
				}
			});
		}	
	});

	/**
	* @description - This function displays the specified page
	* @param gridIndex {Number} - The index of the grid
	* @param dataStartIndex {Number} - The 0 based index of grid
	* @param dataEndIndex {Number} - If set then entire data will be searched rather than the displayed data
	* @param pageNumber {Number} - If set then entire data will be searched rather than the displayed data
	*/
	gridOperations.moveToPage = (function(gridIndex, dataStartIndex, dataEndIndex, pageNumber){
		var pageInfoDOM;
		setDataToCell(jQuery("table[data-grid-index='"+gridIndex+"']", gridContainer)[0], gridIndex, dataStartIndex, dataEndIndex, pageNumber);

		if(typeof startIndexOfDisplayedData == "undefined") {
			startIndexOfDisplayedData = [];
		}
		if(typeof endIndexOfDisplayedData == "undefined") {
			endIndexOfDisplayedData = [];
		}
		
		// updating page info
		pageInfoDOM = jQuery(".db-page-info", gridContainer).eq(gridIndex);
		jQuery("label", pageInfoDOM).eq(0).text((dataStartIndex+1));
		if(dataEndIndex>dataForGrid[gridIndex].data.value.length-1) {
			dataEndIndex = dataForGrid[gridIndex].data.value.length-1;
		}
		jQuery("label", pageInfoDOM).eq(1).text((dataEndIndex+1));

		// setting up the displayed data indexes
		startIndexOfDisplayedData[gridIndex] = dataStartIndex;
		endIndexOfDisplayedData[gridIndex] = dataEndIndex;

	});

	/**
	* @description - This function controls the page set display
	* @param pageSetDOM {Object} - The DOM object
	* @param gridIndex {Number} - 0 based index of the grid
	*/
	gridOperations.movePageSet = (function(pageSetDOM, gridIndex) {
		var moveSetDirection,
			indexOfPresentPageSetDOM,
			indexOfPreviousPageSetDOM,
			indexOfNextPageSetDOM,
			paginationDOM,
			lengthOfPaginationLI;
		paginationDOM = jQuery(".db-pagination", gridContainer).eq(gridIndex)[0]; 	
		moveSetDirection = jQuery(pageSetDOM).attr('data-move-set-direction');
		lengthOfPaginationLI = jQuery("li", paginationDOM).length;
		indexOfPresentPageSetDOM = jQuery("li a", paginationDOM).index(pageSetDOM);
		if(moveSetDirection == "r") {
			jQuery(pageSetDOM).attr('data-move-set-direction', "l");
			indexOfNextPageSetDOM = indexOfPresentPageSetDOM + 6;
			jQuery("li a", paginationDOM).each(function(index) {
				if(index<indexOfPresentPageSetDOM) {
					jQuery(this).parent().hide();
				} else if(index>=indexOfPresentPageSetDOM && index<=(indexOfNextPageSetDOM+1) && index != (lengthOfPaginationLI-1)) {
					jQuery(this).parent().show();
				} else {
					return false;
				}
			});
		} else {
			jQuery(pageSetDOM).attr('data-move-set-direction', "r");
			indexOfPreviousPageSetDOM = indexOfPresentPageSetDOM - 6;
			jQuery("li a", paginationDOM).each(function(index) {
				if(index>=(indexOfPreviousPageSetDOM-1) && index<=indexOfPresentPageSetDOM) {
					jQuery(this).parent().show();
				} else {
					jQuery(this).parent().hide();
				}
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
			lastIndexOfDisplayedData,
			pageSetIndex,
			pageNumberFontWeight,
			currentPageFlag,// required to identify the current page
			pageSetIndexFlag; // requirred to hide page set index greater than 1

		// pagination calculation
		totalNumberOfData = dataForGrid[gridIndex].data.value.length;
		totalNumberOfPages = (totalNumberOfData<attributes.pagination.dataPerPage)?1:((totalNumberOfData % attributes.pagination.dataPerPage)?(Math.floor((totalNumberOfData / attributes.pagination.dataPerPage))+1):(Math.floor((totalNumberOfData / attributes.pagination.dataPerPage))));
		pageNumberHTML = "";							
		pageSetIndex = 0;
		pageSetIndexFlag = 0;
		for(pageIndex=1; pageIndex<=totalNumberOfPages; pageIndex++) {
			dataStartIndex = ((pageIndex-1)*attributes.pagination.dataPerPage);
			dataEndIndex = dataStartIndex +  attributes.pagination.dataPerPage -1;
			if(pageIndex == 1) {
				pageNumberFontWeight = "bolder";
				currentPageFlag = "true";
			} else {
				pageNumberFontWeight = "normal";
				currentPageFlag = false;
			}
			if(pageIndex <= 5) {
				pageNumberHTML += '<li><a data-is-current-page="'+currentPageFlag+'" style="font-weight:'+pageNumberFontWeight+'" data-page-index="'+pageIndex+'" data-start-index="' + dataStartIndex + '" data-end-index="' + dataEndIndex + '" href="#page='+pageIndex+'" class="page-link">' + pageIndex + '</a></li>';
			} else {
				if((pageIndex % 6) == 0) {
					if(!pageSetIndexFlag) {
						pageNumberHTML += '<li><a data-move-set-direction="r" data-page-set-index="'+pageSetIndex+'" class="page-link"  title="More pages" href="#">......</a></li>';					
						pageSetIndexFlag = 1;
					} else {
						pageNumberHTML += '<li style="display:none"><a data-move-set-direction="r" data-page-set-index="'+pageSetIndex+'" class="page-link"  title="More pages" href="#">......</a></li>';						
					}
					pageSetIndex += 1;
				}
				pageNumberHTML += '<li style="display:none; font-weight:'+pageNumberFontWeight+'"><a data-is-current-page="'+currentPageFlag+'" data-page-index="'+pageIndex+'" data-start-index="' + dataStartIndex + '" data-end-index="' + dataEndIndex + '" href="#page='+pageIndex+'" class="page-link">' + pageIndex + '</a></li>';				
			}
		}
		pageNumberHTML += '<li data-move-set-direction="r" style="display:none"><a data-page-set-index="'+pageSetIndex+'" class="page-link"  title="More pages" href="#">......</a></li>';
		
		footerHTML = '<div class="db-table-footer"><div class="db-pagination-wrapper"><a href="#" title="Go to the first page" class="page-link page-link-first"><span class="db-icon db-icon-left-arrow-first">Go to the first page</span></a><a href="#" title="Go to the previous page" class="page-link page-link-nav" ><span class="db-icon db-icon-left-arrow-previous">Go to the previous page</span></a><ul class="db-pagination">' + pageNumberHTML + '</ul><a href="#" title="Go to the next page" class="page-link page-link-nav" ><span class="db-icon db-icon-left-arrow-next">Go to the next page</span></a><a href="#" title="Go to the last page" class="page-link page-link-last" ><span class="db-icon db-icon-right-arrow-last">Go to the last page</span></a></div><div class="db-search-wrapper"><input type="checkbox"><label> Search entire data </label><input type="text" class="search"><input data-grid-index="' + gridIndex + '" type="submit" value="Search" class="button"></div><div class="db-page-info-wrapper"><span class="db-page-info"><label></label> - <label></label> of ' + totalNumberOfData + ' items</span><a href="#" class="page-link"><span class="db-icon db-icon-reload"></span></a></div></div></div>';
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
	startAttachingInitialAttributes = (function() {
		// merging user given attributes to main attribute
		attributes = common.mergeObject(attributes, userGivenAttributes);
	});

	/**
	* @description - Starts attaching other attributes which should be applied after populating the grid
	*/
	startAttachingOtherAttributes = (function() {
		attributeMethods.setStyle(attributes.style); // attaching styles
	});

	/**
	* @description - Begins binding various predefined events to the grid
	*/
	startBindingEvents = (function() {
		// Attaching search event
		jQuery("input[value='Search']", gridContainer).on('click', function() {
			if(jQuery(this).prev().prev().prev().is(":checked")) {
				gridOperations.searchGrid(jQuery.trim(jQuery(this).prev().val()), parseInt(jQuery(this).attr('data-grid-index')), 1);
			} else {
				gridOperations.searchGrid(jQuery.trim(jQuery(this).prev().val()), parseInt(jQuery(this).attr('data-grid-index')), 0);	
			}
		});
		
		jQuery("input[value='Search']", gridContainer).prev().on('change keyup paste', function() {
			if(jQuery(this).prev().prev().is(":checked")) {
				gridOperations.searchGrid(jQuery.trim(jQuery(this).val()), parseInt(jQuery(this).next().attr('data-grid-index')), 1);
			} else {
				gridOperations.searchGrid(jQuery.trim(jQuery(this).val()), parseInt(jQuery(this).next().attr('data-grid-index')), 0);	
			}
		});

		// Attaching pagination event
		jQuery(".db-pagination li a", gridContainer).on('click', function() {
			var gridIndex,
				dataStartIndex,
				dataEndIndex,
				pageNumber;
			gridIndex = jQuery(".db-pagination", gridContainer).index(jQuery(this).parent().parent()[0]);	
			gridOperations.showAllRow(gridIndex);
			if(this.hasAttribute('data-page-set-index')) {
				gridOperations.movePageSet(this, gridIndex);	
			} else {
				dataStartIndex = parseInt(jQuery(this).attr('data-start-index'));
				dataEndIndex = parseInt(jQuery(this).attr('data-end-index'));
				pageNumber = parseInt(jQuery(this).text());
				jQuery("li a", jQuery(".db-pagination").eq(gridIndex)[0]).css({
					"font-weight": "normal"
				});
				jQuery("li a", jQuery(".db-pagination").eq(gridIndex)[0]).attr("data-is-current-page", "false");
				
				jQuery(this).css({
					"font-weight": "bolder"
				});
				jQuery(this).attr("data-is-current-page", "true");
				gridOperations.moveToPage(gridIndex, dataStartIndex, dataEndIndex, pageNumber);
			}

			// if search text is not empty reinvoking search method after changing content of grid
			if(jQuery.trim(jQuery("input[type='text'].search",gridContainer).eq(gridIndex).val()) !== "") {
				jQuery("input[value='Search']", gridContainer).eq(gridIndex).trigger('click');
			}
		});

		// move to next page
		jQuery(".db-icon-left-arrow-next", gridContainer).on('click', function(){
			var presentPageNumber,
				gridIndex,
				presentPaginationDOM,
				dataStartIndex,
				dataEndIndex,
				presentPageNumberDOM,
				nextPageNumberDOM;

			gridIndex = jQuery(".db-icon-left-arrow-next", gridContainer).index(jQuery(this));			
			gridOperations.showAllRow(gridIndex);
			presentPaginationDOM = jQuery(".db-pagination", gridContainer).eq(gridIndex)[0];
			presentPageNumberDOM = jQuery("a[data-is-current-page='true']",presentPaginationDOM)[0];
			presentPageNumber = parseInt(jQuery(presentPageNumberDOM).text());
			nextPageNumberDOM = jQuery("li a[data-page-index='"+(presentPageNumber+1)+"']", presentPaginationDOM)[0];
			if(jQuery("a",jQuery(presentPageNumberDOM).parent().next()[0])[0].hasAttribute("data-move-set-direction")) {
				jQuery("a",jQuery(presentPageNumberDOM).parent().next()[0]).trigger('click');
			}
			jQuery(nextPageNumberDOM).trigger("click");
		});

		// move to previous page
		jQuery(".db-icon-left-arrow-previous", gridContainer).on('click', function(){
			var gridIndex,
				presentPaginationDOM,
				presentPageNumber,
				presentPageNumberDOM,
				previousPageNumberDOM;

			gridIndex = jQuery(".db-icon-left-arrow-previous", gridContainer).index(jQuery(this));
			gridOperations.showAllRow(gridIndex);
			presentPaginationDOM = jQuery(".db-pagination", gridContainer).eq(gridIndex)[0];
			presentPageNumberDOM = jQuery("a[data-is-current-page='true']",presentPaginationDOM)[0];
			presentPageNumber = parseInt(jQuery(presentPageNumberDOM).text());
			previousPageNumberDOM = jQuery("li a[data-page-index='"+(presentPageNumber-1)+"']", presentPaginationDOM)[0];
			if(jQuery("a",jQuery(presentPageNumberDOM).parent().prev()[0])[0].hasAttribute("data-move-set-direction")) {
				jQuery("a",jQuery(presentPageNumberDOM).parent().prev()[0]).trigger('click');
			}
			jQuery(previousPageNumberDOM).trigger("click");
		});

		// move to last page
		jQuery(".db-icon-right-arrow-last", gridContainer).on('click', function() {
			var gridIndex,
				presentPaginationDOM,
				lastMovePageSetDOMIndex,
				secondLastPageSetDOMIndex,	
				secondLastPageSetDOM,
				totalNumberOfMovePageSetDOM;

			gridIndex = jQuery(".db-icon-right-arrow-last", gridContainer).index(jQuery(this));
			gridOperations.showAllRow(gridIndex);
			presentPaginationDOM = jQuery(".db-pagination", gridContainer).eq(gridIndex)[0];

			lastMovePageSetDOMIndex = (jQuery("li", presentPaginationDOM).length -1);
			totalNumberOfMovePageSetDOM = jQuery("li a[data-page-set-index]", presentPaginationDOM).length;
			if(totalNumberOfMovePageSetDOM == 1) {
				secondLastPageSetDOMIndex = 0;	
			} else {
				secondLastPageSetDOM = jQuery("li a[data-page-set-index]", presentPaginationDOM).eq(totalNumberOfMovePageSetDOM-2).parent()[0];	
				secondLastPageSetDOMIndex = jQuery("li", presentPaginationDOM).index(secondLastPageSetDOM);
			}
			
			jQuery("li", presentPaginationDOM).each(function(index) {
				if(index>=secondLastPageSetDOMIndex && index<lastMovePageSetDOMIndex) {
					$(this).show();
				} else {
					$(this).hide();
				}
			});

			jQuery("li a[data-page-index]", presentPaginationDOM).last().trigger('click');

		});

		// move to first page
		jQuery(".db-icon-left-arrow-first", gridContainer).on('click', function() {
			var gridIndex,
				presentPaginationDOM,
				firstMovePageSetDOMIndex,
				secondMovePageSetDOM,
				secondMovePageSetDOMIndex,
				totalNumberOfMovePageSetDOM;

			gridIndex = jQuery(".db-icon-left-arrow-first", gridContainer).index(jQuery(this));
			gridOperations.showAllRow(gridIndex);
			presentPaginationDOM = jQuery(".db-pagination", gridContainer).eq(gridIndex)[0];			

			firstMovePageSetDOMIndex = 0;
			totalNumberOfMovePageSetDOM = jQuery("li a[data-page-set-index]", presentPaginationDOM).length;
			
			if(totalNumberOfMovePageSetDOM == 1) {
				secondMovePageSetDOMIndex = jQuery("li", presentPaginationDOM).length - 2;
			} else {
				secondMovePageSetDOM = jQuery("li a[data-page-set-index]", presentPaginationDOM).first().parent()[0];
				secondMovePageSetDOMIndex = jQuery("li", presentPaginationDOM).index(secondMovePageSetDOM);	
			}

			jQuery("li", presentPaginationDOM).each(function(index) {
				if(index>=firstMovePageSetDOMIndex && index<=secondMovePageSetDOMIndex) {
					$(this).show();
				} else {
					$(this).hide();
				}
			});

			jQuery("li a[data-page-index]", presentPaginationDOM).first().trigger('click');			
		});

	});

	/**
	* @description - This function set data to grid cell
	* @param tableDOM {Object} - The table DOM where the data are going to be injected
	* @param dataGridIndex {Number} - 0 based index of the grid
	* @param startIndex {Number} - 0 based start index of data
	* @param endIndex {Number} - 0 based end index of data
	* @param pageNumber {Number} - Optional, 1 based end index of page number
	*/
	setDataToCell = (function(tableDOM, dataGridIndex, startIndex, endIndex, pageNumber) {
		var dataRowIndex,
			tr,
			dataIndex,
			dataHTML;
		if(typeof pageNumber == "undefined") {
			pageNumber = 1;
		}	
		for(dataRowIndex=startIndex; dataRowIndex<=endIndex; dataRowIndex++) {
			if(dataRowIndex>=attributes.pagination.dataPerPage) {
				tr = jQuery("tr",tableDOM).eq(dataRowIndex - (attributes.pagination.dataPerPage * pageNumber));
			} else {
				tr = jQuery("tr",tableDOM).eq(dataRowIndex);	
			}
			
			if(typeof dataForGrid[dataGridIndex].data.value[dataRowIndex] == "undefined") {
				jQuery("div.cell-data", tr).html("");
			} else {
				for(dataIndex in dataForGrid[dataGridIndex].data.value[dataRowIndex]) {
					dataHTML = "";
					if(typeof dataForGrid[dataGridIndex].data.value[dataRowIndex][dataIndex] == "object") {
						dataHTML += dataToDOM.prepareObject(dataForGrid[dataGridIndex].data.value[dataRowIndex][dataIndex]);
						
					} else {
						dataHTML += dataToDOM.prepareText(dataForGrid[dataGridIndex].data.value[dataRowIndex][dataIndex]);
					}
					jQuery("div.cell-data", tr).eq(dataIndex).html("");
					jQuery("div.cell-data", tr).eq(dataIndex).html(dataHTML);
				}
			}
		}

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
			isHiddenFlag;

		tableDOM = jQuery("table.data-table", gridContainer).eq(dataGridIndex);
		
		if(attributes.isAnimate) {
			jQuery("div.cell-data", tableDOM).hide(1000, function() {
				if(jQuery("div.cell-data", tableDOM).eq(jQuery("div.cell-data", tableDOM).length-1).is(":hidden")) {
					jQuery("div.cell-data", tableDOM).css({
						"display": "block",
						"visibility": "hidden"
					});
					setDataToCell(tableDOM, dataGridIndex, startIndex, endIndex);
					jQuery("div.cell-data", tableDOM).css({
						"visibility": "visible"
					});	
				}
				
			});
		} else {
			setDataToCell(tableDOM, dataGridIndex, startIndex, endIndex);
		}
	});

	/**
	* @description - This method start injecting the data inside the grid
	* @param startIndex {Number} - 0 based start index
	* @param endIndex {Number} - 0 based end index
	* @param dataGridIndex {Number} - 0 based end index of dataGrid, always 0 for single seriese
	*/
	startInjectingData = (function(startIndex, endIndex, dataGridIndex) {
		var pageInfoDiv;
		if(typeof startIndexOfDisplayedData == "undefined") {
			startIndexOfDisplayedData = [];
		}
		if(typeof endIndexOfDisplayedData == "undefined") {
			endIndexOfDisplayedData = [];
		}
		startIndexOfDisplayedData[dataGridIndex] = startIndex;
		endIndexOfDisplayedData[dataGridIndex] = (dataForGrid[dataGridIndex].data.value.length<attributes.pagination.dataPerPage)?(dataForGrid[dataGridIndex].data.value.length-1):(startIndex+attributes.pagination.dataPerPage-1);
		pageInfoDiv = jQuery(".db-page-info", gridContainer).eq(dataGridIndex);
		jQuery("label", pageInfoDiv).eq(0).text(startIndexOfDisplayedData[dataGridIndex]+1);
		jQuery("label", pageInfoDiv).eq(1).text(endIndexOfDisplayedData[dataGridIndex]+1);
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

		startAttachingInitialAttributes();	
		if(Array.isArray(dataForGrid) && dataForGrid.length == 1) {// For single seriese
			
			gridHTML = prepareTableCaption(0);
			gridHTML += prepareTableHeader(dataForGrid[0].data.label);	
			gridHTML += prepareRowOfTable(attributes.pagination.dataPerPage, dataForGrid[0].data.value[0].length, 0);
			gridHTML += prepareTableFooter(0);
			prepareDOM(gridHTML);
			startBindingEvents();
			startInjectingData(0, (attributes.pagination.dataPerPage-1), 0);

		} else { // for multiseriese
			gridHTML = "";
			for(dataGridIndex in dataForGrid) {
				gridHTML += prepareTableCaption(dataGridIndex);
				gridHTML += prepareTableHeader(dataForGrid[dataGridIndex].data.label);	
				gridHTML += prepareRowOfTable(attributes.pagination.dataPerPage, dataForGrid[dataGridIndex].data.value[0].length, dataGridIndex);
				gridHTML += prepareTableFooter(dataGridIndex);
			}
			prepareDOM(gridHTML);
			startBindingEvents();
			for(dataGridIndex in dataForGrid) {
				startInjectingData(0, (attributes.pagination.dataPerPage-1), dataGridIndex);
			}
		}
		startAttachingOtherAttributes();
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
	* @return {Boolean} - True/False
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

	/**
	* @description - This function is the constructor of LifeGrid
	* @param styleObject {Object} - The styles which will be applied to all grids, provide attribute name and value as javascript's css format
	*/
	this.setGridStyle = (function(styleObject) {
		attributeMethods.setStyle(styleObject);
	});

	/**
	* @description - This function is the constructor of LifeGrid
	* @returns {Object} - The style object which is already applied presently in the grids
	*/
	this.getGridStyle = (function() {
		return attributeMethods.getStyle();
	});

	/**
	* @description - This function is the constructor of LifeGrid
	* @param captionStyleObject {Object} - The styles which will be applied to all grids captions and sub captions if exists
	*/
	this.setCaptionStyle = (function(captionStyleObject) {
		attributeMethods.setCpationStyle(captionStyleObject);
	});

}),
LG = LifeGrid;