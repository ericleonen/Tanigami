import * as fs from "fs";

function addTargetNamesToLevelsOrder(): void {
    const levelsOrder: string[] = JSON.parse(
        fs.readFileSync("data/levels/order.json", "utf8")
    );
    const levelsSet = new Set<string>(levelsOrder);

    const targets = JSON.parse(fs.readFileSync("data/targets/index.json", "utf-8"));
    const names = Object.keys(targets);

    names.forEach((name) => {
        if (!levelsSet.has(name)) {
            levelsOrder.push(name);
        }
    });

    let orderJSON = "[";
    levelsOrder.forEach((name, i) => {
        if (orderJSON.length > 1) {
            orderJSON += " ";
        }

        const isLast = names.length - 1 === i;

        orderJSON += `"${name}"${isLast ? "" : "," }` + "\n";
    })
    orderJSON += "]";

    fs.writeFileSync("data/levels/order.json", orderJSON);
}

// main
addTargetNamesToLevelsOrder();