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
		try
		{
			this.CivGridBrowser.updateCivList();

			if (!this.CivGridBrowser.CivList.length)
			{
				this.CivGridBrowser.selected = -1;
				this.CivGridBrowser.currentPage = 0;
				return;
			}

			if (
				this.CivGridBrowser.selected < 0 ||
				this.CivGridBrowser.selected >= this.CivGridBrowser.CivList.length
			)
				this.CivGridBrowser.setSelectedIndex(0);

			this.CivGridBrowser.goToPageOfSelected();
		}
		catch (e)
		{
			error("CivBrowser filter error: " + e);

			this.CivGridBrowser.CivList = [];
			this.CivGridBrowser.itemCount = 0;
			this.CivGridBrowser.selected = -1;
			this.CivGridBrowser.resizeGrid();
		}
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
		let cultures = ["All"];

		const region = this.getSelectedCivType();

		for (let civ of this.CivBrowserPage.CivList)
		{
			// Se uma região estiver selecionada,
			// mostra apenas culturas dessa região.
			if (region != "All" && !civ.Region.includes(region))
				continue;

			for (let culture of civ.Culture)
				if (!cultures.includes(culture))
					cultures.push(culture);
		}

		cultures.sort();

		// Mantém "All" no início
		cultures = ["All"].concat(cultures.filter(c => c != "All"));

		this.CivFilter.control.list = cultures;
		this.CivFilter.control.list_data = cultures;
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
