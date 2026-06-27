class CivGridBrowser extends GridBrowser
{
	constructor(CivBrowserPage, setupWindow)
	{
		super(
			Engine.GetGUIObjectByName(
				"CivBrowserContainer"
			)
		);

		this.setupWindow = setupWindow;
		this.CivBrowserPage = CivBrowserPage;

		this.CivList = [];

		this.items = this.container.children.map(
			(imageObject, itemIndex) =>
				new CivGridBrowserItem(
					CivBrowserPage,
					this,
					imageObject,
					itemIndex
				)
		);

		this.CivBrowserPage.registerOpenPageHandler(
			this.onOpenPage.bind(this)
		);

		this.CivBrowserPage.registerClosePageHandler(
			this.onClosePage.bind(this)
		);

		this.CivBrowserPage.CivBrowserPageDialog.onMouseWheelUp =
			() => this.previousPage(false);

		this.CivBrowserPage.CivBrowserPageDialog.onMouseWheelDown =
			() => this.nextPage(false);
	}

	onOpenPage()
	{

		this.updateCivList();

	let selectedCiv =
		g_GameSettings.playerCiv.values[
			this.CivBrowserPage.selectedPlayer ?? 0
		];

		let index = this.CivList.findIndex(
			civ => civ.file == selectedCiv
		);

		if (index == -1)
			index = 0;

		if (this.CivList.length)
			this.setSelectedIndex(index);

		this.currentPage = 0;

		this.goToPageOfSelected();

		this.container.onWindowResized =
			this.onWindowResized.bind(this);

		Engine.SetGlobalHotkey(
			this.HotkeyConfigNext,
			"Press",
			this.nextPage.bind(this)
		);

		Engine.SetGlobalHotkey(
			this.HotkeyConfigPrevious,
			"Press",
			this.previousPage.bind(this)
		);
	}

	onClosePage()
	{
		delete this.container.onWindowResized;

		Engine.UnsetGlobalHotkey(
			this.HotkeyConfigNext,
			"Press"
		);

		Engine.UnsetGlobalHotkey(
			this.HotkeyConfigPrevious,
			"Press"
		);
	}

	getSelected()
	{
		return this.CivList[this.selected] || undefined;
	}

	select(civFile)
	{
		let idx =
			this.CivList.findIndex(
				civ => civ.file == civFile
			);

		this.setSelectedIndex(idx);
		this.goToPageOfSelected();
	}

	updateCivList()
	{

		let CivList =
			this.CivBrowserPage.CivList || [];

		const region =
			this.CivBrowserPage.controls
				.CivFiltering
				.getSelectedCivType();
		const culture =
			this.CivBrowserPage.controls
				.CivFiltering
				.getSelectedCivFilter();
				
		const searchText =
			this.CivBrowserPage.controls
				.CivFiltering
				.getSearchText()
				.toLowerCase();

		// filtro por região
		if (
			region &&
			region != "All"
		)
		{
		if (region != "All")
		{
			CivList = CivList.filter(civ =>
				Array.isArray(civ.Region) &&
				civ.Region.includes(region)
			);
		}

		if (culture != "All")
		{
			CivList = CivList.filter(civ =>
				Array.isArray(civ.Culture) &&
				civ.Culture.includes(culture)
			);
		}
		}

		// filtro por texto
		if (searchText)
		{
			CivList =
				CivList.filter(
					civ =>
						civ.name
							.toLowerCase()
							.includes(searchText)
				);
		}

		this.CivList = CivList;

		this.itemCount =
			CivList.length;

		this.resizeGrid();

	}

}

CivGridBrowser.prototype.ItemRatio = 1 / 1;

CivGridBrowser.prototype.DefaultItemWidth = 180;

CivGridBrowser.prototype.MinItemWidth = 128;

CivGridBrowser.prototype.MaxItemWidth = 300;

CivGridBrowser.prototype.HotkeyConfigNext =
	"tab.next";

CivGridBrowser.prototype.HotkeyConfigPrevious =
	"tab.prev";