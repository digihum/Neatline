
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record.Item', { startWithParent: false,
  define: function(Item) {


  Item.View = Neatline.Shared.View.extend({


    events: {

      // Build UI widgets when tab is shown.
      'shown.bs.tab a[data-slug="item"]': 'buildWidgets',

    },

    ui: {
      search: 'input[name="item-search"]'
    },


    /**
     * Construct the item search.
     */
    buildWidgets: function() {
      // TODO
    }


  });


}});
