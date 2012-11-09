<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Miscellaneous helpers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


/**
 * Include the static files for the Neatline.
 *
 * @param Omeka_record $exhibit The exhibit.
 *
 * @return void.
 */
function neatline_queueNeatlineAssets()
{
    neatline_queueGoogleMapsApi();
    queue_css_file('v2/payloads/neatline');
    queue_js_file('v2/payloads/neatline', 'javascripts');
}

/**
 * Include the static files for the editor.
 *
 * @return void.
 */
function neatline_queueEditorAssets()
{
    queue_css_file('v2/payloads/editor');
    queue_js_file('v2/payloads/editor', 'javascripts');
}

/**
 * Try to find a CSS file that matches the exhibit slug.
 *
 * @return void.
 */
function neatline_queueExhibitCss($exhibit)
{
    try { queue_css_file($exhibit->slug); } catch (Exception $e) {}
}

/**
 * Include the Google Maps API.
 *
 * @return void.
 */
function neatline_queueGoogleMapsApi()
{
    $url = 'http://maps.google.com/maps/api/js?v=3.8&sensor=false';
    $headScript = get_view()->headScript();
    $headScript->appendScript('', 'text/javascript', array('src' => $url));
}

/**
 * Prepare the starting data array for the front-end application.
 *
 * @param NeatlineExhibit $exhibit The exhibit.
 *
 * @return array The exhibit data.
 */
function neatline_renderExhibit($exhibit)
{
    return json_encode(array(
        'id' => $exhibit->id,
        'dataSource' => neatline_getDataSource($exhibit),
        'mapFocus' => $exhibit->map_focus,
        'mapZoom' => $exhibit->map_zoom
    ));
}

/**
 * Get the data emitter URL for an exhibit.
 *
 * @param NeatlineExhibit $exhibit The exhibit.
 *
 * @return string The url.
 */
function neatline_getDataSource($exhibit)
{
    return public_url('neatline-exhibits/data/' . $exhibit->id);
}

/**
 * Get items for the browser.
 *
 * @param NeatlineExhibit $exhibit The exhibit.
 *
 * @return array of Omeka_records $items The items.
 */
function neatline_getItemsForBrowser($exhibit)
{

    $_db = get_db();
    $itemsTable = $_db->getTable('Item');
    $params = array();
    $items = array();

    // If the query is defined, fetch items.
    if (!is_null($exhibit->query)) {

        // Get query and select.
        $select = $itemsTable->getSelect();
        $query = unserialize($exhibit->query);
        $isQuery = false;

        // ** Adapted directly from Omeka_Controller_Action_Helper_SearchItems.
        foreach($query as $requestParamName => $requestParamValue) {
            if (is_string($requestParamValue) && trim($requestParamValue) == '') {
                continue;
            }
            switch($requestParamName) {
                case 'user':
                    if (is_numeric($requestParamValue)) {
                        $params['user'] = $requestParamValue;
                        $isQuery = true;
                    }
                break;

                case 'public':
                    $params['public'] = is_true($requestParamValue);
                    $isQuery = true;
                break;

                case 'featured':
                    $params['featured'] = is_true($requestParamValue);
                    $isQuery = true;
                break;

                case 'collection':
                    $params['collection'] = $requestParamValue;
                    $isQuery = true;
                break;

                case 'type':
                    $params['type'] = $requestParamValue;
                    $isQuery = true;
                break;

                case 'tag':
                case 'tags':
                    $params['tags'] = $requestParamValue;
                    $isQuery = true;
                break;

                case 'excludeTags':
                    $params['excludeTags'] = $requestParamValue;
                    $isQuery = true;
                break;

                case 'recent':
                    if (!is_true($requestParamValue)) {
                        $params['recent'] = false;
                        $isQuery = true;
                    }
                break;

                case 'search':
                    $params['search'] = $requestParamValue;
                    $isQuery = true;
                    //Don't order by recent-ness if we're doing a search
                    unset($params['recent']);
                break;

                case 'advanced':
                    //We need to filter out the empty entries if any were provided
                    foreach ($requestParamValue as $k => $entry) {
                        if (empty($entry['element_id']) || empty($entry['type'])) {
                            unset($requestParamValue[$k]);
                        }
                    }
                    if (count($requestParamValue) > 0) {
                        $params['advanced_search'] = $requestParamValue;
                        $isQuery = true;
                    }
                break;

                case 'range':
                    $params['range'] = $requestParamValue;
                    $isQuery = true;
                break;
            }
        }

        if ($isQuery) { $items = $itemsTable->findBy($params); }

    }

    return $items;

}

