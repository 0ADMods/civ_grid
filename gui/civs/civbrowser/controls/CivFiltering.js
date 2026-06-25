CivBrowserPageControls.prototype.CivFiltering = class
{
	constructor(CivBrowserPage, CivGridBrowser)
	{
		this.CivBrowserPage = CivBrowserPage;
		this.CivGridBrowser = CivGridBrowser;
		this.CivFilters = CivBrowserPage.CivFilters;

		this.searchBox = new LabelledInput("CivBrowserSearchBox")
			.setupEvents(() => this.onChange());
		this.CivType = new LabelledDropdown("CivBrowserCivType")
			.setupEvents(() => this.onCivTypeChange());
		this.CivFilter = new LabelledDropdown("CivBrowserCivFilter")
			.setupEvents(() => this.onChange());

		CivBrowserPage.registerOpenPageHandler(() => this.onOpenPage());
		CivBrowserPage.registerClosePageHandler(() => this.onClosePage());

		this.searchBox.blur();
	}

	onOpenPage()
	{
		this.CivType.control.list =
			this.CivBrowserPage.Regions;

		this.CivType.control.list_data =
			this.CivBrowserPage.Regions;

		this.renderCivFilter();

		this.CivType.select("All");
		this.CivFilter.select("All");

		setTimeout(() =>
		{
			this.searchBox.control.caption = "";
			this.searchBox.focus();
		}, 0);
	}

	onClosePage()
	{
		this.searchBox.blur();
	}

	onCivTypeChange()
	{
		this.renderCivFilter();
		this.onChange();
	}

	onChange()
	{
		this.CivGridBrowser.updateCivList();
		this.CivGridBrowser.goToPageOfSelected();
	}

	select(filter, type)
	{
		this.CivType.control.list =
			this.CivBrowserPage.Regions;

		this.CivType.control.list_data =
			this.CivBrowserPage.Regions;

		this.renderCivFilter();

		this.CivType.select(type || "All");
		this.CivFilter.select(filter || "All");

		this.CivGridBrowser.updateCivList();
		this.CivGridBrowser.goToPageOfSelected();
	}

	renderCivFilter()
	{
		this.CivFilter.control.list =
			["All"];

		this.CivFilter.control.list_data =
			["All"];
	}

	// TODO: would be nicer to store this state somewhere else.
	getSearchText()
	{
		return this.searchBox.getText() || "";
	}

	getSelectedCivType()
	{
		return this.CivType.getSelected() || "";
	}

	getSelectedCivFilter()
	{
		return this.CivFilter.getSelected() || "";
	}
};
