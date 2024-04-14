import knapsackMultichoiceOnepick from '$lib/mckp';
import Player from './player';

/**
 * @param {any} formations
 * @param {any} budget
 * @param {Player[]} playersList
 */
export default function bestFullTeams(playersList, formations, budget) {
    const formationScorePlayers = [];

    for (const formation of formations) {
        const [playersPoints, playersPrices, playersCombIndexes] = playersPreproc(playersList, formation);

        // console.log(playersPoints);
        console.log('before mckp');

        const [score, combResultIndexes] = knapsackMultichoiceOnepick(playersPrices, playersPoints, budget);

        const resultIndexes = [];
        for (const combIndex of combResultIndexes) {
            for (const winningI of playersCombIndexes[combIndex[0]][combIndex[1]]) {
                resultIndexes.push(winningI);
            }
        }

        const resultPlayers = resultIndexes.map(resIndex => playersList[resIndex]);

        formationScorePlayers.push([formation, score, resultPlayers]);

        console.log(`With formation ${formation}: ${score}`);
        for (const bestPlayer of resultPlayers) {
            console.log(bestPlayer);
        }
        console.log();
        console.log();
    }

    const formationScorePlayersByScore = formationScorePlayers.sort((a, b) => b[1] - a[1]);
    for (const finalFormationScore of formationScorePlayersByScore) {
        console.log([finalFormationScore[0], finalFormationScore[1]]);
    }

    return formationScorePlayers;
}

/**
 * @param {any} playersList
 * @param {any[]} formation
 */
function playersPreproc(playersList, formation) {
    const maxGk = formation[0];
    const maxDef = formation[1];
    const maxMid = formation[2];
    const maxAtt = formation[3];

    const [gkValues, gkWeights, gkIndexes] = generateGroup(playersList, "GK");
    const [gkCombValues, gkCombWeights, gkCombIndexes] = groupPreproc(gkValues, gkWeights, gkIndexes, maxGk);

    const [defValues, defWeights, defIndexes] = generateGroup(playersList, "DEF");
    const [defCombValues, defCombWeights, defCombIndexes] = groupPreproc(defValues, defWeights, defIndexes, maxDef);

    const [midValues, midWeights, midIndexes] = generateGroup(playersList, "MID");
    const [midCombValues, midCombWeights, midCombIndexes] = groupPreproc(midValues, midWeights, midIndexes, maxMid);

    const [attValues, attWeights, attIndexes] = generateGroup(playersList, "STR");
    const [attCombValues, attCombWeights, attCombIndexes] = groupPreproc(attValues, attWeights, attIndexes, maxAtt);

    const resultCombValues = [gkCombValues, defCombValues, midCombValues, attCombValues];
    const resultCombWeights = [gkCombWeights, defCombWeights, midCombWeights, attCombWeights];
    const resultCombIndexes = [gkCombIndexes, defCombIndexes, midCombIndexes, attCombIndexes];

    return [resultCombValues, resultCombWeights, resultCombIndexes];
}

/**
 * @param {string | any[]} fullList
 * @param {string} group
 */
function generateGroup(fullList, group) {
    const groupValues = [];
    const groupWeights = [];
    const groupIndexes = [];
    for (let i = 0; i < fullList.length; i++) {
        const item = fullList[i];
        if (item.position === group) {
            groupValues.push(+item.points);
            groupWeights.push(+item.price);
            groupIndexes.push(+i);
        }
    }
    return [groupValues, groupWeights, groupIndexes];
}

/**
 * Preprocess group data based on values, weights, and initial indexes.
 * @param {number[]} groupValues - Group values.
 * @param {number[]} groupWeights - Group weights.
 * @param {number[]} initialIndexes - Initial indexes.
 * @param {number} r - R value.
 * @returns {any[]} Preprocessed group data.
 */
function groupPreproc(groupValues, groupWeights, initialIndexes, r) {
    const combValues = combinations(groupValues, r);
    const combWeights = combinations(groupWeights, r);
    const combIndexes = combinations(initialIndexes, r);

    const groupCombValues = combValues.map(valueComb => sumArray(valueComb));
    const groupCombWeights = combWeights.map(weightComb => sumArray(weightComb));

    return [groupCombValues, groupCombWeights, combIndexes];
}

/**
 * Calculate combinations of elements from an array.
 * @param {number[]} arr - Input array.
 * @param {number} r - Combination length.
 * @returns {number[][]} Array of combinations.
 */
