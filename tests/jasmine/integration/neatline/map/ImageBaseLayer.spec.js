
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map | Image Base Layer', function() {


  beforeEach(function() {
    NL.loadNeatline('NeatlineMapImageBaseLayer.html');
  });


  it('should construct image base layer', function() {

    // ------------------------------------------------------------------------
    // When an image URL is defined on the exhibit, the map should create a
    // layer from the image and set it as the base layer.
    // ------------------------------------------------------------------------

    var layers  = NL.vw.MAP.map.getLayersBy('isBaseLayer', true);
    var layer   = NL.vw.MAP.map.baseLayer;

    // Should create an image with the correct URL.
    expect(layer.CLASS_NAME).toEqual('OpenLayers.Layer.Image');
    expect(layer.url).toEqual(Neatline.g.neatline.exhibit.image_layer);

    // Should be just one layer.
    expect(layers.length).toEqual(1);

  });


  it('should set the number of zoom levels', function() {

    // ------------------------------------------------------------------------
    // When an image base layer is provided, the number of zoom levels on the
    // layer should be set from the `zoom_levels` exhibit field.
    // ------------------------------------------------------------------------

    expect(NL.vw.MAP.map.baseLayer.numZoomLevels).toEqual(
      Neatline.g.neatline.exhibit.zoom_levels
    );

  });


});