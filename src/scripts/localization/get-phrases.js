import {phrasesRU} from './phrases/RU';
import {phrasesEN} from './phrases/EN';

export function getPhrases() {
    return {
        RU: phrasesRU(),
        EN: phrasesEN()
    }
}