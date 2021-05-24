import { SelectElement } from "./types";

export const mapToList = (valueMap: Record<number, string>) => {
    let returnValue = new Array<SelectElement>()
    Object.keys(valueMap).forEach((value: string, index: number, array: string[]) => {
        const id = Number.parseFloat(value)
        returnValue.push({ id: id, name: '' + valueMap[id] })
    });
    return returnValue
}

export const range = (start: number, stop: number, step: number): Array<number> => {
    if (typeof stop == 'undefined') {
        // one param defined
        stop = start;
        start = 0;
    }

    if (typeof step == 'undefined') {
        step = 1;
    }

    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
        return [];
    }

    var result = [];
    for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(i);
    }

    return result;
}

export const intToSelectionList =
    (elem: number): SelectElement => { return ({ id: elem, name: '' + elem }) }