/**
 * Return specific field for a neatline record.
 *
 * @param string
 * @param array $options
 * @param neatlines|null
 * @return string
 */
function neatline($fieldname, $options = array(), $neatline = null)
{

    $neatline = $neatline ? $neatline : get_current_neatline();
    $fieldname = strtolower($fieldname);
    $text = $neatline->$fieldname;

    if(isset($options['snippet']))
        $text = nls2p(snippet($text, 0, (int)$options['snippet']));

    return $text;

}

/**
 * Returns the current neatline.
 *
 * @return NeatlineExhibit|null
 */
function get_current_neatline()
{
    return get_view()->neatline_exhibit;
}

/**
 * Sets the current neatline.
 *
 * @param NeatlineExhibit|null
 * @return void
 */
function set_current_neatline($neatline = null)
{
    get_view()->neatline_exhibit = $neatline;
}

/**
 * Sets the neatlines for loop
 *
 * @param array $neatlines
 * @return void
 */
function set_neatlines_for_loop($neatlines)
{
    get_view()->neatline_exhibits = $neatlines;
}

/**
 * Get the set of neatlines for the current loop.
 *
 * @return array
 */
function get_neatlines_for_loop()
{
    return get_view()->neatline_exhibits;
}

/**
 * Loops through neatlines assigned to the view.
 *
 * @return mixed
 */
function loop_neatlines()
{
    return get_loop_records(
        'neatline_exhibits', get_neatlines_for_loop(), 'set_current_neatline'
    );
}

/**
 * Determines whether there are any neatlines in the database.
 *
 * @return boolean
 */
function has_neatlines()
{
    return (total_neatlines() > 0);
}

/**
 * Determines whether there are any neatlines to loop on the view.
 *
 * @return boolean
 */
function has_neatlines_for_loop()
{
    $view = get_view();
    return ($view->neatline_exhibits and count($view->neatline_exhibits));
}

/**
 * Returns the total number of neatlines in the database.
 *
 * @return integer
 */
function total_neatlines()
{
    return get_db()->getTable('NeatlineExhibits')->count();
}

/**
 * Returns a link to a Neatline exhibit.
 *
 * @param string HTML for the text of the link.
 * @param array Attributes for the link tag. (optional)
 * @param string The action for the link. Default is 'show'.
 * @param NeatlineExhibit|null
 * @return string The HTML link.
 */
function link_to_neatline(
    $text = null,
    $props = array(),
    $action = 'show',
    $neatline = null,
    $public = true)
{

    $neatline = $neatline ? $neatline : get_current_neatline();
    $text = $text ? $text : strip_formatting(neatline('title', $neatline));

    if ($action == 'show') { $slug = $neatline->slug; }
    else { $slug = $neatline->id; }

    $route = 'neatline-exhibits/' . $action . '/' . $slug;
    $uri = $public ? public_url($route) : url($route);
    $props['href'] = $uri;
    return '<a ' . tag_attributes($props) . '>' . $text . '</a>';

}

/**
 * Returns the number of records used in a given Neatline.
 *
 * @param NeatlineExhibit|null
 * @return integer
 */
function total_records_for_neatline($neatline = null)
{
    $neatline = $neatline ? $neatline : get_current_neatline();
    return (int)$neatline->getNumberOfRecords();
}
