function FixHeader(tableElement, global) {
	this.tableElement = tableElement;
	this.global = global;
	this.timer = null;
}

FixHeader.prototype = {
	constructor: FixHeader,
	init: function () {
		this.tableParent = this.tableElement.parentNode;
		this.header = this.tableElement.querySelector('thead');
		this.cloneHeader = this.header.cloneNode(true);
		this.tableParent.addEventListener('scroll', this.listenerScroll.bind(this), false);
		this.global.addEventListener('resize', this.listenerResize.bind(this), false);
	},
	listenerScroll: function (ev) {
		var top = ev.target.scrollTop,
		//用于判断是否已经添加上了，添加了就不让再次添加
			cloneThead = ev.target.querySelector('.cloneThead');
		if (top > 0) {
			if (cloneThead) {
				cloneThead.style.display = 'block';
				cloneThead.style.top = top + 'px';
				return;
			}
			this.cloneFixHeader();
		} else {
			if (cloneThead) {
				cloneThead.style.display = 'none';
			}
		}
	},
	listenerResize: function () {
		var that = this;
		if (that.timer) {
			clearTimeout(that.timer);
		}
		that.timer = setTimeout(function () {
			var top = that.tableParent.scrollTop;
			if (top <= 0) {
				return;
			}
			var globalWidth = that.global.innerWidth;
			if (that.globalWidth && that.globalWidth == globalWidth) {
				return;
			}
			that.globalWidth = globalWidth;
			var cloneThead = that.tableElement.querySelector('.cloneThead'),
				theads = that.tableElement.querySelectorAll('thead'), i, l = theads.length;
			for (i = 0; i < l; i++) {
				if (theads[i].className != 'cloneThead') {
					that.header = theads[i];
					break;
				}
			}
			if (cloneThead) {
				var cloneThs = cloneThead.children[0].children,
					ths = that.header.children[0].children,
					th, cloneTh;
				l = cloneThs.length;
				for (i = 0; i < l; i++) {
					th = ths[i];
					cloneTh = cloneThs[i];
					cloneTh.style.width = th.offsetWidth + 'px';
					cloneTh.style.height = th.offsetHeight + 'px';
				}
				return;
			}
			that.cloneFixHeader();
		}, 60);
	},
	cloneFixHeader: function () {
		var cloneThs = this.cloneHeader.children[0].children,
			ths = this.header.children[0].children,
			th, cloneTh, i = 0, l = cloneThs.length;
		for (; i < l; i++) {
			th = ths[i];
			cloneTh = cloneThs[i];
			cloneTh.style.width = th.offsetWidth + 'px';
			cloneTh.style.height = th.offsetHeight + 'px';
		}
		this.cloneHeader.className = 'cloneThead';
		this.cloneHeader.style.position = 'absolute';
		this.cloneHeader.style.top = 0;
		this.cloneHeader.style.left = 0;
		this.cloneHeader.style.right = '-1px';
		this.tableElement.appendChild(this.cloneHeader);

	}
};