function combinations(arr, r) {
    /**
     * @type {number[][]}
     */
    const result = [];

    /**
     * @param {number} startIndex
     * @param {number[]} currentComb
     */
    function generateCombination(startIndex, currentComb) {
        if (currentComb.length === r) {
            result.push([...currentComb]);
            return;
        }
        for (let i = startIndex; i < arr.length; i++) {
            currentComb.push(arr[i]);
            generateCombination(i + 1, currentComb);
            currentComb.pop();
        }
    }

    generateCombination(0, []);

    return result;
}

/**
 * Calculate the sum of elements in an array.
 * @param {number[]} arr - Input array.
 * @returns {number} Sum of elements.
 */
function sumArray(arr) {
    return arr.reduce((sum, value) => sum + value, 0);
}

// /**
//  * @param {any[]} groupValues
//  * @param {any[]} groupWeights
//  * @param {any[]} initialIndexes
//  * @param {number} r
//  */
// function groupPreproc(groupValues, groupWeights, initialIndexes, r) {
//     // const combValues = Array.from(itertools.combinations(groupValues, r));
//     // const combWeights = Array.from(itertools.combinations(groupWeights, r));
//     // const combIndexes = Array.from(itertools.combinations(initialIndexes, r));
//     const combValues = Array.from(combinations(groupValues, r));
//     const combWeights = Array.from(combinations(groupWeights, r));
//     const combIndexes = Array.from(combinations(initialIndexes, r));
//     console.log(combIndexes);

//     const groupCombValues = combValues.map(valueCombination => valueCombination.reduce((/** @type {any} */ acc, /** @type {any} */ val) => acc + val, 0));
//     const groupCombWeights = combWeights.map(weightCombination => weightCombination.reduce((/** @type {any} */ acc, /** @type {any} */ val) => acc + val, 0));

//     return [groupCombValues, groupCombWeights, combIndexes];
// }

// /**
//  * @param {string | any[]} arr
//  * @param {any} r
//  */
// function combinations(arr, r) {
//     /**
//      * @type {any[][]}
//      */
//     const result = [];

//     // Helper function to recursively generate combinations
//     /**
//      * @param {number} startIndex
//      * @param {any[]} currentComb
//      */
//     function generateCombination(startIndex, currentComb) {
//         // If the current combination has reached the desired length, add it to the result
//         if (currentComb.length === r) {
//             result.push([...currentComb]);
//             return;
//         }

//         // Iterate over elements starting from the specified index
//         for (let i = startIndex; i < arr.length; i++) {
//             // Add the current element to the current combination
//             currentComb.push(arr[i]);
//             // Recursively generate combinations with the remaining elements
//             generateCombination(i + 1, currentComb);
//             // Backtrack by removing the last element to explore other possibilities
//             currentComb.pop();
//         }
//     }

//     // Start generating combinations from the beginning of the array
//     generateCombination(0, []);

//     return result;
// }


// /**
//  * @param {string | any[]} array
//  * @param {any} r
//  */
// function getPermutations(array, r) {                                                  
//     // Algorythm copied from Python `itertools.permutations`.                      
//     var n = array.length;                                                          
//     if (r === undefined) {                                                         
//         r = n;                                                                     
//     }                                                                              
//     if (r > n) {                                                                   
//         return [];                                                                    
//     }                                                                              
//     var indices = [];                                                              
//     for (var i = 0; i < n; i++) {                                                  
//         indices.push(i);                                                           
//     }                                                                              
//     var cycles = [];                                                               
//     for (var i = n; i > n - r; i-- ) {                                             
//         cycles.push(i);                                                            
//     }                                                                              
//     var results = [];                                                              
//     var res = [];                                                                  
//     for (var k = 0; k < r; k++) {                                                  
//         res.push(array[indices[k]]);                                               
//     }                                                                              
//     results.push(res);                                                             
                                                                                   
//     var broken = false;                                                            
//     while (n > 0) {                                                                
//         for (var i = r - 1; i >= 0; i--) {                                         
//             cycles[i]--;                                                           
//             if (cycles[i] === 0) {                                                 
//                 indices = indices.slice(0, i).concat(                              
//                     indices.slice(i+1).concat(
//                         indices.slice(i, i+1)));             
//                 cycles[i] = n - i;                                                 
//                 broken = false;                                                    
//             } else {                                                               
//                 var j = cycles[i];                                                 
//                 var x = indices[i];                                                
//                 indices[i] = indices[n - j];                          
//                 indices[n - j] = x;                                   
//                 var res = [];
//                 for (var k = 0; k < r; k++) {                        
//                     res.push(array[indices[k]]);                                   
//                 }                                                                  
//                 results.push(res);                                                 
//                 broken = true;                                                     
//                 break;                                                             
//             }                                                                      
//         }                                                                          
//         if (broken === false) {                                                    
//             break;                                                                 
//         }                                                                          
//     }                                                                              
//     return results;                                                                
// }         