/**
 * Utility class with convenience methods for an array.
 */
export class ArrayUtil {

    /**
     * Removes the object in the array for the given propertyName and the given value.
     * @param {any[]} array
     * @param {string} propertyName
     * @param value
     */
    static removeByProperty(array: any[], propertyName: string, value: any) {
        for (let i = 0; i < array.length; i++) {
            if (array[i][propertyName] === value) {
                array.splice(i, 1);
            }
        }
    }
}
