odoo.define('account_report_enhanecement.account_report', function (require) {
    'use strict';
    var accountReportsWidget = require('account_reports.account_report');

    accountReportsWidget.include({
        events: _.extend({}, accountReportsWidget.prototype.events, {
            'change #show_initial_balance': '_onChangeShowInitialBalance'
        }),
        start: function() {
            var self = this;
            if (self.report_model == 'account.partner.ledger')
                self.report_options['show_initial_balance'] = true;
            else
                self.report_options['show_initial_balance'] = false;
            var extra_info = this._rpc({
                    model: self.report_model,
                    method: 'get_report_informations',
                    args: [self.financial_id, self.report_options],
                    context: self.odoo_context,
                })
                .then(function(result){
                    return self.parse_reports_informations(result);
                });
            return Promise.all([extra_info, this._super.apply(this, arguments)]).then(function() {
                self.render();
            });
        },
        _onChangeShowInitialBalance: function (event) {
            var self = this;
            self.report_options['initial_balance'] = $('#show_initial_balance').prop("checked");
            self.reload();
        },
    });

});
