const shuffleList = <T>(array: T[]): T[] => {
    let currentIndex = array.length; let temporaryValue; let randomIndex;
    const clone = Array.from(array);
    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = clone[currentIndex];
        clone[currentIndex] = clone[randomIndex];
        clone[randomIndex] = temporaryValue;
    }
    return clone;
};

export default shuffleList;
