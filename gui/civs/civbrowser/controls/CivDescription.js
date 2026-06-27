CivBrowserPageControls.prototype.CivDescription = class
{
	constructor(CivBrowserPage, CivGridBrowser)
	{
		this.ImageRatio = 1 / 1;

		this.CivBrowserPage = CivBrowserPage;
		this.CivGridBrowser = CivGridBrowser;
		this.CivCache = CivBrowserPage.CivCache;

		this.CivBrowserSelectedName = Engine.GetGUIObjectByName("CivBrowserSelectedName");
		this.CivBrowserSelectedPreview = Engine.GetGUIObjectByName("CivBrowserSelectedPreview");
		this.CivBrowserSelectedDescription = Engine.GetGUIObjectByName("CivBrowserSelectedDescription");
		this.CivBrowserSelectedInfo =
			Engine.GetGUIObjectByName(
				"CivBrowserSelectedInfo"
			);
		let width = 256;
		let height = width;

		{
			let size = this.CivBrowserSelectedPreview.size;

			size.top = 0;
			size.bottom = height;

			this.CivBrowserSelectedPreview.size = size;
		}

		{
			let size = this.CivBrowserSelectedName.size;

			size.top = height + 12;
			size.bottom = height + 42;

			this.CivBrowserSelectedName.size = size;
		}

		{
			let size = this.CivBrowserSelectedInfo.size;

			size.top = height + 45;
			size.bottom = height + 68;

			this.CivBrowserSelectedInfo.size = size;
		}

		{
			let size = this.CivBrowserSelectedDescription.size;

			size.top = height + 75;

			this.CivBrowserSelectedDescription.size = size;
		}

		CivGridBrowser.registerSelectionChangeHandler(this.onSelectionChange.bind(this));
	}

	onSelectionChange()
	{
		let Civ = this.CivGridBrowser.CivList[this.CivGridBrowser.selected];
		if (!Civ)
			return;

		this.CivBrowserSelectedPreview.sprite = "stretched:" + Civ.icon;

		this.CivBrowserSelectedName.caption =
			Civ.name;

		this.CivBrowserSelectedInfo.caption =
			sprintf(
				translate("Region: %(region)s    |    Culture: %(culture)s"),
				{
					"region": Civ.Region,
					"culture": Civ.Culture.join(", ")
				}
			);

		this.CivBrowserSelectedDescription.caption =
			Civ.description;

	}
};
