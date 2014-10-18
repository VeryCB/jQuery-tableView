(function (window, $) {
    // private properties and methods
    var _id = 'table-view',
        _ids = [],

        _default_config = {
            title: [],
            data: [],
            firstKey: null,
            checkBox: true,
            tableClass: 'table'
        },

        _config = function (n, d) {
            var cfg = {}, i;

            for (i in d) {
                if (d.hasOwnProperty(i)) {
                    cfg[i] = n[i] || d[i];

                    if (typeof n[i] === 'boolean' && !n[i]) {
                        cfg[i] = n[i];
                    }
                }
            }
            return cfg;
        },

        _templ = '<table id="{ID}" class="{CLASS}">\
                    <thead>\
                        <tr>\
                        </tr>\
                    </thead>\
                    <tbody>\
                    </tbody>\
                  </table>',

        tableView = function (element, cfg) {
            var c = cfg || {};
            this.config = _config(c, _default_config);
            this.$element = $(element);
            this.init();
        };

    tableView.prototype = {
        init: function () {
            if (!this.config) {
                return;
            }

            var cfg = this.config,
                id = _id + _ids.length;

            _ids.push(id);

            this.id = id;
            this.firstKey = cfg.firstKey;
            this.data = this.firstKey ? this.resortData(cfg.data, this.firstKey) : cfg.data;
            this.title = cfg.title.length === 0 ? Object.keys(this.data[0]) : cfg.title;
            this.checkBox = cfg.checkBox;
            this.tableClass = cfg.tableClass;

            this.render();

            return this;
        },

        render: function () {
            this.$element.html(_templ.replace('{ID}', this.id).replace('{CLASS}', this.tableClass));

            this.node = $('#' + this.id);
            this.titleNode = $('thead tr', this.node);
            this.bodyNode = $('tbody', this.node);

            this.renderTitle();
            this.renderBody();

            return this;
        },

        renderTitle: function () {
            var i,
                title = this.title,
                checkBox = this.checkBox;

            if (typeof checkBox === 'boolean' && checkBox) {
                this.titleNode.append('<td><label class="checkbox"><input type="checkbox"></label></td>');
            }

            for (i in title) {
                this.titleNode.append('<td>' + title[i] + '</td>');
            } 

            return this;
        },

        renderBody: function () {
            var rowContent, item, c, i, o, cellData, cData, tmpData,
                checkBox = this.checkBox,
                urlPattern = /^http/,
                data = this.data;

            this.bodyNode.empty();


            for (item in data) {
                o = data[item];
                rowContent = '<tr>';

                if (typeof checkBox === 'boolean' && checkBox) {
                    rowContent += '<td><label><input type="checkbox" /></label></td>';
                }

                for (i in o) {
                    cellData = o[i];

                    if (typeof cellData === 'string' && urlPattern.test(cellData)) {
                        cellData = '<a href="' + cellData + '" target="_blank">' + cellData + '</a>';
                    } else if (typeof cellData === 'object') {
                        tmpData = ''

                        for (c in cellData) {
                            cData = cellData[c];

                            if (urlPattern.test(cData)) {
                                tmpData += '<a href="' + cData + '" target="_blank">' + cData + '</a><br />';
                            }
                        }

                        cellData = tmpData;
                    }

                    rowContent += '<td>' + cellData + '</td>';
                } 

                rowContent += '</tr>';

                this.bodyNode.append(rowContent);
            }
        },

        resortData: function(data, firstKey) {
            var o, _data = [];

            for (o in data) {
                var _o = {},
                    sortObject = function (object) {
                        for (key in object) {
                            if (!object.hasOwnProperty(key)) {
                                continue;
                            }

                            if (Object.keys(_o).length === 0 && key === firstKey) {
                                _o[firstKey] = object[firstKey];
                                sortObject(object);
                            } else if (Object.keys(_o).length !== 0) {
                                _o[key] = object[key];
                            }
                        }
                    };

                if (!data.hasOwnProperty(o)) {
                    continue;
                }

                sortObject(data[o]);

                _data.push(_o);
            }

            return _data;
        }
    };

    $.fn.tableView = function (cfg) {
        this.each(function () {
            var table = new tableView(this, cfg);
        });
    }

    window.tableView = tableView;

})(window, jQuery);
