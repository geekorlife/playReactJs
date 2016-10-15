const updateObject = (oldObject, newValues) => {
    return Object.assign({}, oldObject, newValues);
}

const updateItemInArray = (array, itemId, updateItemCallback) => {
    const updatedItems = array.map(item => {
        if(item.id !== itemId) {
            return item;
        }
        const updatedItem = updateItemCallback(item);
        return updatedItem;
    });

    return updatedItems;
}

export {
    updateObject,
    updateItemInArray
}