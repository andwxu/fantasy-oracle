/**
 * @param {Array<Array<number>>} weights
 * @param {Array<Array<number>>} values
 * @param {number} maxWeight
 */
export default function knapsackMultichoiceOnepick(weights, values, maxWeight) {
    if (weights.length === 0) {
        return [0, []];
    }

    // console.log('before oepration');
    // console.log(weights);
    // console.log(values);
    weights = weights.filter((weight, index) => weight.length > 0);
    values = values.filter((value, index) => value.length > 0);
    // console.log('after operation');
    // console.log(weights);
    // console.log(values);


    let lastArray = Array(maxWeight + 1).fill(-1);
    let lastPath = Array(maxWeight + 1).fill([]);

    for (let i = 0; i < weights[0].length; i++) {
        if (weights[0][i] < maxWeight) {
            if (lastArray[weights[0][i]] < values[0][i]) {
                lastArray[weights[0][i]] = values[0][i];
                lastPath[weights[0][i]] = [[0, i]];
            }
        }
    }

    for (let i = 1; i < weights.length; i++) {
        let currentArray = Array(maxWeight + 1).fill(-1);
        let currentPath = Array(maxWeight + 1).fill([]);

        for (let j = 0; j < weights[i].length; j++) {
            for (let k = weights[i][j]; k <= maxWeight; k++) {
                if (lastArray[k - weights[i][j]] > 0) {
                    if (currentArray[k] < lastArray[k - weights[i][j]] + values[i][j]) {
                        currentArray[k] = lastArray[k - weights[i][j]] + values[i][j];
                        currentPath[k] = [...lastPath[k - weights[i][j]]];
                        currentPath[k].push([i, j]);
                    }
                }
            }
        }

        lastArray = currentArray;
        lastPath = currentPath;
    }

    const [solution, indexPath] = getOnepickSolution(lastArray, lastPath);

    return [solution, indexPath];
}

/**
 * @param {any[]} scores
 * @param {any[]} paths
 */
function getOnepickSolution(scores, paths) {
    const scoresPaths = scores.map((/** @type {any} */ score, /** @type {number} */ index) => [score, paths[index]]);
    scoresPaths.sort((/** @type {number[]} */ a, /** @type {number[]} */ b) => b[0] - a[0]);

    return [scoresPaths[0][0], scoresPaths[0][1]];
}

/**
 * def knapsack_multichoice_onepick(weights, values, max_weight):
      if len(weights) == 0:
          return 0

      last_array = [-1 for _ in range(max_weight + 1)]
      last_path = [[] for _ in range(max_weight + 1)]
      for i in range(len(weights[0])):
          if weights[0][i] < max_weight:
              if last_array[weights[0][i]] < values[0][i]:
                  last_array[weights[0][i]] = values[0][i]
                  last_path[weights[0][i]] = [(0, i)]

      for i in range(1, len(weights)):
          current_array = [-1 for _ in range(max_weight + 1)]
          current_path = [[] for _ in range(max_weight + 1)]
          for j in range(len(weights[i])):
              for k in range(weights[i][j], max_weight + 1):
                  if last_array[k - weights[i][j]] > 0:
                      if current_array[k] < last_array[k - weights[i][j]] + \
                              values[i][j]:
                          current_array[k] = last_array[k - weights[i][j]] + \
                                             values[i][j]
                          current_path[k] = copy.deepcopy(
                              last_path[k - weights[i][j]])
                          current_path[k].append((i, j))
          last_array = current_array
          last_path = current_path

      solution, index_path = get_onepick_solution(last_array, last_path)

      return solution, index_path


  def get_onepick_solution(scores, paths):
      scores_paths = list(zip(scores, paths))
      scores_paths_by_score = sorted(scores_paths, key=lambda tup: tup[0],
                                     reverse=True)

      return scores_paths_by_score[0][0], scores_paths_by_score[0][1]
 */