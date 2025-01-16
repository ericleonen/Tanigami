/**
 * Given a list of relative likelihoods, randomly chooses an index. If all of the likelihoods are
 * zero, returns -1.
 */
export function randomlyChoose(relativeLikelihoods: number[]): number {
    const sum = relativeLikelihoods.reduce((a, b) => a + b, 0);
    let U = Math.random() * sum;

    for (let i = 0; i < relativeLikelihoods.length; i++) {
        U -= relativeLikelihoods[i];

        if (U <= 0) return i;
    }

    return -1;
}

export function uniformlyChoose(n: number): number {
    return Math.floor(Math.random() * n);
}

export function uniformlyChooseFromList<T>(list: T[]): T {
    return list[uniformlyChoose(list.length)];
}

export function uniform(min = 0, max = 0): number {
    return Math.random() * (max - min) + min;
}