<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

abstract class Neatline_ExpandableTable extends Omeka_Db_Table
{


    /**
     * Gather expanion tables.
     *
     * @return array The array of expansion tables.
     */
    abstract public function getExpansionTables();


    /**
     * Left join the expansion tables onto the query.
     *
     * @return Omeka_Db_Select $select The modified select.
     */
    public function getSelect()
    {

        $select = parent::getSelect();

        // Gather expansion tables.
        $expansions = $this->getExpansionTables();
        if (!$expansions) return $select;

        // Left join the expansions.
        foreach ($expansions as $expansion) {

            // Get name, alias, and columns.
            $name  = $expansion->getTableName();
            $alias = $expansion->getTableAlias();
            $cols  = $expansion->getColumns();

            $select->joinLeft(
                array($alias => $name),
                "{$this->getTableAlias()}.id = $alias.parent_id",
                array_diff($cols, array('id'))
            );

        }

        return $select;

    }


}