
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Presenter events.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Presenter', function(
  Presenter, Neatline, Backbone, Marionette, $, _) {


  /**
   * Show the record.
   *
   * @param {Object} model: The record model.
   */
  var show = function(model) {
    try {
      Neatline.execute(
        'presenter:'+model.get('presenter')+':show', model
      );
    } catch (e) {}
  };

  Neatline.commands.addHandler('presenter:show', show);
  Neatline.vent.on('map:highlight', show);


  /**
   * Hide the record.
   *
   * @param {Object} model: The record model.
   */
  var hide = function(model) {
    try {
      Neatline.execute(
        'presenter:'+model.get('presenter')+':hide', model
      );
    } catch(e) {}
  };

  Neatline.commands.addHandler('presenter:hide', hide);
  Neatline.vent.on('map:unhighlight', hide);


  /**
   * Freeze the record.
   *
   * @param {Object} model: The record model.
   */
  var select = function(model) {
    try {
      Neatline.execute(
        'presenter:'+model.get('presenter')+':select', model
      );
    } catch (e) {}
  };

  Neatline.commands.addHandler('presenter:select', select);
  Neatline.vent.on('map:select', select);


  /**
   * Unfreeze and hide the record.
   *
   * @param {Object} model: The record model.
   */
  var unselect = function(model) {
    try {
      Neatline.execute(
        'presenter:'+model.get('presenter')+':unselect', model
      );
    } catch (e) {}
  };

  Neatline.commands.addHandler('presenter:unselect', unselect);
  Neatline.vent.on('map:unselect', unselect);


});
