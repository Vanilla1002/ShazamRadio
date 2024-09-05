import radioStationsInfo from '../radioStationsInfo.json';
import { RadioInfoClass } from './RadioInfoClass';

const radioMap: {[key: string]: RadioInfoClass} = {};

function createRadioDict(dict: {[key: string]: RadioInfoClass}) {
    let helper = false;
    let newHebrewName;
    for (const [key, value] of Object.entries(radioStationsInfo)) {
        for (const [_, value1] of Object.entries(value)) {
            if (!helper) {
                newHebrewName = value1;
                helper = true;
            } else {
                dict[key] = new RadioInfoClass(newHebrewName, value1);
                helper = false;
            }
        }
    }
}
createRadioDict(radioMap);

export { radioMap };