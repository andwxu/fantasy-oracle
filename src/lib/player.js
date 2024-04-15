export default class Player {
    /**
     * @type {string}
     */
    name;
    /**
     * @type {number}
     */
    price;
    /**
     * @type {number}
     */
    points;
    /**
     * @type {string}
     */
    position;
    /**
     * @type {number}
     */
    index;
    /**
     * @type {string}
     */
    team;
    
    /**
     * @param {string} name
     * @param {number} price
     * @param {number} points
     * @param {string} position
     * @param {number} index
     */
    constructor(name, price, points, position, index, team) {
        this.name = name;
        this.price = price;
        this.points = points;
        this.position = position;
        this.index = index;
        this.team = team;
    }

    toString() {
        return `${this.name} ${this.price} ${this.points} ${this.position} ${this.team}`;
    }

    get_group() {
        if (this.position == "GK") return 0;
        else if (this.position == "DEF") return 1;
        else if (this.position == "MID") return 2;
        else return 3;
    }

    get_price() {
        return this.price;
    }

    get_points() {
        return this.points;
    }
}


// def __init__(
//     self,
//     name: str,
//     price: float,
//     points: float,
//     position: str
// ):
// self.name = name
// self.price = price
// self.points = points
// self.position = position

// def __str__(self):
// return f"({self.name}, {self.price}, {self.points}, {self.position})"

// @property
// def position(self):
// return self._position

// @position.setter
// def position(self, pos):
// if pos not in ["GK", "DEF", "MID", "ATT"]:
//     raise ValueError("Sorry, that's not a valid position")
// self._position = pos

// def get_group(self):
// if self.position == "GK":
//     group = 0
// elif self.position == "DEF":
//     group = 1
// elif self.position == "MID":
//     group = 2
// else:
//     group = 3
// return group