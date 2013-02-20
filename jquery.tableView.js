(function (window, $) {
    // private properties and methods
    var _id = 'table-view',
        _ids = [],

        _CSS_TABLE_VIEW = 'table-view',

        _default_config = {
            data: [],
            checkBox: true
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

        _templ = '<table id="{ID}" class="' + _CSS_TABLE_VIEW + '">\
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
            this.selected = [];
            this.title = Object.keys(cfg.data[0]);
            this.data = cfg.data;
            this.checkBox = cfg.checkBox;

            this.render();

            return this;
        },

        render: function () {
            this.$element.html(_templ.replace('{ID}', this.id).replace('{FOOTER_ID}', this.id + '-footer'));

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
                this.titleNode.append('<td><label class="' + _CSS_TABLE_VIEW + '-checkbox"><input type="checkbox"></label></td>');
            }

            for (i in title) {
                this.titleNode.append('<td>' + title[i] + '</td>');
            } 

            return this;
        },

        renderBody: function () {
            var rowContent, item, i, o,
                checkBox = this.checkBox,
                data = this.data;
            this.bodyNode.empty();

            for (item in data) {
                o = data[item];
                rowContent = '<tr>';

                if (typeof checkBox === 'boolean' && checkBox) {
                    rowContent += '<td><label><input type="checkbox" /></label></td>';
                }
                
                for (i in o) {
                    rowContent += '<td>' + o[i] + '</td>';
                } 

                rowContent += '</tr>';

                this.bodyNode.append(rowContent);
            }
        },

        //TODO
        addSelection: function (id) {
            var i;

            for (i in this.selected) {
                if (this.selected[i] === id) {
                    return
                }
            }
        },

        //TODO
        removeSelection: function (id, email) {
            this.selected = $.grep(this.selected, function (value) {
                return value !==id;
            });
        }
    };

    $.fn.tableView = function (cfg) {
        this.each(function () {
            var table = new tableView(this, cfg);
        });
    }

    window.tableView = tableView;

})(window, jQuery);
