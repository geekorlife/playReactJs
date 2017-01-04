/**
 * 
 * Main immutable tools to 
 * avoid state change in the reducer
 * 
 */

"use strict";

/**
 * Duplicate object
 */
const updateObject = (oldObject, newValues) => {
    return Object.assign({}, oldObject, newValues);
};

/**
 * Duplicate Array
 */
const updateItemInArray = (array, itemId, updateItemCallback) => {
    const updatedItems = array.map(item => {
        if(item.id !== itemId) {
            return item;
        }
        const updatedItem = updateItemCallback(item);
        return updatedItem;
    });

    return updatedItems;
};

export {
    updateObject,
    updateItemInArray
};