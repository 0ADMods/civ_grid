class CivBrowserPageControls
{
	constructor(CivBrowserPage, CivGridBrowser)
	{
		for (let name in this)
			this[name] = new this[name](CivBrowserPage, CivGridBrowser);

		this.CivBrowserPage = CivBrowserPage;
		this.CivGridBrowser = CivGridBrowser;
		this.hiddenRandomCiv = undefined;

		this.setupButtons();
	}

	setupButtons()
	{
			this.pickRandom = Engine.GetGUIObjectByName("CivBrowserPagePickRandom");
			this.pickRandom.onPress = () => this.pickRandomCiv();

		this.select = Engine.GetGUIObjectByName("CivBrowserPageSelect");
		this.select.onPress = () => this.onSelect();

		this.close = Engine.GetGUIObjectByName("CivBrowserPageClose");
		this.close.onPress = () => this.CivBrowserPage.closePage();

		this.overview =
			Engine.GetGUIObjectByName("CivBrowserOverviewButton");

		this.structureTree =
			Engine.GetGUIObjectByName("CivBrowserStructureTreeButton");

		this.overview.onPress =
			this.openOverview.bind(this);

		this.structureTree.onPress =
			this.openStructureTree.bind(this);

		this.hiddenRandom =
			Engine.GetGUIObjectByName("CivBrowserRandomHidden");

		this.hiddenRandom.onPress =
			() => this.pickHiddenRandomCiv();
	}

	onOpenPage(allowSelection)
	{
		this.pickRandom.hidden = !allowSelection;
		this.select.hidden = !allowSelection;

		const usedCaptions = allowSelection ? CivBrowserPageControls.Captions.cancel :
			CivBrowserPageControls.Captions.close;

		this.close.caption = usedCaptions.caption;
		this.close.tooltip = colorizeHotkey(usedCaptions.tooltip, "cancel");
	}

	onSelectionChange()
	{
		this.select.enabled = this.CivGridBrowser.selected != -1;
	}

	onSelect()
	{
		if (this.hiddenRandomCiv)
		{
			g_GameSettings.playerCiv.setValue(
				this.CivBrowserPage.selectedPlayer,
				this.hiddenRandomCiv.file
			);

			this.hiddenRandomCiv = undefined;
			this.CivBrowserPage.closePage();
			return;
		}

		this.CivBrowserPage.submitCivSelection();
	}

	pickRandomCiv()
	{
		this.hiddenRandomCiv = undefined;
		if (!this.CivGridBrowser.CivList.length)
			return;

		let index = randIntInclusive(
			0,
			this.CivGridBrowser.CivList.length - 1
		);

		this.CivGridBrowser.setSelectedIndex(index);
		this.CivGridBrowser.goToPageOfSelected();
	}

	pickHiddenRandomCiv()
	{
		if (!this.CivGridBrowser.CivList.length)
			return;

		let index = randIntInclusive(
			0,
			this.CivGridBrowser.CivList.length - 1
		);

		this.hiddenRandomCiv =
			this.CivGridBrowser.CivList[index];

		this.hiddenRandomCiv =
			this.CivGridBrowser.CivList[index];
	}

	openOverview()
	{
		let civ = this.CivGridBrowser.getSelected();

		if (!civ)
			return;

		Engine.OpenChildPage(
			"page_civinfo.xml",
			{
				civ: civ.code
			}
		);
	}

	openStructureTree()
	{
		let civ = this.CivGridBrowser.getSelected();

		if (!civ)
			return;

		Engine.OpenChildPage(
			"page_structree.xml",
			{
				civ: civ.code
			}
		);
	}
	
	static Captions =
	{
		"close":
		{
			"caption": translate("Close"),
			"tooltip": translate("%(hotkey)s: Close Civ browser.")
		},
		"cancel":
		{
			"caption": translate("Cancel"),
			"tooltip": translate("%(hotkey)s: Close Civ browser and discard the selection.")
		}
	};
}
